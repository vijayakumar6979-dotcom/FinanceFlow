import { useState } from 'react';
import { Target, Trophy, TrendingUp, Plus, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoalCard } from '@/components/goals/GoalCard';
import { ContributeModal } from '@/components/goals/ContributeModal';
import { useGoals, useGoalMilestones } from '@/hooks/useGoals';
import { Goal } from '@financeflow/shared';
import { cn } from '@/lib/utils';
import { AIGoalMentor } from '@/components/goals/AIGoalMentor';

type GoalFilter = 'all' | 'savings' | 'debt_payoff' | 'investment' | 'completed';

export default function GoalsDashboard() {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState<GoalFilter>('all');
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [showContributeModal, setShowContributeModal] = useState(false);

    // React Query hooks
    const { data: goals = [], isLoading } = useGoals(selectedFilter);

    // Summary Stats
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'active');
    const totalSaved = goals.reduce((acc, g) => acc + g.current_amount, 0);
    const totalTarget = goals.reduce((acc, g) => acc + g.target_amount, 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    // Calculate total needed per month for all active goals
    const totalMonthlyContribution = activeGoals.reduce((acc, g) => {
        const targetDate = new Date(g.target_date);
        const today = new Date();
        const monthsLeft = Math.max(1, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        const remaining = g.target_amount - g.current_amount;
        return acc + (remaining / monthsLeft);
    }, 0);

    const highPriorityCount = activeGoals.filter(g => g.priority === 'high').length;
    const completedGoalsCount = goals.filter(g => g.status === 'completed').length;

    const handleContribute = (goal: Goal) => {
        setSelectedGoal(goal);
        setShowContributeModal(true);
    };

    // ... existing code

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-white/5">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">Goals</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                        Turn your dreams into reality with AI-powered tracking.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/goals/new')}
                    className="h-12 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 font-bold px-8 rounded-xl transition-all hover:scale-105 active:scale-95"
                    icon={<Plus size={22} strokeWidth={2.5} />}
                >
                    Create New Goal
                </Button>
            </div>

            {/* AI Goal Mentor Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AIGoalMentor />
                </div>
                <div className="lg:col-span-1">
                    <Card className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-2xl shadow-indigo-500/20 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md mb-4 border border-white/10">
                                    <Target size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Total Progress</h3>
                                <div className="text-5xl font-black tracking-tight mb-2">
                                    {overallProgress}%
                                </div>
                                <p className="text-indigo-100 font-medium opacity-90">
                                    RM {totalSaved.toLocaleString()} saved of RM {totalTarget.toLocaleString()}
                                </p>
                            </div>

                            <div className="w-full bg-black/20 rounded-full h-3 mt-6 backdrop-blur-sm overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${overallProgress}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="bg-white h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bento Grid Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <SummaryCard
                    title="Active Goals"
                    value={activeGoals.length}
                    icon={<Target className="text-primary-500" />}
                    subtitle={`${highPriorityCount} high priority`}
                    trend="+2 this month"
                />
                <SummaryCard
                    title="Monthly Target"
                    value={`RM ${Math.round(totalMonthlyContribution).toLocaleString()}`}
                    icon={<TrendingUp className="text-emerald-500" />}
                    subtitle="Estimated needed"
                    trend="On track"
                    trendColor="text-emerald-500"
                />
                <SummaryCard
                    title="Goals Achieved"
                    value={completedGoalsCount}
                    icon={<Trophy className="text-amber-500" />}
                    subtitle="Lifetime total"
                    trend="Top 5%"
                    trendColor="text-amber-500"
                />
                <SummaryCard
                    title="Next Milestone"
                    value="15 Days"
                    icon={<Sparkles className="text-purple-500" />}
                    subtitle="Emergency Fund"
                    trend="Keep going!"
                    trendColor="text-purple-500"
                />
            </div>

            {/* Goals Filtering & Grid */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-30 py-2 backdrop-blur-xl bg-slate-50/80 dark:bg-slate-900/80 -mx-4 px-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto p-1">
                        {[
                            { value: 'all', label: 'All Goals', icon: '🎯' },
                            { value: 'savings', label: 'Savings', icon: '💰' },
                            { value: 'debt_payoff', label: 'Debt Payoff', icon: '💳' },
                            { value: 'investment', label: 'Investment', icon: '📈' },
                            { value: 'completed', label: 'Completed', icon: '✅' },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value as GoalFilter)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border",
                                    selectedFilter === filter.value
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <span>{filter.icon}</span>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 animate-pulse" />
                            <Loader2 className="w-12 h-12 animate-spin text-primary-500 relative z-10" />
                        </div>
                    </div>
                ) : goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {goals.map((goal, index) => (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GoalCard
                                    goal={goal}
                                    onClick={() => navigate(`/goals/${goal.id}`)}
                                    onContribute={handleContribute}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-slate-200 dark:border-white/10 bg-white/5 backdrop-blur-sm rounded-[32px]">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white/5">
                            <Target className="text-slate-400" size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                            {selectedFilter === 'all' ? 'Start Your Journey' : `No ${selectedFilter.replace('_', ' ')} Goals`}
                        </h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                            {selectedFilter === 'all'
                                ? 'Your financial dreams are waiting. Create your first goal to start tracking your progress today.'
                                : `You haven't set any ${selectedFilter.replace('_', ' ')} goals yet.`}
                        </p>
                        <Button
                            className="bg-primary-600 hover:bg-primary-700 text-white px-10 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all"
                            onClick={() => navigate('/goals/new')}
                            icon={<Plus size={24} />}
                        >
                            Create Goal
                        </Button>
                    </Card>
                )}
            </div>

            {/* Contribute Modal */}
            {selectedGoal && (
                <ContributeModal
                    goalId={selectedGoal.id}
                    goalName={selectedGoal.name}
                    currentAmount={selectedGoal.current_amount}
                    targetAmount={selectedGoal.target_amount}
                    isOpen={showContributeModal}
                    onClose={() => {
                        setShowContributeModal(false);
                        setSelectedGoal(null);
                    }}
                />
            )}
        </div>
    );
}

function SummaryCard({ title, value, icon, subtitle, trend, trendColor = "text-slate-500" }: any) {
    return (
        <Card className="flex flex-col p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-[24px]">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    {icon}
                </div>
                {trend && (
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5", trendColor)}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-auto">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{title}</span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</h4>
                <p className="text-xs font-medium text-slate-400">{subtitle}</p>
            </div>
        </Card>
    );
}
