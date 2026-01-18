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
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="cursor-pointer h-full"
        >
            <Card className={cn(
                "relative overflow-hidden group transition-all duration-500 h-full",
                "bg-white/5 backdrop-blur-xl border border-white/10",
                goal.priority === 'high' ? "ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "",
                isCompleted && "ring-2 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            )}>
                {/* Confetti Effect on Completion */}
                {isCompleted && showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 0, x: Math.random() * 100 - 50, opacity: 1 }}
                                animate={{
                                    y: -200,
                                    x: Math.random() * 200 - 100,
                                    opacity: 0,
                                    rotate: Math.random() * 360,
                                }}
                                transition={{ duration: 2, delay: i * 0.05 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ['#0066FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][i % 5],
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Priority Badge */}
                <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border z-10",
                    getPriorityColor()
                )}>
                    {goal.priority}
                </div>

                <div className="flex justify-between items-start mb-6 relative">
                    {/* Emoji */}
                    <div className="p-4 rounded-2xl bg-white/5 text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {goal.emoji || '🎯'}
                    </div>

                    {/* Progress Ring */}
                    <div className="mr-2">
                        <ProgressRing
                            progress={percentage}
                            size={96}
                            strokeWidth={8}
                            color={isCompleted ? '#10B981' : goal.color || '#0066FF'}
                            showPercentage={true}
                        />
                    </div>
                </div>

                <div className="relative">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate mb-1 pr-6 group-hover:text-primary-400 transition-colors">
                        {goal.name}
                    </h3>

                    {/* Goal Type Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded">
                            {goal.goal_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                            Target: RM {goal.target_amount.toLocaleString()}
                        </span>
                    </div>

                    {/* Milestone Badges */}
                    {standardMilestones.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            {standardMilestones.map((milestone) => (
                                <motion.div
                                    key={milestone.percentage}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: milestone.completed ? 1 : 0.8 }}
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                                        milestone.completed
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-400"
                                    )}
                                >
                                    {milestone.completed && <Award size={10} />}
                                    {milestone.percentage}%
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Current Amount */}
                    <div className="flex flex-col gap-1 mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                                RM {goal.current_amount.toLocaleString()}
                            </span>
                            {goal.current_amount > 0 && (
                                <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
                                    <TrendingUp size={14} />
                                    <span>{percentage.toFixed(0)}%</span>
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {isCompleted ? 'Goal Achieved!' : 'Saved so far'}
                        </span>
                    </div>

                    {/* Footer: Countdown & Contribute Button */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Countdown Timer */}
                        <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm transition-colors flex-1",
                            isCompleted
                                ? "bg-emerald-500/10 text-emerald-500"
                                : daysLeft > 0
                                    ? "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                                    : "bg-red-500/10 text-red-500"
                        )}>
                            <Calendar size={14} className="opacity-70" />
                            {isCompleted
                                ? 'Completed!'
                                : daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : `${Math.abs(daysLeft)} days overdue`}
                        </div>

                        {/* Quick Contribute Button */}
                        {!isCompleted && onContribute && (
                            <motion.button
                                onClick={handleContribute}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all"
                            >
                                <Plus size={20} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Hover Glow */}
                <div className={cn(
                    "absolute inset-x-0 bottom-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500",
                    isCompleted
                        ? "bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"
                        : "bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"
                )} />
            </Card>
        </motion.div>
    );
}
