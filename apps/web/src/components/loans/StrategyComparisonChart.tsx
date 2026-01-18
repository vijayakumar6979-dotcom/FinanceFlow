import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { PayoffStrategyComparison, formatCurrency } from '@financeflow/shared';

interface StrategyComparisonChartProps {
    strategies: PayoffStrategyComparison;
}

export function StrategyComparisonChart({ strategies }: StrategyComparisonChartProps) {
    const data = [
        {
            name: 'Current Plan',
            interest: strategies.currentPlan.totalInterest,
            months: calculateMonthsToPayoff(strategies.currentPlan.payoffDate),
            color: '#6B7280'
        },
        {
            name: 'Snowball',
            interest: strategies.snowballMethod.totalInterest,
            months: calculateMonthsToPayoff(strategies.snowballMethod.payoffDate),
            savings: strategies.snowballMethod.interestSaved,
            color: '#3B82F6'
        },
        {
            name: 'Avalanche',
            interest: strategies.avalancheMethod.totalInterest,
            months: calculateMonthsToPayoff(strategies.avalancheMethod.payoffDate),
            savings: strategies.avalancheMethod.interestSaved,
            color: '#10B981'
        }
    ];

    function calculateMonthsToPayoff(payoffDate: string): number {
        const now = new Date();
        const target = new Date(payoffDate);
        const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
        return Math.max(0, months);
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-slate-900 dark:text-white mb-3">
                        {data.name}
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between gap-6">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Total Interest:</span>
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                {formatCurrency(data.interest)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Months to Payoff:</span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {data.months} months
                            </span>
                        </div>
                        {data.savings > 0 && (
                            <div className="flex justify-between gap-6 pt-2 border-t border-gray-200 dark:border-white/10">
                                <span className="text-sm text-green-700 dark:text-green-400">Savings:</span>
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(data.savings)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Interest Comparison */}
            <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">
                    Total Interest Paid
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                            tickFormatter={(value) => `RM ${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="interest" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Time Comparison */}
            <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">
                    Months to Debt Freedom
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="months" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Best for Savings</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {strategies.avalancheMethod.interestSaved >= strategies.snowballMethod.interestSaved ? 'Avalanche' : 'Snowball'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        Save {formatCurrency(Math.max(strategies.avalancheMethod.interestSaved, strategies.snowballMethod.interestSaved))}
                    </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Fastest Payoff</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {calculateMonthsToPayoff(strategies.avalancheMethod.payoffDate) <= calculateMonthsToPayoff(strategies.snowballMethod.payoffDate) ? 'Avalanche' : 'Snowball'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        {Math.min(calculateMonthsToPayoff(strategies.avalancheMethod.payoffDate), calculateMonthsToPayoff(strategies.snowballMethod.payoffDate))} months
                    </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Recommended</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {strategies.recommendation.bestStrategy === 'avalanche' ? 'Avalanche' : 'Snowball'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        AI-powered choice
                    </p>
                </div>
            </div>
        </div>
    );
}
