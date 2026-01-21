import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';
import { Wallet, CreditCard, Banknote, Landmark, ArrowUpRight, ArrowDownRight, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

// Mock Data
const SAVINGS_DATA = [
    { name: 'Jan', income: 4500, expense: 2100 },
    { name: 'Feb', income: 5200, expense: 2800 },
    { name: 'Mar', income: 4800, expense: 3200 },
    { name: 'Apr', income: 6100, expense: 2900 },
];

const CREDIT_CARDS = [
    { id: 1, name: 'Maybank Visa Infinite', balance: 4500, limit: 20000, utilization: 22.5, apr: 15 },
    { id: 2, name: 'CIMB Mastering', balance: 1200, limit: 5000, utilization: 24.0, apr: 18 }, // Highest APR candidate
    { id: 3, name: 'Citi PremierMiles', balance: 8900, limit: 15000, utilization: 59.3, apr: 12 }, // Highest utilization
];

// Mock Data for Savings Transactions
const TOP_SAVINGS_TRANSACTIONS = [
    { id: 1, description: 'Salary Deposit', amount: 4500, date: '25 Oct', type: 'income' },
    { id: 2, description: 'Transfer to StashAway', amount: 1000, date: '26 Oct', type: 'transfer' },
    { id: 3, description: 'Interest Credited', amount: 12.50, date: '30 Oct', type: 'income' },
    { id: 4, description: 'ATM Withdrawal', amount: 500, date: '01 Nov', type: 'expense' },
    { id: 5, description: 'DuitNow Transfer', amount: 150, date: '02 Nov', type: 'expense' },
];

const TOP_TRANSACTIONS = [
    { id: 1, merchant: 'Apple Store', amount: 4899, category: 'Tech', card: 'Citi PremierMiles' },
    { id: 2, merchant: 'Pavilion KL', amount: 450, category: 'Shopping', card: 'Maybank Visa' },
    { id: 3, merchant: 'Shell', amount: 120, category: 'Fuel', card: 'CIMB Mastering' },
    { id: 4, merchant: 'Netflix', amount: 55, category: 'Sub', card: 'CIMB Mastering' },
    { id: 5, merchant: 'Grab', amount: 45, category: 'Transport', card: 'Maybank Visa' },
];

const EWALLET_DATA = [
    { id: 1, name: 'Touch \'n Go', balance: 245, icon: 'Tp' },
    { id: 2, name: 'GrabPay', balance: 150, icon: 'Gp' },
];

const CASH_DATA = [
    { id: 1, name: 'Cash on Hand', balance: 1500 },
];

// Sub-Component: Savings View
const SavingsView = () => {
    const totalBalance = 24500;
    const monthlyGrowth = 12.5;

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="text-sm font-medium text-slate-400">Total Savings</h4>
                    <h2 className="text-3xl font-black text-white">{formatCurrency(totalBalance)}</h2>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-bold">
                    <TrendingUp size={16} /> +{monthlyGrowth}% this month
                </div>
            </div>

            {/* Area Chart Style */}
            <div className="h-[220px] w-full bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-4 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SAVINGS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncomeSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenseSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncomeSavings)" />
                        <Area type="monotone" dataKey="expense" name="Expenses" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenseSavings)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/10">
                    <div className="text-emerald-500/70 text-xs font-bold uppercase mb-1">Total Income</div>
                    <div className="text-emerald-400 font-mono font-bold text-lg flex items-center gap-2">
                        <ArrowUpRight size={16} /> {formatCurrency(20600)}
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-rose-900/10 border border-rose-500/10">
                    <div className="text-rose-500/70 text-xs font-bold uppercase mb-1">Total Expenses</div>
                    <div className="text-rose-400 font-mono font-bold text-lg flex items-center gap-2">
                        <ArrowDownRight size={16} /> {formatCurrency(11000)}
                    </div>
                </div>
            </div>

            {/* Top 5 Transactions */}
            <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Landmark size={14} className="text-indigo-400" /> Recent Activity
                </h4>
                <div className="space-y-2">
                    {TOP_SAVINGS_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{tx.description}</span>
                                <span className="text-[10px] text-slate-400">{tx.date} • {tx.type}</span>
                            </div>
                            <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sub-Component: Credit Card View
const CreditView = () => {
    const totalLimit = CREDIT_CARDS.reduce((acc, card) => acc + card.limit, 0);
    const totalBalance = CREDIT_CARDS.reduce((acc, card) => acc + card.balance, 0);
    const utilization = (totalBalance / totalLimit) * 100;

    // AI Feature: Identify focus card (Highest utilization > 50% OR Highest Balance)
    const focusCard = CREDIT_CARDS.reduce((prev, current) => (prev.utilization > current.utilization) ? prev : current);

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Summary Header */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-white/10">
                    <p className="text-xs font-medium text-indigo-300 uppercase">Available Credit</p>
                    <p className="text-2xl font-black text-white mt-1">{formatCurrency(totalLimit - totalBalance)}</p>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${100 - utilization}%` }} />
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
                    <p className="text-xs font-medium text-slate-400 uppercase">Total Debt</p>
                    <p className="text-2xl font-black text-white mt-1">{formatCurrency(totalBalance)}</p>
                    <p className="text-xs text-slate-500 mt-2">{utilization.toFixed(1)}% Utilization</p>
                </div>
            </div>

            {/* AI Debt Focus */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900/40 to-slate-900/40 border border-rose-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 bg-rose-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                    <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
                        <Zap size={20} className="fill-current" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">AI Debt Focus</h4>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                            Focus on paying <span className="text-white font-bold">{focusCard.name}</span> first.
                            It has <span className="text-rose-400 font-bold">{focusCard.utilization.toFixed(1)}% usage</span>.
                        </p>
                        <button className="mt-3 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors">
                            Pay {formatCurrency(focusCard.balance)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Top 5 Transactions */}
            <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400" /> Top Spending
                </h4>
                <div className="space-y-2">
                    {TOP_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{tx.merchant}</span>
                                <span className="text-[10px] text-slate-400">{tx.card} • {tx.category}</span>
                            </div>
                            <span className="font-mono font-bold text-white">{formatCurrency(tx.amount)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sub-Component: E-Wallet & Cash View
const CashView = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h4 className="text-sm font-medium text-slate-400">E-Wallets</h4>
            <div className="grid grid-cols-2 gap-4">
                {EWALLET_DATA.map(wallet => (
                    <div key={wallet.id} className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-400 uppercase">{wallet.name}</span>
                            <Zap size={14} className="text-blue-400" />
                        </div>
                        <div className="text-xl font-black text-white">{formatCurrency(wallet.balance)}</div>
                    </div>
                ))}
            </div>

            <h4 className="text-sm font-medium text-slate-400">Cash Assets</h4>
            <div className="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/20">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-emerald-400" />
                        <span className="font-bold text-white">Cash on Hand</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold uppercase">Liquid</span>
                </div>
                <div className="text-2xl font-black text-white">{formatCurrency(CASH_DATA[0].balance)}</div>
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors">
                        + Add Cash
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-bold hover:bg-white/10 transition-colors">
                        View Log
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DigitalWallet = () => {
    const [activeTab, setActiveTab] = useState<'savings' | 'credit' | 'cash'>('credit');

    return (
        <Card className="col-span-12 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-indigo-400" />
                    Digital Wallet
                </h3>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6 backdrop-blur-md border border-white/5">
                {[
                    { id: 'savings', label: 'Savings', icon: Landmark },
                    { id: 'credit', label: 'Credit Cards', icon: CreditCard },
                    { id: 'cash', label: 'E-Wallet / Cash', icon: Banknote },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'savings' && <SavingsView key="savings" />}
                    {activeTab === 'credit' && <CreditView key="credit" />}
                    {activeTab === 'cash' && <CashView key="cash" />}
                </AnimatePresence>
            </div>
        </Card>
    );
};
