import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, Receipt, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Budget, BudgetPeriod } from '@financeflow/shared';
import { cn } from '@/lib/utils';

interface ModernBudgetCardProps {
    budget: Budget;
    currentPeriod?: BudgetPeriod;
    previousPeriod?: BudgetPeriod;
    onEdit?: (budget: Budget) => void;
    onDelete?: (budget: Budget) => void;
    onViewTransactions?: (budget: Budget) => void;
}

export function ModernBudgetCard({
    budget,
    currentPeriod,
    previousPeriod,
    onEdit,
    onDelete,
    onViewTransactions
}: ModernBudgetCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const spent = currentPeriod?.spent_amount || 0;
    const total = budget.amount;
    const percentage = Math.min(100, (spent / total) * 100);
    const remaining = total - spent;

    // Trend calculation
    const previousSpent = previousPeriod?.spent_amount || 0;
    const trend = spent - previousSpent;
    const trendPercentage = previousSpent > 0 ? ((trend / previousSpent) * 100) : 0;

    // Status & Color Logic
    const getStatusStyles = () => {
        if (percentage >= 100) return {
            gradient: 'from-red-500/20 to-red-600/5',
            border: 'border-red-500/30',
            text: 'text-red-500',
            bar: 'bg-gradient-to-r from-red-500 to-rose-500',
            shadow: 'group-hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]'
        };
        if (percentage >= 90) return {
            gradient: 'from-orange-500/20 to-orange-600/5',
            border: 'border-orange-500/30',
            text: 'text-orange-500',
            bar: 'bg-gradient-to-r from-orange-500 to-amber-500',
            shadow: 'group-hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]'
        };
        if (percentage >= 75) return {
            gradient: 'from-amber-500/20 to-amber-600/5',
            border: 'border-amber-500/30',
            text: 'text-amber-500',
            bar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
            shadow: 'group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]'
        };
        return {
            gradient: 'from-emerald-500/20 to-teal-500/5',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
            shadow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
        };
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glowing Backdrop */}
            <div className={cn(
                "absolute inset-0 rounded-3xl transition-all duration-500 opacity-0 group-hover:opacity-100",
                "bg-gradient-to-br via-transparent to-transparent",
                styles.gradient
            )} />

            <Card className={cn(
                "relative h-full overflow-hidden border transition-all duration-300",
                "bg-white/5 backdrop-blur-md",
                "hover:border-white/20 dark:hover:border-white/15",
                styles.border,
                styles.shadow
            )}>
                {/* Content Container */}
                <div className="p-6 relative z-10 flex flex-col h-full">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner",
                                "bg-gradient-to-br from-white/10 to-white/5 border border-white/10",
                                "backdrop-blur-xl group-hover:scale-110 transition-transform duration-300"
                            )}>
                                {budget.emoji || (budget.name?.charAt(0) || 'B')}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-primary-400 transition-colors">
                                    {budget.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="capitalize">{budget.period}</span>
                                    <span>•</span>
                                    <span>Reset {new Date().getDate() === 1 ? 'Today' : `in ${new Date(2024, new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className={cn(
                                    "p-2 rounded-xl text-slate-400 transition-all duration-200",
                                    "hover:bg-white/10 hover:text-white",
                                    (showMenu || isHovered) ? "opacity-100" : "opacity-0"
                                )}
                            >
                                <MoreVertical size={20} />
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-30 p-1"
                                        >
                                            {onViewTransactions && (
                                                <button onClick={() => { onViewTransactions(budget); setShowMenu(false); }} className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition-colors">
                                                    <Receipt size={16} /> View Details
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button onClick={() => { onEdit(budget); setShowMenu(false); }} className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition-colors">
                                                    <Edit size={16} /> Edit Budget
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => { onDelete(budget); setShowMenu(false); }} className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            )}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Progress Circle & Amount (Alternative Layout) */}
                    <div className="mt-auto space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                                    <span className="text-base font-bold align-top text-slate-400 mr-1">RM</span>
                                    {Math.floor(spent).toLocaleString()}
                                    <span className="text-lg text-slate-400">.{spent.toFixed(2).split('.')[1]}</span>
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    of RM {total.toLocaleString()} limit
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={cn("text-xl font-bold", styles.text)}>
                                    {percentage.toFixed(0)}%
                                </div>
                                {previousPeriod && (
                                    <div className={cn(
                                        "flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider mt-1",
                                        trend > 0 ? "text-red-400" : "text-emerald-400"
                                    )}>
                                        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {Math.abs(trendPercentage).toFixed(0)}% vs last
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Liquid Progress Bar */}
                        <div className="relative h-4 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, type: "spring", bounce: 0 }}
                                className={cn("h-full relative overflow-hidden", styles.bar)}
                            >
                                {/* Shimmer Effect */}
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
                                />
                            </motion.div>
                        </div>

                        {/* Footer Status */}
                        <div className="flex justify-between items-center text-xs font-semibold">
                            <span className={cn(remaining < 0 ? "text-red-500" : "text-slate-500 dark:text-slate-400")}>
                                {remaining < 0 ? `Over by RM ${Math.abs(remaining).toLocaleString()}` : `RM ${remaining.toLocaleString()} remaining`}
                            </span>
                            {remaining < 0 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
