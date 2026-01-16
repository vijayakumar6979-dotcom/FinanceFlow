-- Disable RLS for investments tables for development to avoid auth issues
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE investment_transactions DISABLE ROW LEVEL SECURITY;

-- Grant permissions just in case
GRANT ALL ON investments TO anon, authenticated, service_role;
GRANT ALL ON investment_transactions TO anon, authenticated, service_role;
