/**
 * Credit Card Analytics Service
 * Handles CRUD operations for credit card analytics and repayment plans
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
    CreditCardAnalytics,
    CreateCreditCardAnalyticsDTO,
    RepaymentPlan,
    CreateRepaymentPlanDTO,
    UpdateRepaymentPlanDTO,
} from '../types/credit-card-analytics';

export function createCreditCardAnalyticsService(supabase: SupabaseClient) {
    return {
        // ============================================================================
        // Credit Card Analytics Methods
        // ============================================================================

        /**
         * Get latest analytics for a credit card account
         */
        async getLatestAnalytics(accountId: string): Promise<CreditCardAnalytics | null> {
            const { data, error } = await supabase
                .rpc('get_latest_credit_card_analytics', { p_account_id: accountId })
                .single<CreditCardAnalytics>();

            if (error) {
                if (error.code === 'PGRST116') return null;
                console.error('Failed to fetch latest analytics:', error);
                throw error;
            }

            return data;
        },

        /**
         * Get all analytics for a credit card (history)
         */
        async getAllAnalytics(accountId: string): Promise<CreditCardAnalytics[]> {
            const { data, error } = await supabase
                .from('credit_card_analytics')
                .select('*')
                .eq('account_id', accountId)
                .order('analysis_date', { ascending: false });

            if (error) {
                console.error('Failed to fetch analytics history:', error);
                throw error;
            }

            return data || [];
        },

        /**
         * Create new analytics entry
         */
        async createAnalytics(analytics: CreateCreditCardAnalyticsDTO): Promise<CreditCardAnalytics> {
            const { data, error } = await supabase
                .from('credit_card_analytics')
                .insert(analytics)
                .select()
                .single();

            if (error) {
                console.error('Failed to create analytics:', error);
                throw error;
            }

            return data;
        },

        /**
         * Update existing analytics
         */
        async updateAnalytics(
            id: string,
            updates: Partial<CreateCreditCardAnalyticsDTO>
        ): Promise<CreditCardAnalytics> {
            const { data, error } = await supabase
                .from('credit_card_analytics')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Failed to update analytics:', error);
                throw error;
            }

            return data;
        },

        /**
         * Delete analytics entry
         */
        async deleteAnalytics(id: string): Promise<void> {
            const { error } = await supabase
                .from('credit_card_analytics')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Failed to delete analytics:', error);
                throw error;
            }
        },

        // ============================================================================
        // Repayment Plans Methods
        // ============================================================================

        /**
         * Get all active repayment plans for an account
         */
        async getRepaymentPlans(accountId: string): Promise<RepaymentPlan[]> {
            const { data, error } = await supabase
                .rpc('get_active_repayment_plans', { p_account_id: accountId });

            if (error) {
                console.error('Failed to fetch repayment plans:', error);
                throw error;
            }

            return data || [];
        },

        /**
         * Get selected repayment plan for an account
         */
        async getSelectedPlan(accountId: string): Promise<RepaymentPlan | null> {
            const { data, error } = await supabase
                .from('repayment_plans')
                .select('*')
                .eq('account_id', accountId)
                .eq('is_selected', true)
                .eq('is_active', true)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
                console.error('Failed to fetch selected plan:', error);
                throw error;
            }

            return data;
        },

        /**
         * Create new repayment plan
         */
        async createPlan(plan: CreateRepaymentPlanDTO): Promise<RepaymentPlan> {
            const { data, error } = await supabase
                .from('repayment_plans')
                .insert(plan)
                .select()
                .single();

            if (error) {
                console.error('Failed to create repayment plan:', error);
                throw error;
            }

            return data;
        },

        /**
         * Create multiple repayment plans in bulk
         */
        async createPlans(plans: CreateRepaymentPlanDTO[]): Promise<RepaymentPlan[]> {
            const { data, error } = await supabase
                .from('repayment_plans')
                .insert(plans)
                .select();

            if (error) {
                console.error('Failed to create repayment plans:', error);
                throw error;
            }

            return data || [];
        },

        /**
         * Select a repayment plan (deselects others for same account)
         */
        async selectPlan(planId: string): Promise<boolean> {
            const { data, error } = await supabase
                .rpc('select_repayment_plan', { p_plan_id: planId });

            if (error) {
                console.error('Failed to select repayment plan:', error);
                throw error;
            }

            return data;
        },

        /**
         * Update repayment plan
         */
        async updatePlan(planId: string, updates: UpdateRepaymentPlanDTO): Promise<RepaymentPlan> {
            const { data, error } = await supabase
                .from('repayment_plans')
                .update(updates)
                .eq('id', planId)
                .select()
                .single();

            if (error) {
                console.error('Failed to update repayment plan:', error);
                throw error;
            }

            return data;
        },

        /**
         * Record a payment made towards a plan
         * Auto-creates a transaction for the payment
         */
        async recordPayment(planId: string, paymentDate: string, amount: number, accountId: string): Promise<RepaymentPlan> {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: existingPlan, error: fetchError } = await supabase
                .from('repayment_plans')
                .select('payments_made, account_id')
                .eq('id', planId)
                .single();

            if (fetchError) {
                console.error('Failed to fetch plan for payment recording:', fetchError);
                throw fetchError;
            }

            const { data, error } = await supabase
                .from('repayment_plans')
                .update({
                    payments_made: (existingPlan.payments_made || 0) + 1,
                    last_payment_date: paymentDate,
                })
                .eq('id', planId)
                .select()
                .single();

            if (error) {
                console.error('Failed to record payment:', error);
                throw error;
            }

            // Auto-create transaction
            try {
                // Get account details for card name
                const { data: account } = await supabase
                    .from('accounts')
                    .select('name')
                    .eq('id', existingPlan.account_id)
                    .single();

                await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        type: 'expense',
                        amount: amount,
                        description: `Credit Card Payment: ${account?.name || 'Credit Card'}`,
                        account_id: accountId,
                        date: paymentDate,
                        credit_card_payment: true,
                        notes: 'Auto-created from credit card payment',
                        tags: ['credit_card', account?.name?.toLowerCase() || 'payment']
                    });

                console.log(`✅ Auto-created transaction for credit card payment: ${planId}`);
            } catch (txError) {
                console.error('Failed to auto-create transaction for credit card payment:', txError);
                // Don't fail the payment if transaction creation fails
            }

            return data;
        },

        /**
         * Deactivate a repayment plan
         */
        async deactivatePlan(planId: string): Promise<void> {
            const { error } = await supabase
                .from('repayment_plans')
                .update({ is_active: false })
                .eq('id', planId);

            if (error) {
                console.error('Failed to deactivate plan:', error);
                throw error;
            }
        },

        /**
         * Delete repayment plan
         */
        async deletePlan(planId: string): Promise<void> {
            const { error } = await supabase
                .from('repayment_plans')
                .delete()
                .eq('id', planId);

            if (error) {
                console.error('Failed to delete repayment plan:', error);
                throw error;
            }
        },

        /**
         * Delete all plans for an account
         */
        async deleteAllPlans(accountId: string): Promise<void> {
            const { error } = await supabase
                .from('repayment_plans')
                .delete()
                .eq('account_id', accountId);

            if (error) {
                console.error('Failed to delete all plans:', error);
                throw error;
            }
        },
    };
}

// Export type for the service
export type CreditCardAnalyticsService = ReturnType<typeof createCreditCardAnalyticsService>;
