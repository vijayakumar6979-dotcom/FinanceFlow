import { useState } from 'react';
import { Target, TrendingDown, Clock, Heart, Plus, Loader2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetTemplates } from '@/components/budgets/BudgetTemplates';
import { BudgetOverviewChart } from '@/components/budgets/BudgetOverviewChart';
import { useBudgets, useBudgetHealth, useCreateBudget } from '@/hooks/useBudgets';
import { ContributeModal } from '@/components/goals/ContributeModal';

export default function BudgetsDashboard() {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'last' | 'quarter'>('current');
    const [showTemplates, setShowTemplates] = useState(false);

    // React Query hooks
    const { data, isLoading } = useBudgets();
    const { data: healthData, isLoading: isAnalyzing, refetch: refetchHealth } = useBudgetHealth();
    const createBudget = useCreateBudget();

    const budgets = data?.budgets || [];
    const periods = data?.periods || [];

    // Summary Stats
    const totalBudget = budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
    const totalSpent = periods.reduce((acc, p) => acc + (p.spent_amount || 0), 0);
    const remaining = totalBudget - totalSpent;

    // Calculate days remaining in current month
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = lastDay.getDate() - now.getDate();

    const healthScore = healthData?.health_score ?? (budgets.length > 0
        ? Math.round((periods.filter(p => ['on_track', 'warning'].includes(p.status)).length / budgets.length) * 100)
        : 100);

    const getHealthLabel = (score: number) => {
        if (score >= 90) return { label: 'Excellent', color: 'text-emerald-500' };
        if (score >= 70) return { label: 'Good', color: 'text-amber-500' };
        return { label: 'Needs Attention', color: 'text-red-500' };
    };

    const health = getHealthLabel(healthScore);

    const handleTemplateSelect = async (template: any, calculatedBudgets: any[]) => {
        // Create budgets from template
        for (const budget of calculatedBudgets) {
            await createBudget.mutateAsync({
                name: budget.category,
                amount: budget.amount,
                currency: 'MYR',
                period: 'monthly',
                start_date: new Date().toISOString().split('T')[0],
                emoji: budget.icon,
                rollover_enabled: false,
                rollover_amount: 0,
                alert_thresholds: [75, 90, 100],
                notifications_enabled: true,
                is_active: true,
                category_id: '', // Will be set by backend
                user_id: '', // Will be set by hook
            } as any);
        }
        setShowTemplates(false);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Budgets</h1>
                    <p className="text-slate-500 dark:text-slate-400">Plan and track your spending</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-slate-600 dark:text-slate-300"
                        onClick={() => setShowTemplates(!showTemplates)}
                    >
                        {showTemplates ? 'Hide Templates' : 'Templates'}
                    </Button>
                    <Button
                        onClick={() => navigate('/budgets/new')}
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30"
                        icon={<Plus size={18} />}
                    >
                        Create Budget
                    </Button>
                </div>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter size={18} className="text-slate-400 flex-shrink-0" />
                {[
                    { value: 'current', label: 'This Month' },
                    { value: 'last', label: 'Last Month' },
                    { value: 'quarter', label: 'This Quarter' },
                ].map((period) => (
                    <button
                        key={period.value}
                        onClick={() => setSelectedPeriod(period.value as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedPeriod === period.value
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {period.label}
                    </button>
                ))}
            </div>

            {/* Budget Templates Section */}
            {showTemplates && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <BudgetTemplates onSelectTemplate={handleTemplateSelect} />
                </motion.div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Budget"
                    value={`RM ${totalBudget.toLocaleString()}`}
                    icon={<Target className="text-primary-500" />}
                    subtitle="This Month"
                />
                <SummaryCard
                    title="Total Spent"
                    value={`RM ${totalSpent.toLocaleString()}`}
                    icon={<TrendingDown className={totalSpent > totalBudget ? "text-red-500" : "text-emerald-500"} />}
                    subtitle={totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% Used` : 'No budget set'}
                />
                <SummaryCard
                    title="Remaining"
                    value={`RM ${Math.max(0, remaining).toLocaleString()}`}
                    icon={<Clock className="text-emerald-500" />}
                    subtitle={`${daysLeft} days left in month`}
                />
                <SummaryCard
                    title="Health Score"
                    value={isAnalyzing ? 'Analyzing...' : `${healthScore}/100`}
                    icon={isAnalyzing ? <Loader2 className="animate-spin text-primary-500" size={18} /> : <Heart className={health.color} />}
                    subtitle={isAnalyzing ? 'AI is analyzing' : health.label}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Budgets Grid */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Budgets</h2>
                        <div className="text-sm text-slate-500">
                            {budgets.length} Categories
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : budgets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {budgets.map((budget, index) => (
                                <motion.div
                                    key={budget.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <BudgetCard
                                        budget={budget}
                                        currentPeriod={periods.find(p => p.budget_id === budget.id)}
                                        onEdit={(b) => navigate(`/budgets/${b.id}/edit`)}
                                        onDelete={(b) => console.log('Delete', b)}
                                        onViewTransactions={(b) => navigate(`/budgets/${b.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed border-2">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Target className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No budgets set yet</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                                Create your first budget to start tracking your spending habits.
                            </p>
                            <Button onClick={() => navigate('/budgets/new')}>
                                Create First Budget
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Chart & Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Spending Analysis</h2>
                        <BudgetOverviewChart budgets={budgets} periods={periods} />
                    </div>

                    <Card className="bg-gradient-to-br from-primary-600 to-primary-900 text-white border-none p-6 shadow-xl shadow-primary-500/20 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <span className="text-lg">💡</span>}
                            <h3 className="font-bold">AI Insights</h3>
                        </div>
                        <p className="text-sm text-primary-50 mb-4 leading-relaxed relative z-10">
                            {healthData?.insight || "Your budget health is being analyzed by our AI to provide personalized spending insights."}
                        </p>
                        {healthData?.at_risk_categories?.length > 0 && (
                            <div className="mb-4 space-y-2 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-200">Attention Required</p>
                                <div className="flex flex-wrap gap-2">
                                    {healthData.at_risk_categories.map((cat: string) => (
                                        <span key={cat} className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold">{cat}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className="w-full text-white hover:bg-white/10 border-white/20 relative z-10"
                            onClick={() => refetchHealth()}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? "Processing..." : "Refresh Insights"}
                        </Button>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Heart size={120} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, subtitle }: any) {
    return (
        <Card className="flex flex-col p-6 hover:shadow-lg transition-shadow duration-300">
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
