-- Core Schema (Categories & Transactions)

-- 0. Shared Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for system default categories? Or just use specific user
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    icon TEXT,
    color TEXT,
    
    is_default BOOLEAN DEFAULT FALSE, -- for system categories
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    
    amount DECIMAL(15, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadata
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency TEXT,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_id);

-- 3. RLS Policies

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id OR is_default = TRUE);

CREATE POLICY "Users can insert own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Triggers
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
