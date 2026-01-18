import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { Budget, BudgetPeriod, BudgetService } from '@financeflow/shared';
import toast from 'react-hot-toast';

// Query keys
export const budgetKeys = {
    all: ['budgets'] as const,
    lists: () => [...budgetKeys.all, 'list'] as const,
    list: (filters?: any) => [...budgetKeys.lists(), filters] as const,
    details: () => [...budgetKeys.all, 'detail'] as const,
    detail: (id: string) => [...budgetKeys.details(), id] as const,
    periods: (budgetId: string) => [...budgetKeys.all, 'periods', budgetId] as const,
    health: () => [...budgetKeys.all, 'health'] as const,
    recommendations: () => [...budgetKeys.all, 'recommendations'] as const,
};

// Initialize service
const budgetService = new BudgetService(supabase);

/**
 * Fetch all budgets for the current user
 */
export function useBudgets() {
    return useQuery({
        queryKey: budgetKeys.lists(),
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const budgets = await budgetService.getBudgets(user.id);

            // Fetch current periods for all budgets
            const periods = budgets.length > 0
                ? await budgetService.getCurrentPeriods(budgets.map(b => b.id))
                : [];

            return { budgets, periods };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch a single budget by ID
 */
export function useBudget(budgetId: string) {
    return useQuery({
        queryKey: budgetKeys.detail(budgetId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budgets')
                .select('*, category:categories(*)')
                .eq('id', budgetId)
                .single();

            if (error) throw error;

            // Fetch current period
            const periods = await budgetService.getCurrentPeriods([budgetId]);

            return { budget: data as Budget, currentPeriod: periods[0] };
        },
        enabled: !!budgetId,
    });
}

/**
 * Fetch budget periods for a specific budget
 */
export function useBudgetPeriods(budgetId: string) {
    return useQuery({
        queryKey: budgetKeys.periods(budgetId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budget_periods')
                .select('*')
                .eq('budget_id', budgetId)
                .order('period_start', { ascending: false });

            if (error) throw error;
            return data as BudgetPeriod[];
        },
        enabled: !!budgetId,
    });
}

/**
 * Create a new budget
 */
export function useCreateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            return budgetService.createBudget({
                ...budget,
                user_id: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
            toast.success('Budget created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create budget');
        },
    });
}

/**
 * Update an existing budget
 */
export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Budget> }) => {
            return budgetService.updateBudget(id, updates);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
            queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) });
            toast.success('Budget updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update budget');
        },
    });
}

/**
 * Delete a budget
 */
export function useDeleteBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (budgetId: string) => {
            return budgetService.deleteBudget(budgetId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
            toast.success('Budget deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete budget');
        },
    });
}

/**
 * Fetch budget health score from AI
 */
export function useBudgetHealth() {
    return useQuery({
        queryKey: budgetKeys.health(),
        queryFn: async () => {
            const { data, error } = await supabase.functions.invoke('calculate-budget-health');

            if (error) {
                console.error('Budget health calculation failed:', error);
                // Return fallback data
                return {
                    health_score: 75,
                    insight: 'Budget health analysis is temporarily unavailable.',
                    at_risk_categories: [],
                    trend: 'stable',
                    recommendations: [],
                };
            }

            return data;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
}

/**
 * Fetch AI budget recommendations
 */
export function useBudgetRecommendations() {
    return useQuery({
        queryKey: budgetKeys.recommendations(),
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.functions.invoke('generate-budget-recommendations', {
                body: {
                    userId: user.id,
                    timeframe: 'last_3_months',
                },
            });

            if (error) {
                console.error('Budget recommendations failed:', error);
                return {
                    recommendedBudgets: [],
                    budgetStrategy: 'custom',
                    totalBudget: 0,
                    savingsPotential: 0,
                    priorities: [],
                    overallAdvice: 'Budget recommendations are temporarily unavailable.',
                };
            }

            return data;
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
        retry: 1,
    });
}

/**
 * Accept a budget recommendation
 */
export function useAcceptRecommendation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (recommendationId: string) => {
            const { data, error } = await supabase
                .from('budget_recommendations')
                .update({ is_accepted: true })
                .eq('id', recommendationId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: budgetKeys.recommendations() });
            toast.success('Recommendation accepted!');
        },
    });
}
