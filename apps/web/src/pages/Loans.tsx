import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingDown, Calendar, Percent, Flag, Wallet, ChevronRight, Calculator, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Loan,
    LoanService,
    formatCurrency,
    DebtPayoffCalculator,
    DebtSummary,
    PayoffStrategyComparison,
    StrategyType
} from '@financeflow/shared';
import { supabase } from '@/services/supabase';

import { AddLoanModal } from '@/components/loans/AddLoanModal';
import { DebtProgressGauge } from '@/components/loans/DebtProgressGauge';

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('current');
    const [debtSummary, setDebtSummary] = useState<DebtSummary | null>(null);
    const [strategies, setStrategies] = useState<PayoffStrategyComparison | null>(null);

    const loanService = new LoanService(supabase);
    const navigate = useNavigate();

    useEffect(() => {
        loadLoans();
    }, []);

    useEffect(() => {
        if (loans.length > 0) {
            calculateDebtSummary();
            calculateStrategies();
        }
    }, [loans]);

    const loadLoans = async () => {
        try {
            const data = await loanService.getLoans();
            setLoans(data);
        } catch (error) {
            console.error('Failed to load loans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateDebtSummary = () => {
        const summary = DebtPayoffCalculator.calculateDebtSummary(loans);
        setDebtSummary(summary);
    };

    const calculateStrategies = () => {
        const comparison = DebtPayoffCalculator.compareStrategies(loans, 0);
        setStrategies(comparison);
    };

    const handleSaveLoan = async (newLoan: Loan) => {
        await loadLoans(); // Reload to get fresh data
        setIsAddModalOpen(false);
    };

    const getActiveStrategy = () => {
        if (!strategies) return null;
        switch (selectedStrategy) {
            case 'snowball': return strategies.snowballMethod;
            case 'avalanche': return strategies.avalancheMethod;
            default: return strategies.currentPlan;
        }
    };

    const activeStrategy = getActiveStrategy();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-gray-400">Loading your loans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Loans & Debt</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your loans and become debt-free</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/loans/strategies')}
                        className="border-slate-200 dark:border-white/10"
                    >
                        <Calculator className="w-4 h-4 mr-2" />
                        Debt Strategies
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Loan
                    </Button>
                </div>
            </div>

            {loans.length === 0 ? (
                <EmptyState onAdd={() => setIsAddModalOpen(true)} />
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Total Debt"
                            value={formatCurrency(debtSummary?.totalDebt || 0)}
                            icon={<TrendingDown className="w-5 h-5 text-red-400" />}
                            color="text-red-500 dark:text-red-400"
                            subtext={`${loans.length} active loan${loans.length !== 1 ? 's' : ''}`}
                        />
                        <SummaryCard
                            title="Monthly Payments"
                            value={formatCurrency(debtSummary?.totalMonthlyPayments || 0)}
                            icon={<Calendar className="w-5 h-5 text-orange-400" />}
                            color="text-slate-900 dark:text-white"
                            subtext="/ month"
                        />
                        <SummaryCard
                            title="Total Interest (Lifetime)"
                            value={formatCurrency(debtSummary?.totalInterestLifetime || 0)}
                            icon={<Percent className="w-5 h-5 text-purple-400" />}
                            color="text-purple-500 dark:text-purple-400"
                            subtext="estimated"
                        />
                        <SummaryCard
                            title="Debt-Free Date"
                            value={debtSummary ? new Date(debtSummary.debtFreeDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                            icon={<Flag className="w-5 h-5 text-green-400" />}
                            color="text-green-500 dark:text-green-400"
                            subtext={debtSummary ? `${debtSummary.monthsToDebtFree} months to go!` : ''}
                        />
                    </div>

                    {/* Debt Payoff Progress */}
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Debt Payoff Progress</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                    You've paid {formatCurrency(debtSummary?.totalPaid || 0)} so far!
                                </p>
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {debtSummary?.percentagePaid || 0}%
                            </span>
                        </div>
                        <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${debtSummary?.percentagePaid || 0}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>{formatCurrency(debtSummary?.totalPaid || 0)} paid</span>
                            <span>{formatCurrency(debtSummary?.totalOriginalDebt || 0)} total</span>
                        </div>
                    </Card>

                    {/* Debt Payoff Strategy Selector */}
                    {strategies && (
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Debt Payoff Strategy</h3>
                                    <p className="text-sm text-slate-500 dark:text-gray-400">
                                        Compare different payoff methods to save money
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/loans/strategies')}
                                    className="border-slate-200 dark:border-white/10"
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Compare All Strategies
                                </Button>
                            </div>

                            {/* Strategy Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                    { key: 'current' as StrategyType, label: 'Current Plan', color: 'gray' },
                                    { key: 'snowball' as StrategyType, label: 'Snowball', color: 'blue' },
                                    { key: 'avalanche' as StrategyType, label: 'Avalanche', color: 'green' }
                                ].map(({ key, label, color }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedStrategy(key)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStrategy === key
                                                ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/30`
                                                : 'bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {label}
                                        {key === strategies.recommendation.bestStrategy && (
                                            <span className="ml-2 text-xs">⭐</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Active Strategy Details */}
                            <AnimatePresence mode="wait">
                                {activeStrategy && (
                                    <motion.div
                                        key={selectedStrategy}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <p className="text-sm text-slate-600 dark:text-gray-300 mb-3">
                                                {activeStrategy.description}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Payoff Date</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {new Date(activeStrategy.payoffDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Total Interest</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {formatCurrency(activeStrategy.totalInterest)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Savings vs Current</p>
                                                    <p className="font-semibold text-green-500">
                                                        {formatCurrency(activeStrategy.interestSaved)}
                                                    </p>
                                                </div>
                                            </div>

                                            {activeStrategy.interestSaved > 0 && (
                                                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                                                        💰 Save {formatCurrency(activeStrategy.interestSaved)} and become debt-free {activeStrategy.monthsSaved} months earlier!
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payoff Order */}
                                        {activeStrategy.payoffOrder.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                                    Recommended Payoff Order:
                                                </h4>
                                                <div className="space-y-2">
                                                    {activeStrategy.payoffOrder.map((item, index) => (
                                                        <div
                                                            key={item.loanId}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                                    {item.loanName}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                                                    {item.reason}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    )}

                    {/* Loans List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Loans</h2>
                            <p className="text-sm text-slate-500 dark:text-gray-400">
                                {loans.length} active loan{loans.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {loans.map(loan => (
                                <LoanCard key={loan.id} loan={loan} onClick={() => navigate(`/loans/${loan.id}`)} />
                            ))}
                        </div>
                    </div>
                </>
            )}

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
        <Card className="p-5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 ${trendColor?.replace('text-', 'bg-')} ${trendColor}`}>
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

function LoanCard({ loan, onClick }: { loan: Loan; onClick: () => void }) {
    const progress = ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100;

    // Calculate next payment date
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(loan.payment_day);
    if (nextPaymentDate < new Date()) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isPaymentDueSoon = daysUntilPayment <= 7;

    return (
        <Card
            className={`p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all group relative overflow-hidden cursor-pointer ${isPaymentDueSoon ? 'ring-2 ring-yellow-500/50 dark:ring-yellow-500/30' : ''
                }`}
            onClick={onClick}
        >
            {isPaymentDueSoon && (
                <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Due in {daysUntilPayment}d
                    </div>
                </div>
            )}

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-slate-400 dark:text-gray-400" />
            </div>

            <div className="flex items-start gap-4 mb-6">
                <div
                    className="w-12 h-12 rounded-xl p-2 flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: loan.lender_color || '#0066FF' }}
                >
                    <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{loan.loan_name || loan.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">
                        {loan.lender_name || 'Bank Loan'} • {loan.loan_type}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 dark:text-gray-400">Current Balance</span>
                        <span className="font-bold text-red-500 dark:text-red-400">{formatCurrency(loan.current_balance)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>{progress.toFixed(1)}% paid</span>
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

                <div className="pt-2">
                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Next Payment</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {nextPaymentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </Card>
    );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <Card className="p-8 md:p-12 text-center bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-500/30">
                <Flag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You have no active loans</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Congratulations on being debt-free! Or, if you have loans to track, add them to start managing your debt payoff journey.
            </p>
            <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-500/30"
                onClick={onAdd}
            >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Loan
            </Button>
        </Card>
    );
}
