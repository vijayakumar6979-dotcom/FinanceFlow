
import { Card } from '@/components/ui/Card'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AIInsights() {
    const [insights, setInsights] = useState([
        {
            id: '1',
            type: 'saving_tip',
            priority: 'high',
            title: 'Reduce Food Expenses',
            content: 'Your food spending is 25% higher than similar users. Consider meal planning to save $200/month.',
            icon: AlertTriangle,
            color: '#F59E0B',
        },
        {
            id: '2',
            type: 'investment_suggestion',
            priority: 'medium',
            title: 'Investment Opportunity',
            content: 'You have $5,000 sitting idle. Consider investing in low-risk index funds for better returns.',
            icon: TrendingUp,
            color: '#10B981',
        },
        {
            id: '3',
            type: 'spending_pattern',
            priority: 'low',
            title: 'Subscription Alert',
            content: 'You have 3 streaming services costing $45/month. Consider consolidating to save $180/year.',
            icon: Lightbulb,
            color: '#0066FF',
        },
    ])

    const dismissInsight = (id: string) => {
        setInsights(insights.filter(insight => insight.id !== id))
    }

    return (
        <Card className="h-full">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles size={24} className="text-blue-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Insights</h3>
                <span className="ml-auto bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full">
                    Powered by Grok
                </span>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {insights.map((insight) => {
                        const IconComponent = insight.icon

                        return (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="relative p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
                                style={{
                                    background: `linear-gradient(135deg, ${insight.color}10 0%, transparent 100%)`
                                }}
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => dismissInsight(insight.id)}
                                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X size={16} className="text-slate-400 dark:text-gray-400" />
                                </button>

                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${insight.color}20` }}
                                    >
                                        <IconComponent size={20} color={insight.color} />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{insight.title}</h4>
                                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{insight.content}</p>

                                        <div className="flex items-center gap-2 mt-3">
                                            <button className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                                                style={{
                                                    color: insight.color,
                                                    backgroundColor: `${insight.color}20`
                                                }}
                                            >
                                                Learn More
                                            </button>
                                            <button
                                                onClick={() => dismissInsight(insight.id)}
                                                className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {insights.length === 0 && (
                    <div className="text-center py-8">
                        <Sparkles size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">All caught up! Check back later for more insights.</p>
                    </div>
                )}
            </div>
        </Card>
    )
}
