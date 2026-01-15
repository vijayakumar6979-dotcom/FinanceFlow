-- ==========================================
-- PART 1: SHARED UTILITIES
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- PART 2: TABLE CREATION (Loans Management)
-- ==========================================

-- 1. Loans Table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, 
  
  -- Basic Info
  name TEXT NOT NULL,
  lender_id TEXT,
  lender_name TEXT,
  lender_logo TEXT,
  loan_type TEXT NOT NULL,
  
  -- Account Details
  account_number TEXT,
  account_number_masked TEXT,
  
  -- Financial Data
  original_amount DECIMAL(15, 2) NOT NULL,
  current_balance DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  
  -- Terms
  start_date DATE NOT NULL,
  term_months INTEGER NOT NULL,
  remaining_months INTEGER,
  
  -- Payment Info
  monthly_payment DECIMAL(10, 2) NOT NULL,
  payment_day INTEGER,
  next_payment_date DATE,
  
  -- Additional Details
  collateral_value DECIMAL(15, 2),
  prepayment_penalty DECIMAL(10, 2),
  late_fee DECIMAL(10, 2),
  payment_method TEXT,
  linked_account_id UUID,
  
  -- Settings
  reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
  auto_create_transaction BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active',
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Amortization Schedule
CREATE TABLE IF NOT EXISTS loan_amortization_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  payment_number INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  payment_amount DECIMAL(10, 2),
  principal_amount DECIMAL(10, 2),
  interest_amount DECIMAL(10, 2),
  remaining_balance DECIMAL(15, 2),
  is_paid BOOLEAN DEFAULT FALSE,
  actual_payment_date DATE,
  actual_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(loan_id, payment_number)
);

-- 3. Payoff Strategies
CREATE TABLE IF NOT EXISTS loan_payoff_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  strategy_type TEXT NOT NULL,
  strategy_name TEXT,
  extra_payment_amount DECIMAL(10, 2) DEFAULT 0,
  loan_priority_order JSONB,
  projected_payoff_date DATE,
  total_interest DECIMAL(15, 2),
  interest_saved DECIMAL(15, 2),
  months_saved INTEGER,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Refinance Analysis
CREATE TABLE IF NOT EXISTS loan_refinance_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  analysis_date DATE DEFAULT CURRENT_DATE,
  current_rate DECIMAL(5, 2),
  new_rate DECIMAL(5, 2),
  monthly_savings DECIMAL(10, 2),
  lifetime_savings DECIMAL(15, 2),
  break_even_months INTEGER,
  is_recommended BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PART 3: AUTH BYPASS & CONFIGURATION
-- ==========================================

-- Disable RLS (Row Level Security) so our fake user can access everything
ALTER TABLE IF EXISTS loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_amortization_schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_payoff_strategies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_refinance_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;

-- Drop Foreign Key constraints to auth.users (if they exist)
DO $$ 
BEGIN 
  -- Loans
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'loans_user_id_fkey') THEN
    ALTER TABLE loans DROP CONSTRAINT loans_user_id_fkey;
  END IF;

  -- Transactions
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_user_id_fkey') THEN
    ALTER TABLE transactions DROP CONSTRAINT transactions_user_id_fkey;
  END IF;

  -- Accounts
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'accounts_user_id_fkey') THEN
    ALTER TABLE accounts DROP CONSTRAINT accounts_user_id_fkey;
  END IF;
END $$;

-- Force schema cache reload (usually automatic, but good measure)
NOTIFY pgrst, 'reload schema';
