/**
 * Credit Card Analytics and Repayment Plans Types
 * Generated from database schema
 */

// ============================================================================
// Credit Card Analytics Types
// ============================================================================

export interface SpendingPattern {
    category: string;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    insight: string;
}

export interface UtilizationAnalysis {
    status: 'high' | 'moderate' | 'healthy';
    recommendation: string;
    creditScoreImpact: 'negative' | 'neutral' | 'positive';
}

export interface UnusualActivity {
    date: string;
    amount: number;
    category: string;
    reason: string;
}

export interface CreditCardAnalytics {
    id: string;
    account_id: string;
    analysis_date: string;
    spending_patterns: SpendingPattern[];
    utilization_analysis: UtilizationAnalysis;
    unusual_activity: UnusualActivity[];
    recommendations: string[];
    created_at: string;
    updated_at: string;
}

export interface CreateCreditCardAnalyticsDTO {
    account_id: string;
    analysis_date?: string;
    spending_patterns: SpendingPattern[];
    utilization_analysis: UtilizationAnalysis;
    unusual_activity: UnusualActivity[];
    recommendations: string[];
}

// ============================================================================
// Repayment Plans Types
// ============================================================================

export type PlanName = 'aggressive' | 'balanced' | 'conservative' | 'custom';

export interface BudgetAdjustment {
    category: string;
    amount: number;
    action: string;
}

export interface ActualVsPlanned {
    deviation_amount: number;
    deviation_percentage: number;
    status: 'on_track' | 'ahead' | 'behind';
}

export interface RepaymentPlan {
    id: string;
    account_id: string;
    plan_name: PlanName;
    monthly_payment: number;
    duration_months: number;
    total_interest: number;
    payoff_date: string;
    initial_balance: number;
    interest_rate: number;
    total_amount_paid: number; // Computed field
    interest_saved_vs_minimum: number;
    pros: string[];
    cons: string[];
    budget_adjustments: BudgetAdjustment[];
    is_selected: boolean;
    is_active: boolean;
    payments_made: number;
    last_payment_date: string | null;
    actual_vs_planned: ActualVsPlanned | null;
    created_at: string;
    updated_at: string;
}

export interface CreateRepaymentPlanDTO {
    account_id: string;
    plan_name: PlanName;
    monthly_payment: number;
    duration_months: number;
    total_interest: number;
    payoff_date: string;
    initial_balance: number;
    interest_rate: number;
    interest_saved_vs_minimum?: number;
    pros?: string[];
    cons?: string[];
    budget_adjustments?: BudgetAdjustment[];
    is_selected?: boolean;
}

export interface UpdateRepaymentPlanDTO {
    monthly_payment?: number;
    is_selected?: boolean;
    is_active?: boolean;
    payments_made?: number;
    last_payment_date?: string;
    actual_vs_planned?: ActualVsPlanned;
}

// ============================================================================
// Grok API Request/Response Types
// ============================================================================

export interface GrokAnalysisRequest {
    cardName: string;
    creditLimit: number;
    outstandingBalance: number;
    utilization: number;
    transactionSummary: string;
    categoryBreakdown: Record<string, number>;
}

export interface GrokAnalysisResponse {
    spendingPatterns: SpendingPattern[];
    utilizationAnalysis: UtilizationAnalysis;
    unusualActivity: UnusualActivity[];
    topRecommendations: string[];
}

export interface GrokRepaymentRequest {
    balance: number;
    apr: number;
    minPayment: number;
    minPaymentPercentage: number;
    dueDate: number;
    income?: number;
}

export interface GrokRepaymentPlanOption {
    name: PlanName;
    monthlyPayment: number;
    duration: number;
    totalInterest: number;
    payoffDate: string;
    pros: string[];
    cons: string[];
}

export interface GrokRepaymentResponse {
    plans: GrokRepaymentPlanOption[];
    recommendations: string[];
    budgetAdjustments: BudgetAdjustment[];
}

// ============================================================================
// Helper Types
// ============================================================================

export interface RepaymentComparison {
    plan: RepaymentPlan;
    savingsVsMinimum: number;
    monthlyBudgetImpact: number;
    payoffTimelineDays: number;
    affordabilityScore: number; // 0-100
}

export interface PaymentMilestone {
    percentage: number;
    reached: boolean;
    date: string | null;
    label: string;
}
