import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InsightProps {
    type: 'positive' | 'warning' | 'suggestion';
    title: string;
    description: string;
    action?: string;
    onAction?: () => void;
}

export function AIAccountInsight({ type, title, description, action, onAction }: InsightProps) {
    const getIcon = () => {
        switch (type) {
            case 'positive': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            case 'suggestion': return <Lightbulb className="w-4 h-4 text-purple-400" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'positive': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-100';
            case 'suggestion': return 'bg-purple-500/10 border-purple-500/20 text-purple-100';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "p-4 rounded-xl border backdrop-blur-md flex items-start gap-3",
                getColors()
            )}
        >
            <div className="mt-0.5 p-1.5 rounded-full bg-white/5 border border-white/10">
                {getIcon()}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 opacity-50" />
                    <h4 className="text-sm font-bold tracking-wide">{title}</h4>
                </div>
                <p className="text-xs opacity-80 leading-relaxed max-w-[90%]">
                    {description}
                </p>
                {action && (
                    <button
                        onClick={onAction}
                        className="mt-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        {action}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
