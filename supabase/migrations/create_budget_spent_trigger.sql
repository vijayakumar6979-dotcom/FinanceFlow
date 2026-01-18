-- =====================================================
-- Budget Spent Update Trigger
-- Auto-updates budget_periods.spent when transactions are created/updated/deleted
-- =====================================================

-- Function to update budget spent amount
CREATE OR REPLACE FUNCTION update_budget_spent_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
    v_budget_period_id UUID;
    v_total_spent DECIMAL(12,2);
BEGIN
    -- Only process expense transactions with a category
    IF (TG_OP = 'DELETE' AND OLD.type = 'expense' AND OLD.category_id IS NOT NULL) OR
       (TG_OP IN ('INSERT', 'UPDATE') AND NEW.type = 'expense' AND NEW.category_id IS NOT NULL) THEN
        
        -- Find matching budget period(s)
        FOR v_budget_period_id IN
            SELECT bp.id
            FROM budget_periods bp
            JOIN budgets b ON bp.budget_id = b.id
            WHERE b.category_id = COALESCE(NEW.category_id, OLD.category_id)
              AND COALESCE(NEW.date, OLD.date) >= bp.start_date
              AND COALESCE(NEW.date, OLD.date) <= bp.end_date
              AND b.user_id = COALESCE(NEW.user_id, OLD.user_id)
        LOOP
            -- Calculate total spent for this budget period
            SELECT COALESCE(SUM(t.amount), 0)
            INTO v_total_spent
            FROM transactions t
            JOIN budgets b ON t.category_id = b.category_id
            JOIN budget_periods bp ON bp.budget_id = b.id
            WHERE bp.id = v_budget_period_id
              AND t.type = 'expense'
              AND t.date >= bp.start_date
              AND t.date <= bp.end_date;
            
            -- Update budget period spent amount
            UPDATE budget_periods
            SET spent = v_total_spent,
                updated_at = NOW()
            WHERE id = v_budget_period_id;
            
            RAISE NOTICE 'Updated budget_period % with spent amount: %', v_budget_period_id, v_total_spent;
        END LOOP;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on transactions table
DROP TRIGGER IF EXISTS trigger_update_budget_spent ON transactions;
CREATE TRIGGER trigger_update_budget_spent
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_spent_on_transaction();

-- Add comment
COMMENT ON FUNCTION update_budget_spent_on_transaction() IS 
'Automatically updates budget_periods.spent when expense transactions are created, updated, or deleted';

-- =====================================================
-- Test the trigger
-- =====================================================

-- Example test (run manually):
/*
-- 1. Create a test budget
INSERT INTO budgets (user_id, category_id, amount, period_type, start_date)
VALUES ('your-user-id', 'your-category-id', 1000, 'monthly', '2026-01-01');

-- 2. Create a transaction
INSERT INTO transactions (user_id, type, amount, category_id, account_id, date, description)
VALUES ('your-user-id', 'expense', 150, 'your-category-id', 'your-account-id', '2026-01-15', 'Test transaction');

-- 3. Check budget_periods.spent was updated
SELECT bp.*, b.amount as budget_amount
FROM budget_periods bp
JOIN budgets b ON bp.budget_id = b.id
WHERE b.category_id = 'your-category-id';

-- Expected: spent should be 150

-- 4. Update the transaction
UPDATE transactions
SET amount = 200
WHERE description = 'Test transaction';

-- 5. Check again
-- Expected: spent should be 200

-- 6. Delete the transaction
DELETE FROM transactions WHERE description = 'Test transaction';

-- 7. Check again
-- Expected: spent should be 0
*/

-- =====================================================
-- Performance Optimization
-- =====================================================

-- Add index to improve trigger performance
CREATE INDEX IF NOT EXISTS idx_transactions_category_date 
ON transactions(category_id, date) 
WHERE type = 'expense';

-- Add index on budget_periods for faster lookups
CREATE INDEX IF NOT EXISTS idx_budget_periods_dates 
ON budget_periods(start_date, end_date);

COMMENT ON INDEX idx_transactions_category_date IS 
'Improves performance of budget spent calculations';
