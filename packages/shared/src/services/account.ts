
import { SupabaseClient } from '@supabase/supabase-js';

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: 'bank_savings' | 'bank_checking' | 'credit_card' | 'ewallet' | 'cash' | 'investment' | 'loan' | 'other';
    balance: number;
    currency: string;
    institution_name?: string;
    account_number?: string;
    created_at?: string;
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
        }
    };
};
