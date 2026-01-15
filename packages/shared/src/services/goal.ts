import { Goal, GoalContribution, GoalMilestone } from '../types/finance';

export class GoalService {
    private supabase: any;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    /**
     * Fetch all goals for a user
     */
    async getGoals(userId: string): Promise<Goal[]> {
        const { data, error } = await this.supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('target_date', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    /**
     * Create a new goal
     */
    async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
        const { data, error } = await this.supabase
            .from('goals')
            .insert(goal)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update an existing goal
     */
    async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
        const { data, error } = await this.supabase
            .from('goals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete a goal
     */
    async deleteGoal(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('goals')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Add a contribution to a goal
     */
    async addContribution(contribution: Omit<GoalContribution, 'id' | 'created_at'>): Promise<GoalContribution> {
        const { data, error } = await this.supabase
            .from('goal_contributions')
            .insert(contribution)
            .select()
            .single();

        if (error) throw error;

        // Automatically update goal current_amount
        // Note: Ideally this is done via a database trigger or edge function for consistency
        // But for client-side optimitic updates, we can do it here too or let the realtime subscription handle it
        await this.updateGoalAmount(contribution.goal_id, contribution.amount);

        return data;
    }

    /**
     * Helper to increment goal amount
     */
    private async updateGoalAmount(goalId: string, amount: number) {
        // Fetch current to be safe, or use an RPC if available
        const { data: goal } = await this.supabase
            .from('goals')
            .select('current_amount')
            .eq('id', goalId)
            .single();

        if (goal) {
            await this.supabase
                .from('goals')
                .update({ current_amount: (goal.current_amount || 0) + amount })
                .eq('id', goalId);
        }
    }

    /**
     * Get milestones for a goal
     */
    async getMilestones(goalId: string): Promise<GoalMilestone[]> {
        const { data, error } = await this.supabase
            .from('goal_milestones')
            .select('*')
            .eq('goal_id', goalId)
            .order('target_amount', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    /**
     * Calculate monthly contribution needed to reach goal by target date
     */
    calculateMonthlyContributionRaw(targetAmount: number, currentAmount: number, targetDate: Date): number {
        const now = new Date();
        if (targetDate <= now) return 0;

        const monthsRemaining = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());

        if (monthsRemaining <= 0) return targetAmount - currentAmount;

        const remaining = targetAmount - currentAmount;
        return remaining / monthsRemaining;
    }
}
