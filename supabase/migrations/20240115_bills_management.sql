-- Bills Management Migration

-- 1. Create bills table
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Provider Info
    provider_id TEXT, -- Links to hardcoded provider list (tnb, time, etc)
    provider_name TEXT NOT NULL,
    provider_logo TEXT,
    provider_category TEXT,
    
    -- Bill Details
    bill_name TEXT NOT NULL,
    account_number TEXT,
    account_number_masked TEXT,
    
    -- Amount
    is_variable BOOLEAN DEFAULT FALSE,
    fixed_amount DECIMAL(10, 2),
    estimated_amount DECIMAL(10, 2), -- For variable bills
    currency TEXT DEFAULT 'MYR',
    
    -- Schedule
    due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
    due_date_variable BOOLEAN DEFAULT FALSE,
    first_bill_date DATE,
    
    -- Payment
    payment_method TEXT,
    linked_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    auto_pay_enabled BOOLEAN DEFAULT FALSE,
    
    -- Reminders
    reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Budget Integration
    -- budget_category_id UUID REFERENCES public.categories(id), -- Optional: Link to budget categories if exists
    auto_sync_budget BOOLEAN DEFAULT TRUE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create bill_payments table
CREATE TABLE IF NOT EXISTS public.bill_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Denormalized for easier RLS
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_method TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('unpaid', 'paid', 'overdue', 'partial')) DEFAULT 'unpaid',
    
    -- Links
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    
    -- Anomaly Detection
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason TEXT,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create bill_predictions table
CREATE TABLE IF NOT EXISTS public.bill_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE NOT NULL,
    
    prediction_month DATE NOT NULL, -- The month this prediction is for (e.g., 2024-02-01)
    predicted_amount DECIMAL(10, 2),
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    amount_range_min DECIMAL(10, 2),
    amount_range_max DECIMAL(10, 2),
    
    reasoning TEXT,
    factors JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_day ON public.bills(due_day);
CREATE INDEX IF NOT EXISTS idx_bills_provider ON public.bills(provider_id);

CREATE INDEX IF NOT EXISTS idx_bill_payments_bill_id ON public.bill_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_user_id ON public.bill_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_due_date ON public.bill_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_bill_payments_status ON public.bill_payments(status);

CREATE INDEX IF NOT EXISTS idx_bill_predictions_bill_id ON public.bill_predictions(bill_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_predictions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Bills Policies
CREATE POLICY "Users can view their own bills"
    ON public.bills FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bills"
    ON public.bills FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills"
    ON public.bills FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills"
    ON public.bills FOR DELETE
    USING (auth.uid() = user_id);

-- Bill Payments Policies
CREATE POLICY "Users can view their own bill payments"
    ON public.bill_payments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bill payments"
    ON public.bill_payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bill payments"
    ON public.bill_payments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bill payments"
    ON public.bill_payments FOR DELETE
    USING (auth.uid() = user_id);

-- Bill Predictions Policies (View only mainly, but system creates them. For now assume user can view linked bills)
CREATE POLICY "Users can view predictions for their bills"
    ON public.bill_predictions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.bills
        WHERE bills.id = bill_predictions.bill_id
        AND bills.user_id = auth.uid()
    ));

-- 7. Triggers for updated_at
-- Function update_updated_at_column should be defined in core schema now


CREATE TRIGGER update_bills_updated_at
    BEFORE UPDATE ON public.bills
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bill_payments_updated_at
    BEFORE UPDATE ON public.bill_payments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
