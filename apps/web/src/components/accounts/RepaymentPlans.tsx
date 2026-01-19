import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sparkles, TrendingDown, DollarSign, Calendar, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RepaymentPlansProps {
    currentBalance: number
    interestRate: number
    minimumPayment: number
}

interface RepaymentScenario {
    name: string
    monthlyPayment: number
    totalMonths: number
    totalInterest: number
    totalPaid: number
    description: string
    icon: any
    color: string
}

export function RepaymentPlans({ currentBalance, interestRate, minimumPayment }: RepaymentPlansProps) {
    const [selectedPlan, setSelectedPlan] = useState<number>(1)
    const [loading, setLoading] = useState(false)

    // Calculate repayment scenarios
    const calculateScenarios = (): RepaymentScenario[] => {
        const monthlyRate = interestRate / 100 / 12

        // Scenario 1: Minimum Payment Only
        let balance1 = currentBalance
        let months1 = 0
        let totalInterest1 = 0
        while (balance1 > 0 && months1 < 360) {
            const interest = balance1 * monthlyRate
            const principal = minimumPayment - interest
            if (principal <= 0) break
            balance1 -= principal
            totalInterest1 += interest
            months1++
        }

        // Scenario 2: Aggressive (Pay off in 12 months)
        const months2 = 12
        const monthlyPayment2 = (currentBalance * monthlyRate * Math.pow(1 + monthlyRate, months2)) /
            (Math.pow(1 + monthlyRate, months2) - 1)
        const totalPaid2 = monthlyPayment2 * months2
        const totalInterest2 = totalPaid2 - currentBalance

        // Scenario 3: Balanced (Pay off in 24 months)
        const months3 = 24
        const monthlyPayment3 = (currentBalance * monthlyRate * Math.pow(1 + monthlyRate, months3)) /
            (Math.pow(1 + monthlyRate, months3) - 1)
        const totalPaid3 = monthlyPayment3 * months3
        const totalInterest3 = totalPaid3 - currentBalance

        return [
            {
                name: 'Minimum Payment',
                monthlyPayment: minimumPayment,
                totalMonths: months1,
                totalInterest: totalInterest1,
                totalPaid: currentBalance + totalInterest1,
                description: 'Pay only the minimum each month',
                icon: Calendar,
                color: 'red'
            },
            {
                name: 'Balanced Approach',
                monthlyPayment: monthlyPayment3,
                totalMonths: months3,
                totalInterest: totalInterest3,
                totalPaid: totalPaid3,
                description: 'Pay off in 2 years with moderate payments',
                icon: TrendingDown,
                color: 'blue'
            },
            {
                name: 'Aggressive Payoff',
                monthlyPayment: monthlyPayment2,
                totalMonths: months2,
                totalInterest: totalInterest2,
                totalPaid: totalPaid2,
                description: 'Pay off in 1 year to minimize interest',
                icon: Zap,
                color: 'green'
            }
        ]
    }

    const scenarios = calculateScenarios()
    const selected = scenarios[selectedPlan]

    // Generate chart data for selected scenario
    const generateChartData = (scenario: RepaymentScenario) => {
        const data = []
        let balance = currentBalance
        const monthlyRate = interestRate / 100 / 12

        for (let month = 0; month <= scenario.totalMonths; month++) {
            data.push({
                month,
                balance: Math.max(0, balance),
                principal: currentBalance - balance
            })

            if (balance > 0) {
                const interest = balance * monthlyRate
                const principal = scenario.monthlyPayment - interest
                balance -= principal
            }
        }

        return data
    }

    const chartData = generateChartData(selected)

    return (
        <div className="space-y-6">
            {/* AI Recommendation Banner */}
            <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Recommendation</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Based on your spending patterns and income, we recommend the <strong>Balanced Approach</strong>.
                            This will save you RM {(scenarios[0].totalInterest - scenarios[1].totalInterest).toFixed(2)} in interest
                            compared to minimum payments while keeping monthly payments manageable.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                            <Sparkles className="w-4 h-4" />
                            <span>Powered by AI Financial Analysis</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Scenario Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario, index) => {
                    const Icon = scenario.icon
                    const isSelected = selectedPlan === index
                    const colorClasses = {
                        red: 'border-red-500/50 bg-red-500/5',
                        blue: 'border-blue-500/50 bg-blue-500/5',
                        green: 'border-green-500/50 bg-green-500/5'
                    }

                    return (
                        <Card
                            key={index}
                            className={`p-5 cursor-pointer transition-all ${isSelected
                                    ? `${colorClasses[scenario.color as keyof typeof colorClasses]} shadow-lg scale-105`
                                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-md'
                                }`}
                            onClick={() => setSelectedPlan(index)}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scenario.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                                        scenario.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            'bg-green-100 dark:bg-green-900/30'
                                    }`}>
                                    <Icon className={`w-5 h-5 ${scenario.color === 'red' ? 'text-red-600 dark:text-red-400' :
                                            scenario.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                                'text-green-600 dark:text-green-400'
                                        }`} />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{scenario.name}</h4>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{scenario.description}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Payment</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        RM {scenario.monthlyPayment.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Time</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {scenario.totalMonths} months
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Interest</span>
                                    <span className={`font-semibold ${scenario.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        RM {scenario.totalInterest.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                        Selected Plan
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>

            {/* Payoff Progress Chart */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payoff Progress: {selected.name}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#9CA3AF" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#EF4444" fillOpacity={1} fill="url(#colorBalance)" name="Remaining Balance" />
                        <Area type="monotone" dataKey="principal" stroke="#10B981" fillOpacity={1} fill="url(#colorPrincipal)" name="Paid Off" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            {/* Comparison Table */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Savings Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Plan</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Monthly</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Interest</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scenarios.map((scenario, index) => {
                                const savings = scenarios[0].totalInterest - scenario.totalInterest
                                return (
                                    <tr key={index} className="border-b border-gray-100 dark:border-white/5">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{scenario.name}</td>
                                        <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                                            RM {scenario.monthlyPayment.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                                            {scenario.totalMonths} mo
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                                            RM {scenario.totalInterest.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                                            {savings > 0 ? `RM ${savings.toFixed(2)}` : '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Action Button */}
            <div className="flex justify-end">
                <Button className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Set Up Auto-Payment for {selected.name}
                </Button>
            </div>
        </div>
    )
}
