import { Card } from '@/components/ui/Card'
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, PieChart as PieIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface PortfolioAnalysisProps {
    portfolio: {
        totalValue: number
        totalCost: number
        totalGainLoss: number
        gainLossPercent: number
        holdings: {
            symbol: string
            name: string
            type: string
            value: number
            cost: number
            shares: number
        }[]
    }
}

export function PortfolioAnalysis({ portfolio }: PortfolioAnalysisProps) {
    // Calculate diversification
    const assetAllocation = portfolio.holdings.reduce((acc: any[], holding) => {
        const existing = acc.find(item => item.name === holding.type)
        if (existing) {
            existing.value += holding.value
        } else {
            acc.push({ name: holding.type, value: holding.value })
        }
        return acc
    }, [])

    const COLORS = ['#0066FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B']

    // AI Insights (mock)
    const insights = {
        healthScore: 78,
        riskLevel: 'Moderate',
        diversificationScore: 65,
        recommendations: [
            {
                type: 'diversification',
                message: 'Consider adding bonds or REITs to reduce portfolio volatility',
                priority: 'high'
            },
            {
                type: 'rebalancing',
                message: 'Your tech stocks are overweight. Consider rebalancing to target allocation.',
                priority: 'medium'
            },
            {
                type: 'opportunity',
                message: 'Dividend-paying stocks could provide steady income stream',
                priority: 'low'
            }
        ],
        topPerformers: portfolio.holdings
            .map(h => ({ ...h, gainPercent: ((h.value - h.cost) / h.cost) * 100 }))
            .sort((a, b) => b.gainPercent - a.gainPercent)
            .slice(0, 3),
        underperformers: portfolio.holdings
            .map(h => ({ ...h, gainPercent: ((h.value - h.cost) / h.cost) * 100 }))
            .sort((a, b) => a.gainPercent - b.gainPercent)
            .slice(0, 3)
    }

    return (
        <div className="space-y-6">
            {/* Portfolio Health Score */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Portfolio Health Score</h3>
                        <p className="text-gray-600 dark:text-gray-400">AI-powered analysis of your investment portfolio</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{insights.healthScore}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">out of 100</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Level</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{insights.riskLevel}</p>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Diversification</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{insights.diversificationScore}%</p>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Return</p>
                        <p className={`text-lg font-bold ${portfolio.gainLossPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {portfolio.gainLossPercent >= 0 ? '+' : ''}{portfolio.gainLossPercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </Card>

            {/* Asset Allocation */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Allocation</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={assetAllocation}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {assetAllocation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2">
                        {assetAllocation.map((item, index) => {
                            const percentage = (item.value / portfolio.totalValue) * 100
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            RM {item.value.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
                </div>

                <div className="space-y-3">
                    {insights.recommendations.map((rec, index) => {
                        const priorityColors = {
                            high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
                            medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
                            low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                        }

                        return (
                            <div key={index} className={`p-4 rounded-lg border ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium mb-1 capitalize">{rec.type}</p>
                                        <p className="text-sm">{rec.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
                    </div>
                    <div className="space-y-3">
                        {insights.topPerformers.map((holding, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{holding.symbol}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{holding.name}</p>
                                </div>
                                <p className="font-bold text-green-600 dark:text-green-400">
                                    +{holding.gainPercent.toFixed(2)}%
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Underperformers */}
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Needs Attention</h3>
                    </div>
                    <div className="space-y-3">
                        {insights.underperformers.map((holding, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{holding.symbol}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{holding.name}</p>
                                </div>
                                <p className="font-bold text-red-600 dark:text-red-400">
                                    {holding.gainPercent.toFixed(2)}%
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
