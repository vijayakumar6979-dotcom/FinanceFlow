export type LoanType = 'home' | 'auto' | 'personal' | 'education' | 'business' | 'islamic';
export type LoanPaymentStatus = 'current' | 'paid_ahead' | 'behind';
export type LoanStatus = 'active' | 'paid_off' | 'defaulted' | 'refinanced';
export type PaymentMethod = 'auto_debit' | 'online_banking' | 'check' | 'cash';
export type PaymentType = 'regular' | 'extra' | 'lump_sum';
export type PaymentCompletionStatus = 'pending' | 'completed' | 'late' | 'missed';

export interface Loan {
    id: string;
    user_id: string;

    // Identity
    name: string; // Legacy field, use loan_name instead
    loan_name: string;
    loan_type: LoanType;
    lender_id: string;
    lender_name: string;
    lender_logo?: string;
    lender_color?: string;
    account_number?: string;

    // Financial
    original_amount: number;
    current_balance: number;
    interest_rate: number;
    monthly_payment: number;

    // Term
    term_months: number;
    remaining_months?: number;
    start_date: string; // ISO Date string
    payment_day: number;

    // Payment Info
    payment_method?: PaymentMethod;
    linked_account_id?: string;
    payment_status: LoanPaymentStatus;
    missed_payments: number;

    // Additional
    loan_purpose?: string;
    collateral_value?: number;
    late_payment_fee?: number;
    prepayment_penalty_type?: 'percentage' | 'fixed' | 'none';
    prepayment_penalty_value?: number;

    // Reminders
    reminder_days: number[];

    // Integration
    auto_add_to_budget: boolean;

    // Status
    status: LoanStatus;

    // Metadata
    notes?: string;
    currency: string;
    created_at: string;
    updated_at: string;
}

export interface LoanPayment {
    id: string;
    user_id: string;
    loan_id: string;

    payment_date: string;
    amount: number;
    principal_amount: number;
    interest_amount: number;

    payment_type: PaymentType;
    status: PaymentCompletionStatus;
    due_date: string;
    is_late: boolean;
    late_fee_charged?: number;

    transaction_id?: string;
    account_id?: string;
    notes?: string;
    created_at: string;
}

export interface AmortizationScheduleEntry {
    id?: string;
    loan_id: string;
    payment_number: number;
    payment_date: string;
    payment_amount: number;
    principal_amount: number;
    interest_amount: number;
    remaining_balance: number;
    is_paid: boolean;
    actual_payment_id?: string;
}

export interface CreateLoanDTO extends Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'payment_status' | 'missed_payments' | 'status'> {
    payment_status?: LoanPaymentStatus;
    status?: LoanStatus;
}

export interface UpdateLoanDTO extends Partial<CreateLoanDTO> { }

// Payoff Strategy Interfaces
export type StrategyType = 'current' | 'snowball' | 'avalanche' | 'custom';

export interface PayoffStrategyLoan {
    loanId: string;
    loanName: string;
    reason: string;
}

export interface PayoffStrategy {
    type: StrategyType;
    name: string;
    description: string;
    payoffOrder: PayoffStrategyLoan[];
    payoffDate: string;
    totalInterest: number;
    interestSaved: number;
    monthsSaved: number;
    pros: string[];
    cons: string[];
}

export interface PayoffStrategyComparison {
    currentPlan: PayoffStrategy;
    snowballMethod: PayoffStrategy;
    avalancheMethod: PayoffStrategy;
    recommendation: {
        bestStrategy: StrategyType;
        reasoning: string;
        customAdvice: string[];
    };
    quickWins: string[];
    milestones: Array<{
        achievement: string;
        estimatedDate: string;
        impact: string;
    }>;
}

// Refinancing Analysis
export interface RefinanceAnalysis {
    id?: string;
    loanId: string;
    analysisDate: string;
    currentRate: number;
    newRate: number;
    monthlySavings: number;
    lifetimeSavings: number;
    breakEvenMonths: number;
    isRecommended: boolean;
    createdAt?: string;
}

// Debt Summary
export interface DebtSummary {
    totalDebt: number;
    totalMonthlyPayments: number;
    totalInterestLifetime: number;
    totalInterestPaid: number;
    totalInterestRemaining: number;
    debtFreeDate: string;
    monthsToDebtFree: number;
    percentagePaid: number;
    totalOriginalDebt: number;
    totalPaid: number;
}

// Extra Payment Impact
export interface ExtraPaymentImpact {
    extraAmount: number;
    newPayoffDate: string;
    monthsSaved: number;
    interestSaved: number;
    totalSavings: number;
}
