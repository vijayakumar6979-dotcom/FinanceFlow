-- =====================================================
-- TRANSACTIONS MANAGEMENT SYSTEM - DATABASE MIGRATION
-- Phase 1: Schema Updates
-- =====================================================

-- =====================================================
-- 1. EXTEND TRANSACTIONS TABLE
-- =====================================================

-- Add integration fields for linking to other modules
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS bill_payment_id UUID REFERENCES bill_payments(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS loan_payment_id UUID REFERENCES loan_payments(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS goal_contribution_id UUID REFERENCES goal_contributions(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS investment_transaction_id UUID REFERENCES investment_transactions(id) ON DELETE SET NULL;

-- Credit card and recurring flags
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS credit_card_payment BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_recurring_instance BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_transaction_id UUID;

-- Split transaction support
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_split BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE;

-- Transfer support (links two transactions)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transfer_id UUID;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transfer_fee DECIMAL(15, 2) DEFAULT 0;

-- Receipt and OCR
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receipt_urls TEXT[];
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_data JSONB;

-- AI features
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ai_suggested_category UUID REFERENCES categories(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(5, 2);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_corrected_category BOOLEAN DEFAULT FALSE;

-- Anomaly detection
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_anomaly BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS anomaly_reason TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS anomaly_severity TEXT CHECK (anomaly_severity IN ('low', 'medium', 'high'));

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Integration indexes
CREATE INDEX IF NOT EXISTS idx_transactions_bill_payment ON transactions(bill_payment_id) WHERE bill_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_loan_payment ON transactions(loan_payment_id) WHERE loan_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_goal_contribution ON transactions(goal_contribution_id) WHERE goal_contribution_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_investment ON transactions(investment_transaction_id) WHERE investment_transaction_id IS NOT NULL;

-- Recurring and transfer indexes
CREATE INDEX IF NOT EXISTS idx_transactions_recurring ON transactions(recurring_transaction_id) WHERE recurring_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_transfer ON transactions(transfer_id) WHERE transfer_id IS NOT NULL;

-- Anomaly detection index
CREATE INDEX IF NOT EXISTS idx_transactions_anomaly ON transactions(is_anomaly) WHERE is_anomaly = TRUE;

-- Split transaction index
CREATE INDEX IF NOT EXISTS idx_transactions_parent ON transactions(parent_transaction_id) WHERE parent_transaction_id IS NOT NULL;

-- Filtering indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date_type ON transactions(date, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id) WHERE category_id IS NOT NULL;

-- =====================================================
-- 3. CREATE TRANSACTION SPLITS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS transaction_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Split details
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  percentage DECIMAL(5, 2) CHECK (percentage >= 0 AND percentage <= 100),
  description TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_splits_parent ON transaction_splits(parent_transaction_id);
CREATE INDEX IF NOT EXISTS idx_splits_user ON transaction_splits(user_id);
CREATE INDEX IF NOT EXISTS idx_splits_category ON transaction_splits(category_id);

-- =====================================================
-- 4. CREATE RECURRING TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Template fields
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  account_id UUID REFERENCES accounts(id),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  
  -- Recurrence settings
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  interval INTEGER DEFAULT 1 CHECK (interval > 0),
  start_date DATE NOT NULL,
  end_date DATE,
  end_after_occurrences INTEGER CHECK (end_after_occurrences > 0),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  next_occurrence_date DATE,
  last_occurrence_date DATE,
  occurrences_created INTEGER DEFAULT 0,
  
  -- Optional fields
  tags TEXT[],
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recurring_user ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_next_date ON recurring_transactions(next_occurrence_date) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_recurring_active ON recurring_transactions(is_active);

-- =====================================================
-- 5. CREATE AI LEARNING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS transaction_categorization_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Pattern matching
  description_pattern TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  confidence_score DECIMAL(5, 2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 1,
  success_count INTEGER DEFAULT 0,
  
  -- Metadata
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patterns_user ON transaction_categorization_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_patterns_description ON transaction_categorization_patterns(description_pattern);
CREATE INDEX IF NOT EXISTS idx_patterns_category ON transaction_categorization_patterns(category_id);

-- =====================================================
-- 6. CREATE TRIGGERS FOR AUTO-SYNC
-- =====================================================

-- Trigger: Update account balance on transaction insert/update/delete
CREATE OR REPLACE FUNCTION update_account_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT or UPDATE
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- Update account balance
    IF NEW.type = 'income' THEN
      UPDATE accounts 
      SET balance = balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE accounts 
      SET balance = balance - NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.account_id;
    END IF;
    
    -- If UPDATE, reverse old transaction
    IF (TG_OP = 'UPDATE' AND OLD.account_id IS NOT NULL) THEN
      IF OLD.type = 'income' THEN
        UPDATE accounts 
        SET balance = balance - OLD.amount,
            updated_at = NOW()
        WHERE id = OLD.account_id;
      ELSIF OLD.type = 'expense' THEN
        UPDATE accounts 
        SET balance = balance + OLD.amount,
            updated_at = NOW()
        WHERE id = OLD.account_id;
      END IF;
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- On DELETE
  IF (TG_OP = 'DELETE') THEN
    -- Reverse the transaction
    IF OLD.type = 'income' THEN
      UPDATE accounts 
      SET balance = balance - OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE accounts 
      SET balance = balance + OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.account_id;
    END IF;
    
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_update_account_balance ON transactions;

-- Create trigger
CREATE TRIGGER trigger_update_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance_on_transaction();

-- =====================================================
-- 7. TRIGGER: Validate split transaction totals
-- =====================================================

CREATE OR REPLACE FUNCTION validate_split_transaction_total()
RETURNS TRIGGER AS $$
DECLARE
  parent_amount DECIMAL(15, 2);
  splits_total DECIMAL(15, 2);
BEGIN
  -- Get parent transaction amount
  SELECT amount INTO parent_amount
  FROM transactions
  WHERE id = NEW.parent_transaction_id;
  
  -- Calculate total of all splits
  SELECT COALESCE(SUM(amount), 0) INTO splits_total
  FROM transaction_splits
  WHERE parent_transaction_id = NEW.parent_transaction_id;
  
  -- Check if total matches (allow 0.01 difference for rounding)
  IF ABS(splits_total - parent_amount) > 0.01 THEN
    RAISE EXCEPTION 'Split transaction total (%) does not match parent amount (%)', splits_total, parent_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_validate_split_total ON transaction_splits;
CREATE TRIGGER trigger_validate_split_total
  AFTER INSERT OR UPDATE ON transaction_splits
  FOR EACH ROW
  EXECUTE FUNCTION validate_split_transaction_total();

-- =====================================================
-- 8. TRIGGER: Update recurring transaction next date
-- =====================================================

CREATE OR REPLACE FUNCTION update_recurring_next_date()
RETURNS TRIGGER AS $$
DECLARE
  next_date DATE;
BEGIN
  -- Calculate next occurrence based on frequency
  CASE NEW.frequency
    WHEN 'daily' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval || ' days')::INTERVAL;
    WHEN 'weekly' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval || ' weeks')::INTERVAL;
    WHEN 'biweekly' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval * 2 || ' weeks')::INTERVAL;
    WHEN 'monthly' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval || ' months')::INTERVAL;
    WHEN 'quarterly' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval * 3 || ' months')::INTERVAL;
    WHEN 'yearly' THEN
      next_date := NEW.last_occurrence_date + (NEW.interval || ' years')::INTERVAL;
  END CASE;
  
  -- Check if we should stop
  IF NEW.end_date IS NOT NULL AND next_date > NEW.end_date THEN
    NEW.is_active := FALSE;
    NEW.next_occurrence_date := NULL;
  ELSIF NEW.end_after_occurrences IS NOT NULL AND NEW.occurrences_created >= NEW.end_after_occurrences THEN
    NEW.is_active := FALSE;
    NEW.next_occurrence_date := NULL;
  ELSE
    NEW.next_occurrence_date := next_date;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_recurring_next_date ON recurring_transactions;
CREATE TRIGGER trigger_update_recurring_next_date
  BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW
  WHEN (OLD.last_occurrence_date IS DISTINCT FROM NEW.last_occurrence_date)
  EXECUTE FUNCTION update_recurring_next_date();

-- =====================================================
-- 9. ADD RLS POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE transaction_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categorization_patterns ENABLE ROW LEVEL SECURITY;

-- Transaction splits policies
CREATE POLICY "Users can view their own splits"
  ON transaction_splits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own splits"
  ON transaction_splits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own splits"
  ON transaction_splits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own splits"
  ON transaction_splits FOR DELETE
  USING (auth.uid() = user_id);

-- Recurring transactions policies
CREATE POLICY "Users can view their own recurring transactions"
  ON recurring_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring transactions"
  ON recurring_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring transactions"
  ON recurring_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring transactions"
  ON recurring_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Categorization patterns policies
CREATE POLICY "Users can view their own patterns"
  ON transaction_categorization_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patterns"
  ON transaction_categorization_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns"
  ON transaction_categorization_patterns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patterns"
  ON transaction_categorization_patterns FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================

-- Function to get transaction balance impact
CREATE OR REPLACE FUNCTION get_transaction_balance_impact(transaction_id UUID)
RETURNS TABLE (
  previous_balance DECIMAL(15, 2),
  transaction_amount DECIMAL(15, 2),
  new_balance DECIMAL(15, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.balance - t.amount as previous_balance,
    t.amount as transaction_amount,
    a.balance as new_balance
  FROM transactions t
  JOIN accounts a ON a.id = t.account_id
  WHERE t.id = transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to detect duplicate transactions
CREATE OR REPLACE FUNCTION detect_duplicate_transactions(
  p_user_id UUID,
  p_description TEXT,
  p_amount DECIMAL(15, 2),
  p_date TIMESTAMPTZ,
  p_category_id UUID
)
RETURNS TABLE (
  id UUID,
  description TEXT,
  amount DECIMAL(15, 2),
  date TIMESTAMPTZ,
  similarity_score DECIMAL(5, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.description,
    t.amount,
    t.date,
    CASE 
      WHEN t.amount = p_amount AND t.category_id = p_category_id THEN 1.0
      WHEN t.amount = p_amount THEN 0.8
      WHEN t.category_id = p_category_id THEN 0.6
      ELSE 0.4
    END as similarity_score
  FROM transactions t
  WHERE t.user_id = p_user_id
    AND t.date BETWEEN (p_date - INTERVAL '3 days') AND (p_date + INTERVAL '3 days')
    AND (
      ABS(t.amount - p_amount) < 0.01
      OR t.category_id = p_category_id
      OR similarity(t.description, p_description) > 0.7
    )
  ORDER BY similarity_score DESC, t.date DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log migration
DO $$
BEGIN
  RAISE NOTICE 'Transactions Management System - Database Migration Complete';
  RAISE NOTICE 'Tables created: transaction_splits, recurring_transactions, transaction_categorization_patterns';
  RAISE NOTICE 'Triggers created: account balance sync, split validation, recurring date update';
  RAISE NOTICE 'RLS policies enabled on all new tables';
END $$;
