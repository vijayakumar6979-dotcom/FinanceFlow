-- Fix RLS for Development Mode (Mock User)
-- This migration updates RLS policies to allow the mock Dev User to perform actions even when connected via Anon key (auth.uid() IS NULL)

-- 1. LOANS
DROP POLICY IF EXISTS "Users can insert own loans" ON loans;
CREATE POLICY "Users can insert own loans" ON loans FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can view own loans" ON loans;
CREATE POLICY "Users can view own loans" ON loans FOR SELECT
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can update own loans" ON loans;
CREATE POLICY "Users can update own loans" ON loans FOR UPDATE
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can delete own loans" ON loans;
CREATE POLICY "Users can delete own loans" ON loans FOR DELETE
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

-- 2. LOAN AMORTIZATION SCHEDULE
DROP POLICY IF EXISTS "Users can view own amortization" ON loan_amortization_schedule;
CREATE POLICY "Users can view own amortization" ON loan_amortization_schedule FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans WHERE loans.id = loan_amortization_schedule.loan_id AND (
      loans.user_id = auth.uid() OR (auth.uid() IS NULL AND loans.user_id = '11111111-1111-1111-1111-111111111111'::uuid)
    )
  )
);

DROP POLICY IF EXISTS "Users can insert own amortization" ON loan_amortization_schedule;
CREATE POLICY "Users can insert own amortization" ON loan_amortization_schedule FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans WHERE loans.id = loan_amortization_schedule.loan_id AND (
      loans.user_id = auth.uid() OR (auth.uid() IS NULL AND loans.user_id = '11111111-1111-1111-1111-111111111111'::uuid)
    )
  )
);

-- 3. PAYOFF STRATEGIES
DROP POLICY IF EXISTS "Users can view own strategies" ON loan_payoff_strategies;
CREATE POLICY "Users can view own strategies" ON loan_payoff_strategies FOR SELECT
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can insert own strategies" ON loan_payoff_strategies;
CREATE POLICY "Users can insert own strategies" ON loan_payoff_strategies FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can update own strategies" ON loan_payoff_strategies;
CREATE POLICY "Users can update own strategies" ON loan_payoff_strategies FOR UPDATE
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

DROP POLICY IF EXISTS "Users can delete own strategies" ON loan_payoff_strategies;
CREATE POLICY "Users can delete own strategies" ON loan_payoff_strategies FOR DELETE
USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND user_id = '11111111-1111-1111-1111-111111111111'::uuid)
);

-- 4. REFINANCE ANALYSES
DROP POLICY IF EXISTS "Users can view own refinance analyses" ON loan_refinance_analyses;
CREATE POLICY "Users can view own refinance analyses" ON loan_refinance_analyses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans WHERE loans.id = loan_refinance_analyses.loan_id AND (
      loans.user_id = auth.uid() OR (auth.uid() IS NULL AND loans.user_id = '11111111-1111-1111-1111-111111111111'::uuid)
    )
  )
);
