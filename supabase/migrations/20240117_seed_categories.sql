-- Seed detailed categories
INSERT INTO transaction_categories (name, type, icon, color, is_system) VALUES
    -- INCOME
    ('Salary', 'income', 'briefcase', '#10B981', true),
    ('Freelance', 'income', 'laptop', '#34D399', true),
    ('Business', 'income', 'building', '#059669', true),
    ('Investments', 'income', 'trending-up', '#6EE7B7', true),
    ('Rental', 'income', 'home', '#10B981', true),
    ('Gifts', 'income', 'gift', '#F472B6', true),
    ('Dividends', 'income', 'pie-chart', '#3B82F6', true),
    ('Refunds', 'income', 'refresh-ccw', '#6B7280', true),
    ('Other Income', 'income', 'plus-circle', '#9CA3AF', true),

    -- EXPENSE - Housing & Utilities
    ('Rent/Mortgage', 'expense', 'home', '#EF4444', true),
    ('Electricity', 'expense', 'zap', '#F59E0B', true),
    ('Water', 'expense', 'droplet', '#3B82F6', true),
    ('Gas', 'expense', 'flame', '#EF4444', true),
    ('Internet', 'expense', 'wifi', '#8B5CF6', true),
    ('Phone', 'expense', 'smartphone', '#EC4899', true),
    ('Home Maintenance', 'expense', 'tool', '#6B7280', true),
    ('Furniture', 'expense', 'sofa', '#9CA3AF', true),

    -- EXPENSE - Transportation
    ('Fuel', 'expense', 'fuel', '#F97316', true),
    ('Public Transport', 'expense', 'bus', '#3B82F6', true),
    ('Car Maintenance', 'expense', 'tool', '#4B5563', true),
    ('Parking', 'expense', 'map-pin', '#9CA3AF', true),
    ('Toll', 'expense', 'ticket', '#F59E0B', true),
    ('Taxi/Grab', 'expense', 'car', '#EAB308', true),

    -- EXPENSE - Food
    ('Groceries', 'expense', 'shopping-cart', '#10B981', true),
    ('Restaurants', 'expense', 'utensils', '#F87171', true),
    ('Coffee', 'expense', 'coffee', '#78350F', true),
    ('Bars', 'expense', 'wine', '#7C3AED', true),

    -- EXPENSE - Education
    ('Education', 'expense', 'book', '#4F46E5', true), -- General
    ('School Fees', 'expense', 'graduation-cap', '#4338CA', true), -- Added
    ('Tuition Fees', 'expense', 'book-open', '#6366F1', true), -- Added
    ('Books & Stationery', 'expense', 'pencil', '#818CF8', true), -- Added (Using pencil/pen icon)

    -- EXPENSE - Lifestyle & Family
    ('Shopping', 'expense', 'shopping-bag', '#DB2777', true),
    ('Clothing', 'expense', 'shirt', '#EC4899', true),
    ('Entertainment', 'expense', 'film', '#8B5CF6', true),
    ('Subscriptions', 'expense', 'repeat', '#6366F1', true),
    ('Sports', 'expense', 'activity', '#EF4444', true),
    ('Travel', 'expense', 'plane', '#0EA5E9', true),
    ('Personal Care', 'expense', 'smile', '#F472B6', true),
    ('Health/Medical', 'expense', 'heart', '#DC2626', true),
    ('Pharmacy', 'expense', 'pill', '#EF4444', true),
    ('Pets', 'expense', 'dog', '#FB923C', true),
    ('Childcare', 'expense', 'baby', '#F472B6', true),
    ('Charity', 'expense', 'heart-handshake', '#BE185D', true),

    -- EXPENSE - Financial
    ('Insurance', 'expense', 'shield', '#059669', true),
    ('Taxes', 'expense', 'file-text', '#DC2626', true),
    ('Fees', 'expense', 'alert-circle', '#9CA3AF', true),
    ('Loan Payment', 'expense', 'credit-card', '#7C3AED', true),
    ('Fines', 'expense', 'alert-triangle', '#EF4444', true),
    
    -- TRANSFER
    ('Transfer', 'transfer', 'arrow-right-left', '#6B7280', true)
ON CONFLICT DO NOTHING;
