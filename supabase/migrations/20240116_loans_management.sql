-- Shared Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Link to auth.users or profiles if available, usually auth.uid()
  
  -- Basic Info
  name TEXT NOT NULL,
  lender_id TEXT, -- e.g., 'maybank', 'cimb'
  lender_name TEXT,
  lender_logo TEXT,
  loan_type TEXT CHECK (loan_type IN ('home', 'auto', 'personal', 'education', 'business', 'islamic')) NOT NULL,
  
  -- Account Details
  account_number TEXT,
  account_number_masked TEXT,
  
  -- Financial Data
  original_amount DECIMAL(15, 2) NOT NULL,
  current_balance DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL, -- APR
  
  -- Terms
  start_date DATE NOT NULL,
  term_months INTEGER NOT NULL,
  remaining_months INTEGER, -- Can be calculated, but storing for convenience/updates
  
  -- Payment Info
  monthly_payment DECIMAL(10, 2) NOT NULL,
  payment_day INTEGER CHECK (payment_day BETWEEN 1 AND 31),
  next_payment_date DATE,
  
  -- Additional Details
  collateral_value DECIMAL(15, 2),
  prepayment_penalty DECIMAL(10, 2),
  late_fee DECIMAL(10, 2),
  payment_method TEXT,
  linked_account_id UUID REFERENCES accounts(id), -- If they want to auto-deduct/track
  
  -- Settings
  reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
  auto_create_transaction BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paid_off', 'defaulted')),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);

-- Loan payment schedules (amortization)
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

CREATE INDEX IF NOT EXISTS idx_loan_amortization_loan_date ON loan_amortization_schedule(loan_id, payment_date);

-- Payoff strategies
CREATE TABLE IF NOT EXISTS loan_payoff_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  strategy_type TEXT CHECK (strategy_type IN ('current', 'snowball', 'avalanche', 'custom')) NOT NULL,
  strategy_name TEXT,
  
  extra_payment_amount DECIMAL(10, 2) DEFAULT 0,
  loan_priority_order JSONB, -- Array of loan IDs in payoff order
  
  projected_payoff_date DATE,
  total_interest DECIMAL(15, 2),
  interest_saved DECIMAL(15, 2),
  months_saved INTEGER,
  
  is_active BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refinancing analysis
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

-- RLS Policies

-- loans
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loans"
ON loans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loans"
ON loans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loans"
ON loans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loans"
ON loans FOR DELETE
USING (auth.uid() = user_id);

-- loan_amortization_schedule
ALTER TABLE loan_amortization_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own amortization"
ON loan_amortization_schedule FOR SELECT
USING (EXISTS (SELECT 1 FROM loans WHERE loans.id = loan_amortization_schedule.loan_id AND loans.user_id = auth.uid()));

CREATE POLICY "Users can insert own amortization"
ON loan_amortization_schedule FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM loans WHERE loans.id = loan_amortization_schedule.loan_id AND loans.user_id = auth.uid()));

-- loan_payoff_strategies
ALTER TABLE loan_payoff_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategies"
ON loan_payoff_strategies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategies"
ON loan_payoff_strategies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategies"
ON loan_payoff_strategies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategies"
ON loan_payoff_strategies FOR DELETE
USING (auth.uid() = user_id);

-- loan_refinance_analyses
ALTER TABLE loan_refinance_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own refinance analyses"
ON loan_refinance_analyses FOR SELECT
USING (EXISTS (SELECT 1 FROM loans WHERE loans.id = loan_refinance_analyses.loan_id AND loans.user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_loans_updated_at
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
