import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService, FinancialSnapshot } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';

export const NetWorthChart = () => {
    const { user } = useAuth();
    const [data, setData] = useState<FinancialSnapshot[]>([]);
    const [loading, setLoading] = useState(true);
    const analyticsService = createAnalyticsService(supabase);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const snapshots = await analyticsService.getFinancialSnapshot(user!.id, 'monthly');
            // Mock data if empty for visualization showcase
            if (snapshots.length === 0) {
                setData(generateMockData());
            } else {
                setData(snapshots);
            }
        } catch (error) {
            console.error('Failed to fetch net worth history:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = () => {
        const mock: any[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            mock.push({
                snapshot_date: date.toISOString(),
                net_worth: 10000 + Math.random() * 5000 + (i * 1000)
            });
        }
        return mock;
    };

    if (loading) return <Card className="h-80 animate-pulse bg-gray-100 dark:bg-white/5" />;

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-[400px]">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Net Worth Trend</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                        <XAxis
                            dataKey="snapshot_date"
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
                            formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                            labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
                        />
                        <Area
                            type="monotone"
                            dataKey="net_worth"
                            stroke="#0066FF"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorNetWorth)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
