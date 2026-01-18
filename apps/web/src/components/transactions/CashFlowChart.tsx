import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCategoryBreakdown } from '@/hooks/useTransactions';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export function CashFlowChart() {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    const { data: breakdown } = useCategoryBreakdown(
        startDate.toISOString(),
        endDate.toISOString()
    );

    // Generate chart data (mock for now - in real app, aggregate by day)
    const chartData = useMemo(() => {
        const days = eachDayOfInterval({ start: startDate, end: currentDate });
        return days.map(day => ({
            date: format(day, 'MMM d'),
            income: Math.random() * 500 + 200,
            expenses: Math.random() * 400 + 100,
        }));
    }, [startDate, currentDate]);

    return (
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.18)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Cash Flow This Month</h3>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="#94A3B8"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#94A3B8"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1A1F3A',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#incomeGradient)"
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#expensesGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
