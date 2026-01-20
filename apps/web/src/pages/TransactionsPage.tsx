import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownLeft,
    Sparkles,
    Zap,
    BrainCircuit,
    MoreHorizontal,
    Calendar,
    Tag,
    PieChart
} from 'lucide-react';
import { createTransactionService, Transaction, formatCurrency } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Card } from '@/components/ui/Card';

// Initialize Service
const transactionService = createTransactionService(supabase);

// --- Variants for Animation ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export function TransactionsPage() {
    // --- State ---
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [aiInsight, setAiInsight] = useState<string | null>(null);

    // --- Load Data ---
    const loadTransactions = async () => {
        setIsLoading(true);
        try {
            const data = await transactionService.getAll({});
            setTransactions(data);
            generateAiInsight(data);
        } catch (error) {
            console.error('Failed to load transactions', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // --- AI Logic (Mock) ---
    const generateAiInsight = (data: Transaction[]) => {
        const expenses = data.filter(t => t.type === 'expense');
        const recentHighSpend = expenses.find(t => t.amount > 500);
        if (recentHighSpend) {
            setAiInsight(`Alert: Large expenditure of ${formatCurrency(recentHighSpend.amount)} detected at ${recentHighSpend.description || 'Unknown'}.`);
        } else {
            setAiInsight("Spending patterns appear nominal this week.");
        }
    };

    // --- Derived Metrics ---
    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expenses, net: income - expenses };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        let result = transactions;
        if (activeFilter !== 'all') {
            result = result.filter(t => t.type === activeFilter);
        }
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.description?.toLowerCase().includes(lowerQ) ||
                t.category?.name.toLowerCase().includes(lowerQ) ||
                t.amount.toString().includes(lowerQ)
            );
        }
        return result;
    }, [transactions, activeFilter, searchQuery]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen relative font-sans text-slate-200 p-4 lg:p-0 space-y-8 pb-20"
        >
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            {/* --- HEADER & AI COMMAND BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Transactions <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/20 uppercase tracking-widest font-bold">AI Active</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time financial activity stream</p>
                </div>

                {/* AI Command Input */}
                <div className="relative w-full md:w-[400px] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-1 focus-within:ring-2 ring-primary/50 transition-all">
                        <div className="pl-3 pr-2 text-primary animate-pulse">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ask FinanceFlow..."
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="hidden md:flex items-center gap-1 pr-3">
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">⌘K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HOLOGRAPHIC STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Income', value: stats.income, type: 'income', icon: ArrowDownLeft, color: 'text-emerald-400' },
                    { label: 'Total Expenses', value: stats.expenses, type: 'expense', icon: ArrowUpRight, color: 'text-rose-400' },
                    { label: 'Net Flow', value: stats.net, type: 'net', icon: Zap, color: stats.net >= 0 ? 'text-emerald-400' : 'text-rose-400' }
                ].map((stat, idx) => (
                    <motion.div variants={itemVariants} key={idx} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl blur-sm" />
                        <Card className="relative h-full bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-black/20 px-2 py-1 rounded-lg">
                                    This Month
                                </span>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                                <p className={`text-3xl font-mono font-bold ${stat.color} tracking-tight`}>
                                    {formatCurrency(stat.value)}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* --- MAIN CONTENT SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Transaction List (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Filters Toolbar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {[
                            { id: 'all', label: 'All Transactions' },
                            { id: 'income', label: 'Income' },
                            { id: 'expense', label: 'Expenses' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id as any)}
                                className={`
                                    px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                    ${activeFilter === f.id
                                        ? 'bg-white text-black shadow-lg shadow-white/10'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                {f.label}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    {/* List */}
                    <Card className="min-h-[400px] border-white/5 bg-black/20">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <BrainCircuit className="w-10 h-10 mb-4 animate-pulse opacity-50" />
                                <p className="text-xs font-mono uppercase tracking-widest">Processing Data Stream...</p>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <Search className="w-10 h-10 mb-4 opacity-50" />
                                <p className="text-xs font-mono uppercase tracking-widest">No activities found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredTransactions.map((tx) => (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/5 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                            <div className={`
                                                w-12 h-12 rounded-2xl flex items-center justify-center text-lg
                                                ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    tx.type === 'expense' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}
                                            `}>
                                                {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> :
                                                    tx.type === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowUpDown className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{tx.description}</h4>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                                                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {tx.category?.name || 'Uncategorized'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(tx.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                                            <div className="text-right">
                                                <p className={`font-mono font-bold text-lg ${tx.type === 'income' ? 'text-emerald-400' : tx.type === 'expense' ? 'text-white' : 'text-blue-400'}`}>
                                                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                                                </p>
                                                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Completed</p>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all">
                                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* RIGHT: AI Insights Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/40">
                                <BrainCircuit className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-white">Grok Insights</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed dark:text-slate-300">
                            {aiInsight || "Analyzing financial patterns..."}
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-wider text-slate-300 transition-colors">
                                Analyze Trends
                            </button>
                            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-wider text-slate-300 transition-colors">
                                Detect Fraud
                            </button>
                        </div>
                    </Card>

                    <Card className="border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Top Categories</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Food & Dining', pct: 45, color: 'bg-rose-500' },
                                { name: 'Transportation', pct: 20, color: 'bg-blue-500' },
                                { name: 'Shopping', pct: 15, color: 'bg-purple-500' }
                            ].map((cat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1 font-bold">
                                        <span className="text-slate-300">{cat.name}</span>
                                        <span className="text-slate-500">{cat.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.pct}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className={`h-full ${cat.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-white/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Monthly Projected
                        </h3>
                        <p className="text-2xl font-mono font-bold text-white">$4,250.00</p>
                        <p className="text-[10px] text-slate-500 mt-1">Based on recurring patterns</p>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddTransactionModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSave={() => { setIsAddModalOpen(false); loadTransactions(); }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default TransactionsPage;

