import { Bill, BillPayment } from '../types/bills';

export class BillService {
    private supabase: any;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    /**
     * Get all bills for the current user
     */
    async getBills(): Promise<Bill[]> {
        const { data, error } = await this.supabase
            .from('bills')
            .select('*')
            .order('due_day', { ascending: true });

        if (error) throw error;

        return data as Bill[];
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
     */
    async markAsPaid(payment: Partial<BillPayment>): Promise<BillPayment> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase
            .from('bill_payments')
            .insert({ ...payment, user_id: user.id, status: 'paid', paid_date: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
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
