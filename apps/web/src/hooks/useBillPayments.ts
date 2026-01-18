import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { BillPayment, CreateBillPaymentDTO, MarkBillAsPaidDTO } from '@financeflow/shared';

// Query keys
export const billPaymentKeys = {
    all: ['bill-payments'] as const,
    lists: () => [...billPaymentKeys.all, 'list'] as const,
    list: (billId: string) => [...billPaymentKeys.lists(), billId] as const,
    details: () => [...billPaymentKeys.all, 'detail'] as const,
    detail: (id: string) => [...billPaymentKeys.details(), id] as const,
};

// Fetch payments for a bill
async function fetchBillPayments(billId: string): Promise<BillPayment[]> {
    const { data, error } = await supabase
        .from('bill_payments')
        .select('*')
        .eq('bill_id', billId)
        .order('due_date', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Create bill payment
async function createBillPayment(payment: CreateBillPaymentDTO): Promise<BillPayment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('bill_payments')
        .insert({
            ...payment,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Mark bill as paid
async function markBillAsPaid(payload: MarkBillAsPaidDTO): Promise<BillPayment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update the payment record
    const { data, error } = await supabase
        .from('bill_payments')
        .update({
            paid_date: payload.paid_date,
            payment_method: payload.payment_method,
            paid_amount: payload.paid_amount,
            status: 'paid',
            notes: payload.notes,
        })
        .eq('id', payload.payment_id)
        .select()
        .single();

    if (error) throw error;

    // Create transaction if requested
    if (payload.create_transaction) {
        try {
            // Get bill details
            const { data: bill } = await supabase
                .from('bills')
                .select('*')
                .eq('id', payload.bill_id)
                .single();

            if (bill) {
                const { billBudgetService } = await import('@/services/billBudgetService');
                await billBudgetService.createTransactionFromPayment(data, bill, true);
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            // Don't fail the whole operation if transaction creation fails
        }
    }

    return data;
}

// Generate monthly payment for a bill
async function generateMonthlyPayment(billId: string): Promise<BillPayment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get bill details
    const { data: bill, error: billError } = await supabase
        .from('bills')
        .select('*')
        .eq('id', billId)
        .single();

    if (billError) throw billError;

    // Calculate due date for current month
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), bill.due_day);

    // If due date has passed, use next month
    if (dueDate < now) {
        dueDate.setMonth(dueDate.getMonth() + 1);
    }

    // Check if payment already exists for this month
    const startOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data: existing } = await supabase
        .from('bill_payments')
        .select('id')
        .eq('bill_id', billId)
        .gte('due_date', startOfMonth)
        .lte('due_date', endOfMonth)
        .single();

    if (existing) {
        throw new Error('Payment already exists for this month');
    }

    // Create payment
    const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

    const { data, error } = await supabase
        .from('bill_payments')
        .insert({
            bill_id: billId,
            user_id: user.id,
            amount,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'unpaid',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Hooks
export function useBillPayments(billId: string) {
    return useQuery({
        queryKey: billPaymentKeys.list(billId),
        queryFn: () => fetchBillPayments(billId),
        enabled: !!billId,
    });
}

export function useCreateBillPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBillPayment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: billPaymentKeys.list(variables.bill_id) });
            queryClient.invalidateQueries({ queryKey: ['bills'] });
        },
    });
}

export function useMarkBillAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markBillAsPaid,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: billPaymentKeys.list(variables.bill_id) });
            queryClient.invalidateQueries({ queryKey: ['bills'] });
        },
    });
}

export function useGenerateMonthlyPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateMonthlyPayment,
        onSuccess: (_, billId) => {
            queryClient.invalidateQueries({ queryKey: billPaymentKeys.list(billId) });
            queryClient.invalidateQueries({ queryKey: ['bills'] });
        },
    });
}
