import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wallet, Search, Sparkles, LayoutGrid, ListFilter, MessageSquare, Send } from 'lucide-react';
import { AccountCard, AccountProps } from '@/components/accounts/AccountCard';
import { AIAccountInsight } from '@/components/accounts/AIAccountInsight';
import { accountService } from '@/services/account.service';
import { formatCurrency } from '@financeflow/shared';
import { cn } from '@/utils/cn';

export default function AccountsPage() {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<AccountProps[]>([]);
    const [aiQuery, setAiQuery] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await accountService.getAll();
            setAccounts(data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(account => {
        const matchesType = filterType === 'all' ||
            (filterType === 'banks' && account.type.startsWith('bank')) ||
            (filterType === 'cards' && account.type === 'credit_card') ||
            (filterType === 'ewallets' && account.type === 'ewallet') ||
            (filterType === 'cash' && account.type === 'cash');

        const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesSearch;
    });

    const totalAssets = accounts
        .filter(a => a.type !== 'credit_card')
        .reduce((sum, a) => sum + a.balance, 0);

    const totalDebt = accounts
        .filter(a => a.type === 'credit_card')
        .reduce((sum, a) => sum + Math.abs(a.balance), 0);

    const netWorth = totalAssets - totalDebt;

    // Mock AI Insights (Simulated for UI)
    const insights = [
        { type: 'positive', title: 'Debt Reduced', description: 'You paid off 15% of your credit card debt this month. Great job!' },
        { type: 'suggestion', title: 'Optimize Savings', description: 'Your savings account yield is low. Consider moving $2k to a high-yield account.' },
        { type: 'warning', title: 'Unusual Subscription', description: 'Detected a new recurring charge of $12.99 from "Streaming Service".' },
    ] as const;

    return (
        <div className="min-h-screen p-4 lg:p-6 pb-20 space-y-8 dark:text-gray-100">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Header / Financial Overview Hero */}
            <header className="relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
                            Accounts
                        </h1>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                            Financial Command Center
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/accounts/new')}
                        className="group relative px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Add New Account
                        </span>
                    </button>
                </div>

                {/* 3D Glass Hero Section - Full Width Net Worth */}
                <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Net Worth</p>
                            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tight">
                                {formatCurrency(netWorth)}
                            </h2>
                        </div>

                        <div className="flex gap-12 p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Total Assets</p>
                                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalAssets)}</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Total Debt</p>
                                <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalDebt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* AI Financial Intelligence Section (Full Feature) */}
            <section className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-lg">AI Financial Intelligence</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* AI Chat / Assistant */}
                    <div className="lg:col-span-1 p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 backdrop-blur-xl flex flex-col justify-between min-h-[200px]">
                        <div className="space-y-4">
                            <h4 className="font-bold text-white leading-tight">Ask FinanceFlow AI</h4>
                            <p className="text-sm text-white/60">Get instant analysis on your spending, debt, and projected savings.</p>
                        </div>
                        <div className="mt-6 relative group">
                            <input
                                type="text"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="e.g., How can I save more?"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Insights Grid (No Scroll, Full View) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => (
                            <AIAccountInsight
                                key={idx}
                                {...insight}
                            // Make specific insights span differently if needed, for now standard grid
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Controls & Search */}
            <div className="sticky top-4 z-20 flex flex-col md:flex-row gap-4 items-center bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl w-full md:w-auto overflow-x-auto">
                    {['all', 'banks', 'cards', 'ewallets', 'cash'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                filterType === type
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 p-1">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-600 hover:text-white transition-colors">
                        <ListFilter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Accounts Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading Accounts...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                        {filteredAccounts.map((account, index) => (
                            <motion.div
                                key={account.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <AccountCard
                                    account={account}
                                    onEdit={(id) => console.log('Edit', id)}
                                    onDelete={(id) => console.log('Delete', id)}
                                    onView={(id) => navigate(`/accounts/${id}`)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add New Card (Empty State Style) */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/accounts/new')}
                        className="group min-h-[220px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-500">
                            <Plus className="w-8 h-8 text-slate-400 group-hover:text-white" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">Link New Account</span>
                    </motion.button>
                </div>
            )}
        </div>
    );
}

// Ensure you have:
// 1. global CSS with `custom-scrollbar` utility or remove that class
// 2. lucide-react icons installed
