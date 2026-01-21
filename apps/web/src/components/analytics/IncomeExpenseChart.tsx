import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl skew-y-0 transform transition-all">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{format(new Date(label), 'MMMM yyyy')}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-300 font-medium text-sm">{entry.name}:</span>
                            <span className="text-white font-bold text-sm ml-auto font-mono">{formatCurrency(entry.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

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

    if (loading) return (
        <Card className="h-[400px] w-full bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl animate-pulse" />
    );

    return (
        <Card className="p-6 sm:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] h-[400px] w-full rounded-3xl relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-32 bg-rose-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Income vs Expenses</h3>
                        <p className="text-slate-400 text-sm">Monthly cash flow analysis</p>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(str) => format(new Date(str), 'MMM')}
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                tickFormatter={(val) => `${val / 1000}k`}
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Legend
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '20px' }}
                            />
                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="url(#incomeGradient)"
                                radius={[6, 6, 6, 6]}
                                maxBarSize={50}
                            />
                            <Bar
                                dataKey="expense"
                                name="Expense"
                                fill="url(#expenseGradient)"
                                radius={[6, 6, 6, 6]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};
