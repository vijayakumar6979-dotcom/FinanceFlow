import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, AlertCircle, ChevronRight, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Mock AI Insights for UI Demo
const MOCK_INSIGHTS = [
    {
        id: 1,
        type: 'opportunity',
        icon: Sparkles,
        title: "Smart Saving Opportunity",
        message: "Based on your spending patterns, you could save an extra RM 150 this month by cooking at home on Fridays.",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        id: 2,
        type: 'prediction',
        icon: TrendingUp,
        title: "On Track for Vacation",
        message: "Great job! At this rate, you'll hit your Dream Vacation goal 2 weeks ahead of schedule.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        id: 3,
        type: 'tip',
        icon: Lightbulb,
        title: "Investment Tip",
        message: "Your emergency fund is fully funded. Consider diverting that RM 500/month into your investment portfolio.",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    }
];

export function AIGoalMentor() {
    const [currentInsight, setCurrentInsight] = useState(0);
    const [isThinking, setIsThinking] = useState(false);

    const nextInsight = () => {
        setIsThinking(true);
        setTimeout(() => {
            setCurrentInsight((prev) => (prev + 1) % MOCK_INSIGHTS.length);
            setIsThinking(false);
        }, 800);
    };

    const insight = MOCK_INSIGHTS[currentInsight];
    const Icon = insight.icon;

    return (
        <Card className="relative overflow-hidden border-0 bg-transparent p-0">
            {/* Glass Background with holographic gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl" />

            {/* Animated Glow Mesh */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-slow-spin pointer-events-none" />

            <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 animate-pulse" />
                            <div className="relative p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl border border-white/20 shadow-lg shadow-purple-500/30">
                                <Sparkles size={20} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                AI Finance Mentor
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    Beta
                                </span>
                            </h3>
                            <p className="text-sm text-slate-400">Analyzing your financial habits...</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextInsight}
                        disabled={isThinking}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <RefreshCcw size={16} className={cn("mr-2", isThinking && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                {/* Content Area */}
                <div className="min-h-[120px] relative">
                    <AnimatePresence mode="wait">
                        {isThinking ? (
                            <motion.div
                                key="thinking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center space-x-1"
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-4"
                            >
                                <div className={cn("p-3 rounded-xl h-fit", insight.bg, insight.border, "border")}>
                                    <Icon size={24} className={insight.color} />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h4 className={cn("font-bold text-base", insight.color)}>
                                        {insight.title}
                                    </h4>
                                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                                        {insight.message}
                                    </p>

                                    <div className="pt-2">
                                        <button className="group flex items-center gap-1 text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">
                                            View Details
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-50" />
        </Card>
    );
}
