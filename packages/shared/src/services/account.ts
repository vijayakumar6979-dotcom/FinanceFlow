
import { SupabaseClient } from '@supabase/supabase-js';

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: 'bank_savings' | 'bank_checking' | 'credit_card' | 'ewallet' | 'cash' | 'investment' | 'loan' | 'other';
    balance: number;
    currency: string;

    // Bank/Provider Info
    institution_name?: string;
    institution_logo?: string;
    institution_color?: string;

    // Account Details
    account_number?: string;
    account_number_masked?: string;

    // Credit Card Specific Fields
    credit_limit?: number;
    statement_date?: number;              // Day of month (1-31)
    payment_due_date?: number;            // Day of month (1-31)
    minimum_payment_percentage?: number;  // Percentage (e.g., 5.00 for 5%)
    interest_rate?: number;               // APR percentage (e.g., 18.00 for 18%)
    annual_fee?: number;                  // Annual fee amount
    card_network?: string;                // 'Visa' | 'Mastercard' | 'American Express' | 'Other'

    // E-Wallet Specific
    linked_phone?: string;
    linked_email?: string;

    // Settings
    is_default?: boolean;
    is_active?: boolean;
    include_in_total?: boolean;
    color?: string;

    // Metadata
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AccountStatistics {
    total_transactions: number;
    total_spend: number;
    average_transaction_amount: number;
    largest_transaction: {
        amount: number;
        date: string;
        description: string;
        category_name: string;
    } | null;
    most_frequent_category: {
        name: string;
        count: number;
    } | null;
}

export const createAccountService = (supabase: SupabaseClient) => {
    return {
        getAll: async () => {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .order('name');

            if (error) throw error;
            return data as Account[];
        },

        create: async (account: Omit<Account, 'id' | 'user_id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('accounts')
                .insert(account)
                .select()
                .single();

            if (error) throw error;
            return data as Account;
        },

        getById: async (id: string) => {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Account;
        },

        getStatistics: async (accountId: string): Promise<AccountStatistics> => {
            const { data, error } = await supabase
                .rpc('get_account_statistics', { p_account_id: accountId });

            if (error) throw error;
            return data as AccountStatistics;
        }
    };
};
