-- Transaction Categories
CREATE TABLE IF NOT EXISTS transaction_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- Nullable for system categories
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    icon TEXT,
    color TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for categories
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View categories" ON transaction_categories
    FOR SELECT USING (user_id = auth.uid() OR is_system = true);

CREATE POLICY "Manage own categories" ON transaction_categories
    FOR ALL USING (user_id = auth.uid());

-- Seed some system categories
INSERT INTO transaction_categories (name, type, icon, color, is_system) VALUES
    ('Salary', 'income', 'briefcase', '#10B981', true),
    ('Freelance', 'income', 'laptop', '#34D399', true),
    ('Investment Returns', 'income', 'trending-up', '#6EE7B7', true),
    ('Food & Dining', 'expense', 'utensils', '#F87171', true),
    ('Transportation', 'expense', 'car', '#FB923C', true),
    ('Shopping', 'expense', 'shopping-bag', '#F472B6', true),
    ('Housing', 'expense', 'home', '#60A5FA', true),
    ('Utilities', 'expense', 'zap', '#FBBF24', true),
    ('Healthcare', 'expense', 'activity', '#EF4444', true),
    ('Entertainment', 'expense', 'film', '#8B5CF6', true),
    ('Education', 'expense', 'book', '#6366F1', true),
    ('Personal Care', 'expense', 'smile', '#EC4899', true),
    ('Travel', 'expense', 'plane', '#0EA5E9', true),
    ('Debt Payments', 'expense', 'credit-card', '#DC2626', true),
    ('Miscellaneous', 'expense', 'box', '#9CA3AF', true),
    ('Transfer', 'transfer', 'arrow-right-left', '#94A3B8', true)
ON CONFLICT DO NOTHING;


-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    account_id UUID NOT NULL, -- References accounts table (assuming it exists, but loose FK for now or specific if table known)
    category_id UUID REFERENCES transaction_categories(id),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(20, 2) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    notes TEXT,
    tags TEXT[],
    
    -- Sync/Linking Fields
    linked_type TEXT CHECK (linked_type IN ('bill', 'loan', 'goal', 'investment', 'credit_card')),
    linked_id UUID,
    
    -- Recurring Flags
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule_id UUID, -- Link to definition if separate
    
    -- Split Flag
    is_split BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurrence Rules
CREATE TABLE IF NOT EXISTS transaction_recurrence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly')),
    interval INTEGER DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE,
    end_condition TEXT CHECK (end_condition IN ('never', 'count', 'date')),
    occurrence_count INTEGER,
    next_occurrence DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Splits
CREATE TABLE IF NOT EXISTS transaction_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    category_id UUID REFERENCES transaction_categories(id),
    amount DECIMAL(20, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_recurrence ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own transactions" ON transactions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Manage own recurrence" ON transaction_recurrence
    FOR ALL USING (EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_recurrence.transaction_id AND transactions.user_id = auth.uid()));

CREATE POLICY "Manage own splits" ON transaction_splits
    FOR ALL USING (EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_splits.transaction_id AND transactions.user_id = auth.uid()));

-- Development Bypass (Uncomment if needed)
-- ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transaction_categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transaction_recurrence DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transaction_splits DISABLE ROW LEVEL SECURITY;
