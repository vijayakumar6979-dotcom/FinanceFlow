-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Assuming we can't link to profiles directly if it doesn't exist yet, but following prompt schema
  
  -- Basic Info
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank_checking', 'bank_savings', 'credit_card', 'ewallet', 'cash')),
  
  -- Financial Data
  balance DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'MYR',
  
  -- Bank/Provider Info
  institution_id TEXT,
  institution_name TEXT,
  institution_logo TEXT,
  institution_color TEXT,
  
  -- Account Details
  account_number TEXT,
  account_number_masked TEXT,
  
  -- Credit Card Specific
  credit_limit DECIMAL(15, 2),
  statement_date INTEGER,
  payment_due_date INTEGER,
  minimum_payment_percentage DECIMAL(5, 2) DEFAULT 5.00,
  interest_rate DECIMAL(5, 2),
  annual_fee DECIMAL(10, 2),
  card_network TEXT,
  
  -- E-Wallet Specific
  linked_phone TEXT,
  linked_email TEXT,
  
  -- Settings
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  include_in_total BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#0066FF',
  
  -- AI Features
  enable_ai_analytics BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);

-- Create credit_card_analytics table
CREATE TABLE IF NOT EXISTS credit_card_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  analysis_date DATE DEFAULT CURRENT_DATE,
  
  -- Analysis Data (JSON from Grok)
  spending_patterns JSONB,
  utilization_analysis JSONB,
  unusual_activity JSONB,
  recommendations JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create repayment_plans table
CREATE TABLE IF NOT EXISTS repayment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  
  plan_name TEXT,
  monthly_payment DECIMAL(10, 2),
  duration_months INTEGER,
  total_interest DECIMAL(10, 2),
  payoff_date DATE,
  
  -- AI Generated
  pros JSONB,
  cons JSONB,
  budget_adjustments JSONB,
  
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_plans ENABLE ROW LEVEL SECURITY;

-- accounts policies
CREATE POLICY "Users can view own accounts"
ON accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
ON accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
ON accounts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
ON accounts FOR DELETE
USING (auth.uid() = user_id);

-- credit_card_analytics policies API
CREATE POLICY "Users can view own analytics"
ON credit_card_analytics FOR SELECT
USING (EXISTS (SELECT 1 FROM accounts WHERE accounts.id = credit_card_analytics.account_id AND accounts.user_id = auth.uid()));

-- repayment_plans policies
CREATE POLICY "Users can view own plans"
ON repayment_plans FOR SELECT
USING (EXISTS (SELECT 1 FROM accounts WHERE accounts.id = repayment_plans.account_id AND accounts.user_id = auth.uid()));
