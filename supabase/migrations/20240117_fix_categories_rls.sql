-- Disable RLS on categories to ensure they are visible
ALTER TABLE transaction_categories DISABLE ROW LEVEL SECURITY;

-- Grant access to authenticated and anon (just in case)
GRANT SELECT ON transaction_categories TO authenticated, anon;
GRANT ALL ON transaction_categories TO service_role;

-- Verify data exists (optional check for user, but good to know)
-- SELECT count(*) FROM transaction_categories;
