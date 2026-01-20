import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Receipt,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Search,
    BarChart3,
    Sparkles,
    Filter,
    ArrowUpRight,
    Wallet
} from 'lucide-react';
import { useBills, useBillSummary } from '@/hooks/useBills';
import { BillCard } from '@/components/bills/BillCard';

export default function Bills() {
    const navigate = useNavigate();
    const { data: bills, isLoading } = useBills();
    const { data: summary } = useBillSummary();
    const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBills = React.useMemo(() => {
        if (!bills) return [];
        let filtered = bills;
        if (filter !== 'all') filtered = filtered.filter(bill => bill.status === filter);
        if (searchQuery) {
            filtered = filtered.filter(bill =>
                bill.bill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bill.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [bills, filter, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <img src="/logo.svg" className="w-12 h-12 relative z-10 opacity-50 animate-bounce" alt="Loading" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white pb-20 overflow-x-hidden">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8 max-w-7xl z-10">
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tight mb-2"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                                Bills Command
                            </span>
                            <span className="text-primary block lg:inline lg:ml-3">Center</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 text-lg"
                        >
                            Manage subscriptions & recurring payments with AI
                        </motion.p>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/bills/analytics')}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1F3A] border border-white/10 rounded-2xl hover:border-primary/50 hover:bg-[#1A1F3A]/80 transition-all group"
                        >
                            <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="font-semibold text-slate-300 group-hover:text-white">Analytics</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 102, 255, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/bills/new')}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl font-bold shadow-lg shadow-primary/25 border border-white/10"
                        >
                            <Plus className="w-5 h-5" />
                            Add Bill
                        </motion.button>
                    </div>
                </header>

                {/* Hero Metrics Grid */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Total Monthly */}
                        <MetricCard
                            label="Total Monthly"
                            value={summary.total_monthly}
                            icon={Wallet}
                            color="blue"
                            trend="+5% vs last month"
                            delay={0.1}
                        />

                        {/* Due Soon */}
                        <MetricCard
                            label="Due This Month"
                            value={summary.due_this_month.amount}
                            count={summary.due_this_month.count}
                            icon={Calendar}
                            color="purple"
                            status="upcoming"
                            delay={0.2}
                        />

                        {/* AI Insight / Overdue */}
                        {summary.overdue.count > 0 ? (
                            <MetricCard
                                label="Attention Needed"
                                value={summary.overdue.amount}
                                count={summary.overdue.count}
                                icon={AlertTriangle}
                                color="red"
                                status="critical"
                                delay={0.3}
                            />
                        ) : (
                            <MetricCard
                                label="All Caught Up"
                                value={summary.paid_this_month.amount}
                                count={summary.paid_this_month.count}
                                icon={CheckCircle2}
                                color="green"
                                status="success"
                                delay={0.3}
                            />
                        )}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex flex-col gap-6">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121629]/50 p-2 rounded-3xl border border-white/5 backdrop-blur-md">
                        {/* Search */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search bills & providers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#0A0E27]/50 border border-transparent rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:bg-[#0A0E27] focus:border-primary/50 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex p-1 bg-[#0A0E27]/50 rounded-2xl w-full md:w-auto overflow-x-auto">
                            {(['all', 'unpaid', 'paid', 'overdue'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${filter === status
                                        ? 'text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {filter === status && (
                                        <motion.div
                                            layoutId="activeFilter"
                                            className="absolute inset-0 bg-[#1A1F3A] border border-white/10 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{status}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <AnimatePresence mode="wait">
                        {filteredBills.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-24 text-center"
                            >
                                <div className="w-24 h-24 bg-[#1A1F3A] rounded-full flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                    <Receipt className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No bills found</h3>
                                <p className="text-slate-400 mb-8 max-w-md">
                                    {searchQuery || filter !== 'all'
                                        ? "We couldn't find any bills matching your specific filters."
                                        : "Get started by tracking your first recurring bill."}
                                </p>
                                {(!searchQuery && filter === 'all') && (
                                    <button
                                        onClick={() => navigate('/bills/new')}
                                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                                    >
                                        Add First Bill
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredBills.map((bill) => (
                                    <BillCard key={bill.id} bill={bill} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// 3D Metric Card Component
interface MetricCardProps {
    label: string;
    value: number;
    count?: number;
    icon: React.ElementType;
    color: 'blue' | 'purple' | 'green' | 'red';
    trend?: string;
    status?: string;
    delay: number;
}

function MetricCard({ label, value, count, icon: Icon, color, trend, status, delay }: MetricCardProps) {
    const colorStyles = {
        blue: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
        purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
        green: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
        red: "from-rose-500/20 to-orange-500/20 border-rose-500/30",
    };

    const iconColors = {
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        green: "text-emerald-400 bg-emerald-500/10",
        red: "text-rose-400 bg-rose-500/10",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative p-6 rounded-[24px] bg-gradient-to-br ${colorStyles[color]} border backdrop-blur-xl group overflow-hidden`}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${iconColors[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' :
                            status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/20'
                            }`}>
                            {status === 'critical' ? 'Action Required' : status}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        <span className="text-lg text-slate-500 font-sans mr-1">RM</span>
                        {value.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    {count !== undefined && (
                        <p className="text-sm text-slate-300 font-medium">
                            <span className="text-white font-bold">{count}</span> bills total
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <ArrowUpRight size={12} />
                            {trend}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
