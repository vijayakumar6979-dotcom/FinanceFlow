import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Award, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Goal, GoalMilestone } from '@financeflow/shared';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

interface GoalCardProps {
    goal: Goal;
    milestones?: GoalMilestone[];
    onClick?: () => void;
    onContribute?: (goal: Goal) => void;
    onEdit?: (goal: Goal) => void;
    onDelete?: (goal: Goal) => void;
}

export function GoalCard({ goal, milestones = [], onClick, onContribute }: GoalCardProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    // Calculate progress
    const percentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
    const isCompleted = goal.status === 'completed' || percentage >= 100;

    // Date Logic
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const daysLeft = differenceInDays(targetDate, today);

    // Get priority color
    const getPriorityColor = () => {
        switch (goal.priority) {
            case 'high':
                return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'medium':
                return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
            case 'low':
                return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
            default:
                return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
        }
    };

    // Get completed milestones
    const completedMilestones = milestones.filter(m => m.is_completed);
    const standardMilestones = [
        { percentage: 25, completed: percentage >= 25 },
        { percentage: 50, completed: percentage >= 50 },
        { percentage: 75, completed: percentage >= 75 },
    ];

    // Trigger confetti on completion
    if (isCompleted && !showConfetti) {
        setShowConfetti(true);
    }

    const handleContribute = (e: React.MouseEvent) => {
        e.stopPropagation();
        onContribute?.(goal);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="cursor-pointer h-full group"
        >
            <div className={cn(
                "relative h-full overflow-hidden rounded-[24px] border transition-all duration-500",
                "bg-white/5 backdrop-blur-2xl",
                "border-white/10 group-hover:border-white/20",
                goal.priority === 'high' ? "hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]" : "hover:shadow-[0_0_40px_rgba(0,102,255,0.2)]",
                isCompleted && "shadow-[0_0_40px_rgba(16,185,129,0.2)] border-emerald-500/30"
            )}>
                {/* Dynamic Background Glow */}
                <div className={cn(
                    "absolute -inset-[100%] rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700 pointer-events-none",
                    goal.priority === 'high' ? "bg-red-500" : isCompleted ? "bg-emerald-500" : "bg-primary-500"
                )} />

                {/* Priority Badge */}
                <div className={cn(
                    "absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border z-10 backdrop-blur-md shadow-lg",
                    getPriorityColor()
                )}>
                    {goal.priority}
                </div>

                <div className="p-6 relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        {/* Floating 3D Emoji */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-2xl">
                                {goal.emoji || '🎯'}
                            </div>
                        </div>

                        {/* Progress Ring */}
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                            <ProgressRing
                                progress={percentage}
                                size={80}
                                strokeWidth={6}
                                color={isCompleted ? '#10B981' : goal.color || '#0066FF'}
                                showPercentage={true}
                                className="drop-shadow-lg"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate mb-1 pr-6 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                            {goal.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500/80 px-2 py-1 bg-slate-100/50 dark:bg-white/5 rounded-md backdrop-blur-sm">
                                {goal.goal_type.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Milestone Dots */}
                        <div className="flex gap-1 mb-6">
                            {[25, 50, 75, 100].map((step) => {
                                const isReached = percentage >= step;
                                return (
                                    <div
                                        key={step}
                                        className={cn(
                                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                                            isReached
                                                ? (isCompleted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]")
                                                : "bg-slate-200 dark:bg-white/10"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Saved
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none tracking-tight">
                                    RM {goal.current_amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Target
                                </div>
                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">
                                    {goal.target_amount.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="grid grid-cols-[1fr,auto] gap-3">
                            <div className={cn(
                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2.5 rounded-xl transition-colors backdrop-blur-md border",
                                isCompleted
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : daysLeft > 0
                                        ? "bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-white/5"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                            )}>
                                <Calendar size={14} className={cn("opacity-70", daysLeft < 0 && "animate-pulse")} />
                                {isCompleted
                                    ? 'Completed!'
                                    : daysLeft > 0
                                        ? `${daysLeft} days left`
                                        : `${Math.abs(daysLeft)} days overdue`}
                            </div>

                            {!isCompleted && onContribute && (
                                <motion.button
                                    onClick={handleContribute}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-[38px] w-[38px] flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 border border-white/20"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
