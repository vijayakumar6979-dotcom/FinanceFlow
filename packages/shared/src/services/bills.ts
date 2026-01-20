import { Bill, BillPayment } from '../types/bills';

export class BillService {
    private supabase: any;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    /**
     * Get all bills for the current user with calculated status
     */
    async getBills(): Promise<Bill[]> {
        const { data, error } = await this.supabase
            .from('bills')
            .select('*')
            .order('due_day', { ascending: true });

        if (error) throw error;

        // Get current month's date range
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

        // Get all payments for current month
        const { data: payments } = await this.supabase
            .from('bill_payments')
            .select('bill_id, status, paid_date, amount')
            .gte('due_date', startOfMonth)
            .lte('due_date', endOfMonth);

        // Calculate status for each bill
        const billsWithStatus = (data as Bill[]).map(bill => {
            // Get ALL paid payments for this bill in current month
            const currentMonthPayments = payments?.filter(
                (p: any) => p.bill_id === bill.id && p.status === 'paid'
            ) || [];

            const isPaidCurrentMonth = currentMonthPayments.length > 0;

            // Calculate this month's due date
            const dueDay = bill.due_day || 1;
            let targetDueDate = new Date(currentYear, currentMonth, dueDay);
            targetDueDate.setHours(23, 59, 59, 999);

            // If paid for this month, show NEXT month's bill
            if (isPaidCurrentMonth) {
                targetDueDate = new Date(currentYear, currentMonth + 1, dueDay);
                targetDueDate.setHours(23, 59, 59, 999);
            }

            // Calculate days difference
            const diffTime = targetDueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Determine status
            let status: 'paid' | 'unpaid' | 'overdue' = 'unpaid';
            let actualPaidAmount = 0;

            if (isPaidCurrentMonth) {
                // Determine paid amount for history
                actualPaidAmount = currentMonthPayments.reduce(
                    (sum: number, p: any) => sum + parseFloat(p.amount || 0),
                    0
                );
                // Status for the returned object (Next Due Date) is 'unpaid' so it shows up as upcoming
                // Unless we want to explicitly mark it as 'upcoming'
                status = 'unpaid';
            } else {
                // Not paid for current month
                // Check if overdue
                // Note: daysDiff based on 'targetDueDate' (which is this month).
                if (daysDiff < 0) {
                    status = 'overdue';
                } else {
                    status = 'unpaid';
                }
            }

            return {
                ...bill,
                status, // 'unpaid' or 'overdue' (allows it to show in Dashboard)
                next_due_date: targetDueDate.toISOString().split('T')[0],
                days_until_due: daysDiff,
                actual_paid_amount: actualPaidAmount
            };
        });

        return billsWithStatus;
    }

    /**
     * Get a single bill by ID
     */
    async getBillById(id: string): Promise<Bill | null> {
        const { data, error } = await this.supabase
            .from('bills')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Bill;
    }

    /**
     * Create a new bill
     */
    async createBill(bill: Partial<Bill>): Promise<Bill> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase
            .from('bills')
            .insert({ ...bill, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data as Bill;
    }

    /**
     * Update a bill
     */
    async updateBill(id: string, updates: Partial<Bill>): Promise<Bill> {
        const { data, error } = await this.supabase
            .from('bills')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Bill;
    }

    /**
     * Delete a bill
     */
    async deleteBill(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('bills')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Get payment history for a bill
     */
    async getPayments(billId: string): Promise<BillPayment[]> {
        const { data, error } = await this.supabase
            .from('bill_payments')
            .select('*')
            .eq('bill_id', billId)
            .order('due_date', { ascending: false });

        if (error) throw error;
        return data as BillPayment[];
    }

    /**
     * Mark a bill as paid
     * Auto-creates a transaction for the payment
     */
    async markAsPaid(payment: Partial<BillPayment>): Promise<BillPayment> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create bill payment
        const { data, error } = await this.supabase
            .from('bill_payments')
            .insert({ ...payment, user_id: user.id, status: 'paid', paid_date: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;

        // Auto-create transaction
        try {
            // Get bill details for transaction description
            const { data: bill } = await this.supabase
                .from('bills')
                .select('name, category_id')
                .eq('id', payment.bill_id)
                .single();

            // Create transaction linked to this bill payment
            await this.supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    type: 'expense',
                    amount: payment.amount,
                    description: `Bill Payment: ${bill?.name || 'Unknown Bill'}`,
                    category_id: bill?.category_id || null,
                    account_id: payment.account_id,
                    date: payment.paid_date || new Date().toISOString(),
                    bill_payment_id: data.id,
                    notes: `Auto-created from bill payment`
                });

            console.log(`✅ Auto-created transaction for bill payment: ${data.id}`);
        } catch (txError) {
            console.error('Failed to auto-create transaction for bill payment:', txError);
            // Don't fail the payment if transaction creation fails
        }

        return data as BillPayment;
    }

    /**
     * Stub for AI Prediction (Mock logic)
     */
    async predictBillAmount(_billId: string): Promise<{ predicted: number, confidence: number }> {
        // In future, call GrokService here
        // For now, return mock
        return new Promise(resolve => {
            setTimeout(() => resolve({ predicted: Math.floor(Math.random() * 50) + 100, confidence: 85 }), 1000);
        });
    }
}
