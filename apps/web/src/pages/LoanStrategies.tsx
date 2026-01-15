import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency, Loan } from '@financeflow/shared';
import { loanService } from '@/services/loan.service';
import { motion } from 'framer-motion';

export default function LoanStrategiesPage() {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [extraPayment] = useState<number>(500);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            const data = await loanService.getAll();
            setLoans(data);
            const minPayment = data.reduce((sum, loan) => sum + loan.monthly_payment, 0);
            setMonthlyBudget(minPayment + 500); // Default budget is min + 500
        } catch (error) {
            console.error('Failed to load loans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStrategy = (strategy: 'snowball' | 'avalanche') => {
        if (loans.length === 0) return { totalInterest: 0, payoffDate: new Date() };

        let currentLoans = loans.map(l => ({ ...l, balance: l.current_balance }));
        let totalInterest = 0;
        let months = 0;
        let activeLoans = currentLoans.length;

        // Sort loans based on strategy
        // Snowball: Lowest Balance First
        // Avalanche: Highest Interest Rate First
        const sortLoans = (loansToSort: any[]) => {
            return loansToSort.sort((a, b) => {
                if (strategy === 'snowball') return a.balance - b.balance;
                return b.interest_rate - a.interest_rate;
            });
        };

        // Monthly simulation
        while (activeLoans > 0 && months < 1200) { // Limit to 100 years to prevent infinite loop
            months++;
            let budget = monthlyBudget > 0 ? monthlyBudget : loans.reduce((s, l) => s + l.monthly_payment, 0) + extraPayment;
            let remainingBudget = budget;

            // 1. Minimum payments
            currentLoans.forEach(loan => {
                if (loan.balance > 0) {
                    const interest = loan.balance * (loan.interest_rate / 100 / 12);
                    totalInterest += interest;
                    let payment = loan.monthly_payment;

                    // If balance is low, just pay off balance
                    if (loan.balance + interest < payment) {
                        payment = loan.balance + interest;
                    }

                    // Pay interest first then principal
                    const principal = payment - interest;
                    loan.balance -= principal;
                    remainingBudget -= payment;
                }
            });

            // 2. Extra payment to target loan
            if (remainingBudget > 0) {
                // Find first active loan based on strategy
                const targets = currentLoans.filter(l => l.balance > 0);
                if (targets.length > 0) {
                    const sortedTargets = sortLoans(targets);
                    const target = sortedTargets[0];
                    // Pay as much as possible to target
                    const payment = Math.min(target.balance, remainingBudget);
                    target.balance -= payment;
                    remainingBudget -= payment;
                }
            }

            activeLoans = currentLoans.filter(l => l.balance > 0.01).length;
        }

        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);

        return { totalInterest, payoffDate, months };
    };

    const snowball = calculateStrategy('snowball');
    const avalanche = calculateStrategy('avalanche');

    const totalDebt = loans.reduce((sum, loan) => sum + loan.current_balance, 0);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-[#0A0E27] transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/loans')} className="-ml-2">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to Loans
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Debt Payoff Strategies</h1>
                    <p className="text-slate-500 dark:text-gray-400">Compare methods to become debt-free faster</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-500">Loading analysis...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Configuration</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Total Debt</label>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalDebt)}</div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Monthly Budget</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={monthlyBudget || ''}
                                            onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
                                            placeholder={(loans.reduce((s, l) => s + l.monthly_payment, 0) + extraPayment).toString()}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Min required: {formatCurrency(loans.reduce((s, l) => s + l.monthly_payment, 0))}</p>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                    <p>Currently allocating <strong>{formatCurrency(Math.max(0, monthlyBudget - loans.reduce((s, l) => s + l.monthly_payment, 0)))}</strong> extra per month.</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 border-none text-white shadow-xl">
                            <h3 className="font-bold text-lg mb-2">Recommendation</h3>
                            <p className="mb-4 text-purple-100">
                                {avalanche.totalInterest < snowball.totalInterest
                                    ? "The Avalanche method saves you more money in the long run by targeting high-interest loans first."
                                    : "Both methods yield similar results, but Snowball might give you quicker wins!"}
                            </p>
                            <div className="text-3xl font-bold mb-1">
                                {avalanche.totalInterest < snowball.totalInterest
                                    ? formatCurrency(snowball.totalInterest - avalanche.totalInterest)
                                    : formatCurrency(0)}
                            </div>
                            <div className="text-sm text-purple-200">Potential Savings</div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StrategyCard
                            title="Debt Snowball"
                            description="Target smallest balance first. Good for motivation."
                            stats={snowball}
                            color="blue"
                            icon={TrendingUp}
                        />
                        <StrategyCard
                            title="Debt Avalanche"
                            description="Target highest interest rate first. Mathematically optimal."
                            stats={avalanche}
                            color="purple"
                            icon={TrendingDown}
                            isWinner={avalanche.totalInterest < snowball.totalInterest}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function StrategyCard({ title, description, stats, color, icon: Icon, isWinner }: any) {
    const colorClasses = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
        purple: 'text-purple-500 bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
    };

    return (
        <motion.div whileHover={{ y: -5 }} className="h-full">
            <Card className={`p-6 h-full border-2 ${isWinner ? 'border-green-500 dark:border-green-500 shadow-lg shadow-green-500/10' : 'border-transparent'} relative overflow-hidden bg-white dark:bg-white/5`}>
                {isWinner && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMMENDED
                    </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 h-10">{description}</p>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-500">Payoff Date</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {stats.payoffDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-500">Total Interest</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(stats.totalInterest)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-500">Time to Debt Free</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {Math.floor(stats.months / 12)}y {stats.months % 12}m
                        </span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
