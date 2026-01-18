-- Make the 'name' column nullable and add default value from loan_name
-- This allows backward compatibility while transitioning to loan_name

-- First, make name nullable
ALTER TABLE loans ALTER COLUMN name DROP NOT NULL;

-- Set default value for existing rows that might have null name
UPDATE loans SET name = loan_name WHERE name IS NULL;

-- Add a trigger to auto-populate name from loan_name for backward compatibility
CREATE OR REPLACE FUNCTION sync_loan_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If name is not provided, use loan_name
    IF NEW.name IS NULL AND NEW.loan_name IS NOT NULL THEN
        NEW.name := NEW.loan_name;
    END IF;
    
    -- If loan_name is not provided, use name
    IF NEW.loan_name IS NULL AND NEW.name IS NOT NULL THEN
        NEW.loan_name := NEW.name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS sync_loan_name_on_insert ON loans;
CREATE TRIGGER sync_loan_name_on_insert
    BEFORE INSERT ON loans
    FOR EACH ROW
    EXECUTE FUNCTION sync_loan_name();

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS sync_loan_name_on_update ON loans;
CREATE TRIGGER sync_loan_name_on_update
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION sync_loan_name();
