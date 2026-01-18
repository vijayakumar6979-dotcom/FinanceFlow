import { supabase } from '@/services/supabase';
import { AccountProps } from '@/components/accounts/AccountCard';

// Helper function to calculate next payment due date
export const calculateNextDueDate = (paymentDueDay: number): Date => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let dueMonth = currentMonth;
    let dueYear = currentYear;

    // If we've passed the due day this month, calculate for next month
    if (currentDay >= paymentDueDay) {
        dueMonth += 1;
        if (dueMonth > 11) {
            dueMonth = 0;
            dueYear += 1;
        }
    }

    // Handle months with fewer days than the due day
    const lastDayOfMonth = new Date(dueYear, dueMonth + 1, 0).getDate();
    const actualDueDay = Math.min(paymentDueDay, lastDayOfMonth);

    return new Date(dueYear, dueMonth, actualDueDay);
};

// Helper function to calculate minimum payment
export const calculateMinimumPayment = (
    outstandingBalance: number,
    minimumPaymentPercentage: number = 5.0
): number => {
    // Credit cards store outstanding balance as negative values
    const balance = Math.abs(outstandingBalance);
    return Math.max(balance * (minimumPaymentPercentage / 100), 25); // Minimum RM25 or percentage, whichever is higher
};

// Helper function to get payment info
export const getCreditCardPaymentInfo = (account: AccountProps): {
    nextDueDate: Date | null;
    minimumPayment: number;
    daysUntilDue: number;
} => {
    if (!account.payment_due_date) {
        return {
            nextDueDate: null,
            minimumPayment: 0,
            daysUntilDue: 0
        };
    }

    const nextDueDate = calculateNextDueDate(account.payment_due_date);
    const minimumPayment = calculateMinimumPayment(
        account.balance,
        account.minimum_payment_percentage
    );

    const now = new Date();
    const daysUntilDue = Math.ceil((nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
        nextDueDate,
        minimumPayment,
        daysUntilDue
    };
};

export const accountService = {
    getAll: async (): Promise<AccountProps[]> => {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((account: any) => ({
            id: account.id,
            name: account.name,
            type: account.account_type,
            balance: account.balance || 0,
            currency: account.currency || 'MYR',
            institution: {
                name: account.institution_name,
                logo: account.institution_logo,
                color: account.institution_color,
            },
            accountNumber: account.account_number,
            creditLimit: account.credit_limit,
            // Calculate usage if it's a credit card
            usage: account.account_type === 'credit_card' && account.credit_limit
                ? Math.round((Math.abs(account.balance) / account.credit_limit) * 100)
                : undefined,
            linked_phone: account.linked_phone,
            linked_email: account.linked_email,
            isFavorite: account.is_default, // Mapping is_default to isFavorite for now, or add is_favorite to DB
            // Credit card specific fields
            statement_date: account.statement_date,
            payment_due_date: account.payment_due_date,
            minimum_payment_percentage: account.minimum_payment_percentage,
            interest_rate: account.interest_rate,
            annual_fee: account.annual_fee,
            card_network: account.card_network,
        }));
    },

    create: async (account: Partial<AccountProps> & { type: string, institutionName?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        // Reverse mapping for creation - map frontend fields to DB columns
        const dbAccount: any = {
            user_id: user.id,
            name: account.name,
            account_type: account.type,
            balance: account.balance,
            currency: account.currency,
            institution_name: account.institution?.name || account.institutionName,
            institution_logo: account.institution?.logo,
            institution_color: account.institution?.color,
            account_number: account.accountNumber,
            credit_limit: account.creditLimit,
            linked_phone: account.linked_phone,
            linked_email: account.linked_email,
            is_default: account.isFavorite,
        };

        // Add credit card specific fields if present
        if (account.type === 'credit_card') {
            if ((account as any).statement_date !== undefined) {
                dbAccount.statement_date = (account as any).statement_date;
            }
            if ((account as any).payment_due_date !== undefined) {
                dbAccount.payment_due_date = (account as any).payment_due_date;
            }
            if ((account as any).minimum_payment_percentage !== undefined) {
                dbAccount.minimum_payment_percentage = (account as any).minimum_payment_percentage;
            }
            if ((account as any).interest_rate !== undefined) {
                dbAccount.interest_rate = (account as any).interest_rate;
            }
            if ((account as any).annual_fee !== undefined) {
                dbAccount.annual_fee = (account as any).annual_fee;
            }
            if ((account as any).card_network !== undefined) {
                dbAccount.card_network = (account as any).card_network;
            }
        }

        const { data, error } = await supabase
            .from('accounts')
            .insert(dbAccount)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getById: async (id: string): Promise<AccountProps> => {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Manual mapping (same as getAll)
        return {
            id: data.id,
            name: data.name,
            type: data.account_type,
            balance: data.balance || 0,
            currency: data.currency || 'MYR',
            institution: {
                name: data.institution_name,
                logo: data.institution_logo,
                color: data.institution_color,
            },
            accountNumber: data.account_number,
            creditLimit: data.credit_limit,
            usage: data.account_type === 'credit_card' && data.credit_limit
                ? Math.round((Math.abs(data.balance) / data.credit_limit) * 100)
                : undefined,
            linked_phone: data.linked_phone,
            linked_email: data.linked_email,
            isFavorite: data.is_default,
            // Credit card specific fields
            statement_date: data.statement_date,
            payment_due_date: data.payment_due_date,
            minimum_payment_percentage: data.minimum_payment_percentage || 5.0,
            interest_rate: data.interest_rate,
            annual_fee: data.annual_fee,
            card_network: data.card_network,
        };
    },

    update: async (id: string, updates: Partial<AccountProps>) => {
        // Map frontend fields to DB fields
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.balance !== undefined) dbUpdates.balance = updates.balance;
        if (updates.creditLimit !== undefined) dbUpdates.credit_limit = updates.creditLimit;
        if (updates.accountNumber !== undefined) dbUpdates.account_number = updates.accountNumber;
        if (updates.isFavorite !== undefined) dbUpdates.is_default = updates.isFavorite;
        // Add other fields as necessary

        const { data, error } = await supabase
            .from('accounts')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateBalance: async (id: string, newBalance: number) => {
        const { data, error } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id: string) => {
        const { error } = await supabase.rpc('delete_account_safely', {
            p_account_id: id
        });

        if (error) {
            console.error('Failed to delete account via RPC:', error);
            throw error;
        }
    },

    getStatistics: async (accountId: string) => {
        const { data, error } = await supabase
            .rpc('get_account_statistics', { p_account_id: accountId });

        if (error) throw error;
        return data;
    }
};

