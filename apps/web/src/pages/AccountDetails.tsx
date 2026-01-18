import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, TrendingUp, CreditCard, AlertCircle, Save, X, Loader2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatCurrency, Transaction } from '@financeflow/shared';
import { accountService, getCreditCardPaymentInfo } from '@/services/account.service';
import { AccountProps } from '@/components/accounts/AccountCard';
import { PaymentModal } from '@/components/accounts/PaymentModal';
import { TransferModal } from '@/components/accounts/TransferModal';
import { AddMoneyModal } from '@/components/accounts/AddMoneyModal';
import { RepaymentPlanSection } from '@/components/accounts/RepaymentPlanSection';
import { AIAnalyticsSection } from '@/components/accounts/AIAnalyticsSection';
import { AccountStatisticsCard } from '@/components/accounts/AccountStatisticsCard';
import { supabase } from '@/services/supabase';



export default function AccountDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<AccountProps>>({});
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
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
            // Optionally redirect or show error
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
                .limit(10);

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
            fetchAccount(id); // Refresh data
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
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0A0E27]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0A0E27]">
                <p className="text-slate-500 dark:text-gray-400">Account not found</p>
                <Button variant="ghost" className="ml-4" onClick={() => navigate('/accounts')}>Back to Accounts</Button>
            </div>
        );
    }

    const isCreditCard = account.type === 'credit_card';

    return (
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-700 dark:text-white" onClick={() => navigate('/accounts')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    {isEditing ? (
                        <div className="flex gap-4 items-center">
                            <Input
                                label=""
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="text-xl font-bold h-10 w-64"
                            />
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            {account.institution?.logo && (
                                <div className="w-8 h-8 rounded-full bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden">
                                    <img
                                        src={account.institution.logo}
                                        className="w-full h-full object-contain"
                                        alt=""
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            {account.name}
                        </h1>
                    )}

                    {isEditing ? (
                        <div className="mt-2 flex gap-2 items-center">
                            <span className="text-sm text-slate-500">No:</span>
                            <Input
                                label=""
                                value={editForm.accountNumber}
                                onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                                className="h-8 w-48 text-sm"
                                placeholder="Account Number"
                            />
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-mono mt-1">
                            **** **** **** {account.accountNumber?.slice(-4) || '****'}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={handleSave}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-slate-500 hover:text-slate-700"
                                onClick={() => setIsEditing(false)}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                onClick={handleEdit}
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-2">
                            {isCreditCard ? 'Outstanding Balance' : 'Current Balance'}
                        </p>

                        {isEditing ? (
                            <Input
                                label=""
                                type="number"
                                value={editForm.balance}
                                onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                                className="text-2xl font-mono mb-6"
                            />
                        ) : (
                            <h2 className={`text-4xl font-bold font-mono mb-6 ${isCreditCard ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                {formatCurrency(account.balance, account.currency)}
                            </h2>
                        )}

                        {isCreditCard && (
                            <>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-gray-400">Available Credit</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {formatCurrency((account.creditLimit || 0) + account.balance)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-500 dark:text-gray-400">Credit Limit</span>
                                        {isEditing ? (
                                            <Input
                                                label=""
                                                type="number"
                                                value={editForm.creditLimit}
                                                onChange={(e) => setEditForm({ ...editForm, creditLimit: Number(e.target.value) })}
                                                className="h-8 w-32 text-right"
                                            />
                                        ) : (
                                            <span className="text-slate-900 dark:text-white">
                                                {formatCurrency(account.creditLimit || 0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                                            <span>Utilization</span>
                                            <span className={(account.usage || 0) > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
                                                {account.usage || 0}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${(account.usage || 0) > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(account.usage || 0, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Payment Information</span>
                                    </div>
                                    {(() => {
                                        const paymentInfo = getCreditCardPaymentInfo(account);
                                        return (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-gray-400">Next Due Date</span>
                                                    <span className="text-slate-900 dark:text-white">
                                                        {paymentInfo.nextDueDate ? paymentInfo.nextDueDate.toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-gray-400">Min. Payment</span>
                                                    <span className="text-slate-900 dark:text-white">
                                                        {paymentInfo.minimumPayment > 0 ? formatCurrency(paymentInfo.minimumPayment, account.currency) : '--'}
                                                    </span>
                                                </div>
                                                {paymentInfo.daysUntilDue > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-gray-400">Days Until Due</span>
                                                        <span className={`font-medium ${paymentInfo.daysUntilDue <= 7 ? 'text-red-600 dark:text-red-400' :
                                                            paymentInfo.daysUntilDue <= 14 ? 'text-yellow-600 dark:text-yellow-400' :
                                                                'text-green-600 dark:text-green-400'
                                                            }`}>
                                                            {paymentInfo.daysUntilDue} days
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                    <Button
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 mt-2"
                                        onClick={() => setIsPaymentModalOpen(true)}
                                    >
                                        Pay Now
                                    </Button>
                                </div>
                            </>
                        )}

                        {!isCreditCard && (
                            <div className="space-y-4">
                                <Button
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200"
                                    onClick={() => setIsAddMoneyModalOpen(true)}
                                >
                                    Add Money
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                    onClick={() => setIsTransferModalOpen(true)}
                                >
                                    Transfer
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Account Statistics */}
                    <AccountStatisticsCard accountId={account.id} currency={account.currency} />
                </div>

                {/* Right Column: Analytics & Transactions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Placeholder for Analytics or Transactions List */}
                    {isCreditCard ? (
                        <div className="space-y-6">
                            <Card className="p-6 min-h-[300px] flex items-center justify-center border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                <div className="text-center">
                                    <CreditCard className="w-12 h-12 text-slate-400 dark:text-gray-600 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-slate-500 dark:text-gray-400">AI Analytics Dashboard</h3>
                                    <p className="text-sm text-slate-400 dark:text-gray-500">Spending insights & repayment plans coming next</p>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="p-6 min-h-[400px] bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Balance History</h3>
                            <div className="h-64 flex items-center justify-center text-slate-400 dark:text-gray-500">
                                Chart Placeholder (Requires Transaction Data)
                            </div>
                        </Card>
                    )}

                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                onClick={() => navigate('/transactions')}
                            >
                                View All
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No recent transactions</p>
                            ) : (
                                recentTransactions.map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                                                tx.type === 'expense' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                                                    'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                {tx.type === 'income' ? <TrendingUp size={18} /> :
                                                    tx.type === 'expense' ? <TrendingDown size={18} /> :
                                                        <ArrowLeft size={18} className="rotate-180" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                                    {tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' :
                                            tx.type === 'expense' ? 'text-red-600 dark:text-red-400' :
                                                'text-slate-900 dark:text-white'
                                            }`}>
                                            {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount, account?.currency)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* AI Analytics Section - Credit Cards Only */}
                    {isCreditCard && account.id && (
                        <AIAnalyticsSection
                            accountId={account.id}
                            creditCardName={account.name}
                            utilization={account.usage || 0}
                        />
                    )}

                    {/* Repayment Plan Section - Credit Cards Only */}
                    {isCreditCard && account.id && (
                        <RepaymentPlanSection
                            accountId={account.id}
                            creditCardName={account.name}
                            outstandingBalance={Math.abs(account.balance)}
                        />
                    )}
                </div>
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
