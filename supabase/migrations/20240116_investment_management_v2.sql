-- Investments Table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Link to auth.users if available, but keeping loose for now as per other tables
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock', 'crypto', 'fund', 'etf', 'bond', 'real_estate')),
  quantity DECIMAL(20, 10) NOT NULL,
  avg_cost DECIMAL(20, 4) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  exchange TEXT DEFAULT 'bursa',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment Transactions Table
CREATE TABLE IF NOT EXISTS investment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'dividend', 'interest')),
    quantity DECIMAL(20, 10),
    price_per_unit DECIMAL(20, 4),
    total_amount DECIMAL(20, 2),
    fees DECIMAL(10, 2) DEFAULT 0,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments"
ON investments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
ON investments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
ON investments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
ON investments FOR DELETE
USING (auth.uid() = user_id);

ALTER TABLE investment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investment transactions"
ON investment_transactions FOR SELECT
USING (EXISTS (SELECT 1 FROM investments WHERE investments.id = investment_transactions.investment_id AND investments.user_id = auth.uid()));

CREATE POLICY "Users can insert own investment transactions"
ON investment_transactions FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM investments WHERE investments.id = investment_transactions.investment_id AND investments.user_id = auth.uid()));

-- Development Bypass (Optional, but useful since we had issues before)
-- Uncomment if you want to auto-disable RLS for local dev immediately
-- ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE investment_transactions DISABLE ROW LEVEL SECURITY;
