import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    DollarSign,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Brain,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell
} from 'recharts';
import { useBills, useBillSummary } from '@/hooks/useBills';
import { BILL_CATEGORIES, formatCurrency } from '@financeflow/shared';
import { cn } from '@/lib/utils';

export function BillsAnalytics() {
    const { data: bills } = useBills();
    const { data: summary } = useBillSummary();

    const chartData = useMemo(() => {
        if (!bills || !summary) return { categories: [], trend: [] };

        // 1. Category Data for Radial Chart
        const catMap = bills.reduce((acc, bill) => {
            const cat = bill.provider_category;
            const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);
            if (!acc[cat]) acc[cat] = 0;
            acc[cat] += amount;
            return acc;
        }, {} as Record<string, number>);

        const categories = Object.entries(catMap)
            .map(([name, value]) => {
                const catInfo = BILL_CATEGORIES.find(c => c.value === name);
                return {
                    name,
                    value,
                    fill: catInfo?.color || '#94A3B8',
                };
            })
            .sort((a, b) => b.value - a.value); // Sort desc

        // 2. Mock Trend Data (since we don't have historical data in this simplified hook yet)
        const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
        const currentTotal = summary.total_monthly;
        const trend = months.map((month, i) => ({
            name: month,
            amount: currentTotal * (0.8 + Math.random() * 0.4), // Random variation around current
            isProjected: i === 5 // Current month is projected
        }));

        return { categories, trend };
    }, [bills, summary]);

    if (!bills || !summary) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 rounded-3xl bg-[#1A1F3A]/50 border border-white/5" />
                ))}
            </div>
        );
    }

    const aiInsights = [
        {
            type: 'warning',
            text: 'Variable bills are projected to increase by 12% next month due to seasonal trends.',
            icon: TrendingUp,
            color: 'text-rose-400'
        },
        {
            type: 'success',
            text: 'You saved RM 45.00 on electricity compared to last month average.',
            icon: CheckCircle2,
            color: 'text-emerald-400'
        },
        {
            type: 'info',
            text: 'Review your "Internet" subscription. Similar plans are available for RM 20 less.',
            icon: Search,
            color: 'text-blue-400'
        }
    ];

    return (
        <div className="space-y-8 text-white">
            {/* 1. Top Metrics Grid (3D Glass) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Metric3D
                    label="Total Monthly"
                    value={summary.total_monthly}
                    icon={DollarSign}
                    color="blue"
                    trend="+2.4%"
                    trendUp={true}
                />
                <Metric3D
                    label="Avg. per Bill"
                    value={summary.total_monthly / (bills.length || 1)}
                    icon={BarChart3}
                    color="purple"
                    trend="-1.2%"
                    trendUp={false}
                />
                <Metric3D
                    label="Paid So Far"
                    value={summary.paid_this_month.amount}
                    icon={CheckCircle2}
                    color="green"
                    progress={(summary.paid_this_month.amount / summary.total_monthly) * 100}
                />
                <Metric3D
                    label="Outstanding"
                    value={summary.total_monthly - summary.paid_this_month.amount}
                    icon={AlertTriangle}
                    color="red"
                    isAlert={summary.overdue.count > 0}
                />
            </div>

            {/* 2. Main Analytics Section (Bento Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Spend by Category (New Gauge Chart) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 p-6 rounded-[32px] bg-[#121629]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                        Category Split
                    </h3>

                    <div className="h-[300px] w-full relative z-10 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={chartData.categories}
                                startAngle={180}
                                endAngle={-180}
                            >
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                    background={{ fill: '#ffffff10' }}
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0E27', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [`RM ${Number(value).toFixed(2)}`, 'Amount']}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 mt-4">
                        {chartData.categories.slice(0, 3).map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                                    <span className="text-slate-300">{cat.name}</span>
                                </div>
                                <span className="font-bold">RM {cat.value.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Center/Right: Spending Trend & AI HUD */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-[32px] bg-[#1A1F3A]/80 backdrop-blur-xl border border-white/10 relative"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                6-Month Trend
                            </h3>
                            <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/20">Projected</span>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.trend} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#0A0E27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        formatter={(value: any) => [`RM ${Number(value).toFixed(0)}`, 'Total']}
                                    />
                                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                        {chartData.trend.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.isProjected ? 'url(#projectedGradient)' : 'url(#barGradient)'}
                                                stroke={entry.isProjected ? '#60A5FA' : 'transparent'}
                                                strokeWidth={entry.isProjected ? 2 : 0}
                                                strokeDasharray={entry.isProjected ? "4 4" : ""}
                                            />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#3B82F6" />
                                        </linearGradient>
                                        <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1e293b" />
                                            <stop offset="100%" stopColor="#0f172a" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Intelligence Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-1 rounded-[32px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
                    >
                        <div className="bg-[#0A0E27] rounded-[30px] p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Brain className="w-24 h-24 text-primary/10 animate-pulse" />
                            </div>

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                                <SparklesIcon />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                    AI Financial Intelligence
                                </span>
                            </h3>

                            <div className="space-y-4 relative z-10">
                                {aiInsights.map((insight, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className={cn("p-3 rounded-xl bg-white/5 h-fit", insight.color)}>
                                            <insight.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200 leading-relaxed">
                                                {insight.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// 3D Metric Card Helper
function Metric3D({ label, value, icon: Icon, color, trend, trendUp, progress, isAlert }: any) {
    const colorStyles = {
        blue: "from-blue-600 to-indigo-600 shadow-blue-500/20",
        purple: "from-purple-600 to-pink-600 shadow-purple-500/20",
        green: "from-emerald-600 to-teal-600 shadow-emerald-500/20",
        red: "from-rose-600 to-orange-600 shadow-rose-500/20",
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(
                "relative overflow-hidden rounded-[24px] p-6 text-white shadow-xl transition-all",
                "bg-gradient-to-br border border-white/10",
                colorStyles[color as keyof typeof colorStyles]
            )}
        >

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md",
                            trendUp ? "bg-emerald-400/20 text-emerald-100" : "bg-white/20 text-white"
                        )}>
                            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {trend}
                        </div>
                    )}
                    {isAlert && (
                        <div className="animate-pulse bg-white/20 px-2 py-1 rounded-lg">
                            <AlertTriangle size={14} />
                        </div>
                    )}
                </div>

                <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
                <h3 className="text-3xl font-black tracking-tight">
                    <span className="text-lg opacity-70 font-normal mr-1">RM</span>
                    {value.toLocaleString()}
                </h3>

                {progress !== undefined && (
                    <div className="mt-4 h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/90 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

const SparklesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#sparkle-gradient)" />
        <defs>
            <linearGradient id="sparkle-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
        </defs>
    </svg>
);
