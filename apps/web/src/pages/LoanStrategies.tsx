import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    TrendingDown,
    TrendingUp,
    DollarSign,
    Calendar,
    Zap,
    Target,
    Award,
    Sparkles,
    ChevronRight,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Loan,
    LoanService,
    formatCurrency,
    DebtPayoffCalculator,
    PayoffStrategyComparison,
    StrategyType
} from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { StrategyComparisonChart } from '@/components/loans/StrategyComparisonChart';
import { PayoffTimelineChart } from '@/components/loans/PayoffTimelineChart';

export default function LoanStrategiesPage() {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [extraPayment, setExtraPayment] = useState(0);
    const [strategies, setStrategies] = useState<PayoffStrategyComparison | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('avalanche');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const loanService = new LoanService(supabase);

    useEffect(() => {
        loadLoans();
    }, []);

    useEffect(() => {
        if (loans.length > 0) {
            calculateStrategies();
        }
    }, [loans, extraPayment]);

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

    const calculateStrategies = () => {
        const comparison = DebtPayoffCalculator.compareStrategies(loans, extraPayment);
        setStrategies(comparison);

        // Auto-select best strategy
        setSelectedStrategy(comparison.recommendation.bestStrategy);
    };

    const loadAIRecommendations = async () => {
        setIsLoadingAI(true);
        try {
            const { data, error } = await supabase.functions.invoke('generate-debt-payoff-strategy', {
                body: {
                    userId: (await supabase.auth.getUser()).data.user?.id,
                    extraPaymentAmount: extraPayment
                }
            });

            if (!error && data) {
                // Update strategies with AI enhancements
                setStrategies(prev => ({
                    ...prev!,
                    recommendation: {
                        ...prev!.recommendation,
                        customAdvice: data.recommendation?.customAdvice || prev!.recommendation.customAdvice
                    },
                    quickWins: data.quickWins || prev!.quickWins,
                    milestones: data.milestones || prev!.milestones
                }));
            }
        } catch (error) {
            console.error('Failed to load AI recommendations:', error);
        } finally {
            setIsLoadingAI(false);
        }
    };

    const getStrategyData = (type: StrategyType) => {
        if (!strategies) return null;
        switch (type) {
            case 'snowball': return strategies.snowballMethod;
            case 'avalanche': return strategies.avalancheMethod;
            default: return strategies.currentPlan;
        }
    };

    const selectedStrategyData = getStrategyData(selectedStrategy);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-gray-400">Loading strategies...</p>
                </div>
            </div>
        );
    }

    if (loans.length === 0) {
        return (
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50 dark:bg-[#0A0E27]">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/loans')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Loans
                </Button>
                <Card className="p-12 text-center">
                    <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Loans to Analyze</h2>
                    <p className="text-slate-500 dark:text-gray-400 mb-6">
                        Add some loans first to see personalized debt payoff strategies
                    </p>
                    <Button onClick={() => navigate('/loans')}>
                        Go to Loans
                    </Button>
                </Card>
            </div>
        );
    }

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
                            Debt Payoff Strategies
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 mt-1">
                            Compare methods to become debt-free faster
                        </p>
                    </div>
                </div>
                <Button
                    onClick={loadAIRecommendations}
                    disabled={isLoadingAI}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/30"
                >
                    {isLoadingAI ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Getting AI Insights...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Get AI Recommendations
                        </>
                    )}
                </Button>
            </div>

            {/* Extra Payment Slider */}
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Extra Monthly Payment
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            See how extra payments accelerate your debt freedom
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-gray-300">Amount per month:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatCurrency(extraPayment)}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(parseFloat(e.target.value))}
                        className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #0066FF 0%, #0066FF ${(extraPayment / 5000) * 100}%, rgba(148, 163, 184, 0.2) ${(extraPayment / 5000) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
                        }}
                    />

                    <div className="flex justify-between text-xs text-slate-400">
                        <span>RM 0</span>
                        <span>RM 2,500</span>
                        <span>RM 5,000</span>
                    </div>
                </div>
            </Card>

            {/* AI Recommendation Banner */}
            {strategies?.recommendation && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border-2 border-purple-200 dark:border-purple-500/20"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">
                                💡 AI Recommendation: {strategies.recommendation.bestStrategy === 'avalanche' ? 'Avalanche Method' : 'Snowball Method'}
                            </h3>
                            <p className="text-purple-700 dark:text-purple-300 mb-3">
                                {strategies.recommendation.reasoning}
                            </p>
                            {strategies.recommendation.customAdvice && strategies.recommendation.customAdvice.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">Personalized Advice:</p>
                                    <ul className="space-y-1">
                                        {strategies.recommendation.customAdvice.map((advice, index) => (
                                            <li key={index} className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                                                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{advice}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Strategy Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Plan */}
                <StrategyCard
                    type="current"
                    title="Current Plan"
                    description="Continue with minimum payments"
                    strategy={strategies?.currentPlan}
                    isSelected={selectedStrategy === 'current'}
                    isRecommended={false}
                    onClick={() => setSelectedStrategy('current')}
                    icon={Calendar}
                    color="gray"
                />

                {/* Snowball Method */}
                <StrategyCard
                    type="snowball"
                    title="Snowball Method"
                    description="Pay smallest balances first"
                    strategy={strategies?.snowballMethod}
                    isSelected={selectedStrategy === 'snowball'}
                    isRecommended={strategies?.recommendation.bestStrategy === 'snowball'}
                    onClick={() => setSelectedStrategy('snowball')}
                    icon={Zap}
                    color="blue"
                />

                {/* Avalanche Method */}
                <StrategyCard
                    type="avalanche"
                    title="Avalanche Method"
                    description="Pay highest interest first"
                    strategy={strategies?.avalancheMethod}
                    isSelected={selectedStrategy === 'avalanche'}
                    isRecommended={strategies?.recommendation.bestStrategy === 'avalanche'}
                    onClick={() => setSelectedStrategy('avalanche')}
                    icon={TrendingDown}
                    color="green"
                />
            </div>

            {/* Detailed Strategy View */}
            {selectedStrategyData && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedStrategy}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Strategy Details */}
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                {selectedStrategyData.name} Details
                            </h3>
                            <p className="text-slate-600 dark:text-gray-300 mb-6">
                                {selectedStrategyData.description}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Payoff Date</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {new Date(selectedStrategyData.payoffDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Total Interest</p>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {formatCurrency(selectedStrategyData.totalInterest)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Interest Saved</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(selectedStrategyData.interestSaved)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Months Saved</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {selectedStrategyData.monthsSaved} months
                                    </p>
                                </div>
                            </div>

                            {/* Pros & Cons */}
                            {(selectedStrategyData.pros || selectedStrategyData.cons) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStrategyData.pros && (
                                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                                ✓ Advantages
                                            </h4>
                                            <ul className="space-y-1">
                                                {selectedStrategyData.pros.map((pro, index) => (
                                                    <li key={index} className="text-sm text-green-600 dark:text-green-400">
                                                        • {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {selectedStrategyData.cons && (
                                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                                            <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
                                                ⚠ Considerations
                                            </h4>
                                            <ul className="space-y-1">
                                                {selectedStrategyData.cons.map((con, index) => (
                                                    <li key={index} className="text-sm text-orange-600 dark:text-orange-400">
                                                        • {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Payoff Order */}
                        {selectedStrategyData.payoffOrder && selectedStrategyData.payoffOrder.length > 0 && (
                            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    Recommended Payoff Order
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                                    Focus your extra payments in this order for maximum impact
                                </p>
                                <div className="space-y-3">
                                    {selectedStrategyData.payoffOrder.map((item, index) => (
                                        <motion.div
                                            key={item.loanId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {item.loanName}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                                    {item.reason}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Comparison Chart */}
            {strategies && (
                <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Strategy Comparison
                    </h3>
                    <StrategyComparisonChart strategies={strategies} />
                </Card>
            )}

            {/* Quick Wins & Milestones */}
            {strategies && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Wins */}
                    {strategies.quickWins && strategies.quickWins.length > 0 && (
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/10">
                                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Quick Wins
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {strategies.quickWins.map((win, index) => (
                                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/5">
                                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700 dark:text-gray-300">{win}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {/* Milestones */}
                    {strategies.milestones && strategies.milestones.length > 0 && (
                        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/10">
                                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Upcoming Milestones
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {strategies.milestones.map((milestone, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-semibold text-green-700 dark:text-green-400">
                                                {milestone.achievement}
                                            </p>
                                            <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
                                                {new Date(milestone.estimatedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {milestone.impact}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Call to Action */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-2 border-blue-200 dark:border-blue-500/20 text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Ready to Start Your Debt-Free Journey?
                </h3>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                    Choose a strategy and start making progress today
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-500/30"
                        onClick={() => navigate('/loans')}
                    >
                        View My Loans
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-slate-200 dark:border-white/10"
                        onClick={() => window.print()}
                    >
                        Print Strategy
                    </Button>
                </div>
            </Card>
        </div>
    );
}

interface StrategyCardProps {
    type: StrategyType;
    title: string;
    description: string;
    strategy: any;
    isSelected: boolean;
    isRecommended: boolean;
    onClick: () => void;
    icon: any;
    color: 'gray' | 'blue' | 'green';
}

function StrategyCard({
    type,
    title,
    description,
    strategy,
    isSelected,
    isRecommended,
    onClick,
    icon: Icon,
    color
}: StrategyCardProps) {
    const colorClasses = {
        gray: {
            bg: 'bg-gray-100 dark:bg-gray-500/10',
            text: 'text-gray-600 dark:text-gray-400',
            border: 'border-gray-300 dark:border-gray-500/30',
            selected: 'ring-2 ring-gray-500 dark:ring-gray-400'
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-500/10',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-300 dark:border-blue-500/30',
            selected: 'ring-2 ring-blue-500 dark:ring-blue-400'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-500/10',
            text: 'text-green-600 dark:text-green-400',
            border: 'border-green-300 dark:border-green-500/30',
            selected: 'ring-2 ring-green-500 dark:ring-green-400'
        }
    };

    const colors = colorClasses[color];

    if (!strategy) return null;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative cursor-pointer transition-all ${isSelected ? colors.selected : ''
                }`}
        >
            <Card className={`p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow ${isSelected ? 'shadow-lg' : ''
                }`}>
                {isRecommended && (
                    <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Recommended
                    </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{description}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                        <span className="text-sm text-slate-600 dark:text-gray-300">Payoff Date</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {new Date(strategy.payoffDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                        <span className="text-sm text-slate-600 dark:text-gray-300">Total Interest</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {formatCurrency(strategy.totalInterest)}
                        </span>
                    </div>
                    {strategy.interestSaved > 0 && (
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-500/10">
                            <span className="text-sm text-green-700 dark:text-green-400">Savings</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(strategy.interestSaved)}
                            </span>
                        </div>
                    )}
                </div>

                {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                            <Info className="w-4 h-4" />
                            Currently Selected
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
