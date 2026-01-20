import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface MiniChartCardProps {
    title: string
    amount: string
    data: { value: number }[]
    color: string
}

export function MiniChartCard({ title, amount, data, color }: MiniChartCardProps) {
    return (
        <div className="w-full h-full bg-[#1D203E] rounded-3xl p-5 flex flex-col">
            <h3 className="text-[#6E7399] text-xs font-medium mb-1">{title}</h3>
            <p className="text-white text-xl font-bold mb-4">{amount}</p>

            <div className="flex-1 w-full min-h-[50px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
