import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

export function NetWorthTrendWidget() {
    // Mock data - TODO: Replace with real historical data
    const data = [
        { month: 'Jan', netWorth: 180000 },
        { month: 'Feb', netWorth: 185000 },
        { month: 'Mar', netWorth: 192000 },
        { month: 'Apr', netWorth: 198000 },
        { month: 'May', netWorth: 210000 },
        { month: 'Jun', netWorth: 225000 }
    ]

    const currentNetWorth = data[data.length - 1].netWorth
    const previousNetWorth = data.length > 1 ? data[data.length - 2].netWorth : currentNetWorth
    const change = ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Net Worth Trend</h3>
                </div>
                <div className="text-right font-mono">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        RM {(currentNetWorth || 0).toLocaleString()}
                    </p>
                    <p className={`text-sm ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}% this month
                    </p>
                </div>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                            labelStyle={{ color: '#9CA3AF', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}
                            formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, 'Net Worth']}
                        />
                        <Line
                            type="monotone"
                            dataKey="netWorth"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
