import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Sparkles,
    AlertTriangle,
    Target,
    ArrowUpRight,
    Wallet
} from 'lucide-react';
import { formatCurrency } from '@financeflow/shared';

interface InsightProps {
    type: 'positive' | 'warning' | 'suggestion';
    title: string;
    description: string;
    value?: string;
}

function InsightCard({ type, title, description, value }: InsightProps) {
    const getColors = () => {
        switch (type) {
            case 'positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'suggestion': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'positive': return <TrendingUp className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'suggestion': return <Sparkles className="w-5 h-5" />;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-4 rounded-xl border ${getColors()} backdrop-blur-sm`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${type === 'positive' ? 'bg-emerald-500/20' : type === 'warning' ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1">{title}</h4>
                        <p className="text-xs opacity-80 leading-relaxed">{description}</p>
                    </div>
                </div>
                {value && <span className="font-bold font-mono text-sm">{value}</span>}
            </div>
        </motion.div>
    );
}

export function GeneralAIAnalytics({ accountId, accountType }: { accountId: string, accountType: string }) {
    // Mock Data - In a real app, this would come from an AI service based on the accountId
    const aiInsights: InsightProps[] = [
        {
            type: 'positive',
            title: 'Healthy Cash Flow',
            description: 'Your average monthly deposits are 20% higher than withdrawals over the last 3 months.',
            value: '+20%'
        },
        {
            type: 'suggestion',
            title: 'Savings Opportunity',
            description: 'Based on your balance history, you could safely move $1,500 to a high-yield savings account without impacting daily spending.',
        },
        {
            type: 'warning',
            title: 'Subscription Spike',
            description: 'Detected a 15% increase in recurring subscription costs compared to last month.',
            value: '+$45'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">AI Financial Intelligence</h3>
                    <p className="text-sm text-slate-400">Smart insights and optimization tips for your {accountType.replace('_', ' ')}</p>
                </div>
            </div>

            {/* AI Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <Wallet className="w-4 h-4" />
                        <span>Projected EOM</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-white">{formatCurrency(4250)}</p>
                        <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" /> +5.2% vs last month
                        </p>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <Target className="w-4 h-4" />
                        <span>Safe to Spend</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-white">{formatCurrency(1200)}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            After bills & savings
                        </p>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Prediction</span>
                    </div>
                    <div className="relative z-10 mt-4">
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-black text-white">Stable</p>
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-indigo-200/60 mt-1">
                            Spending aligned with goals
                        </p>
                    </div>
                </div>
            </div>

            {/* Insights List */}
            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Latest Insights</h4>
                <div className="grid grid-cols-1 gap-3">
                    {aiInsights.map((insight, idx) => (
                        <InsightCard key={idx} {...insight} />
                    ))}
                </div>
            </div>
        </div>
    );
}
