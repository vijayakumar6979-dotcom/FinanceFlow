import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { createTransactionService } from '@financeflow/shared';
import type { Transaction, CreateTransactionDTO } from '@financeflow/shared';

// Initialize service
const transactionService = createTransactionService(supabase);

// =====================================================
// QUERY KEYS
// =====================================================

export const transactionKeys = {
    all: ['transactions'] as const,
    lists: () => [...transactionKeys.all, 'list'] as const,
    list: (filters?: any) => [...transactionKeys.lists(), { filters }] as const,
    details: () => [...transactionKeys.all, 'detail'] as const,
    detail: (id: string) => [...transactionKeys.details(), id] as const,
    recurring: () => [...transactionKeys.all, 'recurring'] as const,
    stats: (year: number, month: number) => [...transactionKeys.all, 'stats', year, month] as const,
    categoryBreakdown: (startDate: string, endDate: string) =>
        [...transactionKeys.all, 'breakdown', startDate, endDate] as const,
};

// =====================================================
// QUERIES
// =====================================================

/**
 * Fetch transactions with advanced filtering
 */
export function useTransactions(filters?: {
    limit?: number;
    type?: string;
    accountId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    isAnomaly?: boolean;
    hasReceipt?: boolean;
    linkedModule?: 'bill' | 'loan' | 'goal' | 'investment';
}) {
    return useQuery({
        queryKey: transactionKeys.list(filters),
        queryFn: () => transactionService.getAll(filters),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Fetch single transaction by ID
 */
export function useTransaction(id: string) {
    return useQuery({
        queryKey: transactionKeys.detail(id),
        queryFn: () => transactionService.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch recurring transactions
 */
export function useRecurringTransactions() {
    return useQuery({
        queryKey: transactionKeys.recurring(),
        queryFn: () => transactionService.getRecurringTransactions(),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Fetch monthly statistics
 */
export function useMonthlyStats(year: number, month: number) {
    return useQuery({
        queryKey: transactionKeys.stats(year, month),
        queryFn: () => transactionService.getMonthlyStats(year, month),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Fetch category breakdown
 */
export function useCategoryBreakdown(startDate: string, endDate: string) {
    return useQuery({
        queryKey: transactionKeys.categoryBreakdown(startDate, endDate),
        queryFn: () => transactionService.getCategoryBreakdown(startDate, endDate),
        staleTime: 1000 * 60 * 5,
    });
}

// =====================================================
// MUTATIONS - BASIC CRUD
// =====================================================

/**
 * Create transaction mutation
 */
export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: CreateTransactionDTO) =>
            transactionService.create(transaction),
        onSuccess: () => {
            // Invalidate all transaction queries
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            // Invalidate account queries (balance changed)
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            // Invalidate budget queries (spent amount changed)
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}

/**
 * Update transaction mutation
 */
export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateTransactionDTO> }) =>
            transactionService.update(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}

/**
 * Delete transaction mutation
 */
export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}

// =====================================================
// MUTATIONS - BULK OPERATIONS
// =====================================================

/**
 * Bulk delete transactions
 */
export function useBulkDeleteTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => transactionService.bulkDelete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}

/**
 * Bulk update category
 */
export function useBulkUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, categoryId }: { ids: string[]; categoryId: string }) =>
            transactionService.bulkUpdateCategory(ids, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },
    });
}

/**
 * Bulk add tags
 */
export function useBulkAddTags() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, tags }: { ids: string[]; tags: string[] }) =>
            transactionService.bulkAddTags(ids, tags),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },
    });
}

// =====================================================
// MUTATIONS - SPECIAL TRANSACTION TYPES
// =====================================================

/**
 * Create split transaction
 */
export function useCreateSplitTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: CreateTransactionDTO & {
            splits: Array<{
                category_id: string;
                amount: number;
                description?: string;
                notes?: string;
            }>
        }) => transactionService.createSplitTransaction(transaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
}

/**
 * Create transfer transaction
 */
export function useCreateTransferTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transfer: {
            amount: number;
            from_account_id: string;
            to_account_id: string;
            transfer_fee?: number;
            date: string;
            description?: string;
            notes?: string;
        }) => transactionService.createTransferTransaction(transfer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
}

// =====================================================
// MUTATIONS - RECURRING TRANSACTIONS
// =====================================================

/**
 * Create recurring transaction
 */
export function useCreateRecurringTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recurring: {
            description: string;
            category_id: string;
            account_id: string;
            amount: number;
            type: 'income' | 'expense';
            frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
            interval?: number;
            start_date: string;
            end_date?: string;
            end_after_occurrences?: number;
            tags?: string[];
            notes?: string;
        }) => transactionService.createRecurringTransaction(recurring),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.recurring() });
        },
    });
}

/**
 * Update recurring transaction
 */
export function useUpdateRecurringTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            transactionService.updateRecurringTransaction(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.recurring() });
        },
    });
}

/**
 * Delete recurring transaction
 */
export function useDeleteRecurringTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => transactionService.deleteRecurringTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.recurring() });
        },
    });
}

// =====================================================
// AI FEATURES
// =====================================================

/**
 * Get AI category suggestion
 */
export function useSuggestCategory(description: string, amount?: number) {
    return useQuery({
        queryKey: ['ai', 'suggest-category', description, amount],
        queryFn: async () => {
            const { data, error } = await supabase.functions.invoke('suggest-transaction-category', {
                body: { description, amount, date: new Date().toISOString() }
            });

            if (error) throw error;
            return data;
        },
        enabled: !!description && description.length > 3,
        staleTime: 1000 * 60 * 60, // 1 hour (cache suggestions)
    });
}

/**
 * Extract receipt data via OCR
 */
export function useExtractReceiptData() {
    return useMutation({
        mutationFn: async (imageBase64: string) => {
            const { data, error } = await supabase.functions.invoke('extract-receipt-data', {
                body: { image_base64: imageBase64 }
            });

            if (error) throw error;
            return data;
        },
    });
}

/**
 * Detect duplicate transactions
 */
export function useDetectDuplicates() {
    return useMutation({
        mutationFn: async (transaction: {
            description: string;
            amount: number;
            date: string;
            category_id?: string;
        }) => {
            const { data, error } = await supabase.functions.invoke('detect-duplicate-transactions', {
                body: transaction
            });

            if (error) throw error;
            return data;
        },
    });
}
