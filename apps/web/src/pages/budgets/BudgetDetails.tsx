import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Loader2, Calendar, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Brain, Settings, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { useBudget, useBudgetPeriods, useBudgetHealth, useUpdateBudget, useDeleteBudget } from '@/hooks/useBudgets';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function BudgetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAlertSettings, setShowAlertSettings] = useState(false);
    const [alertThresholds, setAlertThresholds] = useState<number[]>([75, 90, 100]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // React Query hooks
    const { data: budgetData, isLoading } = useBudget(id!);
    const { data: periodsData } = useBudgetPeriods(id!);
    const { data: healthData, isLoading: isAnalyzing } = useBudgetHealth();
    const updateBudget = useUpdateBudget();
    const deleteBudget = useDeleteBudget();

    const budget = budgetData?.budget;
    const period = budgetData?.currentPeriod;
    const periods = periodsData || [];

    // Initialize alert settings from budget
    useState(() => {
        if (budget) {
            setAlertThresholds(budget.alert_thresholds || [75, 90, 100]);
            setNotificationsEnabled(budget.notifications_enabled ?? true);
        }
    });

    const handleSaveAlertSettings = async () => {
        if (!budget) return;

        await updateBudget.mutateAsync({
            id: budget.id,
            alert_thresholds: alertThresholds,
            notifications_enabled: notificationsEnabled,
        });
        setShowAlertSettings(false);
    };

    const handleDelete = async () => {
        if (!budget) return;
        if (confirm(`Are you sure you want to delete "${budget.name}"? This action cannot be undone.`)) {
            await deleteBudget.mutateAsync(budget.id);
            navigate('/budgets');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-medium italic">Analyzing your budget limits...</p>
            </div>
        );
    }

    if (!budget) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Budget not found</h2>
            <Button onClick={() => navigate('/budgets')} className="mt-4">Back to Budgets</Button>
        </div>
    );

    // Calculate days remaining
    const today = new Date();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemaining = Math.max(1, Math.ceil((monthEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const daysElapsed = today.getDate();
    const totalDaysInMonth = monthEnd.getDate();

    const spent = period?.spent_amount || 0;
    const dailyAllowance = Math.max(0, (budget.amount - spent) / daysRemaining);
    const averageDailySpending = spent / daysElapsed;

    // Projection calculation
    const projectedSpending = averageDailySpending * totalDaysInMonth;
    const projectedOverage = Math.max(0, projectedSpending - budget.amount);

    // Prepare spending trends data (last 30 days)
    const spendingTrendsData = eachDayOfInterval({
        start: subMonths(today, 1),
        end: today
    }).map((date, index) => ({
        date: format(date, 'MMM dd'),
        spent: Math.random() * (budget.amount / 30) * (1 + index * 0.02), // Simulated data
        budget: budget.amount / 30,
    }));

    // Historical performance data (last 6 periods)
    const historicalData = periods.slice(0, 6).reverse().map((p, index) => ({
        period: format(new Date(p.start_date), 'MMM yyyy'),
        spent: p.spent_amount,
        budget: budget.amount,
        status: p.status,
        percentage: Math.round((p.spent_amount / budget.amount) * 100),
    }));

    // Budget health from AI
    const budgetHealth = healthData?.health_score ?? 85;
    const healthInsight = healthData?.insight || "Your spending is well-managed. Keep up the good work!";

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Button
                        variant="ghost"
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                        onClick={() => navigate('/budgets')}
                    >
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{budget.emoji || '💰'}</span>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {budget.name}
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded text-[10px] font-black uppercase tracking-widest leading-none">
                                {budget.period}
                            </span>
                            • {budget.category_id ? 'Targeting Category' : 'General Budget'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                        variant="secondary"
                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold"
                        icon={<Edit2 size={18} />}
                        onClick={() => navigate(`/budgets/${id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold"
                        icon={<Trash2 size={18} />}
                        onClick={handleDelete}
                        disabled={deleteBudget.isPending}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Visual Card & Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <BudgetCard budget={budget} currentPeriod={period} />

                    {/* Alert Settings Card */}
                    <Card className="p-6 bg-slate-900 border-slate-800 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Settings size={80} />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-6 relative z-10">Configuration</h3>
                        <div className="space-y-4 relative z-10">
                            <SettingRow label="Period" value={budget.period} />
                            <SettingRow label="Rollover" value={budget.rollover_enabled ? 'Active' : 'Disabled'} highlight={budget.rollover_enabled} />
                            <SettingRow label="Alerts" value={`${budget.alert_thresholds?.join('%, ') || '75, 90, 100'}%`} />
                            <SettingRow label="Reporting" value={budget.notifications_enabled ? 'Real-time' : 'Muted'} />
                        </div>
                        <Button
                            className="w-full mt-8 bg-white/10 hover:bg-white/20 border-white/5 text-white font-bold h-12 rounded-xl"
                            onClick={() => setShowAlertSettings(true)}
                        >
                            Configure Alerts
                        </Button>
                    </Card>

                    {/* AI Insights Card */}
                    <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-xl shadow-purple-500/20 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Brain size={120} />
                        </div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
                            <h3 className="font-bold">AI Budget Health</h3>
                        </div>
                        <div className="mb-4 relative z-10">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-black">{budgetHealth}</span>
                                <span className="text-lg text-purple-200">/100</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${budgetHealth}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-white rounded-full"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-purple-50 leading-relaxed relative z-10">
                            {healthInsight}
                        </p>
                    </Card>
                </div>

                {/* Right Column: Analytics & Transactions */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Calendar className="text-emerald-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Days Remaining</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{daysRemaining}</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(daysRemaining / totalDaysInMonth) * 100}%` }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </Card>

                        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <TrendingUp className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Daily Allowance</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                                        RM {Math.round(dailyAllowance).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">To stay within budget for the rest of month.</p>
                        </Card>

                        <Card className={cn(
                            "p-6 border-white/10 bg-white/5 backdrop-blur-xl group transition-all",
                            projectedOverage > 0 ? "hover:border-red-500/30" : "hover:border-emerald-500/30"
                        )}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    projectedOverage > 0 ? "bg-red-500/10" : "bg-emerald-500/10"
                                )}>
                                    {projectedOverage > 0 ? (
                                        <AlertTriangle className="text-red-500" size={24} />
                                    ) : (
                                        <DollarSign className="text-emerald-500" size={24} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Projection</p>
                                    <p className={cn(
                                        "text-3xl font-black font-mono",
                                        projectedOverage > 0 ? "text-red-500" : "text-emerald-500"
                                    )}>
                                        {projectedOverage > 0 ? '+' : ''}RM {Math.round(projectedOverage > 0 ? projectedOverage : budget.amount - projectedSpending).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                {projectedOverage > 0 ? 'Projected overage' : 'Projected savings'}
                            </p>
                        </Card>
                    </div>

                    {/* Spending Trends Chart */}
                    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Spending Trends</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                                    <span>Actual</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                    <span>Budget</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    <span>Projection</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={spendingTrendsData}>
                                <defs>
                                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1A1F3A',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="spent"
                                    stroke="#0066FF"
                                    strokeWidth={3}
                                    fill="url(#colorSpent)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="budget"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Historical Performance Table */}
                    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Historical Performance</h3>
                            <span className="text-xs font-bold text-slate-500">{historicalData.length} Periods</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">Period</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">Budget</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">Spent</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">Usage</th>
                                        <th className="text-center py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historicalData.map((row, index) => (
                                        <motion.tr
                                            key={row.period}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">{row.period}</td>
                                            <td className="py-4 px-4 text-right font-mono text-slate-600 dark:text-slate-400">RM {row.budget.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">RM {row.spent.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-20 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                row.percentage >= 100 ? "bg-red-500" :
                                                                    row.percentage >= 90 ? "bg-orange-500" :
                                                                        row.percentage >= 75 ? "bg-amber-500" :
                                                                            "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${Math.min(100, row.percentage)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{row.percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                                                    row.status === 'on_track' ? "bg-emerald-500/10 text-emerald-500" :
                                                        row.status === 'warning' ? "bg-amber-500/10 text-amber-500" :
                                                            row.status === 'critical' ? "bg-orange-500/10 text-orange-500" :
                                                                "bg-red-500/10 text-red-500"
                                                )}>
                                                    {row.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Alert Settings Modal */}
            <AnimatePresence>
                {showAlertSettings && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            onClick={() => setShowAlertSettings(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <Card className="w-full max-w-md p-8 bg-slate-900 border-slate-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Alert Settings</h3>
                                    <button
                                        onClick={() => setShowAlertSettings(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-3">Alert Thresholds (%)</label>
                                        <div className="flex gap-3">
                                            {[75, 90, 100].map((threshold) => (
                                                <button
                                                    key={threshold}
                                                    onClick={() => {
                                                        if (alertThresholds.includes(threshold)) {
                                                            setAlertThresholds(alertThresholds.filter(t => t !== threshold));
                                                        } else {
                                                            setAlertThresholds([...alertThresholds, threshold].sort((a, b) => a - b));
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl font-bold transition-all",
                                                        alertThresholds.includes(threshold)
                                                            ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                                                            : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                    )}
                                                >
                                                    {threshold}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <p className="font-bold text-white">Push Notifications</p>
                                            <p className="text-xs text-slate-400">Receive real-time alerts</p>
                                        </div>
                                        <button
                                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                            className={cn(
                                                "relative w-14 h-8 rounded-full transition-colors",
                                                notificationsEnabled ? "bg-primary-500" : "bg-slate-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-6 h-6 bg-white rounded-full transition-transform",
                                                notificationsEnabled ? "left-7" : "left-1"
                                            )} />
                                        </button>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 text-slate-400 hover:text-white"
                                            onClick={() => setShowAlertSettings(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                                            icon={<Save size={18} />}
                                            onClick={handleSaveAlertSettings}
                                            disabled={updateBudget.isPending}
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function SettingRow({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center group/row">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={cn(
                "text-sm font-bold tracking-tight px-2 py-0.5 rounded transition-all",
                highlight ? "text-primary-400 bg-primary-400/10" : "text-slate-300 group-hover/row:text-white"
            )}>
                {value}
            </span>
        </div>
    );
}
