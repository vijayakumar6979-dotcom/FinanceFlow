import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';

interface PaymentTrendChartProps {
    payments: any[];
    currency: string;
}

export function PaymentTrendChart({ payments, currency }: PaymentTrendChartProps) {
    const chartData = useMemo(() => {
        // Group payments by month
        const monthlyData: Record<string, { total: number; count: number }> = {};

        payments.forEach(payment => {
            if (payment.paid_date) {
                const month = payment.paid_date.slice(0, 7); // YYYY-MM
                if (!monthlyData[month]) {
                    monthlyData[month] = { total: 0, count: 0 };
                }
                monthlyData[month].total += payment.amount;
                monthlyData[month].count += 1;
            }
        });

        // Convert to array and sort by date
        const data = Object.entries(monthlyData)
            .map(([month, stats]) => ({
                month,
                total: stats.total,
                average: stats.total / stats.count,
                count: stats.count
            }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12); // Last 12 months

        return data;
    }, [payments]);

    if (chartData.length === 0) {
        return (
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Trend</h3>
                <p className="text-center text-slate-500 py-8">No payment history available</p>
            </Card>
        );
    }

    // Calculate max value for scaling
    const maxAmount = Math.max(...chartData.map(d => d.total));
    const minAmount = Math.min(...chartData.map(d => d.total));

    // Calculate trend
    const firstAmount = chartData[0]?.total || 0;
    const lastAmount = chartData[chartData.length - 1]?.total || 0;
    const trendPercentage = firstAmount > 0
        ? ((lastAmount - firstAmount) / firstAmount) * 100
        : 0;
    const isIncreasing = trendPercentage > 0;

    // Month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Trend</h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isIncreasing
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    }`}>
                    {isIncreasing ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-medium">
                        {Math.abs(trendPercentage).toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-48 mb-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-slate-500">
                    <span>{formatCurrency(maxAmount, currency)}</span>
                    <span>{formatCurrency(maxAmount / 2, currency)}</span>
                    <span>{formatCurrency(0, currency)}</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-20 right-0 top-0 bottom-0 flex items-end gap-1">
                    {chartData.map((data, index) => {
                        const height = maxAmount > 0 ? (data.total / maxAmount) * 100 : 0;
                        const [year, month] = data.month.split('-');
                        const monthName = monthNames[parseInt(month) - 1];

                        return (
                            <div key={data.month} className="flex-1 flex flex-col items-center group">
                                {/* Bar */}
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-500 cursor-pointer"
                                        style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                                <div className="font-semibold">{monthName} {year}</div>
                                                <div>{formatCurrency(data.total, currency)}</div>
                                                <div className="text-slate-300 dark:text-slate-600">{data.count} payment{data.count !== 1 ? 's' : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* X-axis label */}
                                <span className="text-xs text-slate-500 mt-2">
                                    {monthName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div>
                    <p className="text-xs text-slate-500">Average</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(chartData.reduce((sum, d) => sum + d.average, 0) / chartData.length, currency)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Highest</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(maxAmount, currency)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Lowest</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(minAmount, currency)}
                    </p>
                </div>
            </div>
        </Card>
    );
}
