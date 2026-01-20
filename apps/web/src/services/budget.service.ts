import { supabase } from './supabase';

export interface Budget {
    id: string;
    category_id: string;
    amount: number; // allocated_amount
    spent_amount: number;
    month: string; // YYYY-MM
    category?: {
        id: string;
        name: string;
        color: string;
        icon?: string;
    };
}

export const budgetService = {
    /**
     * Get all budgets for a specific month
     * @param month YYYY-MM format
     */
    getBudgets: async (month: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('budgets')
            .select(`
                *,
                category:budget_categories (
                    id,
                    name,
                    color,
                    icon
                )
            `)
            .eq('user_id', user.id)
            .eq('month', month);

        if (error) throw error;

        return data as unknown as Budget[]; // Casting for now due to join types
    },

    /**
     * Get total spending status for the month
     */
    getMonthlySummary: async (month: string) => {
        const budgets = await budgetService.getBudgets(month);

        const totalAllocated = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
        const totalSpent = budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);

        return {
            totalAllocated,
            totalSpent,
            percentage: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0,
            budgets
        };
    }
};
