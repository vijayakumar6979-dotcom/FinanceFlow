import { Card } from '@/components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface NetWorthTrackerProps {
    data: {
        month: string
        assets: number
        liabilities: number
        netWorth: number
    }[]
}

export function NetWorthTracker({ data }: NetWorthTrackerProps) {
    const latestData = data[data.length - 1]
    const previousData = data[data.length - 2]

    const netWorthChange = latestData.netWorth - (previousData?.netWorth || 0)
    const netWorthChangePercent = previousData ? ((netWorthChange / previousData.netWorth) * 100) : 0

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Assets</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                RM {latestData.assets.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Liabilities</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                RM {latestData.liabilities.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Worth</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                RM {latestData.netWorth.toLocaleString()}
                            </p>
                            <div className={`flex items-center gap-1 mt-1 ${netWorthChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                <span className="text-sm font-medium">
                                    {netWorthChange >= 0 ? '+' : ''}RM {Math.abs(netWorthChange).toLocaleString()}
                                </span>
                                <span className="text-xs">
                                    ({netWorthChangePercent >= 0 ? '+' : ''}{netWorthChangePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Chart */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Net Worth Over Time</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLiabilities" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="assets" stroke="#10B981" fillOpacity={1} fill="url(#colorAssets)" name="Assets" />
                        <Area type="monotone" dataKey="liabilities" stroke="#EF4444" fillOpacity={1} fill="url(#colorLiabilities)" name="Liabilities" />
                        <Area type="monotone" dataKey="netWorth" stroke="#0066FF" fillOpacity={1} fill="url(#colorNetWorth)" name="Net Worth" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}
