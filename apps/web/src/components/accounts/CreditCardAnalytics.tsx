import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, CreditCard, AlertCircle, Sparkles, DollarSign, Calendar, Percent } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CreditCardAnalyticsProps {
    accountId: string
    creditLimit: number
    currentBalance: number
    dueDate: string
    minimumPayment: number
}

export function CreditCardAnalytics({
    accountId,
    creditLimit,
    currentBalance,
    dueDate,
    minimumPayment
}: CreditCardAnalyticsProps) {
    const [loading, setLoading] = useState(false)
    const [insights, setInsights] = useState<any>(null)

    const utilization = (currentBalance / creditLimit) * 100
    const availableCredit = creditLimit - currentBalance

    // Mock spending data
    const spendingByCategory = [
        { name: 'Food & Dining', value: 450, color: '#EF4444' },
        { name: 'Shopping', value: 320, color: '#F59E0B' },
        { name: 'Transport', value: 180, color: '#10B981' },
        { name: 'Entertainment', value: 150, color: '#3B82F6' },
        { name: 'Bills', value: 200, color: '#8B5CF6' }
    ]

    const monthlySpending = [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1450 },
        { month: 'Mar', amount: 1300 },
        { month: 'Apr', amount: 1600 },
        { month: 'May', amount: 1400 },
        { month: 'Jun', amount: 1300 }
    ]

    const generateAIInsights = async () => {
        setLoading(true)
        // TODO: Call Grok API for AI insights
        await new Promise(resolve => setTimeout(resolve, 1500))

        setInsights({
            spendingPattern: 'Your spending peaks mid-month, averaging RM 1,400/month',
            optimization: 'Consider switching to a card with 3% cashback on dining',
            recommendation: 'Pay RM 500 extra this month to save RM 45 in interest'
        })
        setLoading(false)
    }

    useEffect(() => {
        generateAIInsights()
    }, [accountId])

    return (
        <div className="space-y-6">
            {/* Utilization Overview */}
            <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credit Utilization</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Keep below 30% for optimal credit score</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-3xl font-bold ${utilization > 70 ? 'text-red-600' : utilization > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {utilization.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            RM {currentBalance.toLocaleString()} / RM {creditLimit.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`absolute h-full transition-all ${utilization > 70 ? 'bg-red-500' : utilization > 30 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                            RM {availableCredit.toLocaleString()} available
                        </span>
                    </div>
                </div>

                {utilization > 30 && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            High utilization may impact your credit score. Consider paying down your balance.
                        </p>
                    </div>
                )}
            </Card>

            {/* AI Insights */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Insights</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Smart analysis of your credit card usage</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : insights ? (
                    <div className="space-y-3">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Spending Pattern</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{insights.spendingPattern}</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">Optimization Tip</p>
                            <p className="text-sm text-purple-700 dark:text-purple-300">{insights.optimization}</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">Recommendation</p>
                            <p className="text-sm text-green-700 dark:text-green-300">{insights.recommendation}</p>
                        </div>
                    </div>
                ) : null}
            </Card>

            {/* Spending by Category */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={spendingByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {spendingByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            {/* Monthly Spending Trend */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlySpending}>
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
                        <Bar dataKey="amount" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Payment Information */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{dueDate}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Minimum Payment</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">RM {minimumPayment.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Percent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">18% APR</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
