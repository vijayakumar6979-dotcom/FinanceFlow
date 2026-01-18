/**
 * Repayment Calculation Utilities
 * Formulas and logic for credit card debt payoff scenarios
 */

import type { PlanName, RepaymentPlan } from '../types/credit-card-analytics';

export interface RepaymentScenario {
    planName: PlanName;
    monthlyPayment: number;
    durationMonths: number;
    totalInterest: number;
    totalPaid: number;
    payoffDate: Date;
    interestSavedVsMinimum: number;
}

/**
 * Calculate monthly payment for a given duration
 * Uses amortization formula: P = (r * PV) / (1 - (1 + r)^-n)
 * Where:
 * P = Monthly payment
 * r = Monthly interest rate (APR / 12)
 * PV = Present value (current balance)
 * n = Number of months
 */
export function calculateMonthlyPayment(
    balance: number,
    aprPercentage: number,
    months: number
): number {
    if (months <= 0 || balance <= 0) return 0;
    if (aprPercentage === 0) {
        // No interest, simple division
        return balance / months;
    }

    const monthlyRate = aprPercentage / 100 / 12;
    const payment = (monthlyRate * balance) / (1 - Math.pow(1 + monthlyRate, -months));

    return Math.round(payment * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate total interest paid for a repayment scenario
 */
export function calculateTotalInterest(
    balance: number,
    monthlyPayment: number,
    aprPercentage: number
): number {
    if (monthlyPayment <= 0 || balance <= 0) return 0;

    const monthlyRate = aprPercentage / 100 / 12;
    let remainingBalance = balance;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600; // Safety limit (50 years)

    while (remainingBalance > 0.01 && months < maxMonths) {
        const interestCharge = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestCharge;

        if (principalPayment <= 0) {
            // Payment doesn't cover interest, infinite loop scenario
            throw new Error('Monthly payment too low to cover interest');
        }

        totalInterest += interestCharge;
        remainingBalance -= principalPayment;
        months++;
    }

    return Math.round(totalInterest * 100) / 100;
}

/**
 * Calculate payoff duration given monthly payment
 */
export function calculatePayoffMonths(
    balance: number,
    monthlyPayment: number,
    aprPercentage: number
): number {
    if (monthlyPayment <= 0 || balance <= 0) return 0;

    const monthlyRate = aprPercentage / 100 / 12;
    let remainingBalance = balance;
    let months = 0;
    const maxMonths = 600;

    while (remainingBalance > 0.01 && months < maxMonths) {
        const interestCharge = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestCharge;

        if (principalPayment <= 0) {
            return maxMonths; // Payment too low
        }

        remainingBalance -= principalPayment;
        months++;
    }

    return months;
}

/**
 * Generate payoff date from current date and duration
 */
export function calculatePayoffDate(durationMonths: number): Date {
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + durationMonths);
    return payoffDate;
}

/**
 * Calculate minimum payment (5% of balance or minimum amount)
 */
export function calculateMinimumPayment(
    balance: number,
    minPercentage: number = 5.0,
    minAmount: number = 25
): number {
    const percentagePayment = balance * (minPercentage / 100);
    return Math.max(percentagePayment, minAmount);
}

/**
 * Generate all three standard repayment scenarios
 */
export function generateRepaymentScenarios(
    balance: number,
    aprPercentage: number,
    minPaymentPercentage: number = 5.0
): RepaymentScenario[] {
    const scenarios: RepaymentScenario[] = [];
    const minPayment = calculateMinimumPayment(balance, minPaymentPercentage);

    // Calculate minimum payment scenario for comparison
    const minMonths = calculatePayoffMonths(balance, minPayment, aprPercentage);
    const minInterest = calculateTotalInterest(balance, minPayment, aprPercentage);

    // Aggressive Plan: 6 months
    try {
        const aggressivePayment = calculateMonthlyPayment(balance, aprPercentage, 6);
        const aggressiveInterest = calculateTotalInterest(balance, aggressivePayment, aprPercentage);
        scenarios.push({
            planName: 'aggressive',
            monthlyPayment: aggressivePayment,
            durationMonths: 6,
            totalInterest: aggressiveInterest,
            totalPaid: balance + aggressiveInterest,
            payoffDate: calculatePayoffDate(6),
            interestSavedVsMinimum: minInterest - aggressiveInterest,
        });
    } catch (error) {
        console.warn('Could not generate aggressive plan:', error);
    }

    // Balanced Plan: 12 months
    try {
        const balancedPayment = calculateMonthlyPayment(balance, aprPercentage, 12);
        const balancedInterest = calculateTotalInterest(balance, balancedPayment, aprPercentage);
        scenarios.push({
            planName: 'balanced',
            monthlyPayment: balancedPayment,
            durationMonths: 12,
            totalInterest: balancedInterest,
            totalPaid: balance + balancedInterest,
            payoffDate: calculatePayoffDate(12),
            interestSavedVsMinimum: minInterest - balancedInterest,
        });
    } catch (error) {
        console.warn('Could not generate balanced plan:', error);
    }

    // Conservative Plan: 24 months
    try {
        const conservativePayment = calculateMonthlyPayment(balance, aprPercentage, 24);
        const conservativeInterest = calculateTotalInterest(balance, conservativePayment, aprPercentage);
        scenarios.push({
            planName: 'conservative',
            monthlyPayment: conservativePayment,
            durationMonths: 24,
            totalInterest: conservativeInterest,
            totalPaid: balance + conservativeInterest,
            payoffDate: calculatePayoffDate(24),
            interestSavedVsMinimum: minInterest - conservativeInterest,
        });
    } catch (error) {
        console.warn('Could not generate conservative plan:', error);
    }

    return scenarios;
}

/**
 * Calculate custom repayment scenario with user-defined monthly payment
 */
export function calculateCustomScenario(
    balance: number,
    monthlyPayment: number,
    aprPercentage: number
): RepaymentScenario {
    const minPayment = calculateMinimumPayment(balance);

    if (monthlyPayment < minPayment) {
        throw new Error(`Monthly payment must be at least ${minPayment.toFixed(2)}`);
    }

    const months = calculatePayoffMonths(balance, monthlyPayment, aprPercentage);
    const totalInterest = calculateTotalInterest(balance, monthlyPayment, aprPercentage);
    const minMonths = calculatePayoffMonths(balance, minPayment, aprPercentage);
    const minInterest = calculateTotalInterest(balance, minPayment, aprPercentage);

    return {
        planName: 'custom',
        monthlyPayment,
        durationMonths: months,
        totalInterest,
        totalPaid: balance + totalInterest,
        payoffDate: calculatePayoffDate(months),
        interestSavedVsMinimum: minInterest - totalInterest,
    };
}

/**
 * Calculate progress of a repayment plan
 */
export function calculateRepaymentProgress(
    plan: RepaymentPlan,
    currentBalance: number
): {
    percentComplete: number;
    paymentsRemaining: number;
    balanceReduction: number;
    onTrack: boolean;
    deviation: number;
} {
    const totalReduction = plan.initial_balance - currentBalance;
    const percentComplete = (totalReduction / plan.initial_balance) * 100;

    // Expected balance after payments_made payments
    const expectedBalance = plan.initial_balance;
    let remainingBalance = expectedBalance;
    const monthlyRate = plan.interest_rate / 100 / 12;

    for (let i = 0; i < plan.payments_made; i++) {
        const interestCharge = remainingBalance * monthlyRate;
        const principalPayment = plan.monthly_payment - interestCharge;
        remainingBalance -= principalPayment;
    }

    const deviation = remainingBalance - currentBalance;
    const onTrack = Math.abs(deviation) < plan.monthly_payment * 0.1; // Within 10% tolerance

    const paymentsRemaining = calculatePayoffMonths(
        currentBalance,
        plan.monthly_payment,
        plan.interest_rate
    );

    return {
        percentComplete: Math.min(percentComplete, 100),
        paymentsRemaining,
        balanceReduction: totalReduction,
        onTrack,
        deviation,
    };
}

/**
 * Format repayment plan for display
 */
export function formatRepaymentPlanSummary(plan: RepaymentPlan): string {
    return `Pay ${plan.monthly_payment.toFixed(2)} per month for ${plan.duration_months} months. Total interest: ${plan.total_interest.toFixed(2)}. Save ${plan.interest_saved_vs_minimum.toFixed(2)} vs minimum payments.`;
}
