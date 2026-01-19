import { Sparkles, Lightbulb, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { WidgetSkeleton } from '../skeletons/WidgetSkeleton'

interface Recommendation {
    id: string
    type: 'tip' | 'warning' | 'opportunity'
    title: string
    description: string
    action?: string
}

export function AIRecommendationsWidget() {
    const [generating, setGenerating] = useState(false)
    const [recs, setRecs] = useState<Recommendation[]>([
        {
            id: '1',
            type: 'opportunity',
            title: 'Savings Opportunity',
            description: 'You could save RM 450/month by refinancing your car loan at a lower rate.',
            action: 'View Loan Options'
        },
        {
            id: '2',
            type: 'tip',
            title: 'Budget Optimization',
            description: 'Your dining expenses are 30% higher than similar users. Consider meal planning.',
            action: 'Set Budget'
        },
        {
            id: '3',
            type: 'warning',
            title: 'Emergency Fund',
            description: 'Your emergency fund covers only 2 months. Aim for 6 months of expenses.',
            action: 'Create Goal'
        }
    ])

    const handleRefresh = async () => {
        setGenerating(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setGenerating(false)
    }

    const dismissRec = (id: string) => {
        setRecs(prev => prev.filter(r => r.id !== id))
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'opportunity':
                return <TrendingUp className="w-5 h-5" />
            case 'warning':
                return <AlertCircle className="w-5 h-5" />
            default:
                return <Lightbulb className="w-5 h-5" />
        }
    }

    const getColors = (type: string) => {
        switch (type) {
            case 'opportunity':
                return {
                    bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    icon: 'text-green-600 dark:text-green-400',
                    button: 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                }
            case 'warning':
                return {
                    bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
                    border: 'border-yellow-200 dark:border-yellow-800',
                    icon: 'text-yellow-600 dark:text-yellow-400',
                    button: 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }
            default:
                return {
                    bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                    border: 'border-purple-200 dark:border-purple-800',
                    icon: 'text-purple-600 dark:text-purple-400',
                    button: 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }
        }
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={generating}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500"
                >
                    <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-auto space-y-3">
                {generating ? (
                    <WidgetSkeleton type="list" />
                ) : (
                    <AnimatePresence mode="popLayout">
                        {recs.map((rec, index) => {
                            const colors = getColors(rec.type)
                            return (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className={`p-4 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} relative group shadow-sm`}
                                >
                                    <button
                                        onClick={() => dismissRec(rec.id)}
                                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        ×
                                    </button>
                                    <div className="flex items-start gap-3">
                                        <div className={`${colors.icon} mt-1`}>
                                            {getIcon(rec.type)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{rec.title}</h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{rec.description}</p>
                                            {rec.action && (
                                                <button className={`text-sm font-medium ${colors.button} px-3 py-1 rounded-lg transition-colors`}>
                                                    {rec.action} →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
                {!generating && recs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                        <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">All caught up! Refresh for new insights.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
