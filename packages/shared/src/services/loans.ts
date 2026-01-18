import { SupabaseClient } from '@supabase/supabase-js';
import { Loan, CreateLoanDTO, UpdateLoanDTO, LoanPayment, AmortizationScheduleEntry } from '../types/loans';

export class LoanService {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Get all loans for the current user
     */
    async getLoans(): Promise<Loan[]> {
        const { data, error } = await this.supabase
            .from('loans')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Loan[];
    }

    /**
     * Get a single loan by ID
     */
    async getLoanById(id: string): Promise<Loan | null> {
        const { data, error } = await this.supabase
            .from('loans')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Loan;
    }

    /**
     * Create a new loan
     */
    async createLoan(loan: CreateLoanDTO): Promise<Loan> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase
            .from('loans')
            .insert({ ...loan, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data as Loan;
    }

    /**
     * Update an existing loan
     */
    async updateLoan(id: string, updates: UpdateLoanDTO): Promise<Loan> {
        const { data, error } = await this.supabase
            .from('loans')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Loan;
    }

    /**
     * Delete a loan
     */
    async deleteLoan(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('loans')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Calculate monthly payment (PMT formula)
     */
    calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
        const monthlyRate = annualRate / 100 / 12;
        if (monthlyRate === 0) return principal / termMonths;

        return (
            (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1)
        );
    }

    /**
     * Generate amortization schedule (Preview)
     */
    generateAmortizationSchedule(
        principal: number,
        annualRate: number,
        termMonths: number,
        startDate: string
    ): AmortizationScheduleEntry[] {
        const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, termMonths);
        const monthlyRate = annualRate / 100 / 12;
        let balance = principal;
        const schedule: AmortizationScheduleEntry[] = [];
        const start = new Date(startDate);

        for (let i = 1; i <= termMonths; i++) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;

            // Handle last payment adjustments
            if (balance - principalPayment < 0.01) {
                principalPayment = balance;
            }

            balance -= principalPayment;

            // Calculate payment date
            const paymentDate = new Date(start);
            paymentDate.setMonth(start.getMonth() + i);

            schedule.push({
                loan_id: 'preview', // Placeholder
                payment_number: i,
                payment_date: paymentDate.toISOString().split('T')[0],
                payment_amount: Number((principalPayment + interestPayment).toFixed(2)),
                principal_amount: Number(principalPayment.toFixed(2)),
                interest_amount: Number(interestPayment.toFixed(2)),
                remaining_balance: Number(Math.max(0, balance).toFixed(2)),
                is_paid: false
            });

            if (balance <= 0) break;
        }

        return schedule;
    }

    /**
     * Get loan payment history
     */
    async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
        const { data, error } = await this.supabase
            .from('loan_payments')
            .select('*')
            .eq('loan_id', loanId)
            .order('payment_date', { ascending: false });

        if (error) throw error;
        return data as LoanPayment[];
    }

    /**
     * Create a loan payment
     * Auto-creates a transaction for the payment
     */
    async createPayment(payment: Omit<LoanPayment, 'id' | 'created_at' | 'user_id'>): Promise<LoanPayment> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create loan payment
        const { data, error } = await this.supabase
            .from('loan_payments')
            .insert({ ...payment, user_id: user.id })
            .select()
            .single();

        if (error) throw error;

        // Update loan balance
        const { data: loan } = await this.supabase
            .from('loans')
            .select('current_balance, lender_name')
            .eq('id', payment.loan_id)
            .single();

        if (loan) {
            const newBalance = Math.max(0, loan.current_balance - payment.principal_amount);
            await this.supabase
                .from('loans')
                .update({
                    current_balance: newBalance,
                    status: newBalance === 0 ? 'paid_off' : 'active'
                })
                .eq('id', payment.loan_id);
        }

        // Auto-create transaction
        try {
            await this.supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    type: 'expense',
                    amount: payment.payment_amount,
                    description: `Loan Payment: ${loan?.lender_name || 'Unknown Lender'}`,
                    notes: `Principal: RM ${payment.principal_amount.toFixed(2)}, Interest: RM ${payment.interest_amount.toFixed(2)}`,
                    account_id: payment.account_id,
                    date: payment.payment_date,
                    loan_payment_id: data.id,
                    tags: ['loan', loan?.lender_name?.toLowerCase() || 'loan-payment']
                });

            console.log(`✅ Auto-created transaction for loan payment: ${data.id}`);
        } catch (txError) {
            console.error('Failed to auto-create transaction for loan payment:', txError);
            // Don't fail the payment if transaction creation fails
        }

        return data as LoanPayment;
    }

    /**
     * Calculate total interest over life of loan
     */
    calculateTotalInterest(loan: Loan): number {
        const schedule = this.generateAmortizationSchedule(
            loan.original_amount,
            loan.interest_rate,
            loan.term_months,
            loan.start_date
        );

        return schedule.reduce((sum, entry) => sum + entry.interest_amount, 0);
    }

    /**
     * Calculate projected payoff date
     */
    calculatePayoffDate(loan: Loan, extraMonthlyPayment: number = 0): Date {
        const monthlyPayment = loan.monthly_payment + extraMonthlyPayment;
        const monthlyRate = loan.interest_rate / 100 / 12;
        let balance = loan.current_balance;
        let months = 0;
        const maxMonths = loan.term_months * 2; // Safety limit

        while (balance > 0.01 && months < maxMonths) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
            balance -= principalPayment;
            months++;
        }

        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);
        return payoffDate;
    }

    /**
     * Save amortization schedule to database
     */
    async saveAmortizationSchedule(loanId: string, schedule: AmortizationScheduleEntry[]): Promise<void> {
        // Delete existing schedule
        await this.supabase
            .from('loan_amortization_schedule')
            .delete()
            .eq('loan_id', loanId);

        // Insert new schedule
        const scheduleWithLoanId = schedule.map(entry => ({
            ...entry,
            loan_id: loanId
        }));

        const { error } = await this.supabase
            .from('loan_amortization_schedule')
            .insert(scheduleWithLoanId);

        if (error) throw error;
    }

    /**
     * Get saved amortization schedule
     */
    async getAmortizationSchedule(loanId: string): Promise<AmortizationScheduleEntry[]> {
        const { data, error } = await this.supabase
            .from('loan_amortization_schedule')
            .select('*')
            .eq('loan_id', loanId)
            .order('payment_number', { ascending: true });

        if (error) throw error;
        return data as AmortizationScheduleEntry[];
    }

    /**
     * Calculate interest saved with extra payments
     */
    calculateInterestSavings(loan: Loan, extraMonthlyPayment: number): {
        monthsSaved: number;
        interestSaved: number;
        newPayoffDate: Date;
    } {
        // Original schedule
        const originalSchedule = this.generateAmortizationSchedule(
            loan.current_balance,
            loan.interest_rate,
            loan.term_months,
            new Date().toISOString()
        );
        const originalInterest = originalSchedule.reduce((sum, e) => sum + e.interest_amount, 0);
        const originalMonths = originalSchedule.length;

        // New schedule with extra payments
        const monthlyPayment = loan.monthly_payment + extraMonthlyPayment;
        const monthlyRate = loan.interest_rate / 100 / 12;
        let balance = loan.current_balance;
        let newInterest = 0;
        let newMonths = 0;

        while (balance > 0.01 && newMonths < loan.term_months * 2) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
            balance -= principalPayment;
            newInterest += interestPayment;
            newMonths++;
        }

        const newPayoffDate = new Date();
        newPayoffDate.setMonth(newPayoffDate.getMonth() + newMonths);

        return {
            monthsSaved: originalMonths - newMonths,
            interestSaved: originalInterest - newInterest,
            newPayoffDate
        };
    }
}
