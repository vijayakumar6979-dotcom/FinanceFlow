import { motion } from 'framer-motion'
import { Gauge } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface FinancialHealthWidgetProps {
    score: number // 0-100
    components: {
        budgeting: number
        saving: number
        debt: number
        investing: number
    }
}

export function FinancialHealthWidget({ score, components }: FinancialHealthWidgetProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return { color: '#10B981', label: 'Excellent', gradient: 'from-green-500 to-emerald-500' }
        if (score >= 60) return { color: '#F59E0B', label: 'Good', gradient: 'from-yellow-500 to-amber-500' }
        if (score >= 40) return { color: '#F97316', label: 'Fair', gradient: 'from-orange-500 to-red-500' }
        return { color: '#EF4444', label: 'Needs Work', gradient: 'from-red-500 to-rose-500' }
    }

    const scoreData = getScoreColor(score)
    const circumference = 2 * Math.PI * 70 // radius = 70
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Health</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your overall score</p>
                </div>
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-48">
                    {/* Background circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="70"
                            stroke={scoreData.color}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            style={{
                                filter: `drop-shadow(0 0 8px ${scoreData.color})`
                            }}
                        />
                    </svg>

                    {/* Score in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                            className="text-center"
                        >
                            <p className="text-5xl font-bold" style={{ color: scoreData.color }}>
                                {score}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">out of 100</p>
                            <p className="text-xs font-semibold mt-2" style={{ color: scoreData.color }}>
                                {scoreData.label}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Component Breakdown */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Score Breakdown</h4>

                {[
                    { name: 'Budgeting', value: components.budgeting, color: '#3B82F6' },
                    { name: 'Saving', value: components.saving, color: '#10B981' },
                    { name: 'Debt Management', value: components.debt, color: '#F59E0B' },
                    { name: 'Investing', value: components.investing, color: '#8B5CF6' }
                ].map((component, index) => (
                    <div key={component.name}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{component.name}</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {component.value}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: component.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${component.value}%` }}
                                transition={{ delay: 0.2 * index, duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* View Details Link */}
            <button className="w-full mt-6 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                View Detailed Analysis →
            </button>
        </Card>
    )
}
