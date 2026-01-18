import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';

export const IncomeExpenseChart = () => {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const analyticsService = createAnalyticsService(supabase);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const history = await analyticsService.getIncomeVsExpenseHistory(user!.id);
            if (history.length === 0) {
                setData(generateMockData());
            } else {
                setData(history);
            }
        } catch (error) {
            console.error('Failed to fetch income/expense history:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = () => {
        const mock: any[] = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            mock.push({
                month: format(date, 'yyyy-MM'),
                income: 5000 + Math.random() * 2000,
                expense: 3000 + Math.random() * 2000
            });
        }
        return mock;
    };

    if (loading) return <Card className="h-80 animate-pulse bg-gray-100 dark:bg-white/5" />;

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-[400px]">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Income vs Expenses</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                        <XAxis
                            dataKey="month"
                            tickFormatter={(str) => format(new Date(str), 'MMM')}
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(val) => `${val / 1000}k`}
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A1F3A', border: 'none', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => formatCurrency(value)}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
