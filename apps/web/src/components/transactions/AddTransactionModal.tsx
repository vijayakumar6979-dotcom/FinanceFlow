import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { createTransactionService, createAccountService, CreateTransactionDTO, TransactionCategory, Account } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import {
    ArrowRightLeft,
    TrendingUp,
    TrendingDown,
    Repeat,
    Split,
    Sparkles,
    FileText,
    Wallet,
    X,
    ChevronDown,
    Check,
    Search,
    ShoppingBag,
    Utensils,
    Car,
    Home,
    Zap,
    Coffee,
    Gamepad,
    Plane,
    Briefcase,
    GraduationCap,
    HeartPulse,
    MoreHorizontal
} from 'lucide-react';

const transactionService = createTransactionService(supabase);
const accountService = createAccountService(supabase);

interface AddTransactionModalProps {
    onClose: () => void;
    onSave?: () => void;
}

// Icon Mapping Helper
const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('food') || n.includes('dining')) return <Utensils size={16} />;
    if (n.includes('shop')) return <ShoppingBag size={16} />;
    if (n.includes('transport') || n.includes('car') || n.includes('taxi')) return <Car size={16} />;
    if (n.includes('house') || n.includes('rent') || n.includes('utilities')) return <Home size={16} />;
    if (n.includes('bill') || n.includes('utilities')) return <Zap size={16} />;
    if (n.includes('coffee')) return <Coffee size={16} />;
    if (n.includes('entertainment') || n.includes('game')) return <Gamepad size={16} />;
    if (n.includes('travel')) return <Plane size={16} />;
    if (n.includes('work') || n.includes('salary')) return <Briefcase size={16} />;
    if (n.includes('education')) return <GraduationCap size={16} />;
    if (n.includes('health') || n.includes('medical')) return <HeartPulse size={16} />;
    return <MoreHorizontal size={16} />;
};

export function AddTransactionModal({ onClose, onSave }: AddTransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);

    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Custom Select State
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const controls = useDragControls();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [cats, accs] = await Promise.all([
                transactionService.getCategories(),
                accountService.getAll()
            ]);
            setCategories(cats);
            setAccounts(accs);
            if (accs.length > 0) setAccountId(accs[0].id);
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleSave = async () => {
        if (!accountId) { alert("Please select an account"); return; }
        setIsSaving(true);
        try {
            const payload: CreateTransactionDTO = {
                type,
                amount: parseFloat(amount),
                description,
                category_id: categoryId,
                account_id: accountId,
                date: new Date().toISOString(),
                is_split: false
            };
            await transactionService.create(payload);
            onSave?.();
            onClose();
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save transaction');
        } finally {
            setIsSaving(false);
        }
    };

    // Filter categories based on selection type and search
    const activeCategories = categories.filter(c =>
        c.type === type &&
        c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedAccount = accounts.find(a => a.id === accountId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content - Draggable & Wider */}
            <motion.div
                drag
                dragListener={false}
                dragControls={controls}
                dragMomentum={false}
                dragElastic={0.05}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl overflow-visible rounded-3xl bg-[#050511]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]"
            >
                {/* Drag Handle & Header */}
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="flex items-center justify-between p-6 pb-2 cursor-grab active:cursor-grabbing"
                >
                    <h2 className="text-xl font-bold text-white tracking-tight pointer-events-none">Add Transaction</h2>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Type Selector */}
                    <div className="bg-black/40 p-1 rounded-xl flex border border-white/5">
                        {(['income', 'expense', 'transfer'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden ${type === t ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {type === t && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute inset-0 ${t === 'income' ? 'bg-emerald-500' : t === 'expense' ? 'bg-rose-500' : 'bg-blue-500'}`}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {t === 'income' ? <TrendingUp size={14} /> : t === 'expense' ? <TrendingDown size={14} /> : <ArrowRightLeft size={14} />}
                                    {t}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Amount Input */}
                    <div className="text-center relative group">
                        <style>
                            {`
                                input[type=number]::-webkit-inner-spin-button, 
                                input[type=number]::-webkit-outer-spin-button { 
                                    -webkit-appearance: none; 
                                    margin: 0; 
                                }
                                input[type=number] {
                                    -moz-appearance: textfield;
                                }
                            `}
                        </style>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Amount</label>
                        <div className="relative inline-block w-full">
                            <span className="absolute left-1/2 -translate-x-[120px] top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">RM</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-transparent text-center text-5xl font-black text-white outline-none placeholder-slate-700 caret-primary"
                                autoFocus
                            />
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-focus-within:opacity-100 transition-opacity" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 focus-within:ring-2 ring-primary/50 transition-all">
                            <FileText className="text-slate-400" size={18} />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this for?"
                                className="bg-transparent w-full outline-none text-white placeholder-slate-500 text-sm font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Searchable Category Select */}
                            <div className="relative">
                                <button
                                    onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsAccountOpen(false); if (!isCategoryOpen) setCategorySearch(''); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-1.5 rounded-lg ${selectedCategory ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}>
                                            {selectedCategory ? getCategoryIcon(selectedCategory.name) : <ShoppingBag size={14} />}
                                        </div>
                                        <div className="block overflow-hidden">
                                            <label className="text-[10px] font-bold uppercase text-slate-500 block group-hover:text-primary transition-colors">Category</label>
                                            <span className="text-sm font-medium text-white truncate block">
                                                {selectedCategory?.name || 'Select Category'}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F23] border border-white/10 rounded-xl shadow-2xl z-30 max-h-[300px] overflow-hidden flex flex-col"
                                        >
                                            {/* Search Input */}
                                            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                                                <Search size={14} className="text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    placeholder="Search categories..."
                                                    className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="overflow-y-auto flex-1 no-scrollbar p-1">
                                                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                                                {activeCategories.length > 0 ? activeCategories.map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => { setCategoryId(cat.id); setIsCategoryOpen(false); }}
                                                        className="p-2 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors rounded-lg mb-1"
                                                    >
                                                        <div className="p-1.5 rounded-md bg-white/5 text-slate-300">
                                                            {getCategoryIcon(cat.name)}
                                                        </div>
                                                        <span className="text-sm text-slate-200">{cat.name}</span>
                                                        {categoryId === cat.id && <Check size={14} className="ml-auto text-primary" />}
                                                    </div>
                                                )) : (
                                                    <div className="p-4 text-center text-xs text-slate-500">No matching categories</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Account Select */}
                            <div className="relative">
                                <button
                                    onClick={() => { setIsAccountOpen(!isAccountOpen); setIsCategoryOpen(false); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-1.5 rounded-lg ${selectedAccount ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                                            <Wallet size={14} />
                                        </div>
                                        <div className="block overflow-hidden">
                                            <label className="text-[10px] font-bold uppercase text-slate-500 block group-hover:text-blue-500 transition-colors">Account</label>
                                            <span className="text-sm font-medium text-white truncate block">
                                                {selectedAccount?.name || 'Select Account'}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isAccountOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F23] border border-white/10 rounded-xl shadow-2xl z-30 max-h-[300px] overflow-y-auto no-scrollbar"
                                        >
                                            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                                            {accounts.map(acc => (
                                                <div
                                                    key={acc.id}
                                                    onClick={() => { setAccountId(acc.id); setIsAccountOpen(false); }}
                                                    className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-2 transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <span className="text-sm text-slate-200">{acc.name}</span>
                                                    <span className="text-xs text-slate-500 ml-auto">{acc.currency}</span>
                                                    {accountId === acc.id && <Check size={14} className="text-primary" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsRecurring(!isRecurring)}
                                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isRecurring ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                            >
                                <Repeat size={14} /> Recurring
                            </button>
                            <button className="flex-1 py-3 rounded-xl border border-transparent bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all">
                                <Split size={14} /> Split
                            </button>
                            <button className="flex-1 py-3 rounded-xl border border-transparent bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all">
                                <Sparkles size={14} /> AI Fill
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!amount || !categoryId || isSaving}
                        className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Processing...' : 'Save Transaction'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
