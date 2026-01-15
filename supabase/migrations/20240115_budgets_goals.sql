-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  category_id UUID REFERENCES categories(id),
  name TEXT, -- Optional, if not tied strictly to a category or for custom naming
  
  -- Budget Details
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL DEFAULT 'monthly',
  
  -- Dates
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Settings
  rollover_enabled BOOLEAN DEFAULT FALSE,
  rollover_amount DECIMAL(15, 2) DEFAULT 0,
  
  -- Alerts
  alert_thresholds INTEGER[] DEFAULT ARRAY[75, 90, 100],
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_category ON budgets(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period, start_date);

-- 2. Budget Periods Table (Tracks instances of a budget over time)
CREATE TABLE IF NOT EXISTS budget_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Denormalized for RLS and easy querying
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  budget_amount DECIMAL(15, 2), -- Snapshotted amount for this period (in case budget changes)
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2),
  
  status TEXT CHECK (status IN ('on_track', 'warning', 'critical', 'exceeded')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_periods_budget ON budget_periods(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_periods_user_date ON budget_periods(user_id, period_start, period_end);

-- 3. Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  goal_type TEXT CHECK (goal_type IN ('savings', 'debt_payoff', 'investment', 'custom')),
  
  -- Financial Details
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'MYR',
  
  -- Timeline
  target_date DATE NOT NULL,
  
  -- Visual
  emoji TEXT,
  color TEXT DEFAULT '#0066FF',
  icon TEXT,
  
  -- Settings
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  linked_account_id UUID REFERENCES accounts(id), -- For tracking where the money actually is
  
  -- Auto-Contribute
  auto_contribute_enabled BOOLEAN DEFAULT FALSE,
  auto_contribute_amount DECIMAL(10, 2),
  auto_contribute_frequency TEXT CHECK (auto_contribute_frequency IN ('weekly', 'monthly')),
  auto_contribute_day INTEGER,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'completed', 'paused', 'archived')) DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);

-- 4. Goal Milestones Table
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  target_percentage INTEGER,
  
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  celebration_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal ON goal_milestones(goal_id);

-- 5. Goal Contributions Table
CREATE TABLE IF NOT EXISTS goal_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Denormalized
  
  amount DECIMAL(10, 2) NOT NULL,
  contribution_date DATE DEFAULT CURRENT_DATE,
  
  source_account_id UUID REFERENCES accounts(id), -- Optional transaction link
  transaction_id UUID REFERENCES transactions(id), -- Optional direct link to a real transaction
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_user ON goal_contributions(user_id);

-- 6. Budget Recommendations Table (AI)
CREATE TABLE IF NOT EXISTS budget_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  suggested_amount DECIMAL(10, 2),
  reasoning TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  tips JSONB,
  
  is_accepted BOOLEAN DEFAULT FALSE,
  
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_recommendations_user ON budget_recommendations(user_id);


-- RLS Policies
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_recommendations ENABLE ROW LEVEL SECURITY;

-- Budgets
CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE USING (auth.uid() = user_id);

-- Budget Periods
CREATE POLICY "Users can view own budget periods" ON budget_periods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget periods" ON budget_periods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget periods" ON budget_periods FOR UPDATE USING (auth.uid() = user_id);

-- Goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Goal Milestones (Access via Goal ownership is tricky in RLS without joining, simplified to goal link or explicit check if we add user_id)
-- Note: goal_milestones doesn't have user_id. We rely on the fact that only the user can modify the parent goal. 
-- However, for strict RLS, we typically add user_id or do a join. 
-- For simplicity and standard Supabase RLS patterns, let's assume we trust the implementation or add user_id for stricter control.
-- Adding user_id to milestones for strictly easier RLS:
ALTER TABLE goal_milestones ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- Backfill user_id if needed, but this is a new table.

CREATE POLICY "Users can view own goal milestones" ON goal_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal milestones" ON goal_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goal milestones" ON goal_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goal milestones" ON goal_milestones FOR DELETE USING (auth.uid() = user_id);

-- Goal Contributions
CREATE POLICY "Users can view own goal contributions" ON goal_contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal contributions" ON goal_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goal contributions" ON goal_contributions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goal contributions" ON goal_contributions FOR DELETE USING (auth.uid() = user_id);

-- Budget Recommendations
CREATE POLICY "Users can view own recommendations" ON budget_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON budget_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id); -- Usually system generated, but maybe edge function uses service role or user context
CREATE POLICY "Users can update own recommendations" ON budget_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
