import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Percent, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency, Loan } from '@financeflow/shared';
import { loanService } from '@/services/loan.service';

import { MakePaymentModal } from '@/components/loans/MakePaymentModal';

export default function LoanDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadLoan(id);
        }
    }, [id]);

    const loadLoan = async (loanId: string) => {
        try {
            const data = await loanService.getById(loanId);
            setLoan(data);
        } catch (error) {
            console.error('Failed to load loan details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!loan) return <div className="p-8 text-center text-slate-500">Loan not found</div>;

    const progress = ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100;

    // Quick amortization calc for UI display (since backend might not be populated yet)
    const monthlyRate = loan.interest_rate / 100 / 12;
    const generateSchedule = () => {
        const schedule = [];
        let balance = loan.current_balance; // Starting from current
        const payment = loan.monthly_payment;
        let currentDate = new Date(); // Start from today/next payment

        for (let i = 0; i < (loan.remaining_months || loan.term_months); i++) {
            const interest = balance * monthlyRate;
            const principal = payment - interest;
            balance -= principal;
            if (balance < 0) balance = 0;

            currentDate.setMonth(currentDate.getMonth() + 1);

            schedule.push({
                payment_number: i + 1,
                date: new Date(currentDate),
                payment,
                principal,
                interest,
                balance
            });
            if (balance <= 0) break;
        }
        return schedule;
    };

    const schedule = generateSchedule();

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/loans')} className="-ml-2">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {loan.name}
                        <span className="text-sm font-normal px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 capitalize">
                            {loan.loan_type}
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 capitalize">{loan.lender_name}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline">Edit Loan</Button>
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        onClick={() => setIsPaymentModalOpen(true)}
                    >
                        Make Payment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Stats Card */}
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500 dark:text-gray-400">Current Balance</p>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(loan.current_balance)}</h2>
                                <p className="text-xs text-red-500 flex items-center">
                                    <TrendingDown className="w-3 h-3 mr-1" /> Outstanding
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500 dark:text-gray-400">Original Amount</p>
                                <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300">{formatCurrency(loan.original_amount)}</h2>
                                <p className="text-xs text-slate-400">Principal</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500 dark:text-gray-400">Interest Rate</p>
                                <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-300">{loan.interest_rate}%</h2>
                                <p className="text-xs text-slate-400">APR</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-sm font-medium text-slate-700 dark:text-gray-300">Repayment Progress</p>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>PO: {loan.start_date}</span>
                                <span>Target: {schedule[schedule.length - 1]?.date.toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Amortization Schedule Preview */}
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Amortization Schedule</h3>
                            <Button variant="outline" size="sm">View Full Schedule</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-white/5">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                                        <th className="px-4 py-3">Payment</th>
                                        <th className="px-4 py-3">Principal</th>
                                        <th className="px-4 py-3">Interest</th>
                                        <th className="px-4 py-3 rounded-r-lg">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.slice(0, 5).map((row, index) => (
                                        <tr key={index} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {row.date.toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                                            <td className="px-4 py-3 text-green-600 dark:text-green-400">{formatCurrency(row.principal)}</td>
                                            <td className="px-4 py-3 text-red-500 dark:text-red-400">{formatCurrency(row.interest)}</td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-gray-300">{formatCurrency(row.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="space-y-6">
                    <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Loan Details</h3>
                        <div className="space-y-4">
                            <DetailRow label="Monthly Payment" value={formatCurrency(loan.monthly_payment)} icon={Calendar} />
                            <DetailRow label="Term" value={`${loan.term_months} Months`} icon={Calendar} />
                            <DetailRow label="Payment Day" value={`Day ${loan.payment_day}`} icon={Calendar} />
                            <DetailRow label="Total Interest (est)" value={formatCurrency(schedule.reduce((acc, curr) => acc + curr.interest, 0))} icon={Percent} />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-lg text-white">
                        <h3 className="text-lg font-bold mb-2">Pay Off Faster</h3>
                        <p className="text-blue-100 text-sm mb-4">
                            Adding just RM 100/mo extra could save you thousands in interest!
                        </p>
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none">
                            Calculate Savings
                        </Button>
                    </Card>
                </div>
            </div>

            <MakePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                loan={loan}
                onPaymentSuccess={() => loadLoan(loan.id)}
            />
        </div>
    );
}

function DetailRow({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-white/10 text-slate-600 dark:text-gray-300">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 dark:text-gray-400">{label}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
        </div>
    );
}
