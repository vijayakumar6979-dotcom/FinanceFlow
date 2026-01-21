import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, BrainCircuit } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const MOCK_INSIGHTS = [
    {
        id: '1',
        type: 'prediction',
        icon: TrendingUp,
        title: 'Spending Forecast',
        message: 'Based on your current trajectory, your monthly spending is projected to be 12% lower than last month.',
        highlight: '12% lower',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    },
    {
        id: '2',
        type: 'anomaly',
        icon: AlertTriangle,
        title: 'Unusual Activity Detected',
        message: 'A subscription payment of RM 45.00 for "StreamService" was detected yesterday, which is higher than usual.',
        highlight: 'RM 45.00',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20'
    },
    {
        id: '3',
        type: 'opportunity',
        icon: Sparkles,
        title: 'Savings Opportunity',
        message: 'You have RM 1,200 in your checking account that could earn more interest in your high-yield savings.',
        highlight: 'RM 1,200',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20'
    }
];

export function AIAnalyticsInsight() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleRefresh = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % MOCK_INSIGHTS.length);
            setIsAnalyzing(false);
        }, 1500);
    };

    const insight = MOCK_INSIGHTS[currentIndex];
    const Icon = insight.icon;

    return (
        <Card className="relative overflow-hidden border-0 bg-transparent p-0 w-full">
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl" />

            {/* Animated Mesh Gradient */}
            <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_60%)] animate-slow-spin pointer-events-none" />

            <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
                {/* AI Avatar / Status */}
                <div className="flex-shrink-0 relative">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        {/* Orbiting Rings */}
                        <div className={cn(
                            "absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-400",
                            isAnalyzing ? "animate-spin duration-700" : "animate-[spin_4s_linear_infinite]"
                        )} />
                        <div className={cn(
                            "absolute inset-2 rounded-full border-2 border-purple-500/30 border-b-purple-400",
                            isAnalyzing ? "animate-spin duration-1000 direction-reverse" : "animate-[spin_6s_linear_infinite_reverse]"
                        )} />

                        {/* Center Core */}
                        <div className="relative z-10 bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                            <BrainCircuit size={20} className="text-white" />
                        </div>

                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white tracking-tight">AI Financial Analyst</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Live
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            className="hidden md:flex text-slate-400 hover:text-white hover:bg-white/5"
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                        </Button>
                    </div>

                    <div className="min-h-[80px] relative">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center md:items-start justify-center"
                                >
                                    <div className="text-slate-300 text-sm animate-pulse">Processing financial data points...</div>
                                    <div className="w-full max-w-xs h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={insight.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-left"
                                >
                                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                        <Icon size={16} className={insight.color} />
                                        <span className={cn("text-sm font-bold uppercase tracking-wider", insight.color)}>
                                            {insight.title}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
                                        {insight.message.split(insight.highlight).map((part, i, arr) => (
                                            <span key={i}>
                                                {part}
                                                {i < arr.length - 1 && (
                                                    <span className="text-white font-bold decoration-indigo-500/50 underline decoration-2 underline-offset-2">
                                                        {insight.highlight}
                                                    </span>
                                                )}
                                            </span>
                                        ))}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Refresh Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    className="md:hidden w-full text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </Button>

                {/* Decorative Arrow */}
                <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
            </div>
        </Card>
    );
}
