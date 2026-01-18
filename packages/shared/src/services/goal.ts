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
     * Auto-creates a transaction for the contribution
     */
    async addContribution(contribution: Omit<GoalContribution, 'id' | 'created_at'>): Promise<GoalContribution> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create contribution
        const { data, error } = await this.supabase
            .from('goal_contributions')
            .insert({ ...contribution, user_id: user.id })
            .select()
            .single();

        if (error) throw error;

        // Automatically update goal current_amount
        await this.updateGoalAmount(contribution.goal_id, contribution.amount);

        // Auto-create transaction
        try {
            // Get goal details for transaction description
            const { data: goal } = await this.supabase
                .from('goals')
                .select('name')
                .eq('id', contribution.goal_id)
                .single();

            await this.supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    type: 'expense', // Deducted from source account
                    amount: contribution.amount,
                    description: `Contribution to ${goal?.name || 'Goal'}`,
                    account_id: contribution.source_account_id,
                    date: contribution.contribution_date || new Date().toISOString(),
                    goal_contribution_id: data.id,
                    notes: contribution.notes || 'Auto-created from goal contribution',
                    tags: ['goal', 'savings', goal?.name?.toLowerCase() || 'goal']
                });

            console.log(`✅ Auto-created transaction for goal contribution: ${data.id}`);
        } catch (txError) {
            console.error('Failed to auto-create transaction for goal contribution:', txError);
            // Don't fail the contribution if transaction creation fails
        }

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
     * Update milestone status for a goal
     */
    async checkMilestones(goalId: string): Promise<void> {
        const { data: goal } = await this.supabase
            .from('goals')
            .select('current_amount, target_amount')
            .eq('id', goalId)
            .single();

        if (!goal) return;

        const milestones = await this.getMilestones(goalId);

        for (const milestone of milestones) {
            const milestoneTarget = milestone.target_percentage
                ? (goal.target_amount * (milestone.target_percentage / 100))
                : milestone.target_amount;

            if (goal.current_amount >= milestoneTarget && !milestone.is_completed) {
                await this.supabase
                    .from('goal_milestones')
                    .update({
                        is_completed: true,
                        completed_at: new Date().toISOString()
                    })
                    .eq('id', milestone.id);
            }
        }

        // Check if goal is complete
        if (goal.current_amount >= goal.target_amount) {
            await this.updateGoal(goalId, {
                status: 'completed',
                completed_at: new Date().toISOString()
            });
        }
    }

    /**
     * Calculate monthly contribution needed to reach goal by target date
     */
    calculateMonthlyContribution(goal: Goal): number {
        const targetDate = new Date(goal.target_date);
        const now = new Date();

        if (targetDate <= now) return 0;

        // Calculate months remaining
        const years = targetDate.getFullYear() - now.getFullYear();
        const months = targetDate.getMonth() - now.getMonth();
        const monthsRemaining = years * 12 + months;

        if (monthsRemaining <= 0) {
            return Math.max(0, goal.target_amount - goal.current_amount);
        }

        const remaining = Math.max(0, goal.target_amount - goal.current_amount);
        return remaining / monthsRemaining;
    }
}
