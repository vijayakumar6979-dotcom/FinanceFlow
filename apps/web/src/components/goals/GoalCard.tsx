import { motion } from 'framer-motion';
import { MoreVertical, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Goal } from '@financeflow/shared';
import { cn } from '@/lib/utils';

interface GoalCardProps {
    goal: Goal;
    onEdit?: (goal: Goal) => void;
    onDelete?: (goal: Goal) => void;
}

export function GoalCard({ goal }: GoalCardProps) {
    // Calculate progress
    const percentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Formatting
    const currency = goal.currency || 'MYR';
    const formattedCurrent = new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(goal.current_amount);
    const formattedTarget = new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(goal.target_amount);

    // Date Logic
    const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-3xl">
                        {goal.emoji || '🎯'}
                    </div>
                    <Button variant="ghost" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={18} />
                    </Button>
                </div>

                <div className="absolute top-4 right-4 w-24 h-24 flex items-center justify-center">
                    {/* Ring Chart */}
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-100 dark:text-white/5"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={cn(
                                "transition-all duration-1000 ease-out",
                                goal.color === 'bg-emerald-500' ? 'text-emerald-500' :
                                    goal.color === 'bg-blue-500' ? 'text-blue-500' :
                                        goal.color === 'bg-purple-500' ? 'text-purple-500' : 'text-blue-500'
                            )}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{percentage.toFixed(0)}%</span>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-20">{goal.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Target: {formattedTarget}</p>

                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{formattedCurrent}</span>
                        <span className="text-xs text-slate-400">Saved so far</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-lg w-fit">
                        <Calendar size={14} />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
