import { Loan, AmortizationScheduleEntry, PayoffStrategy, PayoffStrategyComparison, DebtSummary, ExtraPaymentImpact, RefinanceAnalysis } from '../types/loans';

/**
 * Loan Calculator - Financial calculations for loans
 */
export class LoanCalculator {
    /**
     * Calculate monthly payment using PMT formula
     * PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
     */
    static calculateMonthlyPayment(
        principal: number,
        annualRate: number,
        termMonths: number
    ): number {
        if (annualRate === 0) {
            return principal / termMonths;
        }

        const monthlyRate = annualRate / 100 / 12;
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1);

        return Math.round(payment * 100) / 100;
    }

    /**
     * Generate complete amortization schedule
     */
    static generateAmortizationSchedule(
        loanId: string,
        principal: number,
        annualRate: number,
        termMonths: number,
        startDate: Date | string,
        monthlyPayment?: number
    ): AmortizationScheduleEntry[] {
        const schedule: AmortizationScheduleEntry[] = [];
        const payment = monthlyPayment || this.calculateMonthlyPayment(principal, annualRate, termMonths);
        const monthlyRate = annualRate / 100 / 12;

        let remainingBalance = principal;
        const start = new Date(startDate);

        for (let i = 1; i <= termMonths; i++) {
            const interestAmount = remainingBalance * monthlyRate;
            const principalAmount = payment - interestAmount;
            remainingBalance -= principalAmount;

            // Handle final payment rounding
            if (i === termMonths) {
                remainingBalance = 0;
            }

            const paymentDate = new Date(start);
            paymentDate.setMonth(paymentDate.getMonth() + i);

            schedule.push({
                loan_id: loanId,
                payment_number: i,
                payment_date: paymentDate.toISOString().split('T')[0],
                payment_amount: Math.round(payment * 100) / 100,
                principal_amount: Math.round(principalAmount * 100) / 100,
                interest_amount: Math.round(interestAmount * 100) / 100,
                remaining_balance: Math.max(0, Math.round(remainingBalance * 100) / 100),
                is_paid: false
            });
        }

        return schedule;
    }

    /**
     * Calculate total interest over life of loan
     */
    static calculateTotalInterest(
        principal: number,
        annualRate: number,
        termMonths: number,
        monthlyPayment?: number
    ): number {
        const payment = monthlyPayment || this.calculateMonthlyPayment(principal, annualRate, termMonths);
        const totalPaid = payment * termMonths;
        return Math.round((totalPaid - principal) * 100) / 100;
    }

    /**
     * Calculate remaining interest on a loan
     */
    static calculateRemainingInterest(
        currentBalance: number,
        annualRate: number,
        remainingMonths: number,
        monthlyPayment: number
    ): number {
        const schedule = this.generateAmortizationSchedule(
            'temp',
            currentBalance,
            annualRate,
            remainingMonths,
            new Date(),
            monthlyPayment
        );

        return schedule.reduce((sum, entry) => sum + entry.interest_amount, 0);
    }

    /**
     * Calculate payoff date with optional extra payment
     */
    static calculatePayoffDate(
        currentBalance: number,
        annualRate: number,
        monthlyPayment: number,
        extraPayment: number = 0,
        startDate: Date | string = new Date()
    ): Date {
        const totalPayment = monthlyPayment + extraPayment;
        const monthlyRate = annualRate / 100 / 12;

        let balance = currentBalance;
        let months = 0;
        const maxMonths = 600; // Safety limit (50 years)

        while (balance > 0 && months < maxMonths) {
            const interest = balance * monthlyRate;
            const principal = Math.min(totalPayment - interest, balance);
            balance -= principal;
            months++;
        }

        const payoffDate = new Date(startDate);
        payoffDate.setMonth(payoffDate.getMonth() + months);
        return payoffDate;
    }

    /**
     * Calculate interest savings from extra payment
     */
    static calculateInterestSavings(
        currentBalance: number,
        annualRate: number,
        monthlyPayment: number,
        extraPayment: number,
        remainingMonths: number
    ): ExtraPaymentImpact {
        // Calculate without extra payment
        const originalInterest = this.calculateRemainingInterest(
            currentBalance,
            annualRate,
            remainingMonths,
            monthlyPayment
        );
        const originalPayoffDate = this.calculatePayoffDate(
            currentBalance,
            annualRate,
            monthlyPayment,
            0
        );

        // Calculate with extra payment
        const newPayoffDate = this.calculatePayoffDate(
            currentBalance,
            annualRate,
            monthlyPayment,
            extraPayment
        );

        // Calculate months saved
        const monthsSaved = Math.round(
            (originalPayoffDate.getTime() - newPayoffDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        // Recalculate interest with new term
        const newInterest = this.calculateRemainingInterest(
            currentBalance,
            annualRate,
            remainingMonths - monthsSaved,
            monthlyPayment + extraPayment
        );

        const interestSaved = originalInterest - newInterest;

        return {
            extraAmount: extraPayment,
            newPayoffDate: newPayoffDate.toISOString().split('T')[0],
            monthsSaved,
            interestSaved: Math.round(interestSaved * 100) / 100,
            totalSavings: Math.round(interestSaved * 100) / 100
        };
    }

    /**
     * Calculate current payment breakdown (principal vs interest)
     */
    static calculateCurrentPaymentBreakdown(
        currentBalance: number,
        annualRate: number,
        monthlyPayment: number
    ): { principal: number; interest: number } {
        const monthlyRate = annualRate / 100 / 12;
        const interest = currentBalance * monthlyRate;
        const principal = monthlyPayment - interest;

        return {
            principal: Math.round(principal * 100) / 100,
            interest: Math.round(interest * 100) / 100
        };
    }
}

/**
 * Debt Payoff Calculator - Strategy calculations
 */
export class DebtPayoffCalculator {
    /**
     * Calculate Snowball strategy (smallest balance first)
     */
    static calculateSnowballStrategy(
        loans: Loan[],
        extraPayment: number = 0
    ): PayoffStrategy {
        // Sort by current balance (ascending)
        const sortedLoans = [...loans].sort((a, b) => a.current_balance - b.current_balance);

        const payoffOrder = sortedLoans.map(loan => ({
            loanId: loan.id,
            loanName: loan.loan_name || loan.name,
            reason: `Balance: RM ${loan.current_balance.toLocaleString()}`
        }));

        const projection = this.simulatePayoffStrategy(sortedLoans, extraPayment);

        return {
            type: 'snowball',
            name: 'Snowball Method',
            description: 'Pay off smallest balances first for quick wins and psychological momentum',
            payoffOrder,
            payoffDate: projection.payoffDate,
            totalInterest: projection.totalInterest,
            interestSaved: projection.interestSaved,
            monthsSaved: projection.monthsSaved,
            pros: [
                'Quick psychological wins',
                'Builds momentum and motivation',
                'Frees up cash flow faster',
                'Reduces number of debts quickly'
            ],
            cons: [
                'May pay more interest than Avalanche method',
                'Not mathematically optimal',
                'High-interest debts may linger'
            ]
        };
    }

    /**
     * Calculate Avalanche strategy (highest interest first)
     */
    static calculateAvalancheStrategy(
        loans: Loan[],
        extraPayment: number = 0
    ): PayoffStrategy {
        // Sort by interest rate (descending)
        const sortedLoans = [...loans].sort((a, b) => b.interest_rate - a.interest_rate);

        const payoffOrder = sortedLoans.map(loan => ({
            loanId: loan.id,
            loanName: loan.loan_name || loan.name,
            reason: `Interest Rate: ${loan.interest_rate}%`
        }));

        const projection = this.simulatePayoffStrategy(sortedLoans, extraPayment);

        return {
            type: 'avalanche',
            name: 'Avalanche Method',
            description: 'Pay off highest interest rates first for maximum savings',
            payoffOrder,
            payoffDate: projection.payoffDate,
            totalInterest: projection.totalInterest,
            interestSaved: projection.interestSaved,
            monthsSaved: projection.monthsSaved,
            pros: [
                'Maximum interest savings',
                'Mathematically optimal',
                'Faster overall payoff',
                'Reduces total cost of debt'
            ],
            cons: [
                'May take longer to see first loan paid off',
                'Requires discipline and patience',
                'Less immediate gratification'
            ]
        };
    }

    /**
     * Calculate current plan (minimum payments only)
     */
    static calculateCurrentPlan(loans: Loan[]): PayoffStrategy {
        const projection = this.simulatePayoffStrategy(loans, 0);

        return {
            type: 'current',
            name: 'Current Plan',
            description: 'Continue with minimum payments on all loans',
            payoffOrder: loans.map(loan => ({
                loanId: loan.id,
                loanName: loan.loan_name || loan.name,
                reason: 'Minimum payment'
            })),
            payoffDate: projection.payoffDate,
            totalInterest: projection.totalInterest,
            interestSaved: 0,
            monthsSaved: 0,
            pros: ['Lowest monthly commitment', 'Most flexibility'],
            cons: ['Highest total interest', 'Longest payoff time', 'Most expensive option']
        };
    }

    /**
     * Simulate payoff strategy
     */
    private static simulatePayoffStrategy(
        loans: Loan[],
        extraPayment: number
    ): { payoffDate: string; totalInterest: number; interestSaved: number; monthsSaved: number } {
        let totalInterest = 0;
        let maxPayoffDate = new Date();

        loans.forEach(loan => {
            const payoffDate = LoanCalculator.calculatePayoffDate(
                loan.current_balance,
                loan.interest_rate,
                loan.monthly_payment,
                extraPayment / loans.length, // Distribute extra payment
                new Date(loan.start_date)
            );

            if (payoffDate > maxPayoffDate) {
                maxPayoffDate = payoffDate;
            }

            const interest = LoanCalculator.calculateRemainingInterest(
                loan.current_balance,
                loan.interest_rate,
                loan.remaining_months || loan.term_months,
                loan.monthly_payment + (extraPayment / loans.length)
            );

            totalInterest += interest;
        });

        // Calculate baseline (no extra payment)
        const baselineInterest = loans.reduce((sum, loan) => {
            return sum + LoanCalculator.calculateRemainingInterest(
                loan.current_balance,
                loan.interest_rate,
                loan.remaining_months || loan.term_months,
                loan.monthly_payment
            );
        }, 0);

        const baselinePayoffDate = new Date(Math.max(...loans.map(loan =>
            LoanCalculator.calculatePayoffDate(
                loan.current_balance,
                loan.interest_rate,
                loan.monthly_payment,
                0,
                new Date(loan.start_date)
            ).getTime()
        )));

        const monthsSaved = Math.round(
            (baselinePayoffDate.getTime() - maxPayoffDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        return {
            payoffDate: maxPayoffDate.toISOString().split('T')[0],
            totalInterest: Math.round(totalInterest * 100) / 100,
            interestSaved: Math.round((baselineInterest - totalInterest) * 100) / 100,
            monthsSaved: Math.max(0, monthsSaved)
        };
    }

    /**
     * Compare all strategies
     */
    static compareStrategies(
        loans: Loan[],
        extraPayment: number = 0
    ): PayoffStrategyComparison {
        const currentPlan = this.calculateCurrentPlan(loans);
        const snowball = this.calculateSnowballStrategy(loans, extraPayment);
        const avalanche = this.calculateAvalancheStrategy(loans, extraPayment);

        // Determine best strategy (usually Avalanche for savings)
        const bestStrategy: 'snowball' | 'avalanche' =
            avalanche.interestSaved >= snowball.interestSaved ? 'avalanche' : 'snowball';

        const best = bestStrategy === 'avalanche' ? avalanche : snowball;

        return {
            currentPlan,
            snowballMethod: snowball,
            avalancheMethod: avalanche,
            recommendation: {
                bestStrategy,
                reasoning: `Save RM ${best.interestSaved.toLocaleString()} in interest and become debt-free ${best.monthsSaved} months earlier`,
                customAdvice: [
                    `Focus RM ${extraPayment} extra per month on ${best.payoffOrder[0].loanName}`,
                    'Set up auto-debit to never miss payments',
                    'Review spending to free up more for debt payoff'
                ]
            },
            quickWins: [
                `Pay RM ${Math.min(200, extraPayment)} extra this month`,
                'Set up automatic payments',
                'Track your progress monthly'
            ],
            milestones: this.calculateMilestones(loans, best)
        };
    }

    /**
     * Calculate debt milestones
     */
    private static calculateMilestones(
        loans: Loan[],
        strategy: PayoffStrategy
    ): Array<{ achievement: string; estimatedDate: string; impact: string }> {
        const payoffDate = new Date(strategy.payoffDate);
        const now = new Date();

        const milestones = [];

        // First loan paid off
        if (loans.length > 0) {
            const firstLoanMonths = 12; // Estimate
            const firstLoanDate = new Date(now);
            firstLoanDate.setMonth(firstLoanDate.getMonth() + firstLoanMonths);

            milestones.push({
                achievement: 'First loan paid off',
                estimatedDate: firstLoanDate.toISOString().split('T')[0],
                impact: `Free up RM ${loans[0].monthly_payment.toLocaleString()}/month for other loans`
            });
        }

        // 50% debt-free
        const halfwayDate = new Date(now);
        const totalMonths = Math.round((payoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
        halfwayDate.setMonth(halfwayDate.getMonth() + Math.floor(totalMonths / 2));

        milestones.push({
            achievement: '50% debt-free',
            estimatedDate: halfwayDate.toISOString().split('T')[0],
            impact: 'Halfway to financial freedom!'
        });

        return milestones;
    }

    /**
     * Calculate debt summary
     */
    static calculateDebtSummary(loans: Loan[]): DebtSummary {
        const totalDebt = loans.reduce((sum, loan) => sum + loan.current_balance, 0);
        const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthly_payment, 0);
        const totalOriginalDebt = loans.reduce((sum, loan) => sum + loan.original_amount, 0);
        const totalPaid = totalOriginalDebt - totalDebt;

        let totalInterestRemaining = 0;
        let latestPayoffDate = new Date();

        loans.forEach(loan => {
            const interest = LoanCalculator.calculateRemainingInterest(
                loan.current_balance,
                loan.interest_rate,
                loan.remaining_months || loan.term_months,
                loan.monthly_payment
            );
            totalInterestRemaining += interest;

            const payoffDate = LoanCalculator.calculatePayoffDate(
                loan.current_balance,
                loan.interest_rate,
                loan.monthly_payment,
                0,
                new Date()
            );

            if (payoffDate > latestPayoffDate) {
                latestPayoffDate = payoffDate;
            }
        });

        const totalInterestPaid = totalPaid - (totalOriginalDebt - totalDebt);
        const totalInterestLifetime = totalInterestPaid + totalInterestRemaining;

        const now = new Date();
        const monthsToDebtFree = Math.round(
            (latestPayoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        return {
            totalDebt: Math.round(totalDebt * 100) / 100,
            totalMonthlyPayments: Math.round(totalMonthlyPayments * 100) / 100,
            totalInterestLifetime: Math.round(totalInterestLifetime * 100) / 100,
            totalInterestPaid: Math.round(Math.max(0, totalInterestPaid) * 100) / 100,
            totalInterestRemaining: Math.round(totalInterestRemaining * 100) / 100,
            debtFreeDate: latestPayoffDate.toISOString().split('T')[0],
            monthsToDebtFree,
            percentagePaid: totalOriginalDebt > 0 ? Math.round((totalPaid / totalOriginalDebt) * 100) : 0,
            totalOriginalDebt: Math.round(totalOriginalDebt * 100) / 100,
            totalPaid: Math.round(totalPaid * 100) / 100
        };
    }
}

/**
 * Refinance Analyzer
 */
export class RefinanceAnalyzer {
    /**
     * Analyze refinancing opportunity
     */
    static analyzeOpportunity(
        loan: Loan,
        newRate: number,
        closingCosts: number = 0
    ): RefinanceAnalysis {
        const remainingMonths = loan.remaining_months || loan.term_months;

        // Current loan interest
        const currentInterest = LoanCalculator.calculateRemainingInterest(
            loan.current_balance,
            loan.interest_rate,
            remainingMonths,
            loan.monthly_payment
        );

        // New loan payment and interest
        const newPayment = LoanCalculator.calculateMonthlyPayment(
            loan.current_balance,
            newRate,
            remainingMonths
        );

        const newInterest = LoanCalculator.calculateRemainingInterest(
            loan.current_balance,
            newRate,
            remainingMonths,
            newPayment
        );

        const monthlySavings = loan.monthly_payment - newPayment;
        const lifetimeSavings = currentInterest - newInterest - closingCosts;
        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 999;

        return {
            loanId: loan.id,
            analysisDate: new Date().toISOString().split('T')[0],
            currentRate: loan.interest_rate,
            newRate,
            monthlySavings: Math.round(monthlySavings * 100) / 100,
            lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
            breakEvenMonths,
            isRecommended: lifetimeSavings > 5000 && breakEvenMonths < 36
        };
    }

    /**
     * Calculate break-even point
     */
    static calculateBreakEven(
        monthlySavings: number,
        closingCosts: number
    ): number {
        if (monthlySavings <= 0) return 999;
        return Math.ceil(closingCosts / monthlySavings);
    }
}
