
import { Card } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function IncomeExpenseChart() {
    const data = [
        { month: 'Jan', income: 12000, expense: 8500 },
        { month: 'Feb', income: 14000, expense: 9200 },
        { month: 'Mar', income: 13500, expense: 8800 },
        { month: 'Apr', income: 15000, expense: 10200 },
        { month: 'May', income: 16000, expense: 11000 },
        { month: 'Jun', income: 14500, expense: 9500 },
    ]

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Monthly Comparison</h3>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

                    <XAxis
                        dataKey="month"
                        stroke="#94A3B8"
                        style={{ fontSize: 12 }}
                    />

                    <YAxis
                        stroke="#94A3B8"
                        style={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1A1F3A',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            padding: 12
                        }}
                        labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                        itemStyle={{ color: '#94A3B8' }}
                    />

                    <Legend
                        wrapperStyle={{ paddingTop: 20 }}
                        iconType="circle"
                    />

                    <Bar
                        dataKey="income"
                        fill="url(#incomeBar)"
                        radius={[8, 8, 0, 0]}
                        name="Income"
                    />

                    <Bar
                        dataKey="expense"
                        fill="url(#expenseBar)"
                        radius={[8, 8, 0, 0]}
                        name="Expense"
                    />

                    <defs>
                        <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
