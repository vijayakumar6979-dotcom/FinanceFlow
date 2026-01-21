import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Bot, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@financeflow/shared';

const tips = [
    {
        id: 1,
        type: 'optimization',
        title: 'Debt Optimization',
        description: 'Pay off the "CIMB Mastering" card first. The Avalanche method will save you RM 240 in interest.',
        action: 'Pay RM 500',
        icon: TrendingUp,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 2,
        type: 'alert',
        title: 'Projected Bill Increase',
        description: 'Your electric bill is forecasted to be 15% higher this cycle due to recent usage.',
        action: 'View Usage',
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
    {
        id: 3,
        type: 'growth',
        title: 'Cash Flow Opportunity',
        description: 'You have RM 1,200 excess in your main account. Move it to "Emergency Fund" to earn 3.5% APY.',
        action: 'Transfer Funds',
        icon: Sparkles,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    }
];

export const AICopilotWidget = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextTip = () => {
        setActiveIndex((prev) => (prev + 1) % tips.length);
    };

    const currentTip = tips[activeIndex];
    const Icon = currentTip.icon;

    return (
        <Card className="col-span-12 lg:col-span-4 p-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-50" />

            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <Bot size={20} />
                        </div>
                        <h3 className="font-bold text-white">Finance Copilot</h3>
                    </div>
                    <button onClick={nextTip} className="text-xs text-slate-400 hover:text-white transition-colors">
                        Next Tip
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col justify-center"
                    >
                        <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 ${currentTip.bg} ${currentTip.color}`}>
                            {currentTip.title}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            {currentTip.description}
                        </p>

                        <button className="w-full mt-auto py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group/btn">
                            {currentTip.action}
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-1.5 mt-4">
                    {tips.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
};
