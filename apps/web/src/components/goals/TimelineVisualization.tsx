import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Milestone {
    id: string;
    name: string;
    target_percentage?: number;
    is_completed: boolean;
    completed_at?: string;
}

interface TimelineVisualizationProps {
    startDate: string;
    targetDate: string;
    currentAmount: number;
    targetAmount: number;
    milestones?: Milestone[];
    className?: string;
}

export function TimelineVisualization({
    startDate,
    targetDate,
    currentAmount,
    targetAmount,
    milestones = [],
    className = '',
}: TimelineVisualizationProps) {
    const start = new Date(startDate);
    const target = new Date(targetDate);
    const today = new Date();

    const totalDays = differenceInDays(target, start);
    const elapsedDays = differenceInDays(today, start);
    const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

    const amountProgress = Math.min((currentAmount / targetAmount) * 100, 100);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Timeline header */}
            <div className="flex justify-between text-sm text-slate-400">
                <div>
                    <div className="font-medium text-white">Started</div>
                    <div>{format(start, 'MMM d, yyyy')}</div>
                </div>
                <div className="text-center">
                    <div className="font-medium text-white">
                        {elapsedDays < 0 ? 'Not started' : elapsedDays > totalDays ? 'Overdue' : 'In progress'}
                    </div>
                    <div>
                        {elapsedDays < 0
                            ? `Starts in ${Math.abs(elapsedDays)} days`
                            : elapsedDays > totalDays
                                ? `${elapsedDays - totalDays} days overdue`
                                : `${Math.max(totalDays - elapsedDays, 0)} days remaining`}
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-medium text-white">Target</div>
                    <div>{format(target, 'MMM d, yyyy')}</div>
                </div>
            </div>

            {/* Timeline bar */}
            <div className="relative">
                {/* Background track */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    {/* Progress fill */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>

                {/* Milestone markers */}
                {milestones.map((milestone, index) => {
                    const milestonePercentage = milestone.target_percentage || 0;
                    const isPassed = amountProgress >= milestonePercentage;

                    return (
                        <motion.div
                            key={milestone.id}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                            style={{ left: `${milestonePercentage}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <div className="relative group">
                                {/* Marker */}
                                <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${milestone.is_completed
                                            ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
                                            : isPassed
                                                ? 'bg-primary-500 border-primary-400 shadow-lg shadow-primary-500/50'
                                                : 'bg-slate-700 border-slate-600'
                                        }`}
                                >
                                    {milestone.is_completed ? (
                                        <Check className="w-3 h-3 text-white" />
                                    ) : (
                                        <Circle className="w-2 h-2 text-white fill-current" />
                                    )}
                                </div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-slate-700">
                                        <div className="font-medium">{milestone.name}</div>
                                        <div className="text-slate-400">{milestonePercentage}%</div>
                                        {milestone.is_completed && milestone.completed_at && (
                                            <div className="text-emerald-400 text-[10px]">
                                                ✓ {format(new Date(milestone.completed_at), 'MMM d')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Current position marker */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${progress}%` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg shadow-white/50 border-2 border-primary-500" />
                </motion.div>
            </div>

            {/* Progress stats */}
            <div className="flex justify-between text-xs text-slate-400">
                <div>
                    <span className="text-white font-medium">{Math.round(amountProgress)}%</span> of target amount
                </div>
                <div>
                    <span className="text-white font-medium">{Math.round(progress)}%</span> of time elapsed
                </div>
            </div>
        </div>
    );
}
