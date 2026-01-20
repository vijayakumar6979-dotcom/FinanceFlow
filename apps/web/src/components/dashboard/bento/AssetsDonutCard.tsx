import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export function AssetsDonutCard() {
    const data = [
        { name: 'Gold', value: 15700, color: '#FF5E62' },
        { name: 'Stock', value: 22500, color: '#7B61FF' },
        { name: 'Land', value: 135000, color: '#4ADE80' },
        { name: 'Warehouse', value: 120000, color: '#06B6D4' },
    ]

    return (
        <div className="w-full h-full bg-[#1D203E] rounded-3xl p-6 flex flex-col justify-between">
            <h3 className="text-white text-sm font-medium mb-4">Assets</h3>

            <div className="flex-1 min-h-[150px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1D203E', borderRadius: '12px', border: 'none' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text (Optional) */}
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                {data.map(item => (
                    <div key={item.name}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-[#6E7399] text-xs">{item.name}</span>
                        </div>
                        <p className="text-white font-bold text-sm">${item.value.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
