import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Calculator, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loan, formatCurrency, RefinanceAnalyzer as RefinanceCalc } from '@financeflow/shared';

interface RefinanceAnalyzerProps {
    loan: Loan;
}

export function RefinanceAnalyzer({ loan }: RefinanceAnalyzerProps) {
    const [newRate, setNewRate] = useState(loan.interest_rate - 0.5);
    const [closingCosts, setClosingCosts] = useState(5000);
    const [analysis, setAnalysis] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const analyzeRefinancing = () => {
        setIsCalculating(true);

        setTimeout(() => {
            const result = RefinanceCalc.analyzeOpportunity(
                loan.current_balance,
                loan.interest_rate,
                loan.remaining_months || loan.term_months,
                loan.monthly_payment,
                newRate,
                closingCosts
            );

            setAnalysis(result);
            setIsCalculating(false);
        }, 500);
    };

    const isRecommended = analysis?.isRecommended;
    const breakEvenMonths = analysis?.breakEvenMonths || 0;
    const monthlySavings = analysis?.monthlySavings || 0;
    const lifetimeSavings = analysis?.lifetimeSavings || 0;

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                    <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Refinancing Analyzer
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        See if refinancing could save you money
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
                {/* Current Rate Display */}
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <p className="text-sm text-slate-600 dark:text-gray-300 mb-1">Current Interest Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {loan.interest_rate}% APR
                    </p>
                </div>

                {/* New Rate Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                        Potential New Rate
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min={loan.interest_rate - 3}
                            max={loan.interest_rate + 1}
                            step={0.1}
                            value={newRate}
                            onChange={(e) => setNewRate(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <input
                            type="number"
                            value={newRate}
                            onChange={(e) => setNewRate(parseFloat(e.target.value))}
                            step={0.1}
                            className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-center font-semibold"
                        />
                        <span className="text-sm text-slate-600 dark:text-gray-300">%</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>{(loan.interest_rate - 3).toFixed(1)}%</span>
                        <span className={newRate < loan.interest_rate ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                            {newRate < loan.interest_rate ? '↓' : '↑'} {Math.abs(loan.interest_rate - newRate).toFixed(2)}%
                        </span>
                        <span>{(loan.interest_rate + 1).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Closing Costs Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                        Estimated Closing Costs
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400">
                            RM
                        </span>
                        <input
                            type="number"
                            value={closingCosts}
                            onChange={(e) => setClosingCosts(parseFloat(e.target.value))}
                            step={500}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-semibold"
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        Includes legal fees, stamp duty, and processing fees
                    </p>
                </div>

                {/* Calculate Button */}
                <Button
                    onClick={analyzeRefinancing}
                    disabled={isCalculating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/30"
                >
                    {isCalculating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Calculator className="w-5 h-5 mr-2" />
                            Analyze Refinancing
                        </>
                    )}
                </Button>
            </div>

            {/* Results Section */}
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {/* Recommendation Banner */}
                    <div className={`p-4 rounded-lg border-2 ${isRecommended
                            ? 'bg-green-50 dark:bg-green-500/10 border-green-500 dark:border-green-500/30'
                            : 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 dark:border-orange-500/30'
                        }`}>
                        <div className="flex items-start gap-3">
                            {isRecommended ? (
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className={`font-bold mb-1 ${isRecommended ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
                                    }`}>
                                    {isRecommended ? '✓ Refinancing Recommended' : '⚠ Refinancing May Not Be Worth It'}
                                </p>
                                <p className={`text-sm ${isRecommended ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {isRecommended
                                        ? 'The savings outweigh the costs. Consider refinancing to reduce your interest burden.'
                                        : 'The break-even period is too long or savings are minimal. You might want to explore other options.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Savings Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <p className="text-sm text-slate-600 dark:text-gray-300 mb-1">Monthly Savings</p>
                            <p className={`text-2xl font-bold ${monthlySavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {monthlySavings > 0 ? '+' : ''}{formatCurrency(monthlySavings)}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <p className="text-sm text-slate-600 dark:text-gray-300 mb-1">Lifetime Savings</p>
                            <p className={`text-2xl font-bold ${lifetimeSavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {lifetimeSavings > 0 ? '+' : ''}{formatCurrency(lifetimeSavings)}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <p className="text-sm text-slate-600 dark:text-gray-300 mb-1">Break-Even Point</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {breakEvenMonths} months
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                ({(breakEvenMonths / 12).toFixed(1)} years)
                            </p>
                        </div>
                    </div>

                    {/* Detailed Comparison */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                            Comparison
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Current Loan</p>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    {loan.interest_rate}% • {formatCurrency(loan.monthly_payment)}/mo
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">After Refinancing</p>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    {newRate}% • {formatCurrency(loan.monthly_payment - monthlySavings)}/mo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                            disabled={!isRecommended}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get Refinancing Quotes
                        </Button>
                        <Button
                            variant="outline"
                            className="border-gray-200 dark:border-white/10"
                        >
                            Save Analysis
                        </Button>
                    </div>

                    {/* Tips */}
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
                            💡 Refinancing Tips
                        </p>
                        <ul className="space-y-1 text-sm text-purple-600 dark:text-purple-400">
                            <li>• Get quotes from at least 3 different banks</li>
                            <li>• Check for prepayment penalties on your current loan</li>
                            <li>• Factor in all costs: legal fees, stamp duty, valuation fees</li>
                            <li>• Consider lock-in periods for the new loan</li>
                            <li>• Negotiate with your current bank for a rate match</li>
                        </ul>
                    </div>
                </motion.div>
            )}
        </Card>
    );
}
