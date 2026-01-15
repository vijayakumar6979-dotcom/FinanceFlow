export type Currency = 'MYR' | 'USD' | 'SGD' | 'IDR' | 'THB';

export interface Budget {
    id: string;
    user_id: string;
    category_id: string;
    name?: string;
    amount: number;
    currency: Currency;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    start_date: string;
    end_date?: string;
    rollover_enabled: boolean;
    rollover_amount: number;
    alert_thresholds: number[];
    notifications_enabled: boolean;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface BudgetPeriod {
    id: string;
    budget_id: string;
    user_id: string;
    period_start: string;
    period_end: string;
    budget_amount: number;
    spent_amount: number;
    remaining_amount: number;
    status: 'on_track' | 'warning' | 'critical' | 'exceeded';
    created_at: string;
}

export interface Goal {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    goal_type: 'savings' | 'debt_payoff' | 'investment' | 'custom';
    target_amount: number;
    current_amount: number;
    currency: Currency;
    target_date: string;
    emoji?: string;
    color?: string;
    icon?: string;
    priority: 'low' | 'medium' | 'high';
    linked_account_id?: string;
    auto_contribute_enabled: boolean;
    auto_contribute_amount?: number;
    auto_contribute_frequency?: 'weekly' | 'monthly';
    auto_contribute_day?: number;
    status: 'active' | 'completed' | 'paused' | 'archived';
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface GoalMilestone {
    id: string;
    goal_id: string;
    name: string;
    target_amount: number;
    target_percentage?: number;
    is_completed: boolean;
    completed_at?: string;
    celebration_note?: string;
    created_at: string;
}

export interface GoalContribution {
    id: string;
    goal_id: string;
    user_id: string;
    amount: number;
    contribution_date: string;
    source_account_id?: string;
    transaction_id?: string;
    notes?: string;
    created_at: string;
}

export interface BudgetRecommendation {
    id: string;
    user_id: string;
    category_id: string;
    suggested_amount: number;
    reasoning?: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    tips?: string[];
    is_accepted: boolean;
    generated_at: string;
}

export type LoanType = 'home' | 'auto' | 'personal' | 'education' | 'business' | 'islamic';

export interface LoanProvider {
    id: string;
    name: string;
    fullName: string;
    logo: string;
    color: string;
    loanTypes: LoanType[];
    website: string;
    description?: string;
    interestRates?: {
        [key in LoanType]?: { min: number; max: number };
    };
    isIslamic?: boolean;
}

export interface Loan {
    id: string;
    user_id: string;
    name: string;
    lender_id?: string;
    lender_name?: string;
    lender_logo?: string;
    loan_type: LoanType;

    account_number?: string;
    account_number_masked?: string;

    original_amount: number;
    current_balance: number;
    interest_rate: number;

    start_date: string;
    term_months: number;
    remaining_months?: number;

    monthly_payment: number;
    payment_day?: number;
    next_payment_date?: string;

    collateral_value?: number;
    prepayment_penalty?: number;
    late_fee?: number;
    payment_method?: string;
    linked_account_id?: string;

    reminder_days?: number[];
    auto_create_transaction?: boolean;
    status: 'active' | 'paid_off' | 'defaulted';

    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface AmortizationSchedule {
    id: string;
    loan_id: string;
    payment_number: number;
    payment_date: string;
    payment_amount: number;
    principal_amount: number;
    interest_amount: number;
    remaining_balance: number;
    is_paid: boolean;
    actual_payment_date?: string;
    actual_amount?: number;
}

export interface PayoffStrategy {
    id: string;
    user_id: string;
    strategy_type: 'current' | 'snowball' | 'avalanche' | 'custom';
    strategy_name?: string;
    extra_payment_amount: number;
    loan_priority_order?: string[]; // Array of loan IDs
    projected_payoff_date?: string;
    total_interest?: number;
    interest_saved?: number;
    months_saved?: number;
    is_active: boolean;
}
