import { Card } from '@/components/ui/Card'
import { Gauge, TrendingUp, TrendingDown, DollarSign, Target, CreditCard, PieChart as PieIcon } from 'lucide-react'

interface FinancialHealthScoreProps {
    userData: {
        monthlyIncome: number
        monthlyExpenses: number
        totalSavings: number
        totalDebt: number
        budgetAdherence: number
        savingsRate: number
        debtToIncomeRatio: number
        emergencyFundMonths: number
    }
}

export function FinancialHealthScore({ userData }: FinancialHealthScoreProps) {
    // Calculate component scores (0-100)
    const budgetingScore = Math.min(userData.budgetAdherence, 100)
    const savingScore = Math.min((userData.savingsRate / 30) * 100, 100) // 30% savings rate = 100 score
    const debtScore = Math.max(100 - (userData.debtToIncomeRatio * 2), 0) // Lower debt = higher score
    const investingScore = userData.totalSavings > 0 ? Math.min((userData.totalSavings / (userData.monthlyIncome * 6)) * 100, 100) : 0

    // Overall health score (weighted average)
    const overallScore = Math.round(
        (budgetingScore * 0.25) +
        (savingScore * 0.30) +
        (debtScore * 0.25) +
        (investingScore * 0.20)
    )

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400'
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-red-600 dark:text-red-400'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Needs Improvement'
    }

    const components = [
        {
            name: 'Budgeting',
            score: budgetingScore,
            icon: PieIcon,
            description: 'How well you stick to your budget',
            color: 'blue'
        },
        {
            name: 'Saving',
            score: savingScore,
            icon: TrendingUp,
            description: 'Your savings rate and emergency fund',
            color: 'green'
        },
        {
            name: 'Debt Management',
            score: debtScore,
            icon: CreditCard,
            description: 'Debt-to-income ratio and payments',
            color: 'orange'
        },
        {
            name: 'Investing',
            score: investingScore,
            icon: Target,
            description: 'Investment portfolio and growth',
            color: 'purple'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Overall Score */}
            <Card className="p-8 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Health Score</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your overall financial wellness rating
                        </p>
                    </div>
                    <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                            {overallScore}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">out of 100</p>
                        <p className={`text-lg font-semibold mt-2 ${getScoreColor(overallScore)}`}>
                            {getScoreLabel(overallScore)}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`absolute h-full transition-all ${overallScore >= 80 ? 'bg-green-500' :
                                overallScore >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                            }`}
                        style={{ width: `${overallScore}%` }}
                    />
                </div>
            </Card>

            {/* Component Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {components.map((component) => {
                    const Icon = component.icon
                    const colorClasses = {
                        blue: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
                        green: 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
                        orange: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
                        purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }

                    return (
                        <Card key={component.name} className="p-5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[component.color as keyof typeof colorClasses]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{component.name}</h3>
                                        <span className={`text-2xl font-bold ${getScoreColor(component.score)}`}>
                                            {Math.round(component.score)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{component.description}</p>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${component.score >= 80 ? 'bg-green-500' :
                                                    component.score >= 60 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${component.score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* AI Summary */}
            <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI Analysis</h3>
                <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">
                        {overallScore >= 80 ? (
                            <>
                                <strong className="text-green-600 dark:text-green-400">Excellent work!</strong> Your financial health is strong.
                                Continue maintaining your good habits and consider increasing your investment allocation for long-term growth.
                            </>
                        ) : overallScore >= 60 ? (
                            <>
                                <strong className="text-yellow-600 dark:text-yellow-400">You're on the right track!</strong> Focus on improving
                                your weakest areas. Consider increasing your savings rate and reducing unnecessary expenses.
                            </>
                        ) : (
                            <>
                                <strong className="text-red-600 dark:text-red-400">Time to take action.</strong> Your financial health needs attention.
                                Start by creating a realistic budget, building an emergency fund, and reducing high-interest debt.
                            </>
                        )}
                    </p>
                </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userData.savingsRate.toFixed(1)}%</p>
                </Card>
                <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Debt-to-Income</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userData.debtToIncomeRatio.toFixed(1)}%</p>
                </Card>
                <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Emergency Fund</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userData.emergencyFundMonths} mo</p>
                </Card>
                <Card className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Adherence</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userData.budgetAdherence.toFixed(0)}%</p>
                </Card>
            </div>
        </div>
    )
}
