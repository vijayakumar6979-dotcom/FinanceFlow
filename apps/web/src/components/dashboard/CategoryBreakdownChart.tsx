
import { Card } from '@/components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export function CategoryBreakdownChart() {
    const data = [
        { name: 'Food & Dining', value: 2400, color: '#FF6B6B' },
        { name: 'Transportation', value: 1800, color: '#4ECDC4' },
        { name: 'Shopping', value: 1500, color: '#FF8B94' },
        { name: 'Entertainment', value: 1200, color: '#A8E6CF' },
        { name: 'Bills & Utilities', value: 2000, color: '#6C5CE7' },
        { name: 'Healthcare', value: 800, color: '#FFD93D' },
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        if (percent < 0.05) return null

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <Card className="min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Category Breakdown</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">Total: ${total.toLocaleString()}</p>

            <div className="h-[320px] w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={CustomLabel}
                            outerRadius="80%"
                            innerRadius="50%"
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    style={{
                                        filter: 'drop-shadow(0 0 10px rgba(0,102,255,0.3))',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1A1F3A',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                padding: 12
                            }}
                            formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Value']}
                        />

                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-white text-xs mx-1">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}
