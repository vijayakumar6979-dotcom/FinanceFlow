-- Force clean and seed categories WITH GROUPS
TRUNCATE TABLE transaction_categories CASCADE;

INSERT INTO transaction_categories (name, type, icon, color, is_system, group_name) VALUES
    -- INCOME --
    ('Salary', 'income', 'briefcase', '#10B981', true, 'Employment'),
    ('Freelance', 'income', 'laptop', '#34D399', true, 'Employment'),
    ('Business', 'income', 'building', '#059669', true, 'Business'),
    ('Investments', 'income', 'trending-up', '#6EE7B7', true, 'Investments'),
    ('Rental', 'income', 'home', '#10B981', true, 'Investments'),
    ('Dividends', 'income', 'pie-chart', '#3B82F6', true, 'Investments'),
    ('Gifts', 'income', 'gift', '#F472B6', true, 'Other'),
    ('Refunds', 'income', 'refresh-ccw', '#6B7280', true, 'Other'),
    ('Other Income', 'income', 'plus-circle', '#9CA3AF', true, 'Other'),

    -- EXPENSE - Housing --
    ('Rent/Mortgage', 'expense', 'home', '#EF4444', true, 'Housing & Utilities'),
    ('Electricity', 'expense', 'zap', '#F59E0B', true, 'Housing & Utilities'),
    ('Water', 'expense', 'droplet', '#3B82F6', true, 'Housing & Utilities'),
    ('Gas', 'expense', 'flame', '#EF4444', true, 'Housing & Utilities'),
    ('Internet', 'expense', 'wifi', '#8B5CF6', true, 'Housing & Utilities'),
    ('Phone', 'expense', 'smartphone', '#EC4899', true, 'Housing & Utilities'),
    ('Home Maintenance', 'expense', 'tool', '#6B7280', true, 'Housing & Utilities'),
    ('Furniture', 'expense', 'sofa', '#9CA3AF', true, 'Housing & Utilities'),

    -- EXPENSE - Transportation --
    ('Fuel', 'expense', 'fuel', '#F97316', true, 'Transportation'),
    ('Public Transport', 'expense', 'bus', '#3B82F6', true, 'Transportation'),
    ('Car Maintenance', 'expense', 'tool', '#4B5563', true, 'Transportation'),
    ('Parking', 'expense', 'map-pin', '#9CA3AF', true, 'Transportation'),
    ('Toll', 'expense', 'ticket', '#F59E0B', true, 'Transportation'),
    ('Taxi/Grab', 'expense', 'car', '#EAB308', true, 'Transportation'),

    -- EXPENSE - Food --
    ('Groceries', 'expense', 'shopping-cart', '#10B981', true, 'Food & Drinks'),
    ('Restaurants', 'expense', 'utensils', '#F87171', true, 'Food & Drinks'),
    ('Coffee', 'expense', 'coffee', '#78350F', true, 'Food & Drinks'),
    ('Bars', 'expense', 'wine', '#7C3AED', true, 'Food & Drinks'),

     -- EXPENSE - Education --
    ('Education', 'expense', 'book', '#4F46E5', true, 'Education'),
    ('School Fees', 'expense', 'graduation-cap', '#4338CA', true, 'Education'),
    ('Tuition Fees', 'expense', 'book-open', '#6366F1', true, 'Education'),
    ('Books & Stationery', 'expense', 'pencil', '#818CF8', true, 'Education'),

    -- EXPENSE - Lifestyle & Family --
    ('Shopping', 'expense', 'shopping-bag', '#DB2777', true, 'Shopping'),
    ('Clothing', 'expense', 'shirt', '#EC4899', true, 'Shopping'),
    ('Entertainment', 'expense', 'film', '#8B5CF6', true, 'Lifestyle'),
    ('Subscriptions', 'expense', 'repeat', '#6366F1', true, 'Lifestyle'),
    ('Sports', 'expense', 'activity', '#EF4444', true, 'Lifestyle'),
    ('Travel', 'expense', 'plane', '#0EA5E9', true, 'Lifestyle'),
    ('Personal Care', 'expense', 'smile', '#F472B6', true, 'Health & Wellness'),
    ('Health/Medical', 'expense', 'heart', '#DC2626', true, 'Health & Wellness'),
    ('Pharmacy', 'expense', 'pill', '#EF4444', true, 'Health & Wellness'),
    ('Pets', 'expense', 'dog', '#FB923C', true, 'Family'),
    ('Childcare', 'expense', 'baby', '#F472B6', true, 'Family'),
    ('Charity', 'expense', 'heart-handshake', '#BE185D', true, 'Charity'),

    -- EXPENSE - Financial --
    ('Insurance', 'expense', 'shield', '#059669', true, 'Financial'),
    ('Taxes', 'expense', 'file-text', '#DC2626', true, 'Financial'),
    ('Fees', 'expense', 'alert-circle', '#9CA3AF', true, 'Financial'),
    ('Loan Payment', 'expense', 'credit-card', '#7C3AED', true, 'Financial'),
    ('Fines', 'expense', 'alert-triangle', '#EF4444', true, 'Financial'),
    
    -- TRANSFER --
    ('Transfer', 'transfer', 'arrow-right-left', '#6B7280', true, 'Transfers');
