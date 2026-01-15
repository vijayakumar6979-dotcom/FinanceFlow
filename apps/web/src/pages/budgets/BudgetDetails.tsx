import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BudgetCard } from '@/components/budgets/BudgetCard';
// Reuse existing dashboard components for efficiency
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingTrendsChart } from '@/components/dashboard/SpendingTrendsChart';
import { Budget, BudgetPeriod } from '@financeflow/shared';

// Mock Data (in real app, fetch by ID)
const MOCK_BUDGET: Budget = {
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
};

const MOCK_PERIOD: BudgetPeriod = {
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
};

export default function BudgetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // In real app: Fetch budget by id
    const budget = MOCK_BUDGET;
    const period = MOCK_PERIOD;

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="p-2" onClick={() => navigate('/budgets')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{budget.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Monthly Budget</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={<Edit2 size={16} />}>Edit</Button>
                    <Button variant="danger" icon={<Trash2 size={16} />}>Delete</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Main Card */}
                <div className="space-y-6 lg:col-span-1">
                    <BudgetCard budget={budget} currentPeriod={period} />

                    <Card className="bg-slate-900 text-white border-slate-800">
                        <h3 className="font-bold mb-4">Budget Settings</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Period</span>
                                <span className="capitalize">{budget.period}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rollover</span>
                                <span>{budget.rollover_enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Notifications</span>
                                <span>{budget.notifications_enabled ? 'On' : 'Off'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Alerts at</span>
                                <span>{budget.alert_thresholds.join('%, ')}%</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: History & Trends */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Trends - Reusing dashboard chart but conceptually filtering for this category */}
                    <SpendingTrendsChart />

                    {/* Transactions - Reusing dashboard list but conceptually filtering */}
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
