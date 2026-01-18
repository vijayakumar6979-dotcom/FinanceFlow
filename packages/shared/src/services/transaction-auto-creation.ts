import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Transaction Auto-Creation Service
 * Automatically creates transactions when bills are marked as paid
 */

interface BillPayment {
    id: string;
    bill_id: string;
    amount: number;
    paid_date: string;
    payment_method?: string;
    account_id?: string;
    notes?: string;
}

interface Bill {
    id: string;
    bill_name: string;
    provider_name: string;
    budget_category_id?: string;
    linked_account_id?: string;
    currency: string;
}

export class TransactionAutoCreationService {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Create transaction when bill is marked as paid
     */
    async createTransactionFromPayment(payment: BillPayment): Promise<string | null> {
        try {
            // Get bill details
            const { data: bill, error: billError } = await this.supabase
                .from('bills')
                .select('*')
                .eq('id', payment.bill_id)
                .single();

            if (billError || !bill) {
                console.error('Bill not found:', billError);
                return null;
            }

            // Get user ID from auth
            const { data: { user } } = await this.supabase.auth.getUser();
            if (!user) {
                console.error('User not authenticated');
                return null;
            }

            // Determine account ID (use linked account or payment account)
            const accountId = payment.account_id || bill.linked_account_id;

            if (!accountId) {
                console.warn('No account linked to bill payment');
                // Still create transaction but without account link
            }

            // Create transaction
            const transaction = {
                user_id: user.id,
                account_id: accountId,
                category_id: bill.budget_category_id,
                type: 'expense' as const,
                amount: payment.amount,
                currency: bill.currency || 'MYR',
                description: `Bill payment: ${bill.bill_name} (${bill.provider_name})`,
                date: payment.paid_date,
                payment_method: payment.payment_method || 'Other',
                notes: payment.notes || `Auto-created from bill payment`,
                tags: ['bill', 'recurring', bill.provider_name.toLowerCase()],
                is_recurring: true,
                bill_payment_id: payment.id, // Link back to bill payment
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: createdTransaction, error: transactionError } = await this.supabase
                .from('transactions')
                .insert(transaction)
                .select()
                .single();

            if (transactionError) {
                console.error('Failed to create transaction:', transactionError);
                return null;
            }

            // Update account balance if account is linked
            if (accountId) {
                await this.updateAccountBalance(accountId, -payment.amount);
            }

            return createdTransaction.id;
        } catch (error) {
            console.error('Error in createTransactionFromPayment:', error);
            return null;
        }
    }

    /**
     * Update account balance after transaction
     */
    private async updateAccountBalance(accountId: string, amountChange: number): Promise<void> {
        try {
            const { data: account, error: accountError } = await this.supabase
                .from('accounts')
                .select('balance')
                .eq('id', accountId)
                .single();

            if (accountError || !account) {
                console.error('Account not found:', accountError);
                return;
            }

            const { error: updateError } = await this.supabase
                .from('accounts')
                .update({
                    balance: account.balance + amountChange,
                    updated_at: new Date().toISOString()
                })
                .eq('id', accountId);

            if (updateError) {
                console.error('Failed to update account balance:', updateError);
            }
        } catch (error) {
            console.error('Error in updateAccountBalance:', error);
        }
    }

    /**
     * Bulk create transactions for multiple bill payments
     */
    async bulkCreateTransactions(payments: BillPayment[]): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        for (const payment of payments) {
            const transactionId = await this.createTransactionFromPayment(payment);
            if (transactionId) {
                success++;
            } else {
                failed++;
            }
        }

        return { success, failed };
    }

    /**
     * Delete transaction when bill payment is deleted
     */
    async deleteTransactionForPayment(paymentId: string): Promise<void> {
        try {
            // Find transaction linked to this payment
            const { data: transaction, error: findError } = await this.supabase
                .from('transactions')
                .select('id, amount, account_id')
                .eq('bill_payment_id', paymentId)
                .single();

            if (findError || !transaction) {
                console.warn('No transaction found for payment:', paymentId);
                return;
            }

            // Reverse account balance if account is linked
            if (transaction.account_id) {
                await this.updateAccountBalance(transaction.account_id, transaction.amount);
            }

            // Delete transaction
            const { error: deleteError } = await this.supabase
                .from('transactions')
                .delete()
                .eq('id', transaction.id);

            if (deleteError) {
                console.error('Failed to delete transaction:', deleteError);
            }
        } catch (error) {
            console.error('Error in deleteTransactionForPayment:', error);
        }
    }

    /**
     * Get all transactions created from bill payments
     */
    async getBillTransactions(billId: string): Promise<any[]> {
        try {
            // Get all payments for this bill
            const { data: payments, error: paymentsError } = await this.supabase
                .from('bill_payments')
                .select('id')
                .eq('bill_id', billId);

            if (paymentsError || !payments) {
                return [];
            }

            const paymentIds = payments.map(p => p.id);

            // Get transactions linked to these payments
            const { data: transactions, error: transactionsError } = await this.supabase
                .from('transactions')
                .select('*')
                .in('bill_payment_id', paymentIds)
                .order('date', { ascending: false });

            if (transactionsError) {
                console.error('Failed to get bill transactions:', transactionsError);
                return [];
            }

            return transactions || [];
        } catch (error) {
            console.error('Error in getBillTransactions:', error);
            return [];
        }
    }
}
