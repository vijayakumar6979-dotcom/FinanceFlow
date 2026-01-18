import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@financeflow/shared';

interface PaymentBreakdownChartProps {
    principal: number;
    interest: number;
    totalPayment: number;
}

export function PaymentBreakdownChart({ principal, interest, totalPayment }: PaymentBreakdownChartProps) {
    const data = [
        { name: 'Principal', value: principal, color: '#10B981' },
        { name: 'Interest', value: interest, color: '#EF4444' }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / totalPayment) * 100).toFixed(1);
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {payload[0].name}
                    </p>
                    <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        {percentage}% of payment
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                            <span className="text-sm text-slate-600 dark:text-gray-300">
                                {value}: {formatCurrency(entry.payload.value)}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="text-center -mt-40">
                <p className="text-xs text-slate-500 dark:text-gray-400">Total Payment</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalPayment)}
                </p>
            </div>
        </div>
    );
}
