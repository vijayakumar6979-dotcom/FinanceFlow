import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingDown, Calendar, Percent, Flag, Wallet, ChevronRight } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';
import { loanService } from '@/services/loan.service';
import { Loan } from '@financeflow/shared';

import { AddLoanModal } from '@/components/loans/AddLoanModal';

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const navigate = useNavigate(); // Assume useNavigate is imported or add it

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            const data = await loanService.getAll();
            setLoans(data);
        } catch (error) {
            console.error('Failed to load loans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveLoan = (newLoan: Loan) => {
        setLoans(prev => [newLoan, ...prev]);
        setIsAddModalOpen(false);
    };

    const totalDebt = loans.reduce((sum, loan) => sum + loan.current_balance, 0);
    const monthlyPayments = loans.reduce((sum, loan) => sum + loan.monthly_payment, 0);
    // Simple mock calculation for total interest (lifetime) - in reality needs amortization data
    const totalInterest = loans.reduce((sum, loan) => sum + (loan.monthly_payment * loan.term_months - loan.original_amount), 0);

    // Mock payoff date (max term)
    const maxTerm = Math.max(...loans.map(l => l.remaining_months || 0), 0);
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + maxTerm);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Loans & Debt</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your loans and become debt-free</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/loans/strategies')}>Debt Payoff Calculator</Button>
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Loan
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Debt"
                    value={formatCurrency(totalDebt)}
                    icon={<TrendingDown className="w-5 h-5 text-red-400" />}
                    color="text-red-500 dark:text-red-400"
                    trend="-2.1% from last month"
                    trendColor="text-green-500"
                />
                <SummaryCard
                    title="Monthly Payments"
                    value={formatCurrency(monthlyPayments)}
                    icon={<Calendar className="w-5 h-5 text-orange-400" />}
                    color="text-slate-900 dark:text-white"
                    subtext="/ month"
                />
                <SummaryCard
                    title="Total Interest (Lifetime)"
                    value={formatCurrency(totalInterest)}
                    icon={<Percent className="w-5 h-5 text-purple-400" />}
                    color="text-purple-500 dark:text-purple-400"
                    subtext="estimated"
                />
                <SummaryCard
                    title="Debt-Free Date"
                    value={maxTerm > 0 ? payoffDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Debt Free!'}
                    icon={<Flag className="w-5 h-5 text-green-400" />}
                    color="text-green-500 dark:text-green-400"
                    subtext={maxTerm > 0 ? `${maxTerm} months to go!` : 'Congratulations!'}
                />
            </div>

            {/* Debt Payoff Progress */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Debt Payoff Progress</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">You've paid RM 45,200 so far!</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">35%</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '35%' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 relative"
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                    </motion.div>
                </div>
            </Card>

            {/* Loans List */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Loans</h2>

                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">Loading loans...</div>
                ) : loans.length === 0 ? (
                    <EmptyState onAdd={() => setIsAddModalOpen(true)} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loans.map(loan => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                )}
            </div>

            <AddLoanModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveLoan}
            />
        </div>
    );
}

function SummaryCard({ title, value, icon, color, subtext, trend, trendColor }: any) {
    return (
        <Card className="p-5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 ${trendColor.replace('text-', 'bg-')} ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className={`text-2xl font-bold font-mono ${color}`}>
                        {value}
                    </h3>
                    {subtext && <span className="text-sm text-slate-400">{subtext}</span>}
                </div>
            </div>
        </Card>
    );
}

function LoanCard({ loan }: { loan: Loan }) {
    const progress = ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100;

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-sm">
                    {/* Placeholder for logo - would use loan.lender_logo */}
                    <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{loan.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{loan.lender_name || 'Bank Loan'} • {loan.loan_type}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 dark:text-gray-400">Balance</span>
                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(loan.current_balance)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>{progress.toFixed(0)}% paid</span>
                        <span>{formatCurrency(loan.original_amount)} total</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Monthly Payment</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(loan.monthly_payment)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Interest Rate</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{loan.interest_rate}% APR</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <Card className="p-8 md:p-12 text-center bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                <Flag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You have no active loans</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Congratulations on being debt-free! Or, if you have loans to track, add them to start managing your debt payoff journey.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAdd}>
                Add Your First Loan
            </Button>
        </Card>
    )
}
