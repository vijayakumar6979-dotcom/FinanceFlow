import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus, Calendar, Loader2, Target, CheckCircle2, Circle, Trophy, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Goal, GoalContribution, GoalMilestone, GoalService } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function GoalDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [goal, setGoal] = useState<Goal | null>(null);
    const [timeline, setTimeline] = useState<GoalContribution[]>([]);
    const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [contributionNotes, setContributionNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (id) loadGoalDetails();
    }, [id]);

    const loadGoalDetails = async () => {
        try {
            const goalService = new GoalService(supabase);

            // Fetch Goal
            const { data: goalData, error: goalError } = await supabase
                .from('goals')
                .select('*')
                .eq('id', id)
                .single();

            if (goalError) throw goalError;
            setGoal(goalData);

            // Fetch Contributions
            const { data: contribData } = await supabase
                .from('goal_contributions')
                .select('*')
                .eq('goal_id', id)
                .order('contribution_date', { ascending: false });

            setTimeline(contribData || []);

            // Fetch Milestones
            const fetchedMilestones = await goalService.getMilestones(id!);
            setMilestones(fetchedMilestones);

        } catch (error) {
            console.error('Failed to load goal details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddContribution = async () => {
        if (!id || !contributionAmount) return;
        setIsSaving(true);
        try {
            const goalService = new GoalService(supabase);
            await goalService.addContribution({
                goal_id: id,
                user_id: goal!.user_id,
                amount: Number(contributionAmount),
                notes: contributionNotes,
                contribution_date: new Date().toISOString()
            });

            // Re-check milestones
            await goalService.checkMilestones(id);

            // Success
            setContributionAmount('');
            setContributionNotes('');
            setIsContributionModalOpen(false);

            // Refresh
            await loadGoalDetails();

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.7 },
                colors: ['#0066FF', '#8B5CF6', '#EC4899']
            });
        } catch (error) {
            console.error('Failed to add contribution', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteGoal = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            const goalService = new GoalService(supabase);
            await goalService.deleteGoal(id);
            navigate('/goals');
        } catch (error) {
            console.error('Failed to delete goal', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-medium italic">Loading your achievement path...</p>
            </div>
        );
    }

    if (!goal) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Goal not found</h2>
            <Button onClick={() => navigate('/goals')} className="mt-4">Back to Goals</Button>
        </div>
    );

    const percentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
    const goalService = new GoalService(supabase);
    const monthlyNeeded = goalService.calculateMonthlyContribution(goal);

    const targetDate = new Date(goal.target_date);
    const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Button
                        variant="ghost"
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                        onClick={() => navigate('/goals')}
                    >
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{goal.emoji || '🎯'}</span>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {goal.name}
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                            <Target size={16} />
                            Target Date: {new Date(goal.target_date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                        variant="secondary"
                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold"
                        icon={<Edit2 size={18} />}
                        onClick={() => navigate(`/goals/edit/${goal.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold"
                        icon={<Trash2 size={18} />}
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Progress & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Trophy size={120} />
                        </div>

                        <div className="flex flex-col items-center relative z-10">
                            <div className="mb-8 relative w-56 h-56">
                                <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_15px_rgba(0,102,255,0.2)]">
                                    <circle
                                        cx="112"
                                        cy="112"
                                        r="96"
                                        stroke="currentColor"
                                        strokeWidth="16"
                                        fill="transparent"
                                        className="text-slate-100 dark:text-white/5"
                                    />
                                    <motion.circle
                                        initial={{ strokeDashoffset: 2 * Math.PI * 96 }}
                                        animate={{ strokeDashoffset: (2 * Math.PI * 96) * ((100 - percentage) / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="112"
                                        cy="112"
                                        r="96"
                                        stroke="currentColor"
                                        strokeWidth="16"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 96}
                                        className="text-primary-500 transition-all"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                                        {percentage.toFixed(0)}%
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                        Completed
                                    </span>
                                </div>
                            </div>

                            <div className="w-full space-y-5">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-primary-500/30 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saved</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                                            RM {goal.current_amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-10 w-0.5 bg-slate-200 dark:bg-white/10" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white font-mono text-right">
                                            RM {goal.target_amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                                    icon={<Plus size={20} />}
                                    onClick={() => setIsContributionModalOpen(true)}
                                >
                                    Add Contribution
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-5 border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="p-2 bg-emerald-500/10 rounded-lg w-fit mb-3">
                                <Calendar className="text-emerald-500" size={18} />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Time Left</span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                                {Math.max(0, daysLeft)}
                                <span className="text-xs ml-1 opacity-50 uppercase tracking-tighter">Days</span>
                            </div>
                        </Card>
                        <Card className="p-5 border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-3">
                                <TrendingUp className="text-blue-500" size={18} />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Monthly Est.</span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                                <span className="text-xs align-top opacity-50 mr-0.5 font-sans">RM</span>
                                {Math.round(monthlyNeeded).toLocaleString()}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Timeline & Milestones */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Progress Timeline / Milestones */}
                    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Milestone Path
                            </h3>
                            <div className="text-xs font-bold text-primary-400 bg-primary-400/10 px-3 py-1 rounded-full border border-primary-400/20">
                                {milestones.filter((m: GoalMilestone) => m.is_completed).length} / {milestones.length} Reached
                            </div>
                        </div>

                        <div className="relative pt-4 pb-8">
                            <div className="absolute top-[26px] left-0 right-0 h-1 bg-slate-100 dark:bg-white/5 rounded-full" />
                            <div className="relative flex justify-between">
                                {milestones.length > 0 ? milestones.map((milestone: GoalMilestone) => (
                                    <div key={milestone.id} className="flex flex-col items-center gap-3 relative z-10">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-lg",
                                            milestone.is_completed
                                                ? "bg-primary-500 border-primary-500 text-white scale-125 glow-primary"
                                                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20"
                                        )}>
                                            {milestone.is_completed ? <CheckCircle2 size={14} /> : <Circle size={8} className="fill-current" />}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest mb-1 transition-colors",
                                                milestone.is_completed ? "text-primary-500" : "text-slate-400"
                                            )}>
                                                {milestone.name}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                                                RM {milestone.target_amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="w-full text-center py-4 text-slate-500 italic text-sm">
                                        No milestones defined for this goal yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Contribution History */}
                    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Savings Activity
                            </h3>
                        </div>

                        {timeline.length > 0 ? (
                            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-white/5">
                                {timeline.map((item: GoalContribution, idx: number) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative pl-12 group"
                                    >
                                        <div className={cn(
                                            "absolute left-[13.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(0,102,255,0.5)]",
                                            idx === 0 ? "bg-primary-500 shadow-[0_0_8px_rgba(0,102,255,0.4)]" : "bg-slate-300 dark:bg-white/20"
                                        )} />
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-white/5 border border-transparent group-hover:border-white/10 group-hover:bg-white/10 transition-all cursor-default">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                                                        RM {item.amount.toLocaleString()}
                                                    </span>
                                                    {idx === 0 && (
                                                        <span className="text-[10px] font-black text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                                    {item.notes || 'One-time savings contribution'}
                                                </p>
                                            </div>
                                            <div className="mt-3 sm:mt-0 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-transparent sm:border-slate-200/50 dark:sm:border-white/5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Contribution Date</p>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                    <Calendar size={12} className="opacity-50" />
                                                    {new Date(item.contribution_date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Target size={40} className="mb-4 opacity-20" />
                                <p className="font-medium italic">No activity recorded for this goal yet.</p>
                                <p className="text-xs mt-1">Make your first contribution to spark progress!</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Contribution Modal */}
            <AnimatePresence>
                {isContributionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Record Progress</h3>
                                    <button
                                        onClick={() => setIsContributionModalOpen(false)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Contribution Quantum</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 font-bold">RM</span>
                                            <input
                                                type="number"
                                                value={contributionAmount}
                                                onChange={(e) => setContributionAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full h-20 bg-white/5 border-white/10 rounded-3xl pl-16 pr-6 text-3xl font-black text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Strategic Note</label>
                                        <input
                                            type="text"
                                            value={contributionNotes}
                                            onChange={(e) => setContributionNotes(e.target.value)}
                                            placeholder="e.g., Monthly surge allocation"
                                            className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-white/5"
                                            onClick={() => setIsContributionModalOpen(false)}
                                        >
                                            Abort
                                        </Button>
                                        <Button
                                            className="flex-3 h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                                            onClick={handleAddContribution}
                                            disabled={isSaving || !contributionAmount}
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" /> : 'Confirm Deposit'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={40} className="text-rose-500" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Erase Strategy?</h3>
                                <p className="text-slate-400 font-medium mb-8">
                                    All progress and contribution history for <span className="text-white font-bold">"{goal.name}"</span> will be permanently deleted.
                                </p>

                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-white/5"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="flex-1 h-14 rounded-2xl font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                                        onClick={handleDeleteGoal}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin" /> : 'Confirm'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

