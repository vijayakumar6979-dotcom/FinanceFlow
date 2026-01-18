import { supabase } from '@/services/supabase';
import type { Bill, BillPayment } from '@financeflow/shared';

/**
 * Service for integrating bills with the budget system
 */
export const billBudgetService = {
    /**
     * Create a transaction when a bill is marked as paid
     */
    async createTransactionFromPayment(
        payment: BillPayment,
        bill: Bill,
        createTransaction: boolean = true
    ): Promise<string | null> {
        if (!createTransaction) return null;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Get the budget category if linked
            let categoryId = bill.budget_category_id;

            // If no category linked, try to find or create one based on bill category
            if (!categoryId) {
                const { data: category } = await supabase
                    .from('budget_categories')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('name', bill.provider_category)
                    .single();

                if (category) {
                    categoryId = category.id;
                } else {
                    // Create a new budget category for this bill type
                    const { data: newCategory } = await supabase
                        .from('budget_categories')
                        .insert({
                            user_id: user.id,
                            name: bill.provider_category,
                            type: 'expense',
                            color: getCategoryColor(bill.provider_category),
                        })
                        .select()
                        .single();

                    if (newCategory) {
                        categoryId = newCategory.id;

                        // Update bill with the new category
                        await supabase
                            .from('bills')
                            .update({ budget_category_id: categoryId })
                            .eq('id', bill.id);
                    }
                }
            }

            // Create the transaction
            const { data: transaction, error } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    category_id: categoryId,
                    amount: payment.paid_amount || payment.amount,
                    type: 'expense',
                    description: `${bill.bill_name} - ${bill.provider_name}`,
                    date: payment.paid_date || new Date().toISOString().split('T')[0],
                    payment_method: payment.payment_method || 'other',
                    notes: payment.notes || `Auto-created from bill payment`,
                    is_recurring: false,
                })
                .select()
                .single();

            if (error) throw error;

            return transaction.id;
        } catch (error) {
            console.error('Error creating transaction from payment:', error);
            throw error;
        }
    },

    /**
     * Update budget allocation when bill amount changes
     */
    async updateBudgetAllocation(bill: Bill): Promise<void> {
        if (!bill.auto_sync_budget || !bill.budget_category_id) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const amount = bill.is_variable
                ? (bill.estimated_amount || 0)
                : (bill.fixed_amount || 0);

            // Get current budget for this category
            const currentMonth = new Date().toISOString().slice(0, 7);

            const { data: budget } = await supabase
                .from('budgets')
                .select('*')
                .eq('user_id', user.id)
                .eq('category_id', bill.budget_category_id)
                .eq('month', currentMonth)
                .single();

            if (budget) {
                // Update existing budget
                await supabase
                    .from('budgets')
                    .update({
                        allocated_amount: amount,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', budget.id);
            } else {
                // Create new budget entry
                await supabase
                    .from('budgets')
                    .insert({
                        user_id: user.id,
                        category_id: bill.budget_category_id,
                        month: currentMonth,
                        allocated_amount: amount,
                        spent_amount: 0,
                    });
            }
        } catch (error) {
            console.error('Error updating budget allocation:', error);
            throw error;
        }
    },

    /**
     * Get budget impact summary for a bill
     */
    async getBudgetImpact(billId: string): Promise<{
        categoryName: string;
        allocated: number;
        spent: number;
        remaining: number;
        percentage: number;
    } | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: bill } = await supabase
                .from('bills')
                .select('*, budget_category:budget_categories(*)')
                .eq('id', billId)
                .single();

            if (!bill || !bill.budget_category_id) return null;

            const currentMonth = new Date().toISOString().slice(0, 7);

            const { data: budget } = await supabase
                .from('budgets')
                .select('*')
                .eq('user_id', user.id)
                .eq('category_id', bill.budget_category_id)
                .eq('month', currentMonth)
                .single();

            if (!budget) return null;

            const remaining = budget.allocated_amount - budget.spent_amount;
            const percentage = (budget.spent_amount / budget.allocated_amount) * 100;

            return {
                categoryName: bill.budget_category.name,
                allocated: budget.allocated_amount,
                spent: budget.spent_amount,
                remaining,
                percentage: Math.round(percentage),
            };
        } catch (error) {
            console.error('Error getting budget impact:', error);
            return null;
        }
    },
};

// Helper function to get category color based on bill category
function getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
        'Electricity': '#F59E0B',
        'Water': '#06B6D4',
        'Internet': '#8B5CF6',
        'Mobile': '#EC4899',
        'TV': '#EF4444',
        'Insurance': '#10B981',
        'Loan': '#6366F1',
        'Subscription': '#F97316',
        'Other': '#64748B',
    };

    return colorMap[category] || '#64748B';
}
