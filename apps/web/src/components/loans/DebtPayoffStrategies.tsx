import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Zap, TrendingDown, Calculator, DollarSign, Calendar, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Loan {
    id: string
    name: string
    principal: number
    currentBalance: number
    interestRate: number
    monthlyPayment: number
    remainingMonths: number
}

interface DebtPayoffStrategiesProps {
    loans: Loan[]
}

type Strategy = 'snowball' | 'avalanche' | 'custom'

export function DebtPayoffStrategies({ loans }: DebtPayoffStrategiesProps) {
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('avalanche')

    // Calculate strategies
    const calculateSnowball = () => {
        // Sort by balance (smallest first)
        const sorted = [...loans].sort((a, b) => a.currentBalance - b.currentBalance)
        return calculatePayoffPlan(sorted, 'snowball')
    }

    const calculateAvalanche = () => {
        // Sort by interest rate (highest first)
        const sorted = [...loans].sort((a, b) => b.interestRate - a.interestRate)
        return calculatePayoffPlan(sorted, 'avalanche')
    }

    const calculatePayoffPlan = (sortedLoans: Loan[], strategyName: string) => {
        let totalMonths = 0
        let totalInterest = 0
        const timeline: any[] = []

        sortedLoans.forEach((loan, index) => {
            const monthlyRate = loan.interestRate / 100 / 12
            let balance = loan.currentBalance
            let months = 0
            let interest = 0

            while (balance > 0 && months < 360) {
                const interestPayment = balance * monthlyRate
                const principalPayment = loan.monthlyPayment - interestPayment

                if (principalPayment <= 0) break

                balance -= principalPayment
                interest += interestPayment
                months++
            }

            totalMonths = Math.max(totalMonths, months)
            totalInterest += interest

            timeline.push({
                name: loan.name,
                months,
                interest,
                order: index + 1
            })
        })

        return {
            strategy: strategyName,
            totalMonths,
            totalInterest,
            timeline,
            monthlySavings: 0 // Calculate vs minimum payments
        }
    }

    const snowballPlan = calculateSnowball()
    const avalanchePlan = calculateAvalanche()

    const strategies = [
        {
            id: 'snowball' as Strategy,
            name: 'Debt Snowball',
            description: 'Pay off smallest debts first for quick wins',
            icon: Zap,
            color: 'blue',
            plan: snowballPlan,
            pros: ['Quick psychological wins', 'Builds momentum', 'Simplifies finances faster'],
            cons: ['May pay more interest overall', 'Takes longer than avalanche']
        },
        {
            id: 'avalanche' as Strategy,
            name: 'Debt Avalanche',
            description: 'Pay off highest interest debts first to save money',
            icon: TrendingDown,
            color: 'green',
            plan: avalanchePlan,
            pros: ['Saves most money on interest', 'Mathematically optimal', 'Fastest debt freedom'],
            cons: ['Slower initial progress', 'Requires discipline']
        },
        {
            id: 'custom' as Strategy,
            name: 'Custom Strategy',
            description: 'Create your own personalized payoff plan',
            icon: Target,
            color: 'purple',
            plan: null,
            pros: ['Tailored to your situation', 'Flexible approach', 'Combines best of both'],
            cons: ['Requires more planning', 'May not be optimal']
        }
    ]

    const selectedPlan = strategies.find(s => s.id === selectedStrategy)

    // Comparison chart data
    const comparisonData = [
        {
            metric: 'Time to Debt Free',
            Snowball: snowballPlan.totalMonths,
            Avalanche: avalanchePlan.totalMonths
        },
        {
            metric: 'Total Interest',
            Snowball: snowballPlan.totalInterest / 100, // Scale down for visualization
            Avalanche: avalanchePlan.totalInterest / 100
        }
    ]

    return (
        <div className="space-y-6">
            {/* Strategy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {strategies.map((strategy) => {
                    const Icon = strategy.icon
                    const isSelected = selectedStrategy === strategy.id
                    const colorClasses = {
                        blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30',
                        green: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
                        purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/30'
                    }

                    return (
                        <motion.div
                            key={strategy.id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-5 cursor-pointer transition-all ${isSelected
                                ? `bg-gradient-to-br ${colorClasses[strategy.color as keyof typeof colorClasses]} shadow-lg`
                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-md'
                                }`}
                            onClick={() => setSelectedStrategy(strategy.id)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${strategy.color === 'blue' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                                    strategy.color === 'green' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                                        'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{strategy.name}</h3>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{strategy.description}</p>

                            {strategy.plan && (
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Time to Freedom</span>
                                        <span className="font-semibold text-gray-900 dark:text-white font-mono">
                                            {strategy.plan.totalMonths} months
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                                        <span className="font-semibold text-gray-900 dark:text-white font-mono">
                                            RM {strategy.plan.totalInterest.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                        Selected Strategy
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Selected Strategy Details */}
            {selectedPlan?.plan && (
                <>
                    {/* Payoff Timeline */}
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Payoff Timeline: {selectedPlan.name}
                        </h3>
                        <div className="space-y-3">
                            {selectedPlan.plan.timeline.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{item.order}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.months} months
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                                                style={{ width: `${(item.months / selectedPlan.plan.totalMonths) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right font-mono">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            RM {item.interest.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">interest</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Advantages</h4>
                            <ul className="space-y-2">
                                {selectedPlan.pros.map((pro, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                                        <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Considerations</h4>
                            <ul className="space-y-2">
                                {selectedPlan.cons.map((con, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                                        <span className="text-red-600 dark:text-red-400 mt-0.5">!</span>
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </>
            )}

            {/* Comparison Chart */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strategy Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="metric" stroke="#9CA3AF" />
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
                        <Bar dataKey="Snowball" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Avalanche" fill="#10B981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Action Button */}
            <div className="flex justify-end">
                <Button
                    className="gap-2 shadow-glow-blue"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Calculator className="w-4 h-4" />
                    Apply {selectedPlan?.name} Strategy
                </Button>
            </div>
        </div>
    )
}
