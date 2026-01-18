import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@financeflow/shared';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, Percent, CreditCard, PieChart } from 'lucide-react';

export const QuickStatsGrid = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const analyticsService = createAnalyticsService(supabase);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const data = await analyticsService.getOverviewStats(user!.id);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => <Card key={i} className="h-24 bg-gray-100 dark:bg-white/5" />)}
    </div>;

    if (!stats) return null;

    const items = [
        { label: 'Total Income', value: formatCurrency(stats.totalIncome), icon: ArrowUpRight, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'Net Savings', value: formatCurrency(stats.netSavings), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Savings Rate', value: `${stats.savingsRate.toFixed(1)}%`, icon: Percent, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Net Worth', value: formatCurrency(stats.netWorth), icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Debt', value: formatCurrency(stats.totalDebt), icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Investments', value: formatCurrency(stats.investmentReturns), icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Budget Adherence', value: `${stats.budgetAdherence}%`, icon: PieChart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <Card key={index} className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-gray-400">{item.label}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
                        </div>
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
