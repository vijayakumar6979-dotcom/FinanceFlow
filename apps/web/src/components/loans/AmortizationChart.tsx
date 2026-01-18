import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { AmortizationScheduleEntry } from '@financeflow/shared';

interface AmortizationChartProps {
    schedule: AmortizationScheduleEntry[];
}

export function AmortizationChart({ schedule }: AmortizationChartProps) {
    const chartData = useMemo(() => {
        // Sample every Nth payment for better performance and readability
        const sampleRate = Math.max(1, Math.floor(schedule.length / 50));

        return schedule
            .filter((_, index) => index % sampleRate === 0 || index === schedule.length - 1)
            .map(entry => ({
                payment: entry.payment_number,
                date: new Date(entry.payment_date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
                principal: parseFloat(entry.principal_amount.toFixed(2)),
                interest: parseFloat(entry.interest_amount.toFixed(2)),
                balance: parseFloat(entry.remaining_balance.toFixed(2))
            }));
    }, [schedule]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Payment #{payload[0].payload.payment}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-300 mb-2">
                        {payload[0].payload.date}
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-xs text-green-600 dark:text-green-400">Principal:</span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                RM {payload[0].value.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-xs text-red-600 dark:text-red-400">Interest:</span>
                            <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                RM {payload[1].value.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1 border-t border-gray-200 dark:border-white/10">
                            <span className="text-xs text-slate-600 dark:text-gray-300">Balance:</span>
                            <span className="text-xs font-medium text-slate-900 dark:text-white">
                                RM {payload[0].payload.balance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                        tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    />
                    <YAxis
                        tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                        tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        tickFormatter={(value) => `RM ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-sm text-slate-600 dark:text-gray-300">{value}</span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="principal"
                        stackId="1"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#colorPrincipal)"
                        name="Principal"
                    />
                    <Area
                        type="monotone"
                        dataKey="interest"
                        stackId="1"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fill="url(#colorInterest)"
                        name="Interest"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
