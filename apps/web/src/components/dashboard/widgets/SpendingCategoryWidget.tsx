import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { DollarSign } from 'lucide-react'

const COLORS = ['#0066FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4']

export function SpendingCategoryWidget() {
    // Mock data - TODO: Replace with real data from Supabase
    const data = [
        { name: 'Food & Dining', value: 1200, color: COLORS[0] },
        { name: 'Shopping', value: 800, color: COLORS[1] },
        { name: 'Transportation', value: 500, color: COLORS[2] },
        { name: 'Entertainment', value: 400, color: COLORS[3] },
        { name: 'Bills', value: 600, color: COLORS[4] },
        { name: 'Other', value: 300, color: COLORS[5] }
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="60%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, 'Amount']}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="w-full mt-4 space-y-2">
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1)
                        return (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 text-xs font-mono">{percentage}%</span>
                                    <span className="font-bold text-gray-900 dark:text-white font-mono">RM {(item.value || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
