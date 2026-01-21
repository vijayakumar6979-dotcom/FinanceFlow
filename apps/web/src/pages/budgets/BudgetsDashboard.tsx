import { useState } from 'react';
import { Target, TrendingDown, Clock, Plus, Loader2, Filter, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ModernBudgetCard } from '@/components/budgets/ModernBudgetCard';
import { AIBudgetAssistant } from '@/components/budgets/AIBudgetAssistant';
import { BudgetTemplates } from '@/components/budgets/BudgetTemplates';
import { BudgetOverviewChart } from '@/components/budgets/BudgetOverviewChart';
import { useBudgets, useBudgetHealth, useCreateBudget } from '@/hooks/useBudgets';
import { cn } from '@/lib/utils';

export default function BudgetsDashboard() {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'last' | 'quarter'>('current');
    const [showTemplates, setShowTemplates] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // React Query hooks
    const { data, isLoading } = useBudgets();
    const { data: healthData, isLoading: isAnalyzing } = useBudgetHealth();
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
                category_id: null,
                user_id: null,
            } as any);
        }
        setShowTemplates(false);
    };

    // Transform health data for AI Assistant
    const aiInsights = healthData?.at_risk_categories?.map((cat: string) => ({
        id: cat,
        type: 'warning',
        title: 'Spending Alert',
        description: `Your spending on ${cat} is higher than usual. Consider adjusting your budget.`,
        action: 'Review Budget'
    })) || [
            {
                id: 'welcome',
                type: 'info',
                title: 'Welcome to AI Budgets',
                description: 'I can help you analyze your spending patterns and suggest optimizations.',
            }
        ];

    if (healthData?.insight) {
        aiInsights.unshift({
            id: 'health',
            type: 'info',
            title: 'Health Analysis',
            description: healthData.insight,
        });
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 space-y-8 pb-20">
            {/* Hero Section with AI Assistant */}
            <div className="relative overflow-hidden bg-slate-900 pb-24 pt-12 lg:pt-20">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-soft-light"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                Smart Budgeting
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
                            >
                                Master your money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-400">AI precision</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-slate-400 max-w-lg"
                            >
                                Your financial co-pilot analyzes your spending in real-time to keep you on track.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-4"
                            >
                                <Button
                                    onClick={() => navigate('/budgets/new')}
                                    className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 h-12 px-8 rounded-xl font-bold text-base"
                                    icon={<Plus size={20} />}
                                >
                                    Create Budget
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-white hover:bg-white/10 h-12 px-8 rounded-xl font-semibold border border-white/10"
                                    onClick={() => setShowTemplates(!showTemplates)}
                                >
                                    {showTemplates ? 'Close Templates' : 'Browse Templates'}
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AIBudgetAssistant
                                insights={aiInsights}
                                onAskAI={(q) => console.log('AI Query:', q)}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-12 relative z-20">

                {/* Templates Section */}
                <AnimatePresence>
                    {showTemplates && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <BudgetTemplates onSelectTemplate={handleTemplateSelect} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Budget"
                        value={`RM ${totalBudget.toLocaleString()}`}
                        icon={<Target className="text-primary-500" />}
                        change="+12% vs last month"
                        positive={true}
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
                        title="Budget Health"
                        value={isAnalyzing ? 'Analyzing...' : 'Excellent'}
                        icon={isAnalyzing ? <Loader2 className="animate-spin text-primary-500" size={18} /> : <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        subtitle="On track to save goal"
                        positive={true}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Budget Grid */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Budgets</h2>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    <button
                                        onClick={() => setSelectedPeriod('current')}
                                        className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all", selectedPeriod === 'current' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900")}
                                    >
                                        This Month
                                    </button>
                                    <button
                                        onClick={() => setSelectedPeriod('last')}
                                        className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all", selectedPeriod === 'last' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900")}
                                    >
                                        Last Month
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow text-primary-500" : "text-slate-400")}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow text-primary-500" : "text-slate-400")}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                                <Button variant="ghost" size="sm" icon={<Filter size={16} />}>Filter</Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                            </div>
                        ) : budgets.length > 0 ? (
                            <div className={cn(
                                "grid gap-6",
                                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                            )}>
                                {budgets.map((budget, index) => (
                                    <div key={budget.id} className={viewMode === 'list' ? "h-32" : "h-64"}>
                                        <ModernBudgetCard
                                            budget={budget}
                                            currentPeriod={periods.find(p => p.budget_id === budget.id)}
                                            onEdit={(b) => navigate(`/budgets/${b.id}/edit`)}
                                            onDelete={(b) => console.log('Delete', b)}
                                            onViewTransactions={(b) => navigate(`/budgets/${b.id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2">
                                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
                                    <Target className="text-primary-500" size={40} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No budgets set yet</h3>
                                <p className="text-slate-500 text-base max-w-sm mx-auto mb-8">
                                    Start taking control of your finances by setting spending limits for different categories.
                                </p>
                                <Button onClick={() => navigate('/budgets/new')} className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 px-8 py-3 h-auto text-base">
                                    Create First Budget
                                </Button>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Analysis */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Spending Analysis</h3>
                            <div className="h-auto">
                                <BudgetOverviewChart budgets={budgets} periods={periods} />
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Top Spenders</h4>
                                <div className="space-y-3">
                                    {periods
                                        .sort((a, b) => (b.spent_amount || 0) - (a.spent_amount || 0))
                                        .slice(0, 3)
                                        .map(period => {
                                            const budget = budgets.find(b => b.id === period.budget_id);
                                            return (
                                                <div key={period.id} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                                                        <span className="text-slate-600 dark:text-slate-300">{budget?.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">RM {period.spent_amount.toLocaleString()}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, subtitle, change, positive }: any) {
    return (
        <Card className="p-0 border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-white dark:bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                    {change && (
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full",
                            positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        )}>
                            {change}
                        </span>
                    )}
                </div>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium block mb-1">{title}</span>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h4>
                    {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
                </div>
            </div>
        </Card>
    );
}

