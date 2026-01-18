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

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Goals</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and achieve your dreams</p>
                </div>
                <Button
                    onClick={() => navigate('/goals/new')}
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 font-semibold px-6"
                    icon={<Plus size={20} />}
                >
                    New Goal
                </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${selectedFilter === filter.value
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span>{filter.icon}</span>
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Progress"
                    value={`${overallProgress}%`}
                    icon={<Trophy className="text-amber-500" />}
                    subtitle={`RM ${totalSaved.toLocaleString()} of RM ${totalTarget.toLocaleString()}`}
                />
                <SummaryCard
                    title="Active Goals"
                    value={activeGoals.length}
                    icon={<Target className="text-primary-500" />}
                    subtitle={`${highPriorityCount} high priority`}
                />
                <SummaryCard
                    title="Monthly Target"
                    value={`RM ${Math.round(totalMonthlyContribution).toLocaleString()}`}
                    icon={<TrendingUp className="text-emerald-500" />}
                    subtitle="Estimated contribution"
                />
                <SummaryCard
                    title="Goals Achieved"
                    value={completedGoalsCount}
                    icon={<Sparkles className="text-purple-500" />}
                    subtitle={`${totalGoals} total goals`}
                />
            </div>

            {/* Milestones Preview Section */}
            {activeGoals.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-xl shadow-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                            <Trophy size={24} className="text-purple-200" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Upcoming Milestones</h3>
                            <p className="text-sm text-purple-100 opacity-90">You're making great progress!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeGoals.slice(0, 3).map((goal) => {
                            const progress = (goal.current_amount / goal.target_amount) * 100;
                            const nextMilestone = progress < 25 ? 25 : progress < 50 ? 50 : progress < 75 ? 75 : 100;
                            const remaining = (goal.target_amount * (nextMilestone / 100)) - goal.current_amount;

                            return (
                                <div key={goal.id} className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{goal.emoji || '🎯'}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold truncate">{goal.name}</div>
                                            <div className="text-xs text-purple-200">Next: {nextMilestone}%</div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        RM {remaining.toLocaleString()} to go
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Goals Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedFilter === 'all' ? 'All Goals' :
                            selectedFilter === 'completed' ? 'Completed Goals' :
                                `${selectedFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Goals`}
                    </h2>
                    <div className="text-sm text-slate-500">
                        {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                    </div>
                ) : goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-slate-200 dark:border-white/10 bg-transparent">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Target className="text-slate-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {selectedFilter === 'all' ? 'No goals set yet' : `No ${selectedFilter.replace('_', ' ')} goals`}
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            {selectedFilter === 'all'
                                ? 'Dreaming of a new car, a home, or a vacation? Start tracking your savings today!'
                                : `Create a ${selectedFilter.replace('_', ' ')} goal to get started.`}
                        </p>
                        <Button
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-12 rounded-xl text-lg font-bold"
                            onClick={() => navigate('/goals/new')}
                        >
                            Create Your First Goal
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

function SummaryCard({ title, value, icon, subtitle }: any) {
    return (
        <Card className="flex flex-col p-6 hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/5 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {icon}
                </div>
            </div>
            <div className="mt-auto">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
        </Card>
    );
}
