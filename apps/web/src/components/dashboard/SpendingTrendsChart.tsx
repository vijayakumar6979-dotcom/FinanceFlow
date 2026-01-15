
import { Card } from '@/components/ui/Card'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
// import { useTheme } from '@/hooks/useTheme' // Not available yet, using mock theme/colors

export function SpendingTrendsChart() {
    // const { theme } = useTheme()

    const data = [
        { date: 'Jan 1', income: 4000, expense: 2400 },
        { date: 'Jan 5', income: 3000, expense: 1398 },
        { date: 'Jan 10', income: 2000, expense: 3800 },
        { date: 'Jan 15', income: 2780, expense: 3908 },
        { date: 'Jan 20', income: 1890, expense: 4800 },
        { date: 'Jan 25', income: 2390, expense: 3800 },
        { date: 'Jan 30', income: 3490, expense: 4300 },
    ]

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload) return null

        return (
            <div className="backdrop-blur-xl bg-dark-elevated/90 border border-white/10 rounded-xl p-4 shadow-lg">
                <p className="text-white font-semibold mb-2">{payload[0].payload.date}</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-400 text-sm">Income:</span>
                        <span className="text-white font-medium">${payload[0].value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-400 text-sm">Expense:</span>
                        <span className="text-white font-medium">${payload[1].value.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card className="h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spending Trends</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Income vs Expenses over time</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-slate-500 dark:text-gray-400">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm text-slate-500 dark:text-gray-400">Expense</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

                    <XAxis
                        dataKey="date"
                        stroke="#94A3B8"
                        style={{ fontSize: 12 }}
                    />

                    <YAxis
                        stroke="#94A3B8"
                        style={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#incomeGradient)"
                        dot={{ fill: '#10B981', r: 4 }}
                        activeDot={{ r: 6, fill: '#10B981' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        strokeWidth={3}
                        fill="url(#expenseGradient)"
                        dot={{ fill: '#EF4444', r: 4 }}
                        activeDot={{ r: 6, fill: '#EF4444' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    )
}
