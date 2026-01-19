import { useState, useEffect, useMemo } from 'react'
import CountUp from 'react-countup'
import { Sparkles, Wallet, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { ParticleBackground } from '../ui/ParticleBackground'
import { FinancialHealthWidget } from './FinancialHealthWidget'
import { supabase } from '@/services/supabase'

// Mock sparkline data for visual richness
const generateSparklineData = (baseValue: number, trend: 'up' | 'down') => {
    return Array.from({ length: 10 }, (_, i) => ({
        value: baseValue + (trend === 'up' ? i * 5 : -i * 5) + Math.random() * 20
    }))
}

const useFinancialData = () => {
    const [data, setData] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        totalBudget: 0,
        healthScore: 0,
        healthComponents: {
            budgeting: 0,
            saving: 0,
            debt: 0,
            investing: 0
        },
        isLoading: true
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: accounts } = await supabase
                    .from('accounts')
                    .select('balance, type')
                    .eq('user_id', user.id)

                const totalBalance = accounts?.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) || 0
                const assets = accounts?.filter(a => a.type !== 'credit_card' && a.type !== 'loan')
                    .reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) || 0
                const liabilities = accounts?.filter(a => a.type === 'credit_card' || a.type === 'loan')
                    .reduce((sum, acc) => sum + Math.abs(Number(acc.balance) || 0), 0) || 0
                const netWorth = assets - liabilities

                const startOfMonth = new Date()
                startOfMonth.setDate(1)
                startOfMonth.setHours(0, 0, 0, 0)

                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('amount, type')
                    .eq('user_id', user.id)
                    .gte('date', startOfMonth.toISOString())

                const monthlyIncome = transactions
                    ?.filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0
                const monthlyExpenses = transactions
                    ?.filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0

                const { data: budgets } = await supabase
                    .from('budgets')
                    .select('budget_amount')
                    .eq('user_id', user.id)

                const totalBudgetAmount = budgets?.reduce((sum, b) => sum + (Number(b.budget_amount) || 0), 0) || 0

                const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0
                const debtRatio = assets > 0 ? (liabilities / assets) * 100 : 0
                const budgetingScore = Math.min(100, Math.max(0, 100 - Math.abs(monthlyExpenses - monthlyIncome * 0.7)))
                const savingScore = Math.min(100, savingsRate * 3)
                const debtScore = Math.max(0, 100 - debtRatio)
                const investingScore = assets > 0 ? Math.min(100, (assets / (monthlyIncome * 6)) * 100) : 0

                const healthScore = Math.round(
                    (budgetingScore * 0.25) +
                    (savingScore * 0.30) +
                    (debtScore * 0.25) +
                    (investingScore * 0.20)
                )

                setData({
                    totalBalance,
                    monthlyIncome,
                    monthlyExpenses,
                    netWorth,
                    totalAssets: assets,
                    totalLiabilities: liabilities,
                    totalBudget: totalBudgetAmount,
                    healthScore,
                    healthComponents: {
                        budgeting: Math.round(budgetingScore),
                        saving: Math.round(savingScore),
                        debt: Math.round(debtScore),
                        investing: Math.round(investingScore)
                    },
                    isLoading: false
                })
            } catch (error) {
                console.error('Failed to fetch financial data:', error)
                setData(prev => ({ ...prev, isLoading: false }))
            }
        }
        fetchData()
    }, [])

    return data
}

interface StatCardProps {
    label: string
    value: number
    change: string
    trend: 'up' | 'down'
    icon: React.ReactNode
    color: string
}

function MiniSparkline({ trend, color }: { trend: 'up' | 'down', color: string }) {
    const data = useMemo(() => generateSparklineData(100, trend), [trend])
    return (
        <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fill={`${color}33`}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

function StatCard({ label, value, change, trend, icon, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all cursor-default"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <MiniSparkline trend={trend} color={trend === 'up' ? '#10B981' : '#EF4444'} />
            </div>

            <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
            <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-2xl font-bold text-white font-mono">
                    RM <CountUp end={value || 0} decimals={2} duration={2} separator="," />
                </h4>
                <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                </div>
            </div>
        </motion.div>
    )
}

const MonthlyMilestone = ({ data }: { data: any }) => {
    const budgetPercentage = data.totalBudget > 0
        ? Math.min((data.monthlyExpenses / data.totalBudget) * 100, 100)
        : 0

    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysRemaining = daysInMonth - now.getDate()

    const getProgressColor = (pct: number) => {
        if (pct >= 90) return 'from-red-500 to-rose-600'
        if (pct >= 70) return 'from-orange-500 to-amber-600'
        return 'from-green-500 to-emerald-600'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-400" />
                            <span className="text-white font-semibold tracking-wide">Monthly Budget Mission</span>
                        </div>
                        <span className={`text-sm font-bold ${budgetPercentage > 90 ? 'text-red-400' : 'text-gray-400'}`}>
                            {budgetPercentage.toFixed(0)}% Utilized
                        </span>
                    </div>

                    <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${budgetPercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(budgetPercentage)} rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]`}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs font-medium uppercase tracking-tighter text-gray-500">
                        <span>Spent: RM {data.monthlyExpenses.toLocaleString()}</span>
                        <span>Total Budget: RM {data.totalBudget.toLocaleString()}</span>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-4 pl-0 md:pl-6 border-l-0 md:border-l border-white/10">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Payday in</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white font-mono">{daysRemaining}</span>
                            <span className="text-sm font-bold text-primary-400">days</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20">
                        <TrendingUp className="w-6 h-6 text-primary-400" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export function EnhancedFinancialHero() {
    const data = useFinancialData()
    const cashFlow = data.monthlyIncome - data.monthlyExpenses

    if (data.isLoading) {
        return <div className="h-[450px] w-full animate-pulse bg-white/5 rounded-3xl" />
    }

    return (
        <div className="relative mb-8">
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <ParticleBackground count={30} />
            </div>

            <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#121629]/90 to-[#0A0E27]/90 backdrop-blur-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Summary Section */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center gap-2">
                                        <Activity className="w-3.5 h-3.5 text-primary-400" />
                                        <span className="text-[11px] uppercase tracking-wider font-bold text-primary-400">Live Portfolio</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                        <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">AI Optimized</span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide uppercase">Current Net Worth</p>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent italic font-mono">
                                        RM <CountUp end={data.netWorth || 0} decimals={2} duration={2.5} separator="," />
                                    </h1>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-bold">+12.5%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Compact Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    label="Total Assets"
                                    value={data.totalAssets}
                                    change="+5.2%"
                                    trend="up"
                                    icon={<Wallet className="w-5 h-5" />}
                                    color="blue"
                                />
                                <StatCard
                                    label="Total Liabilities"
                                    value={data.totalLiabilities}
                                    change="-2.1%"
                                    trend="down"
                                    icon={<TrendingDown className="w-5 h-5" />}
                                    color="red"
                                />
                                <StatCard
                                    label="Monthly Cash Flow"
                                    value={cashFlow}
                                    change={cashFlow >= 0 ? '+8.3%' : '-3.2%'}
                                    trend={cashFlow >= 0 ? 'up' : 'down'}
                                    icon={<BarChart3 className="w-5 h-5" />}
                                    color={cashFlow >= 0 ? 'green' : 'orange'}
                                />
                            </div>

                            {/* Monthly Milestone Tracker (Option 3) */}
                            <MonthlyMilestone data={data} />
                        </div>

                        {/* Health Section */}
                        <div className="lg:w-[350px]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <FinancialHealthWidget
                                    score={data.healthScore}
                                    components={data.healthComponents}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

