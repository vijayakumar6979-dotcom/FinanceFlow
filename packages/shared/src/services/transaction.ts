import { SupabaseClient } from '@supabase/supabase-js';
import { Transaction, CreateTransactionDTO, TransactionCategory } from '../types/transaction';

export const createTransactionService = (supabase: SupabaseClient) => ({

    // =====================================================
    // CATEGORIES
    // =====================================================

    getCategories: async (): Promise<TransactionCategory[]> => {
        const { data, error } = await supabase
            .from('transaction_categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as TransactionCategory[];
    },

    createCategory: async (category: Omit<TransactionCategory, 'id' | 'created_at' | 'is_system'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transaction_categories')
            .insert({ ...category, user_id: user.id, is_system: false })
            .select()
            .single();

        if (error) throw error;
        return data as TransactionCategory;
    },

    // =====================================================
    // TRANSACTIONS - BASIC CRUD
    // =====================================================

    getAll: async (filters?: {
        limit?: number;
        type?: string;
        accountId?: string;
        categoryId?: string;
        startDate?: string;
        endDate?: string;
        tags?: string[];
        isAnomaly?: boolean;
        hasReceipt?: boolean;
        linkedModule?: 'bill' | 'loan' | 'goal' | 'investment';
    }) => {
        let query = supabase
            .from('transactions')
            .select(`
                *,
                category:transaction_categories(*),
                account:accounts(id, name, type, logo),
                splits:transaction_splits(*),
                bill_payment:bill_payments(id, provider, amount),
                loan_payment:loan_payments(id, loan_id, amount),
                goal_contribution:goal_contributions(id, goal_id, amount),
                investment_transaction:investment_transactions(id, symbol, quantity)
            `)
            .order('date', { ascending: false });

        if (filters?.type) query = query.eq('type', filters.type);
        if (filters?.accountId) query = query.eq('account_id', filters.accountId);
        if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
        if (filters?.startDate) query = query.gte('date', filters.startDate);
        if (filters?.endDate) query = query.lte('date', filters.endDate);
        if (filters?.isAnomaly !== undefined) query = query.eq('is_anomaly', filters.isAnomaly);
        if (filters?.hasReceipt !== undefined) {
            if (filters.hasReceipt) {
                query = query.not('receipt_urls', 'is', null);
            } else {
                query = query.is('receipt_urls', null);
            }
        }
        if (filters?.linkedModule) {
            switch (filters.linkedModule) {
                case 'bill':
                    query = query.not('bill_payment_id', 'is', null);
                    break;
                case 'loan':
                    query = query.not('loan_payment_id', 'is', null);
                    break;
                case 'goal':
                    query = query.not('goal_contribution_id', 'is', null);
                    break;
                case 'investment':
                    query = query.not('investment_transaction_id', 'is', null);
                    break;
            }
        }
        if (filters?.limit) query = query.limit(filters.limit);

        const { data, error } = await query;
        if (error) throw error;
        return data as Transaction[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                category:transaction_categories(*),
                account:accounts(*),
                splits:transaction_splits(*),
                bill_payment:bill_payments(*),
                loan_payment:loan_payments(*),
                goal_contribution:goal_contributions(*),
                investment_transaction:investment_transactions(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    create: async (transaction: CreateTransactionDTO) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { splits, ...mainTxData } = transaction;

        const { data: newTx, error: txError } = await supabase
            .from('transactions')
            .insert({ ...mainTxData, user_id: user.id })
            .select()
            .single();

        if (txError) throw txError;
        if (!newTx) throw new Error('Failed to create transaction');

        // Handle Splits
        if (transaction.is_split && splits && splits.length > 0) {
            const splitsWithId = splits.map(s => ({
                ...s,
                parent_transaction_id: newTx.id,
                user_id: user.id
            }));

            const { error: splitError } = await supabase
                .from('transaction_splits')
                .insert(splitsWithId);

            if (splitError) {
                console.error('Failed to create splits', splitError);
                throw splitError;
            }
        }

        return newTx as Transaction;
    },

    update: async (id: string, updates: Partial<CreateTransactionDTO>) => {
        const { splits, ...mainUpdates } = updates;

        const { data, error } = await supabase
            .from('transactions')
            .update(mainUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Handle splits update (delete all and recreate)
        if (updates.is_split && splits) {
            // Delete existing splits
            await supabase
                .from('transaction_splits')
                .delete()
                .eq('parent_transaction_id', id);

            // Create new splits
            if (splits.length > 0) {
                const { data: { user } } = await supabase.auth.getUser();
                const splitsWithId = splits.map(s => ({
                    ...s,
                    parent_transaction_id: id,
                    user_id: user!.id
                }));

                await supabase
                    .from('transaction_splits')
                    .insert(splitsWithId);
            }
        }

        return data as Transaction;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // =====================================================
    // SPLIT TRANSACTIONS
    // =====================================================

    createSplitTransaction: async (transaction: CreateTransactionDTO & {
        splits: Array<{
            category_id: string;
            amount: number;
            description?: string;
            notes?: string;
        }>
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Validate splits total equals transaction amount
        const splitsTotal = transaction.splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(splitsTotal - transaction.amount) > 0.01) {
            throw new Error(`Split total (${splitsTotal}) does not match transaction amount (${transaction.amount})`);
        }

        // Create parent transaction
        const { splits, ...mainTxData } = transaction;
        const { data: newTx, error: txError } = await supabase
            .from('transactions')
            .insert({
                ...mainTxData,
                user_id: user.id,
                is_split: true
            })
            .select()
            .single();

        if (txError) throw txError;

        // Create splits
        const splitsWithId = splits.map(s => ({
            ...s,
            parent_transaction_id: newTx.id,
            user_id: user.id,
            percentage: (s.amount / transaction.amount) * 100
        }));

        const { error: splitError } = await supabase
            .from('transaction_splits')
            .insert(splitsWithId);

        if (splitError) throw splitError;

        return newTx as Transaction;
    },

    // =====================================================
    // TRANSFER TRANSACTIONS
    // =====================================================

    createTransferTransaction: async (transfer: {
        amount: number;
        from_account_id: string;
        to_account_id: string;
        transfer_fee?: number;
        date: string;
        description?: string;
        notes?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Generate transfer ID to link both transactions
        const transfer_id = crypto.randomUUID();

        // Create expense transaction (from account)
        const { data: expenseTx, error: expenseError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: transfer.from_account_id,
                type: 'expense',
                amount: transfer.amount + (transfer.transfer_fee || 0),
                date: transfer.date,
                description: transfer.description || `Transfer to account`,
                notes: transfer.notes,
                transfer_id,
                transfer_fee: transfer.transfer_fee || 0,
                category_id: null // Transfer category
            })
            .select()
            .single();

        if (expenseError) throw expenseError;

        // Create income transaction (to account)
        const { data: incomeTx, error: incomeError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: transfer.to_account_id,
                type: 'income',
                amount: transfer.amount,
                date: transfer.date,
                description: transfer.description || `Transfer from account`,
                notes: transfer.notes,
                transfer_id,
                category_id: null // Transfer category
            })
            .select()
            .single();

        if (incomeError) {
            // Rollback expense transaction
            await supabase.from('transactions').delete().eq('id', expenseTx.id);
            throw incomeError;
        }

        return { expenseTx, incomeTx, transfer_id };
    },

    // =====================================================
    // RECURRING TRANSACTIONS
    // =====================================================

    createRecurringTransaction: async (recurring: {
        description: string;
        category_id: string;
        account_id: string;
        amount: number;
        type: 'income' | 'expense';
        frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
        interval?: number;
        start_date: string;
        end_date?: string;
        end_after_occurrences?: number;
        tags?: string[];
        notes?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Calculate next occurrence date
        const next_occurrence_date = recurring.start_date;

        const { data, error } = await supabase
            .from('recurring_transactions')
            .insert({
                ...recurring,
                user_id: user.id,
                interval: recurring.interval || 1,
                is_active: true,
                next_occurrence_date,
                occurrences_created: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getRecurringTransactions: async () => {
        const { data, error } = await supabase
            .from('recurring_transactions')
            .select('*, category:transaction_categories(*), account:accounts(*)')
            .order('next_occurrence_date');

        if (error) throw error;
        return data;
    },

    updateRecurringTransaction: async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from('recurring_transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteRecurringTransaction: async (id: string) => {
        const { error } = await supabase
            .from('recurring_transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // =====================================================
    // BULK OPERATIONS
    // =====================================================

    bulkDelete: async (ids: string[]) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .in('id', ids);

        if (error) throw error;
    },

    bulkUpdateCategory: async (ids: string[], category_id: string) => {
        const { error } = await supabase
            .from('transactions')
            .update({ category_id })
            .in('id', ids);

        if (error) throw error;
    },

    bulkAddTags: async (ids: string[], newTags: string[]) => {
        // Get existing transactions
        const { data: transactions } = await supabase
            .from('transactions')
            .select('id, tags')
            .in('id', ids);

        if (!transactions) return;

        // Update each with merged tags
        for (const tx of transactions) {
            const existingTags = tx.tags || [];
            const mergedTags = Array.from(new Set([...existingTags, ...newTags]));

            await supabase
                .from('transactions')
                .update({ tags: mergedTags })
                .eq('id', tx.id);
        }
    },

    // =====================================================
    // AUTO-SYNC HELPERS
    // =====================================================

    createFromBillPayment: async (billPayment: {
        id: string;
        bill_id: string;
        amount: number;
        payment_date: string;
        account_id: string;
        provider: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: billPayment.account_id,
                type: 'expense',
                amount: billPayment.amount,
                date: billPayment.payment_date,
                description: `${billPayment.provider} Bill Payment`,
                bill_payment_id: billPayment.id,
                tags: ['bill', billPayment.provider.toLowerCase()]
            })
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    createFromLoanPayment: async (loanPayment: {
        id: string;
        loan_id: string;
        amount: number;
        payment_date: string;
        account_id: string;
        principal_amount: number;
        interest_amount: number;
        lender_name: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: loanPayment.account_id,
                type: 'expense',
                amount: loanPayment.amount,
                date: loanPayment.payment_date,
                description: `${loanPayment.lender_name} Loan Payment`,
                notes: `Principal: RM ${loanPayment.principal_amount}, Interest: RM ${loanPayment.interest_amount}`,
                loan_payment_id: loanPayment.id,
                tags: ['loan', loanPayment.lender_name.toLowerCase()]
            })
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    createFromGoalContribution: async (contribution: {
        id: string;
        goal_id: string;
        amount: number;
        contribution_date: string;
        source_account_id: string;
        goal_name: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: contribution.source_account_id,
                type: 'expense', // Deducted from source account
                amount: contribution.amount,
                date: contribution.contribution_date,
                description: `Contribution to ${contribution.goal_name}`,
                goal_contribution_id: contribution.id,
                tags: ['goal', 'savings', contribution.goal_name.toLowerCase()]
            })
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    createFromInvestment: async (investment: {
        id: string;
        type: 'buy' | 'sell';
        symbol: string;
        quantity: number;
        price: number;
        total_amount: number;
        transaction_date: string;
        account_id: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: investment.account_id,
                type: investment.type === 'buy' ? 'expense' : 'income',
                amount: investment.total_amount,
                date: investment.transaction_date,
                description: `${investment.type === 'buy' ? 'Buy' : 'Sell'} ${investment.quantity} ${investment.symbol} @ RM ${investment.price}`,
                investment_transaction_id: investment.id,
                tags: ['investment', investment.symbol.toLowerCase(), investment.type]
            })
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    createFromCreditCardPayment: async (payment: {
        credit_card_account_id: string;
        payment_account_id: string;
        amount: number;
        payment_date: string;
        card_name: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                account_id: payment.payment_account_id,
                type: 'expense',
                amount: payment.amount,
                date: payment.payment_date,
                description: `${payment.card_name} Credit Card Payment`,
                credit_card_payment: true,
                tags: ['credit_card', payment.card_name.toLowerCase()]
            })
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    // =====================================================
    // ANALYTICS & INSIGHTS
    // =====================================================

    getMonthlyStats: async (year: number, month: number) => {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

        const { data, error } = await supabase
            .from('transactions')
            .select('type, amount')
            .gte('date', startDate)
            .lte('date', endDate);

        if (error) throw error;

        const income = data
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = data
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            net: income - expenses,
            count: data.length
        };
    },

    getCategoryBreakdown: async (startDate: string, endDate: string) => {
        const { data, error } = await supabase
            .from('transactions')
            .select('category_id, category:transaction_categories(name, icon, color), amount')
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate);

        if (error) throw error;

        // Group by category
        const breakdown = data.reduce((acc: any, tx: any) => {
            const categoryId = tx.category_id || 'uncategorized';
            if (!acc[categoryId]) {
                acc[categoryId] = {
                    category: tx.category || { name: 'Uncategorized', icon: '❓', color: '#gray' },
                    total: 0,
                    count: 0
                };
            }
            acc[categoryId].total += tx.amount;
            acc[categoryId].count += 1;
            return acc;
        }, {});

        return Object.values(breakdown);
    }
});
