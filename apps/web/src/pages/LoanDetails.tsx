import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit,
    Trash2,
    DollarSign,
    TrendingUp,
    Calendar,
    Calculator,
    Download,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Loan,
    LoanService,
    formatCurrency,
    LoanCalculator,
    AmortizationScheduleEntry
} from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { DebtProgressGauge } from '@/components/loans/DebtProgressGauge';
import { AmortizationChart } from '@/components/loans/AmortizationChart';
import { PaymentBreakdownChart } from '@/components/loans/PaymentBreakdownChart';
import { ExtraPaymentCalculator } from '@/components/loans/ExtraPaymentCalculator';

export default function LoanDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [schedule, setSchedule] = useState<AmortizationScheduleEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFullSchedule, setShowFullSchedule] = useState(false);

    const loanService = new LoanService(supabase);

    useEffect(() => {
        if (id) {
            loadLoan();
        }
    }, [id]);

    const loadLoan = async () => {
        try {
            const data = await loanService.getLoanById(id!);
            setLoan(data);

            // Generate amortization schedule
            const amortization = LoanCalculator.generateAmortizationSchedule(
                data.id,
                data.current_balance,
                data.interest_rate,
                data.remaining_months || data.term_months,
                new Date().toISOString(),
                data.monthly_payment
            );
            setSchedule(amortization);
        } catch (error) {
            console.error('Failed to load loan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-gray-400">Loading loan details...</p>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
                <Card className="p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Loan Not Found</h2>
                    <p className="text-slate-500 dark:text-gray-400 mb-6">The loan you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/loans')}>Back to Loans</Button>
                </Card>
            </div>
        );
    }

    const progress = ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100;
    const totalInterest = LoanCalculator.calculateTotalInterest(
        loan.original_amount,
        loan.interest_rate,
        loan.term_months,
        loan.monthly_payment
    );
    const remainingInterest = LoanCalculator.calculateRemainingInterest(
        loan.current_balance,
        loan.interest_rate,
        loan.remaining_months || loan.term_months,
        loan.monthly_payment
    );
    const interestPaid = totalInterest - remainingInterest;

    const paymentBreakdown = LoanCalculator.calculateCurrentPaymentBreakdown(
        loan.current_balance,
        loan.interest_rate,
        loan.monthly_payment
    );

    const payoffDate = LoanCalculator.calculatePayoffDate(
        loan.current_balance,
        loan.interest_rate,
        loan.monthly_payment,
        0,
        new Date()
    );

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/loans')}
                        className="p-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {loan.loan_name || loan.name}
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 mt-1 capitalize">
                            {loan.lender_name} • {loan.loan_type}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 dark:border-white/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" className="border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Progress Gauge and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 flex items-center justify-center">
                    <DebtProgressGauge
                        percentage={progress}
                        totalPaid={loan.original_amount - loan.current_balance}
                        totalDebt={loan.original_amount}
                        size="lg"
                    />
                </Card>

                <Card className="lg:col-span-2 p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Financial Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Original Amount</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(loan.original_amount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Current Balance</p>
                            <p className="text-xl font-bold text-red-500 dark:text-red-400">
                                {formatCurrency(loan.current_balance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Amount Paid</p>
                            <p className="text-xl font-bold text-green-500 dark:text-green-400">
                                {formatCurrency(loan.original_amount - loan.current_balance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Progress</p>
                            <p className="text-xl font-bold text-blue-500 dark:text-blue-400">
                                {progress.toFixed(1)}% paid
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Monthly Payment Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Monthly Payment Breakdown
                    </h3>
                    <div className="flex items-center justify-center mb-6">
                        <PaymentBreakdownChart
                            principal={paymentBreakdown.principal}
                            interest={paymentBreakdown.interest}
                            totalPayment={loan.monthly_payment}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-500/10">
                            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Principal</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(paymentBreakdown.principal)}
                            </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-500/10">
                            <p className="text-sm text-red-700 dark:text-red-400 mb-1">Interest</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(paymentBreakdown.interest)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Interest Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Interest Rate</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {loan.interest_rate}% APR
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Total Interest (Lifetime)</span>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {formatCurrency(totalInterest)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Interest Paid So Far</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(interestPaid)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                            <span className="text-sm text-slate-600 dark:text-gray-300">Interest Remaining</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(remainingInterest)}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Loan Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Start Date</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(loan.start_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Original Term</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {loan.term_months} months ({Math.floor(loan.term_months / 12)} years)
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Remaining Term</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {loan.remaining_months || loan.term_months} months
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Projected Payoff Date</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                            {payoffDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Amortization Chart */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Amortization Schedule
                    </h3>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 dark:border-white/10"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
                <AmortizationChart schedule={schedule} />
            </Card>

            {/* Extra Payment Calculator */}
            <ExtraPaymentCalculator loan={loan} />

            {/* Payment Schedule Table */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Payment Schedule
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullSchedule(!showFullSchedule)}
                    >
                        {showFullSchedule ? 'Show Less' : 'Show All Payments'}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 dark:border-white/10">
                            <tr className="text-left">
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">#</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Date</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Payment</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Principal</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Interest</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Balance</th>
                                <th className="pb-3 font-semibold text-slate-900 dark:text-white">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(showFullSchedule ? schedule : schedule.slice(0, 12)).map((entry, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                                >
                                    <td className="py-3 text-slate-600 dark:text-gray-300">{entry.payment_number}</td>
                                    <td className="py-3 text-slate-600 dark:text-gray-300">
                                        {new Date(entry.payment_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-3 font-medium text-slate-900 dark:text-white">
                                        {formatCurrency(entry.payment_amount)}
                                    </td>
                                    <td className="py-3 text-green-600 dark:text-green-400">
                                        {formatCurrency(entry.principal_amount)}
                                    </td>
                                    <td className="py-3 text-red-600 dark:text-red-400">
                                        {formatCurrency(entry.interest_amount)}
                                    </td>
                                    <td className="py-3 font-medium text-slate-900 dark:text-white">
                                        {formatCurrency(entry.remaining_balance)}
                                    </td>
                                    <td className="py-3">
                                        {entry.is_paid ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                                                <CheckCircle className="w-3 h-3" />
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!showFullSchedule && schedule.length > 12 && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            Showing 12 of {schedule.length} payments
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
