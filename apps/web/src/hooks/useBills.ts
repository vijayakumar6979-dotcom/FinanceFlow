import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { Bill, CreateBillDTO, UpdateBillDTO, BillSummary } from '@financeflow/shared';
import { calculateNextDueDate, calculateDaysUntilDue, determinePaymentStatus } from '@financeflow/shared';

// Query keys
export const billKeys = {
    all: ['bills'] as const,
    lists: () => [...billKeys.all, 'list'] as const,
    list: (filters: string) => [...billKeys.lists(), { filters }] as const,
    details: () => [...billKeys.all, 'detail'] as const,
    detail: (id: string) => [...billKeys.details(), id] as const,
    summary: () => [...billKeys.all, 'summary'] as const,
};

// Fetch all bills with computed status
async function fetchBills(): Promise<Bill[]> {
    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('is_active', true)
        .order('due_day', { ascending: true });

    if (error) throw error;

    // Get current month's payments
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data: payments } = await supabase
        .from('bill_payments')
        .select('bill_id, status, paid_date')
        .gte('due_date', startOfMonth)
        .lte('due_date', endOfMonth);

    // Enhance bills with computed fields
    return (data || []).map(bill => {
        const nextDueDate = calculateNextDueDate(bill.due_day);
        const daysUntilDue = calculateDaysUntilDue(nextDueDate);

        // Check if paid this month
        const isPaidThisMonth = payments?.some(
            p => p.bill_id === bill.id && p.status === 'paid'
        );

        const currentStatus = isPaidThisMonth
            ? 'paid'
            : determinePaymentStatus(nextDueDate);

        return {
            ...bill,
            next_due_date: nextDueDate.toISOString().split('T')[0],
            days_until_due: daysUntilDue,
            status: currentStatus,
        };
    });
}

// Fetch single bill
async function fetchBill(id: string): Promise<Bill> {
    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    const nextDueDate = calculateNextDueDate(data.due_day);
    const daysUntilDue = calculateDaysUntilDue(nextDueDate);

    return {
        ...data,
        next_due_date: nextDueDate.toISOString().split('T')[0],
        days_until_due: daysUntilDue,
    };
}

// Calculate bill summary
async function fetchBillSummary(): Promise<BillSummary> {
    const bills = await fetchBills();

    const totalMonthly = bills.reduce((sum, bill) => {
        const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);
        return sum + amount;
    }, 0);

    const dueThisMonth = bills.filter(b => b.status !== 'paid');
    const paidThisMonth = bills.filter(b => b.status === 'paid');
    const overdue = bills.filter(b => b.status === 'overdue');

    return {
        total_monthly: totalMonthly,
        due_this_month: {
            count: dueThisMonth.length,
            amount: dueThisMonth.reduce((sum, b) => sum + (b.is_variable ? (b.estimated_amount || 0) : (b.fixed_amount || 0)), 0),
        },
        paid_this_month: {
            count: paidThisMonth.length,
            amount: paidThisMonth.reduce((sum, b) => sum + (b.is_variable ? (b.estimated_amount || 0) : (b.fixed_amount || 0)), 0),
        },
        overdue: {
            count: overdue.length,
            amount: overdue.reduce((sum, b) => sum + (b.is_variable ? (b.estimated_amount || 0) : (b.fixed_amount || 0)), 0),
        },
    };
}

// Create bill
async function createBill(bill: CreateBillDTO): Promise<Bill> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('bills')
        .insert({
            ...bill,
            user_id: user.id,
            currency: bill.currency || 'MYR',
            auto_pay_enabled: bill.auto_pay_enabled || false,
            auto_sync_budget: bill.auto_sync_budget !== false,
            notifications_enabled: bill.notifications_enabled !== false,
            reminder_days: bill.reminder_days || [7, 3, 1],
            is_active: true,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Update bill
async function updateBill({ id, updates }: { id: string; updates: UpdateBillDTO }): Promise<Bill> {
    const { data, error } = await supabase
        .from('bills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Delete bill
async function deleteBill(id: string): Promise<void> {
    const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Hooks
export function useBills() {
    return useQuery({
        queryKey: billKeys.lists(),
        queryFn: fetchBills,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useBill(id: string) {
    return useQuery({
        queryKey: billKeys.detail(id),
        queryFn: () => fetchBill(id),
        enabled: !!id,
    });
}

export function useBillSummary() {
    return useQuery({
        queryKey: billKeys.summary(),
        queryFn: fetchBillSummary,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateBill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billKeys.all });
        },
    });
}

export function useUpdateBill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBill,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: billKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: billKeys.lists() });
        },
    });
}

export function useDeleteBill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billKeys.all });
        },
    });
}
