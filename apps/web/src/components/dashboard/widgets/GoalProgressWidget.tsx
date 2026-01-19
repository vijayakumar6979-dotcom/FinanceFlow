import { useState, useEffect } from 'react'
import { Target, TrendingUp, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'

interface Goal {
    id: string
    name: string
    target_amount: number
    current_amount: number
    target_date: string
    icon: string
}

import confetti from 'canvas-confetti'

export function GoalProgressWidget() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .limit(4)

            const fetchedGoals = data || []
            setGoals(fetchedGoals)

            // Celebrate recently completed goals
            fetchedGoals.forEach(goal => {
                if (goal.current_amount >= goal.target_amount) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#0066FF', '#8B5CF6', '#EC4899']
                    })
                }
            })
        } catch (error) {
            console.error('Error fetching goals:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Progress</h3>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
                {goals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <Target className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No goals set</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Create a goal to start saving</p>
                    </div>
                ) : (
                    goals.map((goal, index) => {
                        const percentage = (goal.current_amount / goal.target_amount) * 100
                        const remaining = goal.target_amount - goal.current_amount

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{goal.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            RM {(remaining || 0).toLocaleString()} to go
                                        </p>
                                    </div>
                                    <div className="text-right font-mono">
                                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            {percentage.toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                <div className="relative h-4 bg-white dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                                        transition={{ delay: index * 0.1 + 0.2, duration: 1, ease: 'easeOut' }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm font-mono">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        RM {(goal.current_amount || 0).toLocaleString()}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        RM {(goal.target_amount || 0).toLocaleString()}
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
