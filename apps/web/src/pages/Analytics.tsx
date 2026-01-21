import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Calendar, Wallet, TrendingUp, TrendingDown, PiggyBank, BrainCircuit } from 'lucide-react';
import { NetWorthChart } from '@/components/analytics/NetWorthChart';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';
import { AIAnalyticsInsight } from '@/components/analytics/AIAnalyticsInsight';
import { Card } from '@/components/ui/Card';

// Mini Sparkline component for metric cards
const Sparkline = ({ type }: { type: 'up' | 'down' | 'neutral' }) => {
    const color = type === 'up' ? 'stroke-emerald-500' : type === 'down' ? 'stroke-rose-500' : 'stroke-blue-500';
    return (
        <svg className="w-full h-12" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
            <path
                d={type === 'up'
                    ? "M0 15 C20 15, 30 5, 50 10 C70 15, 80 5, 100 0"
                    : "M0 5 C20 5, 30 15, 50 10 C70 5, 80 15, 100 20"
                }
                className={`${color} stroke-[2] vector-effect-non-scaling-stroke opacity-50`}
            />
            <path
                d={type === 'up'
                    ? "M0 15 C20 15, 30 5, 50 10 C70 15, 80 5, 100 0 L100 20 L0 20 Z"
                    : "M0 5 C20 5, 30 15, 50 10 C70 5, 80 15, 100 20 L100 20 L0 20 Z"
                }
                className={`fill-${type === 'up' ? 'emerald' : type === 'down' ? 'rose' : 'blue'}-500/10`}
            />
        </svg>
    )
}

const MetricCard = ({ title, value, trend, icon: Icon, color, type = 'neutral' }: any) => {
    const colorStyles: Record<string, { bg: string, text: string, iconBg: string }> = {
        blue: { bg: 'bg-blue-500/5', text: 'text-blue-500', iconBg: 'bg-blue-500/10' },
        emerald: { bg: 'bg-emerald-500/5', text: 'text-emerald-500', iconBg: 'bg-emerald-500/10' },
        rose: { bg: 'bg-rose-500/5', text: 'text-rose-500', iconBg: 'bg-rose-500/10' },
        purple: { bg: 'bg-purple-500/5', text: 'text-purple-500', iconBg: 'bg-purple-500/10' },
    };

    const style = colorStyles[color] || colorStyles['blue'];

    return (
        <div className="relative overflow-visible group">
            <div className={`absolute inset-0 ${style.bg} blur-xl rounded-3xl transition-opacity opacity-50 group-hover:opacity-100`} />
            <Card className="relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl h-full flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${style.iconBg} ${style.text}`}>
                        <Icon size={20} />
                    </div>
                    {trend && (
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${type === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <span className="text-slate-400 text-sm font-medium block mb-1">{title}</span>
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</span>
                </div>
                <div className="mt-4 -mx-6 -mb-6">
                    <Sparkline type={type} />
                </div>
            </Card>
        </div>
    );
};

const AnalyticsPage = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'income', label: 'Income & Expense' },
        { id: 'budget', label: 'Budget Analysis' },
        { id: 'debt', label: 'Debt Strategy' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Intelligence</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-gray-400 font-medium max-w-2xl">
                        AI-powered analysis of your wealth, spending habits, and financial trajectory.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 h-10 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5">
                        <Calendar size={16} />
                        <span className="hidden sm:inline">This Month</span>
                    </Button>
                    <Button className="gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-10 px-6 rounded-xl font-bold hover:shadow-lg transition-all">
                        <Download size={16} />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* AI Widget Section */}
            <AIAnalyticsInsight />

            {/* Navigation */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pill"
                className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl inline-flex"
            />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6">
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Net Worth"
                                value="RM 142,500"
                                trend="+8.2% vs last mo"
                                icon={Wallet}
                                color="blue"
                                type="up"
                            />
                            <MetricCard
                                title="Monthly Income"
                                value="RM 12,450"
                                trend="+2.1% vs last mo"
                                icon={TrendingUp}
                                color="emerald"
                                type="up"
                            />
                            <MetricCard
                                title="Monthly Expenses"
                                value="RM 4,230"
                                trend="-5.4% vs last mo"
                                icon={TrendingDown}
                                color="rose"
                                type="down"
                            />
                            <MetricCard
                                title="Savings Rate"
                                value="66%"
                                trend="+4% vs last mo"
                                icon={PiggyBank}
                                color="purple"
                                type="up"
                            />
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <NetWorthChart />
                            <IncomeExpenseChart />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'income' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <IncomeExpenseChart />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Placeholder for detailed category breakdown */}
                            <Card className="md:col-span-3 p-12 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-3xl border-dashed">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="text-slate-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Detailed Breakdown Report</h3>
                                <p className="text-slate-400">Deep dive analysis into income sources and expense categories is generating...</p>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {(activeTab === 'budget' || activeTab === 'debt') && (
                    <Card className="min-h-[400px] flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-3xl border-dashed">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <BrainCircuit className="text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">AI is analyzing {activeTab} data...</h3>
                        <p className="text-slate-400 max-w-md">Our advanced algorithms are crunching the numbers to provide you with personalized strategies.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
