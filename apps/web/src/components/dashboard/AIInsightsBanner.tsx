import { useState, useEffect } from 'react'
import { X, Sparkles, TrendingUp, AlertCircle, Target, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface AIInsight {
    id: string
    type: 'success' | 'warning' | 'info' | 'tip'
    title: string
    message: string
    action?: {
        label: string
        onClick: () => void
    }
}

export function AIInsightsBanner() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDismissed, setIsDismissed] = useState(false)
    const [insights, setInsights] = useState<AIInsight[]>([])
    const [loading, setLoading] = useState(true)

    // Mock AI insights - TODO: Replace with Grok API call
    useEffect(() => {
        const fetchInsights = async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockInsights: AIInsight[] = [
                {
                    id: '1',
                    type: 'warning',
                    title: 'Spending Alert',
                    message: "You're spending 23% more on dining this month. Consider setting a budget of RM 800 to stay on track.",
                    action: {
                        label: 'Set Budget',
                        onClick: () => console.log('Navigate to budgets')
                    }
                },
                {
                    id: '2',
                    type: 'success',
                    title: 'Goal Progress',
                    message: "Great job! You're on track to reach your Emergency Fund goal 2 months early at this rate.",
                    action: {
                        label: 'View Goal',
                        onClick: () => console.log('Navigate to goals')
                    }
                },
                {
                    id: '3',
                    type: 'info',
                    title: 'Credit Utilization',
                    message: 'Your credit utilization is at 45%. Pay down RM 1,500 to improve your credit score to excellent range.',
                    action: {
                        label: 'View Details',
                        onClick: () => console.log('Navigate to credit cards')
                    }
                },
                {
                    id: '4',
                    type: 'tip',
                    title: 'Savings Opportunity',
                    message: 'You could save RM 450/month by switching to a lower interest rate on your car loan. Consider refinancing.',
                    action: {
                        label: 'Analyze Loans',
                        onClick: () => console.log('Navigate to loans')
                    }
                }
            ]

            setInsights(mockInsights)
            setLoading(false)
        }

        // Check if banner was dismissed
        const dismissed = localStorage.getItem('ai-insights-dismissed')
        if (dismissed === 'true') {
            setIsDismissed(true)
            return
        }

        fetchInsights()
    }, [])

    // Auto-rotate insights every 5 seconds
    useEffect(() => {
        if (insights.length === 0 || isDismissed) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [insights.length, isDismissed])

    const handleDismiss = () => {
        setIsDismissed(true)
    }

    const handleDismissForever = () => {
        localStorage.setItem('ai-insights-dismissed', 'true')
        setIsDismissed(true)
    }

    if (isDismissed || loading || insights.length === 0) return null

    const currentInsight = insights[currentIndex]

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Target className="w-6 h-6" />
            case 'warning': return <AlertCircle className="w-6 h-6" />
            case 'info': return <TrendingUp className="w-6 h-6" />
            case 'tip': return <Sparkles className="w-6 h-6" />
            default: return <Sparkles className="w-6 h-6" />
        }
    }

    const getColors = (type: string) => {
        switch (type) {
            case 'success': return {
                bg: 'from-green-500/10 to-emerald-500/10',
                border: 'border-green-500/30',
                icon: 'text-green-400',
                text: 'text-green-100'
            }
            case 'warning': return {
                bg: 'from-yellow-500/10 to-amber-500/10',
                border: 'border-yellow-500/30',
                icon: 'text-yellow-400',
                text: 'text-yellow-100'
            }
            case 'info': return {
                bg: 'from-blue-500/10 to-cyan-500/10',
                border: 'border-blue-500/30',
                icon: 'text-blue-400',
                text: 'text-blue-100'
            }
            case 'tip': return {
                bg: 'from-purple-500/10 to-pink-500/10',
                border: 'border-purple-500/30',
                icon: 'text-purple-400',
                text: 'text-purple-100'
            }
            default: return {
                bg: 'from-gray-500/10 to-gray-500/10',
                border: 'border-gray-500/30',
                icon: 'text-gray-400',
                text: 'text-gray-100'
            }
        }
    }

    const colors = getColors(currentInsight.type)

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <Card className={`p-6 bg-gradient-to-r ${colors.bg} ${colors.border} border relative overflow-hidden`}>
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

                    <div className="relative z-10 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                            {getIcon(currentInsight.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                                        AI Insight
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleDismiss}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        aria-label="Dismiss"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentInsight.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>
                                        {currentInsight.title}
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        {currentInsight.message}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {currentInsight.action && (
                                            <Button
                                                onClick={currentInsight.action.onClick}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                {currentInsight.action.label}
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {/* Pagination dots */}
                                        <div className="flex items-center gap-2">
                                            {insights.map((_, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className={`h-2 rounded-full transition-all ${index === currentIndex
                                                        ? 'bg-white w-6 shadow-glow-blue'
                                                        : 'bg-white/30 hover:bg-white/50 w-2'
                                                        }`}
                                                    aria-label={`Go to insight ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Dismiss forever link */}
                    <motion.button
                        whileHover={{ scale: 1.05, color: '#fff' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDismissForever}
                        className="absolute bottom-2 right-2 text-xs text-gray-500 transition-colors"
                    >
                        Don't show again
                    </motion.button>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}
