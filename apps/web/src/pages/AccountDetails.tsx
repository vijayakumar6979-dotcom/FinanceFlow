import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';
import { CreditCardAnalytics } from '@/components/analytics/CreditCardAnalytics';
import { RepaymentPlanner } from '@/components/analytics/RepaymentPlanner';

export default function AccountDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data Fetch based on ID
    // In real app, useQuery hook here
    const account = {
        id: '1',
        name: 'Maybank Visa Platinum',
        type: 'credit_card',
        balance: -2450.00,
        currency: 'MYR',
        institution: {
            name: 'Maybank',
            logo: '/logos/banks/maybank-logo.png',
            color: '#FFD700'
        },
        accountNumber: '4567',
        creditLimit: 20000,
        usage: 12.25,
        dueDate: '2024-02-15',
        statementDate: '2024-01-15',
        minPayment: 125.00
    };

    const isCreditCard = account.type === 'credit_card';

    return (
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-700 dark:text-white" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {account.institution?.logo && (
                            <img src={account.institution.logo} className="w-8 h-8 object-contain" alt="" />
                        )}
                        {account.name}
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-mono mt-1">
                        **** **** **** {account.accountNumber}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <p className="text-slate-500 dark:text-gray-400 text-sm mb-2">
                            {isCreditCard ? 'Outstanding Balance' : 'Current Balance'}
                        </p>
                        <h2 className={`text-4xl font-bold font-mono mb-6 ${isCreditCard ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(account.balance, account.currency)}
                        </h2>

                        {isCreditCard && (
                            <>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-gray-400">Available Credit</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {formatCurrency((account.creditLimit || 0) + account.balance)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-gray-400">Credit Limit</span>
                                        <span className="text-slate-900 dark:text-white">
                                            {formatCurrency(account.creditLimit || 0)}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                                            <span>Utilization</span>
                                            <span className={(account.usage || 0) > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
                                                {account.usage}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${(account.usage || 0) > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${account.usage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Payment Due Soon</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-gray-400">Due Date</span>
                                        <span className="text-slate-900 dark:text-white">{account.dueDate}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-gray-400">Min. Payment</span>
                                        <span className="text-slate-900 dark:text-white">{formatCurrency(account.minPayment || 0)}</span>
                                    </div>
                                    <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 mt-2">
                                        Pay Now
                                    </Button>
                                </div>
                            </>
                        )}

                        {!isCreditCard && (
                            <div className="space-y-4">
                                <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200">
                                    Add Money
                                </Button>
                                <Button variant="outline" className="w-full border-gray-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
                                    Transfer
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Quick Stats */}
                    <Card className="p-6 space-y-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Stats</h3>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-gray-400">Spent this month</p>
                                <p className="text-lg font-medium text-slate-900 dark:text-white">{formatCurrency(1250)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-gray-400">Last transaction</p>
                                <p className="text-lg font-medium text-slate-900 dark:text-white">Today</p>
                            </div>
                        </div>
                    </Card>
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
                                Chart Placeholder
                            </div>
                        </Card>
                    )}

                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
                            <Button variant="ghost" size="sm" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-slate-700 dark:text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Supermarket</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">Groceries • Today</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-slate-900 dark:text-white">-{formatCurrency(45.50)}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
