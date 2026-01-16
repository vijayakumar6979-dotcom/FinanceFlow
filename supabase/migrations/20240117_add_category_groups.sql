-- Add group_name column for categorization
ALTER TABLE transaction_categories ADD COLUMN group_name TEXT;

-- Verify
-- SELECT * FROM transaction_categories LIMIT 5;
