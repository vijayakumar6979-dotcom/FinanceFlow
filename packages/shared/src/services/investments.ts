import { SupabaseClient } from '@supabase/supabase-js';
import { Investment, InvestmentTransaction, PortfolioSummary, AssetAllocation } from '../types/investments';
import { marketService } from './market';

// We need to inject the supabase client because it might differ between web and mobile (or at least the auth context)
// BUT for simplicity in shared package, we can accept it as a param or expect a singleton if we had one.
// Since `@financeflow/shared` doesn't seem to hold the supabase client instance (usually apps do), 
// we'll make a factory or class. OR, simpler for now: Pass supabase client to functions or 
// use a `setClient` approach.
//
// Looking at existing `budget.ts` in shared might verify how they handle it. 
// For now, I'll assume we pass the client or it's a standard pattern. 
// Actually, I'll make it a class-like object or functions that take the client, 
// OR simpler: `createInvestmentService(supabase: SupabaseClient)`.
//
// However, `apps/web/src/services/investment.service.ts` imported `supabase` from `./supabase`.
// In shared, we don't have that.
// Let's modify the service to accept the client.

export const createInvestmentService = (supabase: SupabaseClient) => ({
    getAll: async () => {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Investment[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Investment;
    },

    create: async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('investments')
            .insert({ ...investment, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data as Investment;
    },

    update: async (id: string, updates: Partial<Investment>) => {
        const { data, error } = await supabase
            .from('investments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Investment;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('investments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    addTransaction: async (transaction: Omit<InvestmentTransaction, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('investment_transactions')
            .insert(transaction)
            .select()
            .single();

        if (error) throw error;
        return data as InvestmentTransaction;
    },

    getTransactions: async (investmentId: string) => {
        const { data, error } = await supabase
            .from('investment_transactions')
            .select('*')
            .eq('investment_id', investmentId)
            .order('transaction_date', { ascending: false });

        if (error) throw error;
        return data as InvestmentTransaction[];
    },

    getPortfolioSummary: async (): Promise<PortfolioSummary> => {
        // This causes a self-reference if we just call `getAll`.
        // We'll duplicate the logic or extract it.
        const { data: investments, error } = await supabase
            .from('investments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        const invs = (investments || []) as Investment[];

        if (invs.length === 0) {
            return {
                total_value: 0,
                total_invested: 0,
                total_profit_loss: 0,
                total_profit_loss_pct: 0,
                daily_change: 0,
                daily_change_pct: 0
            };
        }

        const symbols = [...new Set(invs.map(i => i.symbol))];
        const quotes = await marketService.getQuotes(symbols);

        let totalValue = 0;
        let totalInvested = 0;
        let dailyChange = 0;

        invs.forEach(inv => {
            const quote = quotes.get(inv.symbol);
            const currentPrice = quote ? quote.price : inv.avg_cost;
            const currentValue = inv.quantity * currentPrice;
            const investedValue = inv.quantity * inv.avg_cost;
            const change = quote ? (quote.change * inv.quantity) : 0;

            totalValue += currentValue;
            totalInvested += investedValue;
            dailyChange += change;
        });

        const totalProfit = totalValue - totalInvested;

        return {
            total_value: totalValue,
            total_invested: totalInvested,
            total_profit_loss: totalProfit,
            total_profit_loss_pct: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
            daily_change: dailyChange,
            daily_change_pct: totalValue > 0 ? (dailyChange / totalValue) * 100 : 0
        };
    },

    getAssetAllocation: async (): Promise<AssetAllocation> => {
        const { data: investments, error } = await supabase
            .from('investments')
            .select('*');

        if (error) throw error;
        const invs = (investments || []) as Investment[];

        const quotes = await marketService.getQuotes([...new Set(invs.map(i => i.symbol))]);

        const typeMap = new Map<string, number>();
        let totalVal = 0;

        invs.forEach(inv => {
            const quote = quotes.get(inv.symbol);
            const price = quote ? quote.price : inv.avg_cost;
            const val = inv.quantity * price;

            typeMap.set(inv.type, (typeMap.get(inv.type) || 0) + val);
            totalVal += val;
        });

        return Array.from(typeMap.entries()).map(([type, value]) => ({
            type,
            value,
            percentage: totalVal > 0 ? (value / totalVal) * 100 : 0
        }));
    }
});
