import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trophy, Target, Sparkles, TrendingUp, Calendar, DollarSign, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Milestone {
    id: string
    percentage: number
    label: string
    reached: boolean
    date?: string
    reward?: string
}

interface MilestoneTrackerProps {
    goalId: string
    goalName: string
    targetAmount: number
    currentAmount: number
    onMilestoneReached?: (milestone: Milestone) => void
}

export function MilestoneTracker({
    goalId,
    goalName,
    targetAmount,
    currentAmount,
    onMilestoneReached
}: MilestoneTrackerProps) {
    const progress = (currentAmount / targetAmount) * 100

    const [milestones] = useState<Milestone[]>([
        {
            id: '1',
            percentage: 25,
            label: 'Great Start!',
            reached: progress >= 25,
            reward: 'Keep going! You\'re building momentum.'
        },
        {
            id: '2',
            percentage: 50,
            label: 'Halfway There!',
            reached: progress >= 50,
            reward: 'Amazing progress! You\'re halfway to your goal.'
        },
        {
            id: '3',
            percentage: 75,
            label: 'Almost There!',
            reached: progress >= 75,
            reward: 'You\'re so close! Just a little more to go.'
        },
        {
            id: '4',
            percentage: 100,
            label: 'Goal Achieved!',
            reached: progress >= 100,
            reward: 'Congratulations! You did it! 🎉'
        }
    ])

    const triggerCelebration = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const nextMilestone = milestones.find(m => !m.reached)
    const lastReachedMilestone = milestones.filter(m => m.reached).pop()

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestone Progress</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goalName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            {progress.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            RM {currentAmount.toLocaleString()} / RM {targetAmount.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute h-full bg-gradient-to-r from-primary-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                    {/* Milestone Markers */}
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.id}
                            className="absolute top-0 bottom-0 w-1 bg-white dark:bg-gray-900"
                            style={{ left: `${milestone.percentage}%` }}
                        />
                    ))}
                </div>

                {/* Next Milestone Info */}
                {nextMilestone && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Next Milestone: {nextMilestone.label} ({nextMilestone.percentage}%)
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    RM {((targetAmount * nextMilestone.percentage) / 100 - currentAmount).toLocaleString()} more to go
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Milestone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((milestone, index) => {
                    const isNext = nextMilestone?.id === milestone.id
                    const amount = (targetAmount * milestone.percentage) / 100

                    return (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`p-5 transition-all ${milestone.reached
                                        ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-lg'
                                        : isNext
                                            ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                                            : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${milestone.reached
                                                ? 'bg-green-500/20'
                                                : isNext
                                                    ? 'bg-blue-500/20'
                                                    : 'bg-gray-100 dark:bg-gray-800'
                                            }`}
                                    >
                                        {milestone.reached ? (
                                            <Trophy className="w-7 h-7 text-green-600 dark:text-green-400" />
                                        ) : isNext ? (
                                            <Zap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <Target className="w-7 h-7 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{milestone.label}</h4>
                                            {milestone.reached && (
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                                    ✓ Reached
                                                </span>
                                            )}
                                            {isNext && (
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                                    Next
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    RM {amount.toLocaleString()} ({milestone.percentage}%)
                                                </span>
                                            </div>

                                            {milestone.reached && milestone.date && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        Reached on {new Date(milestone.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}

                                            {milestone.reward && (
                                                <p className={`text-sm ${milestone.reached ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {milestone.reward}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {milestone.reached && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mt-4 pt-4 border-t border-green-200 dark:border-green-800"
                                    >
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full gap-2"
                                            onClick={triggerCelebration}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Celebrate Again!
                                        </Button>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Achievement Banner */}
            <AnimatePresence>
                {lastReachedMilestone && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <Card className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center">
                                    <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {lastReachedMilestone.label}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {lastReachedMilestone.reward}
                                    </p>
                                </div>
                                <Button className="gap-2" onClick={triggerCelebration}>
                                    <Sparkles className="w-4 h-4" />
                                    Celebrate
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
