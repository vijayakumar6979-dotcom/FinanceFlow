import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Edit2, Trash2, TrendingUp, TrendingDown,
    CreditCard, Save, X, Loader2, ArrowRightLeft,
    Plus, DollarSign, Wallet, Settings, LayoutDashboard, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, Transaction } from '@financeflow/shared';
import { accountService, getCreditCardPaymentInfo } from '@/services/account.service';
import { AccountProps, AccountCard } from '@/components/accounts/AccountCard';
import { PaymentModal } from '@/components/accounts/PaymentModal';
import { TransferModal } from '@/components/accounts/TransferModal';
import { AddMoneyModal } from '@/components/accounts/AddMoneyModal';
import { RepaymentPlanSection } from '@/components/accounts/RepaymentPlanSection';
import { AIAnalyticsSection } from '@/components/accounts/AIAnalyticsSection';
import { GeneralAIAnalytics } from '@/components/accounts/GeneralAIAnalytics';
import { CreditUtilizationGauge } from '@/components/accounts/CreditUtilizationGauge';
import { AccountStatisticsCard } from '@/components/accounts/AccountStatisticsCard';
import { supabase } from '@/services/supabase';
import { cn } from '@/utils/cn';

type TabType = 'overview' | 'analytics' | 'settings';

export default function AccountDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<AccountProps>>({});
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Modals
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAccount(id);
            fetchRecentTransactions(id);
        }
    }, [id]);

    const fetchAccount = async (accountId: string) => {
        try {
            setIsLoading(true);
            const data = await accountService.getById(accountId);
            setAccount(data);
        } catch (error) {
            console.error('Failed to fetch account details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentTransactions = async (currentAccountId?: string) => {
        const targetAccountId = currentAccountId || id;
        if (!targetAccountId) return;

        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    category:categories(*),
                    recurrence_rule:transaction_recurrence(*),
                    splits:transaction_splits(*)
                `)
                .eq('account_id', targetAccountId)
                .order('date', { ascending: false })
                .limit(20);

            if (error) throw error;
            setRecentTransactions(data || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleModalSuccess = () => {
        if (id) {
            fetchAccount(id);
            fetchRecentTransactions(id);
        }
    };

    const handleEdit = () => {
        if (!account) return;
        setEditForm({
            name: account.name,
            accountNumber: account.accountNumber,
            balance: account.balance,
            creditLimit: account.creditLimit
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!account || !id) return;
        try {
            await accountService.update(id, editForm);
            setIsEditing(false);
            fetchAccount(id);
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await accountService.delete(id);
            navigate('/accounts');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A0E27]">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-primary animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/20" />
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-[#0A0E27] space-y-4">
                <p className="text-slate-400">Account not found</p>
                <Button variant="ghost" onClick={() => navigate('/accounts')} className="text-primary hover:bg-primary/10">
                    Back to Accounts
                </Button>
            </div>
        );
    }

    const isCreditCard = account.type === 'credit_card';

    return (
        <div className="min-h-screen p-4 lg:p-8 pb-20 space-y-8 bg-[#0A0E27] text-gray-100 overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Top Navigation */}
            <div className="relative z-10 flex items-center justify-between">
                <button
                    onClick={() => navigate('/accounts')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm tracking-wide">Back to Command Center</span>
                </button>

                <div className="flex gap-2">
                    {isEditing ? (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                            <Button
                                onClick={handleSave}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                            <Button
                                onClick={() => setIsEditing(false)}
                                variant="ghost"
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleEdit}
                            variant="ghost"
                            className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                            <Settings className="w-4 h-4 mr-2" /> Edit Details
                        </Button>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* 3D Account Card Representation */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="relative group perspective-1000">
                        {/* Visual Wrapper for Large Card */}
                        <div className="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-2">
                            <AccountCard
                                account={account}
                            // Disable standard actions in hero view, handled externally
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        {!isCreditCard ? (
                            <>
                                <button onClick={() => setIsAddMoneyModalOpen(true)} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0F1225] border border-white/5 hover:bg-[#1A1F35] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mb-3">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">Add Money</span>
                                </button>
                                <button onClick={() => setIsTransferModalOpen(true)} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0F1225] border border-white/5 hover:bg-[#1A1F35] hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform mb-3">
                                        <ArrowRightLeft className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">Transfer</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsPaymentModalOpen(true)} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0F1225] border border-white/5 hover:bg-[#1A1F35] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mb-3">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">Pay Bill</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0F1225] border border-white/5 hover:bg-[#1A1F35] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">Optimize</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Left Column Stats (Credit Health or General Stats) */}
                    {isCreditCard ? (
                        <div className="p-6 rounded-3xl bg-[#0F1225] border border-gray-800">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Credit Health</h3>
                            <div className="flex flex-col items-center justify-center py-2 h-full">
                                <CreditUtilizationGauge utilization={account.usage || 0} size={220} />
                                <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div className="flex flex-col items-start px-2">
                                        <span className="text-xs text-slate-500 mb-1">Available</span>
                                        <span className="text-lg font-bold text-white">{formatCurrency((account.creditLimit || 0) - Math.abs(account.balance))}</span>
                                    </div>
                                    <div className="flex flex-col items-end px-2">
                                        <span className="text-xs text-slate-500 mb-1">Limit</span>
                                        {isEditing ? (
                                            <Input
                                                label=""
                                                type="number"
                                                value={editForm.creditLimit}
                                                onChange={(e) => setEditForm({ ...editForm, creditLimit: Number(e.target.value) })}
                                                className="h-8 w-28 text-right text-sm bg-black/20 border-white/10"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-white">
                                                {formatCurrency(account.creditLimit || 0)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-3xl bg-[#0F1225] border border-gray-800">
                            <AccountStatisticsCard accountId={account.id} currency={account.currency} />
                        </div>
                    )}
                </div>

                {/* Account Details & Stats (Bento Grid) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Header Details */}
                    <div className="flex items-end justify-between border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl font-black text-white">{account.name}</h1>
                            <p className="text-slate-400 font-mono text-sm mt-1 flex items-center gap-2 opacity-60">
                                {account.institution?.name} • **** {account.accountNumber?.slice(-4)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Current Balance</p>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                {formatCurrency(Math.abs(account.balance), account.currency)}
                            </div>
                        </div>
                    </div>

                    <div className="h-full">
                        {/* Monthly In/Out Overview */}
                        <div className="flex flex-col p-6 rounded-3xl bg-[#0F1225] border border-gray-800 h-full">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Monthly Overview</h3>
                            <div className="flex flex-col gap-6 flex-1 justify-center">
                                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Income</span>
                                            <span className="text-2xl font-black text-white tracking-tight">+ {formatCurrency(4500)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                                            <TrendingDown className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Expenses</span>
                                            <span className="text-2xl font-black text-white tracking-tight">- {formatCurrency(3200)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="relative z-10 mt-12">
                <div className="flex items-center gap-6 border-b border-white/10 mb-8 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Transactions', icon: LayoutDashboard },
                        { id: 'analytics', label: 'AI Intelligence', icon: Sparkles },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                activeTab === tab.id ? "text-primary" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-3 space-y-4">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((tx, i) => (
                                            <div
                                                key={tx.id}
                                                className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                        tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' :
                                                            'bg-slate-700/50 text-slate-400 group-hover:bg-white group-hover:text-black'
                                                    )}>
                                                        {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{tx.description}</p>
                                                        <p className="text-xs text-slate-500">{tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "font-bold font-mono",
                                                    tx.type === 'income' ? 'text-emerald-400' : 'text-white'
                                                )}>
                                                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount, account?.currency)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 text-slate-500">
                                            <p>No recent transactions found.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Sidebar */}
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search</h4>
                                        <Input label="" placeholder="Filter transactions..." className="bg-black/20 border-white/10" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="max-w-5xl mx-auto">
                                {isCreditCard ? (
                                    <div className="space-y-8">
                                        <AIAnalyticsSection
                                            accountId={account.id}
                                            creditCardName={account.name}
                                            utilization={account.usage || 0}
                                        />
                                        <RepaymentPlanSection
                                            accountId={account.id}
                                            creditCardName={account.name}
                                            outstandingBalance={Math.abs(account.balance)}
                                        />
                                    </div>
                                ) : (
                                    <GeneralAIAnalytics
                                        accountId={account.id}
                                        accountType={account.type}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 max-w-2xl mx-auto space-y-6">
                                <h3 className="text-xl font-bold text-white">Account Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium text-slate-400">Account Name</span>
                                            <Input
                                                label=""
                                                value={editForm.name ?? account.name}
                                                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                disabled={!isEditing}
                                                className="bg-black/20 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium text-slate-400">Last 4 Digits</span>
                                            <Input
                                                label=""
                                                value={editForm.accountNumber ?? account.accountNumber}
                                                onChange={e => setEditForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                                                disabled={!isEditing}
                                                className="bg-black/20 border-white/10"
                                            />
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <Button onClick={handleEdit} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                                            Enable Editing
                                        </Button>
                                    )}

                                    {isEditing && (
                                        <div className="flex gap-4">
                                            <Button onClick={handleSave} className="flex-1 bg-primary text-white">Save Changes</Button>
                                            <Button onClick={() => setIsEditing(false)} className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20">Cancel</Button>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/10">
                                        <Button onClick={handleDelete} variant="ghost" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                                        </Button>
                                        <p className="text-center text-xs text-red-500/50 mt-2">
                                            This action cannot be undone. All data associated with this account will be lost.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modals */}
            {isPaymentModalOpen && isCreditCard && (
                <PaymentModal
                    creditCardAccount={account}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
            {isTransferModalOpen && (
                <TransferModal
                    sourceAccount={account}
                    onClose={() => setIsTransferModalOpen(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
            {isAddMoneyModalOpen && (
                <AddMoneyModal
                    account={account}
                    onClose={() => setIsAddMoneyModalOpen(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
}
