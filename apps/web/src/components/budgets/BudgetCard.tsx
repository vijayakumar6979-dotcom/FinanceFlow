import { motion } from 'framer-motion';
import { MoreVertical, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Budget, BudgetPeriod } from '@financeflow/shared';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface BudgetCardProps {
    budget: Budget;
    currentPeriod?: BudgetPeriod;
    onEdit?: (budget: Budget) => void;
    onDelete?: (budget: Budget) => void;
}

export function BudgetCard({ budget, currentPeriod, onEdit, onDelete }: BudgetCardProps) {
    const spent = currentPeriod?.spent_amount || 0;
    const total = budget.amount;
    const percentage = Math.min(100, (spent / total) * 100);
    const remaining = total - spent;
    const isOverBudget = spent > total;

    // Status Logic
    let statusColor = 'bg-emerald-500';
    let borderColor = 'border-transparent';
    if (percentage > 90) {
        statusColor = 'bg-red-500';
        borderColor = 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    } else if (percentage > 75) {
        statusColor = 'bg-amber-500';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn("relative overflow-hidden transition-all duration-300", borderColor)}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold", statusColor)}>
                            {/* Placeholder Icon - In real app, map category_id to icon */}
                            {budget.name?.charAt(0) || 'B'}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{budget.name || 'Budget'}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{budget.period}</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>

                {/* Amounts */}
                <div className="mb-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            RM {spent.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            / RM {total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <ProgressBar
                        value={spent}
                        max={total}
                        color={isOverBudget ? 'red' : percentage > 75 ? 'yellow' : 'green'}
                        size="md"
                    />
                </div>

                {/* Footer Stats */}
                <div className="flex justify-between items-center text-xs">
                    <div className={cn("flex items-center gap-1 font-medium", remaining < 0 ? 'text-red-500' : 'text-emerald-500')}>
                        {remaining < 0 ? (
                            <>
                                <AlertTriangle size={14} />
                                <span>Over by RM {Math.abs(remaining).toLocaleString()}</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={14} />
                                <span>RM {remaining.toLocaleString()} left</span>
                            </>
                        )}
                    </div>

                    <div className="text-slate-400">
                        {percentage.toFixed(0)}% Used
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
