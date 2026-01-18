import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Budget Integration Helpers for Bills Management
 * Automatically syncs bills with budget categories
 */

export class BudgetIntegrationService {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Sync bill with budget category
     * Updates budget allocated amount when bill is added/updated
     */
    async syncBillWithBudget(billId: string): Promise<void> {
        try {
            // Get bill details
            const { data: bill, error: billError } = await this.supabase
                .from('bills')
                .select('budget_category_id, fixed_amount, estimated_amount, auto_sync_budget')
                .eq('id', billId)
                .single();

            if (billError || !bill || !bill.auto_sync_budget || !bill.budget_category_id) {
                return; // Skip if auto-sync is disabled or no category linked
            }

            const billAmount = bill.fixed_amount || bill.estimated_amount || 0;

            // Get current budget for this category
            const { data: budget, error: budgetError } = await this.supabase
                .from('budgets')
                .select('id, allocated_amount')
                .eq('category_id', bill.budget_category_id)
                .single();

            if (budgetError || !budget) {
                console.warn('Budget not found for category:', bill.budget_category_id);
                return;
            }

            // Update budget allocated amount to include this bill
            const { error: updateError } = await this.supabase
                .from('budgets')
                .update({
                    allocated_amount: budget.allocated_amount + billAmount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', budget.id);

            if (updateError) {
                console.error('Failed to sync budget:', updateError);
            }
        } catch (error) {
            console.error('Error in syncBillWithBudget:', error);
            throw error;
        }
    }

    /**
     * Remove bill amount from budget when bill is deleted
     */
    async unsyncBillFromBudget(billId: string): Promise<void> {
        try {
            // Get bill details before deletion
            const { data: bill, error: billError } = await this.supabase
                .from('bills')
                .select('budget_category_id, fixed_amount, estimated_amount')
                .eq('id', billId)
                .single();

            if (billError || !bill || !bill.budget_category_id) {
                return;
            }

            const billAmount = bill.fixed_amount || bill.estimated_amount || 0;

            // Get current budget
            const { data: budget, error: budgetError } = await this.supabase
                .from('budgets')
                .select('id, allocated_amount')
                .eq('category_id', bill.budget_category_id)
                .single();

            if (budgetError || !budget) {
                return;
            }

            // Decrease budget allocated amount
            const { error: updateError } = await this.supabase
                .from('budgets')
                .update({
                    allocated_amount: Math.max(0, budget.allocated_amount - billAmount),
                    updated_at: new Date().toISOString()
                })
                .eq('id', budget.id);

            if (updateError) {
                console.error('Failed to unsync budget:', updateError);
            }
        } catch (error) {
            console.error('Error in unsyncBillFromBudget:', error);
            throw error;
        }
    }

    /**
     * Get total bills amount for a budget category
     */
    async getTotalBillsForCategory(categoryId: string): Promise<number> {
        try {
            const { data: bills, error } = await this.supabase
                .from('bills')
                .select('fixed_amount, estimated_amount')
                .eq('budget_category_id', categoryId)
                .eq('is_active', true);

            if (error || !bills) {
                return 0;
            }

            return bills.reduce((total, bill) => {
                return total + (bill.fixed_amount || bill.estimated_amount || 0);
            }, 0);
        } catch (error) {
            console.error('Error in getTotalBillsForCategory:', error);
            return 0;
        }
    }

    /**
     * Update budget spent amount when bill is paid
     */
    async updateBudgetOnPayment(billId: string, paidAmount: number): Promise<void> {
        try {
            // Get bill details
            const { data: bill, error: billError } = await this.supabase
                .from('bills')
                .select('budget_category_id, auto_sync_budget')
                .eq('id', billId)
                .single();

            if (billError || !bill || !bill.auto_sync_budget || !bill.budget_category_id) {
                return;
            }

            // Get current month's budget
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            const { data: budget, error: budgetError } = await this.supabase
                .from('budgets')
                .select('id, spent_amount')
                .eq('category_id', bill.budget_category_id)
                .gte('period_start', startOfMonth)
                .lte('period_end', endOfMonth)
                .single();

            if (budgetError || !budget) {
                console.warn('Budget not found for current month');
                return;
            }

            // Update spent amount
            const { error: updateError } = await this.supabase
                .from('budgets')
                .update({
                    spent_amount: budget.spent_amount + paidAmount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', budget.id);

            if (updateError) {
                console.error('Failed to update budget spent amount:', updateError);
            }
        } catch (error) {
            console.error('Error in updateBudgetOnPayment:', error);
            throw error;
        }
    }

    /**
     * Get budget utilization including bills
     */
    async getBudgetWithBills(categoryId: string) {
        try {
            const [budget, totalBills] = await Promise.all([
                this.supabase
                    .from('budgets')
                    .select('*')
                    .eq('category_id', categoryId)
                    .single(),
                this.getTotalBillsForCategory(categoryId)
            ]);

            if (budget.error || !budget.data) {
                return null;
            }

            return {
                ...budget.data,
                bills_amount: totalBills,
                available_after_bills: budget.data.allocated_amount - totalBills - budget.data.spent_amount
            };
        } catch (error) {
            console.error('Error in getBudgetWithBills:', error);
            return null;
        }
    }
}
