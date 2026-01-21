
import React from 'react';
import { Card } from '@/components/ui/Card';
import { useDashboard } from '@/context/DashboardContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const mockData = [
    { day: '1', income: 4000, expense: 2400 },
    { day: '5', income: 3000, expense: 1398 },
    { day: '10', income: 2000, expense: 9800 },
    { day: '15', income: 2780, expense: 3908 },
    { day: '20', income: 1890, expense: 4800 },
    { day: '25', income: 2390, expense: 3800 },
    { day: '29', income: 3490, expense: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Day {label}</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-300 text-sm">Income:</span>
                        <span className="text-white font-bold text-sm ml-auto">{formatCurrency(payload[0].value)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-slate-300 text-sm">Expense:</span>
                        <span className="text-white font-bold text-sm ml-auto">{formatCurrency(payload[1].value)}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const IncomeExpensePulse = () => {
    const { cycleMode, setCycleMode, formatDateRange } = useDashboard();

    return (
        <Card className="col-span-12 lg:col-span-8 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl relative overflow-hidden group">
            {/* Glows */}
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-32 bg-rose-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary-400" />
                            The Pulse
                        </h3>
                        <p className="text-slate-400 text-sm">{formatDateRange()}</p>
                    </div>

                    <div className="flex bg-slate-900/50 backdrop-blur-sm p-1 rounded-xl border border-white/5">
                        {(['cycle', 'week', 'month', 'year'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setCycleMode(mode)}
                                className={`px - 4 py - 1.5 rounded - lg text - xs font - bold capitalize transition - all ${cycleMode === mode
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    } `}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                tickFormatter={(val) => `${val / 1000} k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#F43F5E"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
}
