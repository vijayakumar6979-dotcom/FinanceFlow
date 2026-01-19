import { useState, useEffect } from 'react'
import { Target, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'

interface Budget {
    id: string
    category: string
    budget_amount: number
    spent_amount: number
    color: string
}

export function BudgetProgressWidget() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBudgets()
    }, [])

    const fetchBudgets = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('budgets')
                .select('*')
                .eq('user_id', user.id)
                .limit(6)

            setBudgets(data || [])
        } catch (error) {
            console.error('Error fetching budgets:', error)
        } finally {
            setLoading(false)
        }
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'from-red-500 to-rose-500'
        if (percentage >= 80) return 'from-yellow-500 to-amber-500'
        return 'from-green-500 to-emerald-500'
    }

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
                {budgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <Target className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No budgets set</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Create a budget to track spending</p>
                    </div>
                ) : (
                    budgets.map((budget, index) => {
                        const budgetAmt = budget.budget_amount || 0
                        const spentAmt = budget.spent_amount || 0
                        const percentage = budgetAmt > 0 ? (spentAmt / budgetAmt) * 100 : 0
                        const remaining = budgetAmt - spentAmt

                        return (
                            <motion.div
                                key={budget.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 dark:text-white">{budget.category}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>

                                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(percentage)} rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm font-mono">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        RM {spentAmt.toLocaleString()} / RM {budgetAmt.toLocaleString()}
                                    </span>
                                    <span className={remaining >= 0 ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                                        {remaining >= 0 ? 'RM ' + remaining.toLocaleString() + ' left' : 'RM ' + Math.abs(remaining).toLocaleString() + ' over'}
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
