import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Loan, LoanCalculator, formatCurrency, ExtraPaymentImpact } from '@financeflow/shared';

interface ExtraPaymentCalculatorProps {
    loan: Loan;
}

export function ExtraPaymentCalculator({ loan }: ExtraPaymentCalculatorProps) {
    const [extraPayment, setExtraPayment] = useState(0);
    const [impact, setImpact] = useState<ExtraPaymentImpact | null>(null);

    useEffect(() => {
        if (extraPayment > 0) {
            const calculatedImpact = LoanCalculator.calculateInterestSavings(
                loan.current_balance,
                loan.interest_rate,
                loan.monthly_payment,
                extraPayment,
                loan.remaining_months || loan.term_months
            );
            setImpact(calculatedImpact);
        } else {
            setImpact(null);
        }
    }, [extraPayment, loan]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtraPayment(parseFloat(e.target.value));
    };

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                    <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Extra Payment Calculator
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        See how extra payments can save you money
                    </p>
                </div>
            </div>

            {/* Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        Extra Monthly Payment
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {formatCurrency(extraPayment)}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={extraPayment}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                        background: `linear-gradient(to right, #0066FF 0%, #0066FF ${(extraPayment / 5000) * 100}%, rgba(148, 163, 184, 0.2) ${(extraPayment / 5000) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
                    }}
                />

                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>RM 0</span>
                    <span>RM 2,500</span>
                    <span>RM 5,000</span>
                </div>
            </div>

            {/* Results */}
            {impact && impact.monthsSaved > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {/* Summary Banner */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20">
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">
                            💰 Potential Savings with {formatCurrency(extraPayment)}/month extra
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Interest Saved</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    {formatCurrency(impact.interestSaved)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Time Saved</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    {impact.monthsSaved} months
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <p className="text-xs text-slate-600 dark:text-gray-300">New Payoff Date</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {new Date(impact.newPayoffDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-slate-600 dark:text-gray-300">Months Saved</p>
                            </div>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {impact.monthsSaved} months
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                ({(impact.monthsSaved / 12).toFixed(1)} years)
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-purple-500" />
                                <p className="text-xs text-slate-600 dark:text-gray-300">Total Savings</p>
                            </div>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {formatCurrency(impact.totalSavings)}
                            </p>
                        </div>
                    </div>

                    {/* Comparison */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3 font-medium">
                            Payment Comparison
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Current Payment</p>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                    {formatCurrency(loan.monthly_payment)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">New Payment</p>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                    {formatCurrency(loan.monthly_payment + extraPayment)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="flex gap-3 pt-2">
                        <button className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30">
                            Apply This Strategy
                        </button>
                        <button className="px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            Share Results
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-gray-400">
                        Move the slider to see how extra payments can help you save money and pay off your loan faster
                    </p>
                </div>
            )}
        </Card>
    );
}
