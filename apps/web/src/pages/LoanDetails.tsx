import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Shield,
    CheckCircle,
    Wallet,
    TrendingDown,
    ChevronRight,
    CreditCard,
    DollarSign,
    FileText,
    Activity
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
import { cn } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

export default function LoanDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [schedule, setSchedule] = useState<AmortizationScheduleEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');

    const loanService = new LoanService(supabase);

    useEffect(() => {
        if (id) {
            loadLoan();
        }
    }, [id]);

    const loadLoan = async () => {
        try {
            const data = await loanService.getLoanById(id!);
            if (!data) {
                setLoan(null);
                return;
            }

            // Mock Insurance Data for Demo
            if (!data.insurance_provider && data.loan_type === 'home') {
                data.insurance_provider = "Allianz Home Guard";
                data.insurance_policy_no = "POL-88429-XJ";
                data.insurance_amount = 450.00;
                data.insurance_expiry_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
            }

            setLoan(data);

            const amortization = LoanCalculator.generateAmortizationSchedule(
                data.id,
                data.current_balance,
                data.interest_rate,
                data.remaining_months || data.term_months,
                new Date(data.start_date || new Date()).toISOString(),
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
            <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
                <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!loan) return null;

    const progress = ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100;
    const pastPayments = schedule.filter(s => s.is_paid || new Date(s.payment_date) < new Date()).slice(-5).reverse();

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#F59E0B]/30 relative overflow-hidden">
            {/* Ambient Lighting Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F59E0B]/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* HEADLINE & ACTIONS */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/loans')}
                            className="p-3 hover:bg-white/10 rounded-xl text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-tight text-white">{loan.loan_name}</h1>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] uppercase tracking-wider">
                                    {loan.loan_type}
                                </span>
                            </div>
                            <p className="text-slate-400 mt-1 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-slate-500" /> {loan.lender_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <Button className="flex-1 lg:flex-none bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 rounded-xl px-8 h-12 font-semibold tracking-wide transition-all transform hover:-translate-y-0.5">
                            Pay Loan <DollarSign className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>

                {/* VISUAL METRICS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. KEY NUMBERS (Glass Card) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="h-full p-8 bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F59E0B]/20 to-transparent blur-3xl opacity-50" />

                            <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-6">Loan Balance</h3>

                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-white tracking-tight">RM {loan.current_balance.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                                />
                            </div>
                            <p className="text-sm text-slate-400 flex justify-between">
                                <span>Total Paid: RM {(loan.original_amount - loan.current_balance).toLocaleString()}</span>
                                <span className="text-[#F59E0B] font-semibold">{progress.toFixed(0)}%</span>
                            </p>
                        </Card>
                    </motion.div>

                    {/* 2. LOAN TERMS (Glass Card) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="h-full p-8 bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="grid grid-cols-2 gap-8 h-full">
                                <div className="flex flex-col justify-center">
                                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center mb-4 text-[#8B5CF6]">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Interest Rate</p>
                                    <p className="text-3xl font-bold text-white">{loan.interest_rate}%</p>
                                </div>
                                <div className="flex flex-col justify-center border-l border-white/5 pl-8">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Term Length</p>
                                    <p className="text-3xl font-bold text-white">{loan.term_months} <span className="text-sm font-medium text-slate-500">mo</span></p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* 3. HOME INSURANCE (New Section) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="h-full p-0 bg-gradient-to-b from-[#1E293B]/60 to-[#0F172A]/80 backdrop-blur-xl border border-white/5 rounded-3xl relative overflow-hidden hover:border-white/10 transition-colors">
                            <div className="p-6 border-b border-white/5 flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">Home Insurance</h3>
                                        <p className="text-slate-400 text-xs mt-1 font-medium">{loan.insurance_provider || 'Not Linked'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Premium</p>
                                    <p className="text-xl font-bold text-white">RM {loan.insurance_amount || '0.00'}</p>
                                </div>
                            </div>
                            <div className="p-6 pt-4 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Policy No</span>
                                    <span className="font-mono text-slate-200">{loan.insurance_policy_no || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Expiry Date</span>
                                    <span className={cn("font-medium", loan.insurance_expiry_date ? "text-emerald-400" : "text-slate-500")}>
                                        {loan.insurance_expiry_date ? new Date(loan.insurance_expiry_date).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <Button className="w-full mt-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 rounded-xl py-6 font-semibold transition-all">
                                    Pay Insurance
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* TABS & CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <Card className="bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden min-h-[500px]">
                            {/* Custom Tab Header */}
                            <div className="flex items-center gap-2 p-2 border-b border-white/5 bg-white/[0.02]">
                                <button
                                    onClick={() => setActiveTab('schedule')}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2",
                                        activeTab === 'schedule'
                                            ? "bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <TrendingDown className="w-4 h-4" /> Amortization
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2",
                                        activeTab === 'history'
                                            ? "bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <CreditCard className="w-4 h-4" /> Payment History
                                </button>
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'schedule' ? (
                                        <motion.div
                                            key="schedule"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="h-[400px]"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">Projected Balance</h4>
                                                    <p className="text-slate-400 text-xs mt-1">Estimated payoff trajectory based on current payments</p>
                                                </div>
                                            </div>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={schedule.filter((_, i) => i % 6 === 0)}>
                                                    <defs>
                                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                    <XAxis
                                                        dataKey="payment_date"
                                                        tickFormatter={d => new Date(d).getFullYear().toString()}
                                                        stroke="#475569"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        dy={10}
                                                    />
                                                    <YAxis
                                                        stroke="#475569"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`}
                                                        dx={-10}
                                                    />
                                                    <RechartsTooltip
                                                        contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                        itemStyle={{ color: '#F8FAFC' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="remaining_balance"
                                                        stroke="#F59E0B"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorBalance)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="history"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-white font-bold text-lg">Recent Transactions</h4>
                                                <Button variant="ghost" className="text-[#F59E0B] hover:text-[#FBBF24] hover:bg-transparent text-sm">Download Statement</Button>
                                            </div>

                                            {pastPayments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {pastPayments.map((p, i) => (
                                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white text-sm">Monthly Repayment</p>
                                                                    <p className="text-xs text-slate-500">{new Date(p.payment_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-mono font-bold text-white">RM {p.payment_amount.toLocaleString()}</p>
                                                                <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Paid</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                                                    <p>No payment history available yet.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </div>

                    {/* SIDEBAR - Next Payment & Quick Facts */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-8 bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-3xl">
                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Upcoming Payment</h4>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-[#F59E0B]/10 rounded-2xl border border-[#F59E0B]/20">
                                    <Calendar className="w-8 h-8 text-[#F59E0B]" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">RM {loan.monthly_payment.toLocaleString()}</p>
                                    <p className="text-sm text-slate-400 mt-1">Due {new Date(new Date().setDate(loan.payment_day)).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Button className="w-full bg-white text-[#0F172A] hover:bg-slate-200 h-12 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                                Setup Auto-Pay
                            </Button>
                        </Card>

                        {/* AI Insight Mini */}
                        <Card className="p-8 bg-indigo-900/20 backdrop-blur-xl border border-indigo-500/20 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full -mr-10 -mt-10" />
                            <h4 className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> AI Insight
                            </h4>
                            <p className="text-slate-200 text-sm leading-relaxed mb-6">
                                You could save <span className="text-white font-bold">RM {(loan.interest_rate * 0.1 * loan.current_balance).toFixed(0)}</span> in interest by rounding up your payment to the nearest hundred.
                            </p>
                            <Button variant="ghost" className="w-full text-indigo-300 hover:text-white hover:bg-indigo-500/20 h-10 rounded-lg text-sm font-semibold">
                                View Strategy <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
