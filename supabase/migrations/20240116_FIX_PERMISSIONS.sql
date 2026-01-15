-- Force schema cache reload
NOTIFY pgrst, 'reload schema';

-- Grant permissions to standard Supabase roles
-- This ensures 'anon' (unauthenticated) and 'authenticated' (logged in) users can actually "see" the tables
-- usage on schema is usually default, but good to ensure
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to the tables
GRANT ALL ON TABLE loans TO anon, authenticated, service_role;
GRANT ALL ON TABLE loan_amortization_schedule TO anon, authenticated, service_role;
GRANT ALL ON TABLE loan_payoff_strategies TO anon, authenticated, service_role;
GRANT ALL ON TABLE loan_refinance_analyses TO anon, authenticated, service_role;

-- Ensure sequences (for IDs if serial, though we used UUID) are accessible just in case
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Verify existence (This will show in the output if it exists)
SELECT exists(select * from information_schema.tables where table_name = 'loans') as loans_table_exists;
