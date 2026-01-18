export interface FinancialHealthScore {
    overall: number; // 0-100
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    breakdown: {
        budgeting: number;
        saving: number;
        debtManagement: number;
        investing: number;
        cashFlow: number;
    };
    insights: string[];
}

export interface FinancialSnapshot {
    id: string;
    user_id: string;
    snapshot_date: string;
    snapshot_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    total_income: number;
    total_expenses: number;
    net_savings: number;
    savings_rate: number;
    total_assets: number;
    total_liabilities: number;
    net_worth: number;
    budgets_on_track: number;
    budgets_total: number;
    budget_adherence_rate: number;
    total_debt: number;
    monthly_debt_payments: number;
    portfolio_value: number;
    portfolio_roi: number;
    financial_health_score: number;
    created_at: string;
}

export interface AnalyticsInsight {
    id: string;
    user_id: string;
    insight_type: 'achievement' | 'alert' | 'opportunity' | 'pattern' | 'milestone';
    priority: 'low' | 'medium' | 'high';
    title: string;
    message: string;
    recommendation?: string;
    impact_amount?: number;
    is_read: boolean;
    is_actioned: boolean;
    metadata?: any;
    created_at: string;
    expires_at?: string;
}

export interface SpendingForecast {
    period: string; // e.g., "July 2024"
    predicted: number;
    confidence: number; // 0-100
    range?: {
        min: number;
        max: number;
    };
}

export interface NetWorthData {
    date: string;
    assets: number;
    liabilities: number;
    netWorth: number;
}

export interface CashFlowData {
    month: string;
    income: number;
    expenses: number;
    net: number;
}

export interface CategoryBreakdown {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
}
