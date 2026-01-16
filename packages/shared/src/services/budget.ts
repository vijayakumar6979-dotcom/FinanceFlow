
import { Budget, BudgetPeriod } from '../types/finance';

// Note: This assumes supabase client is passed or imported from a config
// For the shared package, we'll often pass the client or use a singleton if configured
// Here we'll define the service class

export class BudgetService {
    private supabase: any;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    /**
     * Fetch all budgets for a user
     */
    async getBudgets(userId: string): Promise<Budget[]> {
        const { data, error } = await this.supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Create a new budget
     */
    async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
        const { data, error } = await this.supabase
            .from('budgets')
            .insert(budget)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update an existing budget
     */
    async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
        const { data, error } = await this.supabase
            .from('budgets')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete a budget
     */
    async deleteBudget(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('budgets')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Calculate budget health score (0-100)
     * Simple algorithm: 
     * - Start with 100
     * - Deduct for overspending
     * - Deduct for warning status
     */
    calculateBudgetHealth(periods: BudgetPeriod[]): number {
        if (!periods.length) return 100;

        let totalScore = 100;
        let deductions = 0;

        periods.forEach(period => {
            if (period.status === 'exceeded') deductions += 20;
            if (period.status === 'critical') deductions += 10;
            if (period.status === 'warning') deductions += 5;
        });

        // Normalize
        const finalScore = Math.max(0, totalScore - (deductions / periods.length));
        return Math.round(finalScore);
    }

    /**
     * Get current budget periods for active budgets
     * This would typically involve a join or separate query
     */
    async getCurrentPeriods(userId: string): Promise<BudgetPeriod[]> {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('budget_periods')
            .select('*')
            .eq('user_id', userId)
            .lte('period_start', today)
            .gte('period_end', today);

        if (error) throw error;
        return data || [];
    }
}
