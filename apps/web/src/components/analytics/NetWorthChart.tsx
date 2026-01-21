import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService, FinancialSnapshot } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{format(new Date(label), 'MMMM yyyy')}</p>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-slate-300 font-medium text-sm">Net Worth:</span>
                    <span className="text-white font-bold text-sm ml-auto font-mono">{formatCurrency(payload[0].value)}</span>
                </div>
            </div>
        );
    }
    return null;
};

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

    if (loading) return (
        <Card className="h-[400px] w-full bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl animate-pulse" />
    );

    return (
        <Card className="p-6 sm:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] h-[400px] w-full rounded-3xl relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 p-32 bg-blue-500/10 rounded-full blur-3xl -mt-24 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Net Worth Trend</h3>
                        <p className="text-slate-400 text-sm">Wealth accumulation over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            +12.5% this year
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                            <XAxis
                                dataKey="snapshot_date"
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
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area
                                type="monotone"
                                dataKey="net_worth"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorNetWorth)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};
