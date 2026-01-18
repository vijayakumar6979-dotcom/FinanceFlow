import { SupabaseClient } from '@supabase/supabase-js';
import { FinancialHealthScore, FinancialSnapshot, AnalyticsInsight } from '../types/analytics';

export const createAnalyticsService = (supabase: SupabaseClient) => {

    const getMonthlyIncome = async (userId: string, startDate: string, endDate: string) => {
        const { data } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'income')
            .gte('date', startDate)
            .lte('date', endDate);
        return data?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    };

    const getMonthlyExpenses = async (userId: string, startDate: string, endDate: string) => {
        const { data } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate);
        return data?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    };

    const getTotalDebt = async (userId: string) => {
        const { data } = await supabase
            .from('loans') // Assuming 'loans' table tracks debts
            .select('current_balance') // Adjust field name based on schema
            .eq('user_id', userId);

        // Also check credit cards negative balances? 
        // For now simplifying to loans table
        return data?.reduce((sum, loan) => sum + (loan.current_balance || 0), 0) || 0;
    };

    return {
        calculateFinancialHealth: async (userId: string): Promise<FinancialHealthScore> => {
            // Helpers for score calculation
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            // 1. Budgeting Score
            const { data: budgets } = await supabase.from('budgets').select('*').eq('user_id', userId);
            let budgetingScore = 0;
            if (budgets && budgets.length > 0) {
                const onTrack = budgets.filter((b: any) => (b.spent || 0) <= b.amount).length;
                budgetingScore = (onTrack / budgets.length) * 100;
            } else {
                budgetingScore = 50; // Default if no budgets
            }

            // 2. Saving Score
            const income = await getMonthlyIncome(userId, startOfMonth, endOfMonth);
            const expenses = await getMonthlyExpenses(userId, startOfMonth, endOfMonth);
            let savingScore = 0;
            if (income > 0) {
                const savingsRate = ((income - expenses) / income) * 100;
                if (savingsRate >= 20) savingScore = 100;
                else if (savingsRate >= 15) savingScore = 85;
                else if (savingsRate >= 10) savingScore = 70;
                else if (savingsRate >= 5) savingScore = 50;
                else savingScore = Math.max(savingsRate * 5, 0);
            }

            // 3. Debt Score
            const totalDebt = await getTotalDebt(userId);
            const annualizedIncome = income * 12; // Approximation
            let debtScore = 100;
            if (annualizedIncome > 0) {
                const debtToIncome = totalDebt / annualizedIncome;
                if (debtToIncome === 0) debtScore = 100;
                else if (debtToIncome < 1) debtScore = 90;
                else if (debtToIncome < 2) debtScore = 75;
                else if (debtToIncome < 3) debtScore = 60;
                else if (debtToIncome < 4) debtScore = 45;
                else debtScore = Math.max(100 - (debtToIncome * 15), 0);
            }

            // 4. Investing Score (Mocked for now as investment table structure unclear in prompt, assuming simplistic)
            // Ideally fetch portfolio value / net worth logic
            let investingScore = 65; // Placeholder

            // 5. Cash Flow Score (Simple: Income > Expense)
            let cashFlowScore = income > expenses ? 100 : (income > 0 ? (income / expenses) * 50 : 0);
            if (cashFlowScore > 100) cashFlowScore = 100;

            // Weighted Average
            const overall = (
                budgetingScore * 0.25 +
                savingScore * 0.25 +
                debtScore * 0.25 +
                investingScore * 0.15 +
                cashFlowScore * 0.10
            );

            let rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Needs Improvement';
            if (overall >= 90) rating = 'Excellent';
            else if (overall >= 70) rating = 'Good';
            else if (overall >= 50) rating = 'Fair';

            return {
                overall: Math.round(overall),
                rating,
                breakdown: {
                    budgeting: Math.round(budgetingScore),
                    saving: Math.round(savingScore),
                    debtManagement: Math.round(debtScore),
                    investing: Math.round(investingScore),
                    cashFlow: Math.round(cashFlowScore)
                },
                insights: [
                    budgetingScore > 80 ? "Great job sticking to your budgets!" : "Review your budget limits.",
                    savingScore > 70 ? "Your savings rate is healthy." : "Try to save at least 20% of income.",
                    debtScore > 80 ? "Debt is well managed." : "Focus on paying down high-interest debt."
                ]
            };
        },

        getFinancialSnapshot: async (userId: string, period: 'monthly' | 'yearly' = 'monthly'): Promise<FinancialSnapshot[]> => {
            const { data, error } = await supabase
                .from('financial_snapshots')
                .select('*')
                .eq('user_id', userId)
                .eq('snapshot_type', period)
                .order('snapshot_date', { ascending: true })
                .limit(12);

            if (error) throw error;
            return data as FinancialSnapshot[];
        },

        generateDailySnapshot: async (userId: string) => {
            // Use RPC or complex logic to aggregate everything and insert into financial_snapshots
            // For MVP/Demo: we usually call this via a CRON job or Edge Function. 
            // Implementing this client-side is heavy.
            // We'll leave this for the backend requirement "Edge Function: calculate-financial-health-score"
            // But we can enable a "Refresh Snapshot" button.
            console.log('Generating snapshot for', userId);
        },

        getCategoryBreakdown: async (userId: string, startDate: string, endDate: string) => {
            const { data } = await supabase
                .from('transactions')
                .select(`
                    amount,
                    category:transaction_categories(name, color)
                `)
                .eq('user_id', userId)
                .eq('type', 'expense')
                .gte('date', startDate)
                .lte('date', endDate);

            // Aggregation
            const map = new Map<string, { value: number, color: string }>();
            data?.forEach((tx: any) => {
                const catName = tx.category?.name || 'Uncategorized';
                const catColor = tx.category?.color || '#999';
                const current = map.get(catName) || { value: 0, color: catColor };
                map.set(catName, { value: current.value + (tx.amount || 0), color: catColor });
            });

            return Array.from(map.entries()).map(([name, { value, color }]) => ({
                name,
                value,
                color
            })).sort((a, b) => b.value - a.value);
        },

        getIncomeVsExpenseHistory: async (userId: string) => {
            // This typically requires grouping by month on server-side or fetching last 6 months txns
            // Simplified: fetch last 6 months transactions
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const { data } = await supabase
                .from('transactions')
                .select('date, amount, type')
                .eq('user_id', userId)
                .gte('date', sixMonthsAgo.toISOString());

            // process in JS
            const result: Record<string, { income: number, expense: number }> = {};

            data?.forEach((tx: any) => {
                const month = tx.date.substring(0, 7); // YYYY-MM
                if (!result[month]) result[month] = { income: 0, expense: 0 };
                if (tx.type === 'income') result[month].income += tx.amount;
                else if (tx.type === 'expense') result[month].expense += tx.amount;
            });

            return Object.entries(result).map(([month, stats]) => ({
                month,
                ...stats
            })).sort((a, b) => a.month.localeCompare(b.month));

        },

        getOverviewStats: async (userId: string) => {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            const income = await getMonthlyIncome(userId, startOfMonth, endOfMonth);
            const expenses = await getMonthlyExpenses(userId, startOfMonth, endOfMonth);
            const debt = await getTotalDebt(userId);

            // Calculate Net Worth (Assets - Liabilities)
            // Need accounts for assets
            const { data: accounts } = await supabase.from('accounts').select('balance, type').eq('user_id', userId);

            // Adjust assets/liabilities logic based on account type
            // Liabilities: credit_card, loan
            // Assets: bank_savings, bank_checking, ewallet, cash, investment, other

            let assets = 0;
            let liabilities = 0;

            accounts?.forEach((acc: any) => {
                const type = acc.type;
                if (type === 'credit_card' || type === 'loan') {
                    liabilities += Math.abs(acc.balance || 0);
                } else {
                    assets += (acc.balance || 0);
                }
            });

            // Note: loan service might have more accurate debt info, but accounts table usually mirrors it.
            // Using accounts table for speed.

            return {
                totalIncome: income,
                totalExpenses: expenses,
                netSavings: income - expenses,
                savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
                netWorth: assets - liabilities,
                totalDebt: liabilities,
                investmentReturns: 0, // Placeholder
                budgetAdherence: 85 // Placeholder
            };
        }
    };
};
