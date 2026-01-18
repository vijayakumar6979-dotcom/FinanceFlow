
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

    async getCurrentPeriods(budgetIds: string[]): Promise<BudgetPeriod[]> {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('budget_periods')
            .select('*')
            .in('budget_id', budgetIds)
            .lte('period_start', today)
            .gte('period_end', today);

        if (error) throw error;
        return data || [];
    }

    /**
     * Calculate rollover for a budget
     */
    async calculateRollover(budgetId: string): Promise<number> {
        // Get the most recent completed period
        const today = new Date().toISOString().split('T')[0];
        const { data: lastPeriod, error } = await this.supabase
            .from('budget_periods')
            .select('*')
            .eq('budget_id', budgetId)
            .lt('period_end', today)
            .order('period_end', { ascending: false })
            .limit(1)
            .single();

        if (error || !lastPeriod) return 0;

        // If spent less than budget, rollover the difference if enabled
        const { data: budget } = await this.supabase
            .from('budgets')
            .select('rollover_enabled')
            .eq('id', budgetId)
            .single();

        if (!budget?.rollover_enabled) return 0;

        const remaining = Math.max(0, lastPeriod.budget_amount - lastPeriod.spent_amount);
        return remaining;
    }
}
