import { supabase } from './supabase';
import { Loan, AmortizationSchedule, PayoffStrategy } from '@financeflow/shared';

export const loanService = {
    // Loans CRUD
    getAll: async () => {
        const { data, error } = await supabase
            .from('loans')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Loan[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('loans')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Loan;
    },

    create: async (loan: Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('loans')
            .insert({ ...loan, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data as Loan;
    },

    update: async (id: string, updates: Partial<Loan>) => {
        const { data, error } = await supabase
            .from('loans')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Loan;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('loans')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Amortization
    getAmortizationSchedule: async (loanId: string) => {
        const { data, error } = await supabase
            .from('loan_amortization_schedule')
            .select('*')
            .eq('loan_id', loanId)
            .order('payment_number', { ascending: true });

        if (error) throw error;
        return data as AmortizationSchedule[];
    },

    generateAmortization: async (loanId: string) => {
        // This would typically call an Edge Function
        // For now, we'll implement a basic version client-side or assume the edge function exists
        // Returning empty array as place holder if edge function not ready
        return [];
    },

    // Strategies
    getStrategies: async () => {
        const { data, error } = await supabase
            .from('loan_payoff_strategies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as PayoffStrategy[];
    },

    saveStrategy: async (strategy: Omit<PayoffStrategy, 'id' | 'user_id'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('loan_payoff_strategies')
            .insert({ ...strategy, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data as PayoffStrategy;
    }
};
