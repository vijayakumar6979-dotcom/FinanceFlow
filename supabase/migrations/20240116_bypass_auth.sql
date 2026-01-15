-- Disable RLS strictly for development/bypass
ALTER TABLE IF EXISTS loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_amortization_schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_payoff_strategies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loan_refinance_analyses DISABLE ROW LEVEL SECURITY;

-- Accounts & Core
ALTER TABLE IF EXISTS accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS goals DISABLE ROW LEVEL SECURITY;

-- Attempt to drop FK constraints to auth.users if they exist
-- We use DO block to avoid errors if constraint names vary
DO $$ 
BEGIN 
  -- Loans
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'loans_user_id_fkey') THEN
    ALTER TABLE loans DROP CONSTRAINT loans_user_id_fkey;
  END IF;

  -- Accounts
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'accounts_user_id_fkey') THEN
    ALTER TABLE accounts DROP CONSTRAINT accounts_user_id_fkey;
  END IF;

  -- Transactions
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_user_id_fkey') THEN
    ALTER TABLE transactions DROP CONSTRAINT transactions_user_id_fkey;
  END IF;

  -- Categories
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'categories_user_id_fkey') THEN
    ALTER TABLE categories DROP CONSTRAINT categories_user_id_fkey;
  END IF;
END $$;
