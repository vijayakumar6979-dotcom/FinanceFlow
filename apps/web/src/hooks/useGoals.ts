import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { Goal, GoalContribution, GoalMilestone, GoalService } from '@financeflow/shared';
import toast from 'react-hot-toast';

// Query keys
export const goalKeys = {
    all: ['goals'] as const,
    lists: () => [...goalKeys.all, 'list'] as const,
    list: (filters?: any) => [...goalKeys.lists(), filters] as const,
    details: () => [...goalKeys.all, 'detail'] as const,
    detail: (id: string) => [...goalKeys.details(), id] as const,
    milestones: (goalId: string) => [...goalKeys.all, 'milestones', goalId] as const,
    contributions: (goalId: string) => [...goalKeys.all, 'contributions', goalId] as const,
    feasibility: (goalId: string) => [...goalKeys.all, 'feasibility', goalId] as const,
};

// Initialize service
const goalService = new GoalService(supabase);

/**
 * Fetch all goals for the current user
 */
export function useGoals(filter?: 'all' | 'savings' | 'debt_payoff' | 'investment' | 'completed') {
    return useQuery({
        queryKey: goalKeys.list(filter),
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            let query = supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id);

            if (filter && filter !== 'all') {
                if (filter === 'completed') {
                    query = query.eq('status', 'completed');
                } else {
                    query = query.eq('goal_type', filter).neq('status', 'completed');
                }
            }

            const { data, error } = await query.order('target_date', { ascending: true });

            if (error) throw error;
            return data as Goal[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch a single goal by ID with milestones and contributions
 */
export function useGoal(goalId: string) {
    return useQuery({
        queryKey: goalKeys.detail(goalId),
        queryFn: async () => {
            const { data: goal, error: goalError } = await supabase
                .from('goals')
                .select('*, linked_account:accounts(*)')
                .eq('id', goalId)
                .single();

            if (goalError) throw goalError;

            // Fetch milestones
            const milestones = await goalService.getMilestones(goalId);

            // Fetch recent contributions
            const { data: contributions, error: contribError } = await supabase
                .from('goal_contributions')
                .select('*')
                .eq('goal_id', goalId)
                .order('contribution_date', { ascending: false })
                .limit(10);

            if (contribError) throw contribError;

            return {
                goal: goal as Goal,
                milestones,
                contributions: contributions as GoalContribution[],
            };
        },
        enabled: !!goalId,
    });
}

/**
 * Fetch milestones for a goal
 */
export function useGoalMilestones(goalId: string) {
    return useQuery({
        queryKey: goalKeys.milestones(goalId),
        queryFn: async () => {
            return goalService.getMilestones(goalId);
        },
        enabled: !!goalId,
    });
}

/**
 * Fetch contributions for a goal
 */
export function useGoalContributions(goalId: string) {
    return useQuery({
        queryKey: goalKeys.contributions(goalId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('goal_contributions')
                .select('*, source_account:accounts(*)')
                .eq('goal_id', goalId)
                .order('contribution_date', { ascending: false });

            if (error) throw error;
            return data as GoalContribution[];
        },
        enabled: !!goalId,
    });
}

/**
 * Create a new goal
 */
export function useCreateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            return goalService.createGoal({
                ...goal,
                user_id: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
            toast.success('Goal created successfully! 🎯');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create goal');
        },
    });
}

/**
 * Update an existing goal
 */
export function useUpdateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Goal> }) => {
            return goalService.updateGoal(id, updates);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) });
            toast.success('Goal updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update goal');
        },
    });
}

/**
 * Delete a goal
 */
export function useDeleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goalId: string) => {
            return goalService.deleteGoal(goalId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
            toast.success('Goal deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete goal');
        },
    });
}

/**
 * Add a contribution to a goal
 */
export function useContributeToGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (contribution: Omit<GoalContribution, 'id' | 'created_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            return goalService.addContribution({
                ...contribution,
                user_id: user.id,
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.goal_id) });
            queryClient.invalidateQueries({ queryKey: goalKeys.contributions(variables.goal_id) });
            toast.success('Contribution added! 💰');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add contribution');
        },
    });
}

/**
 * Fetch AI goal feasibility analysis
 */
export function useGoalFeasibility(goalId: string) {
    return useQuery({
        queryKey: goalKeys.feasibility(goalId),
        queryFn: async () => {
            const { data: goal } = await supabase
                .from('goals')
                .select('*')
                .eq('id', goalId)
                .single();

            if (!goal) throw new Error('Goal not found');

            const { data, error } = await supabase.functions.invoke('analyze-goal-feasibility', {
                body: {
                    goalId,
                    targetAmount: goal.target_amount,
                    targetDate: goal.target_date,
                    currentAmount: goal.current_amount,
                },
            });

            if (error) {
                console.error('Goal feasibility analysis failed:', error);
                // Return fallback data
                const monthlyNeeded = goalService.calculateMonthlyContribution(goal);
                return {
                    feasibilityScore: 70,
                    monthlyContributionNeeded: monthlyNeeded,
                    isAchievable: true,
                    confidenceLevel: 'medium',
                    requiredAdjustments: [],
                    alternativeTimelines: [],
                    sideIncomeIdeas: [],
                    advice: 'Goal feasibility analysis is temporarily unavailable.',
                };
            }

            return data;
        },
        enabled: !!goalId,
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
}

/**
 * Mark a goal as completed
 */
export function useCompleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goalId: string) => {
            return goalService.updateGoal(goalId, {
                status: 'completed',
                completed_at: new Date().toISOString(),
            });
        },
        onSuccess: (_, goalId) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
            toast.success('🎉 Congratulations! Goal completed!');
        },
    });
}

/**
 * Create a custom milestone
 */
export function useCreateMilestone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (milestone: Omit<GoalMilestone, 'id' | 'created_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('goal_milestones')
                .insert({
                    ...milestone,
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.milestones(variables.goal_id) });
            toast.success('Milestone created!');
        },
    });
}
