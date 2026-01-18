import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, AlertTriangle, CheckCircle, Edit, Trash2, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Budget, BudgetPeriod } from '@financeflow/shared';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
    budget: Budget;
    currentPeriod?: BudgetPeriod;
    previousPeriod?: BudgetPeriod;
    lastTransaction?: {
        description: string;
        amount: number;
        date: string;
    };
    onEdit?: (budget: Budget) => void;
    onDelete?: (budget: Budget) => void;
    onViewTransactions?: (budget: Budget) => void;
}

export function BudgetCard({
    budget,
    currentPeriod,
    previousPeriod,
    lastTransaction,
    onEdit,
    onDelete,
    onViewTransactions
}: BudgetCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const spent = currentPeriod?.spent_amount || 0;
    const total = budget.amount;
    const percentage = Math.min(100, (spent / total) * 100);
    const remaining = total - spent;

    // Calculate trend
    const previousSpent = previousPeriod?.spent_amount || 0;
    const trend = spent - previousSpent;
    const trendPercentage = previousSpent > 0 ? ((trend / previousSpent) * 100) : 0;

    // Check if any alert threshold is exceeded
    const hasAlert = budget.alert_thresholds?.some(threshold => percentage >= threshold) || false;

    // Status Logic according to design standard
    const getStatusStyles = () => {
        if (percentage >= 100) return {
            color: 'bg-red-500',
            glow: 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
            progress: 'red' as const,
            text: 'text-red-500',
            pulse: true
        };
        if (percentage >= 90) return {
            color: 'bg-orange-500',
            glow: 'border-orange-500/50 shadow-[0_0_15px_rgba(255,107,0,0.3)]',
            progress: 'red' as const,
            text: 'text-orange-500',
            pulse: true
        };
        if (percentage >= 75) return {
            color: 'bg-amber-500',
            glow: 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
            progress: 'yellow' as const,
            text: 'text-amber-500',
            pulse: false
        };
        return {
            color: 'bg-emerald-500',
            glow: 'border-emerald-500/30 shadow-none',
            progress: 'green' as const,
            text: 'text-emerald-500',
            pulse: false
        };
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className={cn(
                "relative overflow-hidden transition-all duration-500 h-full",
                "bg-white/5 backdrop-blur-xl border border-white/10",
                styles.glow,
                styles.pulse && "animate-pulse-border"
            )}>
                {/* Background Accent */}
                <div className={cn("absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 blur-3xl", styles.color)} />

                {/* Alert Badge */}
                {hasAlert && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 z-10"
                    >
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            styles.color,
                            "shadow-lg"
                        )} />
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-6 relative">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl",
                            "shadow-lg",
                            styles.color
                        )}>
                            {budget.emoji || (budget.name?.charAt(0) || 'B')}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                {budget.name || 'Budget'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 py-0.5 bg-slate-100 dark:bg-white/5 rounded">
                                    {budget.period}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <MoreVertical size={20} />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />

                                    {/* Menu */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-20"
                                    >
                                        {onEdit && (
                                            <button
                                                onClick={() => {
                                                    onEdit(budget);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Edit size={16} />
                                                Edit Budget
                                            </button>
                                        )}
                                        {onViewTransactions && (
                                            <button
                                                onClick={() => {
                                                    onViewTransactions(budget);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Receipt size={16} />
                                                View Transactions
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => {
                                                    onDelete(budget);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-800"
                                            >
                                                <Trash2 size={16} />
                                                Delete Budget
                                            </button>
                                        )}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Amounts */}
                <div className="mb-6 relative">
                    <div className="flex justify-between items-baseline mb-2">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                                RM {spent.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                of RM {total.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className={cn("text-lg font-bold", styles.text)}>
                                {percentage.toFixed(0)}%
                            </div>
                            {/* Trend Indicator */}
                            {previousPeriod && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-semibold",
                                    trend > 0 ? "text-red-500" : trend < 0 ? "text-emerald-500" : "text-slate-500"
                                )}>
                                    {trend > 0 ? (
                                        <TrendingUp size={12} />
                                    ) : trend < 0 ? (
                                        <TrendingDown size={12} />
                                    ) : null}
                                    <span>
                                        {trend > 0 ? '+' : ''}{trendPercentage.toFixed(0)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn("h-full rounded-full transition-colors duration-500", styles.color)}
                        />
                    </div>
                </div>

                {/* Last Transaction Preview */}
                {lastTransaction && (
                    <div className="mb-4 p-3 bg-slate-100 dark:bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-500 mb-0.5">Last Transaction</div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {lastTransaction.description}
                                </div>
                            </div>
                            <div className="text-right ml-3">
                                <div className="text-sm font-bold text-red-500">
                                    -RM {lastTransaction.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {new Date(lastTransaction.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Stats */}
                <div className="flex justify-between items-center relative pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className={cn("flex items-center gap-1.5 font-semibold text-sm", styles.text)}>
                        {remaining < 0 ? (
                            <>
                                <AlertTriangle size={16} />
                                <span>RM {Math.abs(remaining).toLocaleString()} over</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={16} />
                                <span>RM {remaining.toLocaleString()} left</span>
                            </>
                        )}
                    </div>

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {currentPeriod?.status?.replace('_', ' ') || 'ON TRACK'}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
