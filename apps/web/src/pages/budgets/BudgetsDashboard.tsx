import { useState } from 'react';
import { Target, TrendingDown, Clock, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetOverviewChart } from '@/components/budgets/BudgetOverviewChart';
import { Budget, BudgetPeriod } from '@financeflow/shared';

// Mock Data for UI Dev
const MOCK_BUDGETS: Budget[] = [
    {
        id: '1',
        user_id: 'user1',
        category_id: 'cat1',
        name: 'Food & Dining',
        amount: 800,
        currency: 'MYR',
        period: 'monthly',
        start_date: '2024-01-01',
        rollover_enabled: false,
        rollover_amount: 0,
        alert_thresholds: [75, 90, 100],
        notifications_enabled: true,
        is_active: true,
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        user_id: 'user1',
        category_id: 'cat2',
        name: 'Transportation',
        amount: 400,
        currency: 'MYR',
        period: 'monthly',
        start_date: '2024-01-01',
        rollover_enabled: true,
        rollover_amount: 0,
        alert_thresholds: [],
        notifications_enabled: true,
        is_active: true,
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        user_id: 'user1',
        category_id: 'cat3',
        name: 'Shopping',
        amount: 300,
        currency: 'MYR',
        period: 'monthly',
        start_date: '2024-01-01',
        rollover_enabled: false,
        rollover_amount: 0,
        alert_thresholds: [],
        notifications_enabled: true,
        is_active: true,
        created_at: '',
        updated_at: ''
    }
];

const MOCK_PERIODS: BudgetPeriod[] = [
    {
        id: 'p1',
        budget_id: '1',
        user_id: 'user1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        budget_amount: 800,
        spent_amount: 650,
        remaining_amount: 150,
        status: 'on_track',
        created_at: ''
    },
    {
        id: 'p2',
        budget_id: '2',
        user_id: 'user1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        budget_amount: 400,
        spent_amount: 380,
        remaining_amount: 20,
        status: 'warning',
        created_at: ''
    },
    {
        id: 'p3',
        budget_id: '3',
        user_id: 'user1',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        budget_amount: 300,
        spent_amount: 450,
        remaining_amount: -150,
        status: 'exceeded',
        created_at: ''
    }
];

export default function BudgetsDashboard() {
    const navigate = useNavigate();
    const [budgets] = useState<Budget[]>(MOCK_BUDGETS);
    const [periods] = useState<BudgetPeriod[]>(MOCK_PERIODS);

    // Summary Stats
    const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
    const totalSpent = periods.reduce((acc, p) => acc + p.spent_amount, 0);
    const remaining = totalBudget - totalSpent;
    const healthScore = 78; // Mock score

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</h1>
                    <p className="text-slate-500 dark:text-slate-400">Plan and track your spending</p>
                </div>
                <Button
                    onClick={() => navigate('/budgets/new')}
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30"
                    icon={<Plus size={18} />}
                >
                    Create Budget
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Budget"
                    value={`RM ${totalBudget.toLocaleString()}`}
                    icon={<Target className="text-blue-500" />}
                    subtitle="This Month"
                />
                <SummaryCard
                    title="Total Spent"
                    value={`RM ${totalSpent.toLocaleString()}`}
                    icon={<TrendingDown className="text-red-500" />}
                    subtitle={`${Math.round((totalSpent / totalBudget) * 100)}% Used`}
                />
                <SummaryCard
                    title="Remaining"
                    value={`RM ${remaining.toLocaleString()}`}
                    icon={<Clock className="text-emerald-500" />}
                    subtitle="12 days left"
                />
                <SummaryCard
                    title="Health Score"
                    value={`${healthScore}/100`}
                    icon={<Heart className="text-amber-500" />}
                    subtitle="Good"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budgets Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgets.map(budget => (
                            <BudgetCard
                                key={budget.id}
                                budget={budget}
                                currentPeriod={periods.find(p => p.budget_id === budget.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Chart & Sidebar */}
                <div className="space-y-6">
                    <BudgetOverviewChart budgets={budgets} periods={periods} />

                    {/* AI Tips could go here */}
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                        <h3 className="font-bold mb-2">💡 AI Tip</h3>
                        <p className="text-sm opacity-90">
                            You're spending 15% more on Dining compared to last month. Try cooking at home this weekend to stay on track!
                        </p>
                    </Card>
                </div>
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
