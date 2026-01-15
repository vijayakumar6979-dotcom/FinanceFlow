import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Goal } from '@financeflow/shared';

// Mock Data
const MOCK_GOAL: Goal = {
    id: '1',
    user_id: 'user1',
    name: 'New MacBook Pro',
    target_amount: 12000,
    current_amount: 4500,
    currency: 'MYR',
    target_date: '2024-06-01',
    emoji: '💻', // Used in title
    color: 'bg-blue-500',
    goal_type: 'savings',
    priority: 'high',
    auto_contribute_enabled: true,
    status: 'active',
    created_at: '',
    updated_at: ''
};

const TIMELINE = [
    { id: 1, date: '2024-01-28', amount: 500, note: 'Monthly saving' },
    { id: 2, date: '2024-01-15', amount: 1000, note: 'Bonus contribution' },
    { id: 3, date: '2024-01-01', amount: 3000, note: 'Initial deposit' },
];

export default function GoalDetails() {
    const navigate = useNavigate();
    const goal = MOCK_GOAL;

    const percentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="p-2" onClick={() => navigate('/goals')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{goal.name}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Target: {goal.target_date}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={<Edit2 size={16} />}>Edit</Button>
                    <Button variant="danger" icon={<Trash2 size={16} />}>Delete</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Progress Card */}
                <div className="md:col-span-1">
                    <Card className="flex flex-col items-center justify-center p-8 h-full bg-white dark:bg-white/5">
                        <div className="mb-6 relative w-48 h-48">
                            {/* SVG Ring */}
                            <svg className="transform -rotate-90 w-full h-full">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100 dark:text-white/5"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 80}
                                    strokeDashoffset={(2 * Math.PI * 80) * ((100 - percentage) / 100)}
                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">{percentage.toFixed(0)}%</span>
                                <span className="text-sm text-slate-500">Completed</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Current</span>
                                <span className="font-bold text-slate-900 dark:text-white">RM {goal.current_amount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Target</span>
                                <span className="font-bold text-slate-900 dark:text-white">RM {goal.target_amount}</span>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" icon={<Plus size={16} />}>
                                Add Funds
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Timeline & details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                            <span className="text-xs text-slate-500">Days Remaining</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">138</div>
                        </Card>
                        <Card className="p-4">
                            <span className="text-xs text-slate-500">Monthly Est.</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">RM 850</div>
                        </Card>
                    </div>

                    {/* Contributions List */}
                    <Card>
                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Contribution History</h3>
                        <div className="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-white/10">
                            {TIMELINE.map((item) => (
                                <div key={item.id} className="relative pl-6">
                                    <div className="absolute left-[13.5px] top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-[#0A0E27]" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">RM {item.amount}</p>
                                            <p className="text-xs text-slate-500">{item.note}</p>
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {item.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
