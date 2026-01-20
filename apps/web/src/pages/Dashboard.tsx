import React, { useEffect, useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Calendar,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    CreditCard,
    DollarSign,
    ShoppingCart,
    History,
    MoreVertical,
    TrendingUp,
    Sparkles,
    Settings,
    Landmark,
    Banknote,
    Car,
    Home,
    GraduationCap,
    Zap
} from 'lucide-react';
import {
    createTransactionService,
    Transaction,
    formatCurrency,
    Bill,
    createAnalyticsService,
    LoanService,
    Loan
} from '@financeflow/shared';
import { useBills } from '@/hooks/useBills';
import { supabase } from '@/services/supabase';
import { accountService, calculateNextDueDate as calcNextDueDateAccount } from '@/services/account.service';
import { budgetService } from '@/services/budget.service';
import { AccountProps } from '@/components/accounts/AccountCard';
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { AnimatePresence } from 'framer-motion';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';

// --- Constants ---
const BILLING_CYCLE_START_DAY = 30; // Configurable Cycle Start Day

// --- Helper: Billing Cycle Calculator ---
const getBillingCycle = (today: Date, startDay: number) => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    // Helper to safely get date (handling Feb 30 -> Feb 28 etc)
    const getDate = (year: number, month: number, day: number) => {
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        return new Date(year, month, Math.min(day, lastDayOfMonth), 23, 59, 59);
    };

    const candidateStartDate = getDate(currentYear, currentMonth, startDay);

    // Set strictly to start of day for comparison
    const candidateStartCompare = new Date(candidateStartDate);
    candidateStartCompare.setHours(0, 0, 0, 0);

    let cycleStart: Date;
    let cycleEnd: Date;

    if (today < candidateStartCompare) {
        // We are in the cycle that started last month
        cycleStart = getDate(currentYear, currentMonth - 1, startDay);
        cycleStart.setHours(0, 0, 0, 0); // Start of day
        cycleEnd = getDate(currentYear, currentMonth, startDay - 1);
        cycleEnd.setHours(23, 59, 59, 999); // End of day
    } else {
        // We are in the cycle that started this month
        cycleStart = getDate(currentYear, currentMonth, startDay);
        cycleStart.setHours(0, 0, 0, 0);
        cycleEnd = getDate(currentYear, currentMonth + 1, startDay - 1);
        cycleEnd.setHours(23, 59, 59, 999);
    }

    return { cycleStart, cycleEnd };
};

// --- Types ---
type PaymentType = 'bill' | 'loan' | 'credit_card';
interface UpcomingPayment {
    id: string;
    name: string;
    amount: number;
    dueDate: string; // ISO Date
    daysUntilDue: number;
    type: PaymentType;
    category?: string;
    status: 'unpaid' | 'overdue' | 'paid'; // 'paid' filtered out usually
    icon?: React.ElementType;
}

// --- Animation Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const GlassCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
    <motion.div
        variants={itemVariants}
        className={`
        relative backdrop-blur-2xl transition-all duration-300
        dark:bg-white/5 dark:border-white/10 dark:text-slate-200
        bg-white border-slate-200 text-slate-800 shadow-sm border
        ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/10 dark:hover:border-white/20' : ''} 
        ${className}
    `}>
        {children}
    </motion.div>
);

const Dashboard = () => {
    // Data States
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<AccountProps[]>([]);
    const [creditCards, setCreditCards] = useState<AccountProps[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]); // Added Loans State

    // Hook for Bills
    const { data: billsRaw, isLoading: billsLoading } = useBills();

    // Metrics
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [liquidity, setLiquidity] = useState(0);
    const [monthlyYield, setMonthlyYield] = useState(0);
    const [riskScore, setRiskScore] = useState(0);
    const [healthDetails, setHealthDetails] = useState<any>(null);

    // Charts
    const [chartData, setChartData] = useState<{ month: string, income: number, expense: number }[]>([]);

    // Widget States
    const [spendingSummary, setSpendingSummary] = useState({
        totalAllocated: 0,
        totalSpent: 0,
        percentage: 0,
        topCategories: [] as { name: string, percentage: number, color: string }[]
    });
    const [insight, setInsight] = useState({ text: "Analyzing financial data...", action: "View Details" });

    // Modal State
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

    const [isDashboardLoading, setIsDashboardLoading] = useState(true);
    const isLoading = isDashboardLoading || billsLoading;

    // --- Derived State: Unified Upcoming Payments (Bills + Loans + CC) ---
    const upcomingPayments = useMemo(() => {
        const { cycleStart, cycleEnd } = getBillingCycle(new Date(), BILLING_CYCLE_START_DAY);
        const unifiedList: UpcomingPayment[] = [];
        const now = new Date();

        // 1. Process Bills
        if (billsRaw) {
            billsRaw.forEach(bill => {
                // If paid, check next month. If unpaid, check this month.
                // NOTE: Dashboard logic (unlike Bills page) focuses on 'unpaid only'.
                // If a bill is paid for the current cycle, it should NOT appear (per user request).
                // If it is 'unpaid', check if it falls in the current cycle.

                if (!bill.next_due_date) return;
                let checkDateStr = bill.next_due_date;
                let status = bill.status as 'unpaid' | 'overdue' | 'paid';

                if (status === 'paid') return; // User explicitly said "displayed the unpaid bills only"

                // Check if the due date falls within current cycle
                const checkDate = new Date(checkDateStr);

                // If overdue (in past) but unpaid, ALWAYS show it regardless of cycle?
                // Or user said "unpaid bills only for current month".
                // Usually overdue bills are important. Let's include them.
                // Strict Interpretation: "for the current month" might exclude old overdue logic?
                // Better UX: Show anything unpaid due <= cycleEnd.

                if (checkDate <= cycleEnd) {
                    const diffTime = checkDate.getTime() - now.getTime();
                    const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    unifiedList.push({
                        id: `bill-${bill.id}`,
                        name: bill.bill_name,
                        amount: bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0),
                        dueDate: bill.next_due_date,
                        daysUntilDue: daysDiff,
                        type: 'bill',
                        status: daysDiff < 0 ? 'overdue' : 'unpaid',
                        // budget_category_id used for icon if needed
                        category: bill.budget_category_id
                    });
                }
            });
        }

        // 2. Process Loans
        if (loans) {
            loans.forEach(loan => {
                if (loan.status !== 'active') return;

                // Calculate next due date for this loan within cycle?
                // Loans logic usually: Due on day X of every month.
                // Find the instance of 'payment_day' that falls within [cycleStart, cycleEnd].
                // Note: cycle might span 2 months (e.g. Dec 30 - Jan 29).
                // payment_day X might appear 0, 1, or 2 times? Usually 1.

                // Get candidate dates in the months covered by cycle
                const startMonth = cycleStart.getMonth();
                const endMonth = cycleEnd.getMonth();
                const startYear = cycleStart.getFullYear();
                const endYear = cycleEnd.getFullYear();

                // Check all months in range (start and end)
                let foundDate: Date | null = null;

                // Check start month instance
                const d1 = new Date(startYear, startMonth, Math.min(loan.payment_day, new Date(startYear, startMonth + 1, 0).getDate()));
                if (d1 >= cycleStart && d1 <= cycleEnd) foundDate = d1;

                // Check end month instance (if different)
                if (!foundDate && (startMonth !== endMonth || startYear !== endYear)) {
                    const d2 = new Date(endYear, endMonth, Math.min(loan.payment_day, new Date(endYear, endMonth + 1, 0).getDate()));
                    if (d2 >= cycleStart && d2 <= cycleEnd) foundDate = d2;
                }

                if (foundDate) {
                    // We found a due date in this cycle.
                    // IMPORTANT: Is it paid?
                    // Real implementation needs to query `loan_payments`.
                    // For now, we assume unpaid if it's in the future or recent past.
                    // (Without querying payments table for every loan, we can't be 100% sure if paid early).
                    // Optimization: In real app, `loans` fetch should include `last_payment` info.
                    // Current `Loan` interface doesn't have it.
                    // We will list it. If user paid, they might see it. (Gap in logic due to data limitations).
                    // WORKAROUND: Assume unpaid for now.

                    const diffTime = foundDate.getTime() - now.getTime();
                    const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    unifiedList.push({
                        id: `loan-${loan.id}`,
                        name: loan.loan_name || loan.name, // Support legacy name
                        amount: loan.monthly_payment,
                        dueDate: foundDate.toISOString(),
                        daysUntilDue: daysDiff,
                        type: 'loan',
                        status: daysDiff < 0 ? 'overdue' : 'unpaid',
                        // Select icon based on loan type
                        icon: loan.loan_type === 'home' ? Home : loan.loan_type === 'auto' ? Car : loan.loan_type === 'education' ? GraduationCap : Banknote
                    });
                }
            });
        }

        // 3. Process Credit Cards
        if (creditCards) {
            creditCards.forEach(card => {
                // Check if card has payment date
                if (card.payment_due_date && card.balance < 0) { // Credit cards usually negative balance = spending
                    // Find due date in cycle (similar to loans)
                    const startMonth = cycleStart.getMonth();
                    const endMonth = cycleEnd.getMonth();
                    const startYear = cycleStart.getFullYear();
                    const endYear = cycleEnd.getFullYear();

                    let foundDate: Date | null = null;
                    const day = card.payment_due_date;

                    // Check start month instance
                    const d1 = new Date(startYear, startMonth, Math.min(day, new Date(startYear, startMonth + 1, 0).getDate()));
                    if (d1 >= cycleStart && d1 <= cycleEnd) foundDate = d1;

                    // Check end month instance
                    if (!foundDate && (startMonth !== endMonth || startYear !== endYear)) {
                        const d2 = new Date(endYear, endMonth, Math.min(day, new Date(endYear, endMonth + 1, 0).getDate()));
                        if (d2 >= cycleStart && d2 <= cycleEnd) foundDate = d2;
                    }

                    if (foundDate) {
                        const diffTime = foundDate.getTime() - now.getTime();
                        const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        unifiedList.push({
                            id: `cc-${card.id}`,
                            name: `${card.institution?.name} Card`,
                            amount: 0, // Should be min payment? accountService doesn't give min payment easily in props.
                            // Dashboard `creditCards` state is AccountProps array.
                            // AccountProps has `minimum_payment_percentage` but not calculated amount.
                            // We calculate roughly:
                            // balance is negative (spending). abs(balance) * min_pct / 100.
                            // Use raw logic or generic amount.
                            dueDate: foundDate.toISOString(),
                            daysUntilDue: daysDiff,
                            type: 'credit_card',
                            status: daysDiff < 0 ? 'overdue' : 'unpaid',
                            icon: CreditCard
                        });

                        // Fix amount calculation
                        const balance = Math.abs(card.balance);
                        const minPct = card.minimum_payment_percentage || 5;
                        const minPayment = Math.max(balance * (minPct / 100), 25);
                        unifiedList[unifiedList.length - 1].amount = minPayment;
                    }
                }
            });
        }

        // Sort by Due Date (Ascending)
        return unifiedList.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    }, [billsRaw, loans, creditCards]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const now = new Date();
                const currentMonthStr = now.toISOString().slice(0, 7);
                const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

                // Services
                const txService = createTransactionService(supabase);
                const analyticsService = createAnalyticsService(supabase);
                const loanService = new LoanService(supabase); // Instantiate Loan Service

                const [txData, accountsData, budgetData, healthData, loansData] = await Promise.all([
                    txService.getAll({ startDate: sixMonthsAgo }),
                    accountService.getAll(),
                    budgetService.getMonthlySummary(currentMonthStr),
                    analyticsService.calculateFinancialHealth(user.id),
                    loanService.getLoans() // Fetch Loans
                ]);

                // --- 1. Process Chart Data ---
                setTransactions(txData.slice(0, 5));

                const monthsMap = new Map<string, { income: number, expense: number }>();
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = d.toLocaleString('default', { month: 'short' });
                    monthsMap.set(key, { income: 0, expense: 0 });
                }

                txData.forEach(tx => {
                    const d = new Date(tx.date);
                    const key = d.toLocaleString('default', { month: 'short' });
                    if (monthsMap.has(key)) {
                        const entry = monthsMap.get(key)!;
                        if (tx.type === 'income') entry.income += tx.amount;
                        if (tx.type === 'expense') entry.expense += tx.amount;
                    }
                });

                setChartData(Array.from(monthsMap.entries()).map(([month, data]) => ({
                    month,
                    income: data.income,
                    expense: data.expense
                })));

                const currentMonthName = now.toLocaleString('default', { month: 'short' });
                const currentMonthStats = monthsMap.get(currentMonthName) || { income: 0, expense: 0 };
                setMonthlyYield(currentMonthStats.income - currentMonthStats.expense);

                // --- 2. Accounts & Risk ---
                setAccounts(accountsData);
                const cards = accountsData.filter(a => a.type === 'credit_card');
                setCreditCards(cards);
                setLoans(loansData); // Set Loans

                const totalAssets = accountsData.reduce((sum, a) => sum + (a.type !== 'credit_card' ? a.balance : 0), 0);
                const totalDebt = accountsData.reduce((sum, a) => sum + (a.type === 'credit_card' ? Math.abs(a.balance) : 0), 0);
                const totalLiquidity = accountsData
                    .filter(a => ['bank', 'cash', 'ewallet'].includes(a.type))
                    .reduce((sum, a) => sum + a.balance, 0);

                setPortfolioValue(totalAssets - totalDebt);
                setLiquidity(totalLiquidity);
                setRiskScore(healthData.overall);
                setHealthDetails(healthData);

                // --- 3. Budget Summary ---
                const topBudgets = [...budgetData.budgets]
                    .sort((a, b) => (b.spent_amount / b.amount) - (a.spent_amount / a.amount))
                    .slice(0, 2)
                    .map(b => ({
                        name: b.category?.name || 'Unknown',
                        percentage: Math.min(100, Math.round((b.spent_amount / (b.amount || 1)) * 100)),
                        color: b.category?.color || '#64748B'
                    }));

                setSpendingSummary({
                    totalAllocated: budgetData.totalAllocated,
                    totalSpent: budgetData.totalSpent,
                    percentage: Math.min(100, Math.round(budgetData.percentage)),
                    topCategories: topBudgets
                });

                // Insight Update
                if (healthData.insights && healthData.insights.length > 0) {
                    setInsight({ text: healthData.insights[0], action: "View Analysis" });
                } else if (currentMonthStats.income < currentMonthStats.expense) {
                    setInsight({ text: "Spending exceeds income.", action: "Review" });
                } else {
                    setInsight({ text: "Healthy cash flow.", action: "Invest" });
                }

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsDashboardLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const activeCard = creditCards[0];

    const gaugeData = [
        { name: 'Score', value: riskScore, fill: riskScore > 75 ? '#10B981' : riskScore > 50 ? '#F59E0B' : '#EF4444' },
        { name: 'Remaining', value: 100 - riskScore, fill: '#33415510' },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen font-sans p-4 lg:p-0 relative dark:text-slate-200 text-slate-800"
        >
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            </div>

            {/* TOP SECTION: Financial Overview & Upcoming Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-4">

                {/* LEFT: Financial Health & Overview */}
                <GlassCard className="p-6 rounded-3xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold dark:text-white text-slate-900">Financial Overview</h2>
                            <p className="text-xs text-slate-500">Real-time health & performance</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${riskScore > 70 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                            {riskScore > 70 ? 'Healthy' : 'Attention Needed'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Portfolio Summary */}
                        <div className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Net Worth</p>
                                <p className="text-2xl font-black dark:text-white text-slate-900 mt-1">{formatCurrency(portfolioValue)}</p>
                                <div className="flex items-center text-[10px] mt-2 font-bold text-emerald-500">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    <span>+2.4% this month</span>
                                </div>
                            </div>
                            <MoreVertical className="absolute top-2 right-2 w-4 h-4 text-slate-300 dark:text-slate-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Risk / Health Gauge */}
                        <div className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 flex items-center justify-between relative overflow-hidden">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Health Score</p>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <p className={`text-3xl font-black ${riskScore > 75 ? 'text-emerald-500' : riskScore > 50 ? 'text-amber-500' : 'text-rose-500'}`}>{riskScore}</p>
                                    <span className="text-xs font-bold text-slate-400">/100</span>
                                </div>
                                <p className="text-[9px] text-slate-400 mt-1">{healthDetails?.rating || 'Calculating...'}</p>
                            </div>
                            <div className="h-20 w-32 relative flex items-center justify-center -mr-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={gaugeData}
                                            cx="50%"
                                            cy="70%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={35}
                                            outerRadius={45}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={4}
                                        >
                                            {gaugeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                                    <ShieldCheck className={`w-5 h-5 ${riskScore > 75 ? 'text-emerald-500' : riskScore > 50 ? 'text-amber-500' : 'text-rose-500'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 w-full min-h-[180px] bg-gradient-to-b from-transparent to-primary/5 rounded-2xl border border-primary/10 p-4 pt-6">
                        <ResponsiveContainer width="100%" height={160}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#33415530" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* RIGHT: Upcoming Bills & Payments (Unified) */}
                <GlassCard className="p-6 rounded-3xl flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-rose-500/10 p-2 rounded-xl text-rose-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold dark:text-white text-slate-900">Upcoming Payments</h2>
                                <p className="text-xs text-slate-500">Current Cycle (Start {BILLING_CYCLE_START_DAY}th)</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">View All</button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <p className="text-center text-sm text-slate-500 py-10">Checking schedule...</p>
                        ) : upcomingPayments.length === 0 ? (
                            <div className="text-center py-10 flex flex-col items-center">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 opacity-20" />
                                <p className="text-sm font-bold text-slate-400">All caught up!</p>
                                <p className="text-xs text-slate-500 whitespace-pre-line">
                                    No unpaid bills, loans, or cards{'\n'}due in current cycle.
                                </p>
                            </div>
                        ) : (
                            upcomingPayments.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl dark:bg-white/5 bg-slate-50 border border-transparent dark:hover:border-white/10 hover:border-slate-200 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-xl shadow-sm">
                                            {item.icon ? (
                                                <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                                            ) : (
                                                item.type === 'loan' ? <Landmark className="w-5 h-5 text-purple-500" /> :
                                                    item.type === 'credit_card' ? <CreditCard className="w-5 h-5 text-blue-500" /> :
                                                        item.category === 'electricity' ? '⚡' : '📄'
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold dark:text-white text-slate-900 leading-snug">{item.name}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${item.daysUntilDue < 0 ? 'text-rose-500' :
                                                item.daysUntilDue <= 3 ? 'text-amber-500' : 'text-slate-400'
                                                }`}>
                                                {item.daysUntilDue < 0 ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                                {item.daysUntilDue < 0 ? `Overdue by ${Math.abs(item.daysUntilDue)}d` :
                                                    item.daysUntilDue === 0 ? 'Due Today' :
                                                        `Due in ${item.daysUntilDue} days`}
                                                <span className="opacity-50 mx-1">•</span>
                                                <span>{new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold dark:text-white text-slate-900">{formatCurrency(item.amount)}</p>
                                        <div className="flex justify-end gap-1 mt-1">
                                            {item.type === 'loan' && <span className="text-[9px] bg-purple-500/10 text-purple-500 px-1.5 rounded uppercase font-bold">Loan</span>}
                                            {item.type === 'credit_card' && <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 rounded uppercase font-bold">Card</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="w-full mt-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10">
                        Quick Pay
                    </button>
                </GlassCard>
            </div>

            {/* SECOND ROW: Card Management | Spending Limit | Wealth AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-6 gap-6 pb-20">
                {/* Card Management - Large Block */}
                <GlassCard className="p-8 rounded-3xl lg:col-span-3 lg:row-span-6 group relative overflow-hidden dark:bg-white/5 bg-white">
                    {/* Decorative background element - Dark mode only */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-bl-full -z-10 dark:block hidden"></div>

                    {activeCard ? (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold text-lg dark:text-white text-slate-900">Card Management</h3>
                                <div className="flex space-x-2">
                                    {creditCards.map(card => (
                                        <button key={card.id} className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest dark:hover:text-white hover:text-slate-900 px-3 py-1 dark:bg-white/5 bg-slate-100 rounded-lg border dark:border-white/5 border-slate-200 transition-colors">
                                            {card.institution?.name || 'Card'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center h-full">
                                <div className="lg:col-span-3 h-full">
                                    <motion.div
                                        whileHover={{ scale: 1.02, rotateY: 2 }}
                                        className="w-full aspect-[1.58/1] rounded-2xl p-8 relative overflow-hidden border border-white/10 shadow-2xl shadow-black/40 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-black transform transition-transform"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">{activeCard.institution?.name}</p>
                                                <p className="text-sm font-bold text-white/80">{activeCard.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <CreditCard className="text-white/80 w-8 h-8" />
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <p className="text-xl md:text-2xl font-medium tracking-[0.15em] text-white/90 mb-6 font-mono">
                                                •••• •••• •••• {activeCard.accountNumber?.slice(-4) || 'XXXX'}
                                            </p>
                                            <div className="flex justify-between items-end">
                                                <div className="flex space-x-8">
                                                    <div>
                                                        <p className="text-[8px] uppercase font-bold text-white/30 tracking-widest mb-1">Status</p>
                                                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">ACTIVE</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] uppercase font-bold text-white/30 tracking-widest mb-1">Due Date</p>
                                                        <p className="text-[10px] font-bold text-white/80 tracking-widest">
                                                            {activeCard.payment_due_date ? `Day ${activeCard.payment_due_date}` : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                    <div className="p-4 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200">
                                        <p className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-1">Credit Usage</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-lg font-bold dark:text-white text-slate-900">{formatCurrency(Math.abs(activeCard.balance))}</p>
                                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold">
                                                {activeCard.creditLimit ? `${Math.round((Math.abs(activeCard.balance) / activeCard.creditLimit) * 100)}% Used` : 'N/A'}
                                            </p>
                                        </div>
                                        {activeCard.creditLimit && (
                                            <div className="h-1 w-full dark:bg-black/20 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (Math.abs(activeCard.balance) / activeCard.creditLimit) * 100)}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-emerald-500 dark:bg-emerald-400"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <button className="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-lg dark:text-white text-slate-900 mb-2">No Cards Linked</h3>
                            <p className="text-sm dark:text-slate-400 text-slate-500 mb-6 max-w-xs">link a credit card to track usage, limits, and payment dates in real-time.</p>
                            <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                Link Card
                            </button>
                        </div>
                    )}
                </GlassCard>

                {/* AI & Spending - Right Column */}
                <div className="lg:col-span-1 lg:row-span-6 flex flex-col gap-6">
                    {/* Spending Limit Circle */}
                    <GlassCard className="p-6 rounded-3xl flex-1 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4 z-10 relative">
                            <h3 className="font-bold text-sm dark:text-white text-slate-900">Spending</h3>
                            <button className="dark:text-slate-500 text-slate-400 hover:text-primary transition-colors text-xs"><Settings className="w-4 h-4" /></button>
                        </div>

                        <div className="relative flex flex-col justify-center items-center py-2 z-10">
                            {/* Circular Progress */}
                            <div className="w-32 h-32 rounded-full border-8 dark:border-white/5 border-slate-100 relative flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-transparent" />
                                    <motion.circle
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: spendingSummary.percentage / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="50" cy="50" r="46" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" className="text-purple-500"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7C3AED" />
                                            <stop offset="100%" stopColor="#06B6D4" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="text-center">
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-2xl font-black dark:text-white text-slate-900"
                                    >
                                        {spendingSummary.percentage}%
                                    </motion.p>
                                    <p className="text-[9px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest">Used</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4 z-10 relative">
                            {spendingSummary.topCategories.length > 0 ? spendingSummary.topCategories.map((cat, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="dark:text-slate-400 text-slate-500 uppercase tracking-widest">{cat.name}</span>
                                        <span className="dark:text-white text-slate-900">{cat.percentage}%</span>
                                    </div>
                                    <div className="h-1 w-full dark:bg-white/5 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.percentage}%` }}
                                            transition={{ delay: 0.8 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-[10px] text-slate-500 pt-2">No budget data set for this month.</div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Wealth AI */}
                    <GlassCard className="p-6 rounded-3xl flex-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white text-slate-900 text-sm leading-none">Wealth AI</h3>
                                <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1">Grok-Enabled</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-[10px] leading-relaxed dark:text-slate-200 text-slate-700">
                                {insight.text}
                            </div>
                            <div className="dark:bg-white/5 bg-white border dark:border-white/5 border-slate-200 p-3 rounded-xl text-[10px] dark:hover:bg-white/10 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center group/action">
                                <span className="text-cyan-500 dark:text-cyan-400 font-bold">{insight.action}</span>
                                <CreditCard className="w-3 h-3 text-cyan-500 dark:text-cyan-400 group-hover/action:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Activity - Bottom Full Width */}
                <GlassCard className="p-8 rounded-3xl lg:col-span-4 lg:row-span-4 group">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl dark:text-white text-slate-900">Recent Activity</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsAddTransactionOpen(true)}
                                className="px-3 py-1.5 dark:bg-white/5 bg-slate-50 dark:hover:bg-white/10 hover:bg-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-emerald-500 hover:text-emerald-400"
                            >
                                + Add New
                            </button>
                            <button className="px-3 py-1.5 dark:bg-white/5 bg-slate-50 dark:hover:bg-white/10 hover:bg-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Filter</button>
                            <button className="px-3 py-1.5 dark:bg-white/5 bg-slate-50 dark:hover:bg-white/10 hover:bg-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Export</button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {isLoading ? (
                            <div className="text-center py-4 text-slate-500 text-sm">Loading activity...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-4 text-slate-500 text-sm">No recent activity</div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 dark:hover:bg-white/[0.03] hover:bg-slate-50 rounded-2xl transition-all border-b dark:border-white/5 border-slate-100 last:border-0 cursor-pointer group/item">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' :
                                            tx.type === 'expense' ? 'bg-primary/10 text-primary' :
                                                'bg-cyan-500/10 text-cyan-500'
                                            }`}>
                                            {tx.type === 'income' ? <DollarSign className="w-5 h-5" /> :
                                                tx.type === 'expense' ? <ShoppingCart className="w-5 h-5" /> :
                                                    <History className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white text-slate-900 group-hover/item:text-primary transition-colors">{tx.description}</p>
                                            <p className="text-[11px] dark:text-slate-500 text-slate-400 font-medium">
                                                {tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'dark:text-white text-slate-900'}`}>
                                            {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                                        </p>
                                        <p className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="w-full mt-6 py-3 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 dark:hover:bg-white/10 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all">
                        View Complete Ledger
                    </button>
                </GlassCard>

            </div>

            <button
                onClick={() => setIsAddTransactionOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all z-[100] md:hidden"
            >
                <Zap className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isAddTransactionOpen && (
                    <AddTransactionModal
                        onClose={() => setIsAddTransactionOpen(false)}
                        onSave={() => {
                            // Refresh logic could go here
                            setIsAddTransactionOpen(false);
                            window.location.reload(); // Simple refresh for now or use QueryClient invalidate
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
