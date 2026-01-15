import { useState } from 'react';
import { Target, Trophy, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoalCard } from '@/components/goals/GoalCard';
import { Goal } from '@financeflow/shared';

// Mock Data
const MOCK_GOALS: Goal[] = [
    {
        id: '1',
        user_id: 'user1',
        name: 'New MacBook Pro',
        target_amount: 12000,
        current_amount: 4500,
        currency: 'MYR',
        target_date: '2024-06-01',
        emoji: '💻',
        color: 'bg-blue-500',
        goal_type: 'savings',
        priority: 'high',
        auto_contribute_enabled: true,
        status: 'active',
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        user_id: 'user1',
        name: 'Bali Trip',
        target_amount: 5000,
        current_amount: 1200,
        currency: 'MYR',
        target_date: '2024-08-15',
        emoji: '🏝️',
        color: 'bg-emerald-500',
        goal_type: 'savings',
        priority: 'medium',
        auto_contribute_enabled: false,
        status: 'active',
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        user_id: 'user1',
        name: 'Emergency Fund',
        target_amount: 20000,
        current_amount: 15400,
        currency: 'MYR',
        target_date: '2024-12-31',
        emoji: '🛡️',
        color: 'bg-purple-500',
        goal_type: 'custom',
        priority: 'high',
        auto_contribute_enabled: true,
        status: 'active',
        created_at: '',
        updated_at: ''
    }
];

export default function GoalsDashboard() {
    const navigate = useNavigate();
    const [goals] = useState<Goal[]>(MOCK_GOALS);

    // Summary Stats
    const totalGoals = goals.length;
    const totalSaved = goals.reduce((acc, g) => acc + g.current_amount, 0);
    const totalTarget = goals.reduce((acc, g) => acc + g.target_amount, 0);
    const overallProgress = Math.round((totalSaved / totalTarget) * 100) || 0;

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Goals</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and achieve your dreams</p>
                </div>
                <Button
                    onClick={() => navigate('/goals/new')}
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30"
                    icon={<Plus size={18} />}
                >
                    New Goal
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Saved"
                    value={`RM ${totalSaved.toLocaleString()}`}
                    icon={<Trophy className="text-amber-500" />}
                    subtitle={`${overallProgress}% of Total Target`}
                />
                <SummaryCard
                    title="Active Goals"
                    value={totalGoals}
                    icon={<Target className="text-blue-500" />}
                    subtitle="2 High Priority"
                />
                <SummaryCard
                    title="Monthly Contribution"
                    value="RM 850"
                    icon={<TrendingUp className="text-emerald-500" />}
                    subtitle="On Track"
                />
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}

                {/* Empty State / Add New Placeholder */}
                {goals.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                        <Target size={48} className="mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No goals yet</h3>
                        <p className="mb-4">Start saving for something special today.</p>
                        <Button onClick={() => navigate('/goals/new')}>Create your first goal</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, subtitle }: any) {
    return (
        <Card className="flex flex-col">
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
