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
