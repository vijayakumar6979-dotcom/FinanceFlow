import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { billBudgetService } from '@/services/billBudgetService';
import type { Bill } from '@financeflow/shared';

interface BudgetImpactCardProps {
    bill: Bill;
}

export function BudgetImpactCard({ bill }: BudgetImpactCardProps) {
    const [impact, setImpact] = React.useState<{
        categoryName: string;
        allocated: number;
        spent: number;
        remaining: number;
        percentage: number;
    } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadBudgetImpact();
    }, [bill.id]);

    const loadBudgetImpact = async () => {
        try {
            const data = await billBudgetService.getBudgetImpact(bill.id);
            setImpact(data);
        } catch (error) {
            console.error('Error loading budget impact:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl bg-dark-elevated border border-white/10 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-white/5 rounded"></div>
            </div>
        );
    }

    if (!impact) {
        return null; // No budget category linked
    }

    const isOverBudget = impact.percentage > 100;
    const isNearLimit = impact.percentage > 80 && impact.percentage <= 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${isOverBudget
                    ? 'bg-red-500/10 border-red-500/20'
                    : isNearLimit
                        ? 'bg-yellow-500/10 border-yellow-500/20'
                        : 'bg-dark-elevated border-white/10'
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOverBudget
                        ? 'bg-red-500/20'
                        : isNearLimit
                            ? 'bg-yellow-500/20'
                            : 'bg-blue-500/20'
                    }`}>
                    <Wallet className={`w-5 h-5 ${isOverBudget
                            ? 'text-red-400'
                            : isNearLimit
                                ? 'text-yellow-400'
                                : 'text-blue-400'
                        }`} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Budget Impact</h3>
                    <p className="text-sm text-slate-400">{impact.categoryName}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Budget Usage</span>
                    <span className={`text-sm font-semibold ${isOverBudget
                            ? 'text-red-400'
                            : isNearLimit
                                ? 'text-yellow-400'
                                : 'text-white'
                        }`}>
                        {impact.percentage}%
                    </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${isOverBudget
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : isNearLimit
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                        style={{ width: `${Math.min(impact.percentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Budget Details */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Allocated</p>
                    <p className="text-sm font-semibold text-white">
                        RM {impact.allocated.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Spent</p>
                    <p className="text-sm font-semibold text-white">
                        RM {impact.spent.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Remaining</p>
                    <div className="flex items-center gap-1">
                        {impact.remaining < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                        ) : (
                            <TrendingUp className="w-3 h-3 text-green-400" />
                        )}
                        <p className={`text-sm font-semibold ${impact.remaining < 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                            RM {Math.abs(impact.remaining).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Warning Message */}
            {(isOverBudget || isNearLimit) && (
                <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${isOverBudget
                        ? 'bg-red-500/10'
                        : 'bg-yellow-500/10'
                    }`}>
                    <AlertCircle className={`w-4 h-4 mt-0.5 ${isOverBudget ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                    <p className={`text-xs ${isOverBudget ? 'text-red-300' : 'text-yellow-300'
                        }`}>
                        {isOverBudget
                            ? `You've exceeded your budget by RM ${Math.abs(impact.remaining).toFixed(2)}`
                            : `You're approaching your budget limit. RM ${impact.remaining.toFixed(2)} remaining.`}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
