import { useState, useEffect } from 'react'
import { Sparkles, Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { StatCard } from './StatCard'

// Hook to fetch financial data (extracted from EnhancedFinancialHero)
const useFinancialData = () => {
    const [data, setData] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netWorth: 0,
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

                const assets = accounts?.filter(a => a.type !== 'credit_card' && a.type !== 'loan')
                    .reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) || 0
                const liabilities = accounts?.filter(a => a.type === 'credit_card' || a.type === 'loan')
                    .reduce((sum, acc) => sum + Math.abs(Number(acc.balance) || 0), 0) || 0
                const netWorth = assets - liabilities
                const totalBalance = assets // Simplified for display

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

                setData({
                    totalBalance,
                    monthlyIncome,
                    monthlyExpenses,
                    netWorth,
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

export function FinancialOverviewHero() {
    const { totalBalance, monthlyIncome, monthlyExpenses, netWorth, isLoading } = useFinancialData()

    if (isLoading) {
        return <div className="h-[400px] w-full animate-pulse bg-white/5 rounded-3xl" />
    }

    return (
        <div className="relative mb-8 group">
            {/* Particle background */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl z-0">
                <ParticleBackground count={50} />
            </div>

            {/* Main card with 3D transform */}
            <div className="
        relative p-8 rounded-3xl
        bg-gradient-to-br from-[#1A1F3A]/90 to-[#121629]/90
        backdrop-blur-2xl
        border border-white/10
        transform-gpu
        transition-transform duration-700 ease-out
        hover:scale-[1.01]
        hover:shadow-2xl hover:shadow-blue-500/20
        overflow-hidden
      "
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                }}>
                {/* Holographic rotating border effect */}
                <div className="absolute -inset-[50%] bg-gradient-conic from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-spin-slow pointer-events-none"></div>

                {/* Content with depth */}
                <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">
                                Financial Overview
                            </h2>
                            <p className="text-gray-400">Real-time snapshot of your wealth</p>
                        </div>

                        {/* AI Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                            <Sparkles size={16} className="text-blue-400 animate-pulse" />
                            <span className="text-blue-400 text-sm font-semibold">AI Powered</span>
                        </div>
                    </div>

                    {/* Stats Grid with glassmorphism cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Balance */}
                        <StatCard
                            label="Total Balance"
                            value={totalBalance}
                            change="+12.5%"
                            trend="up"
                            icon={<Wallet size={32} />}
                            gradient="from-blue-500 to-cyan-500"
                        />

                        {/* Monthly Income */}
                        <StatCard
                            label="Monthly Income"
                            value={monthlyIncome}
                            change="+8.2%"
                            trend="up"
                            icon={<TrendingUp size={32} />}
                            gradient="from-green-500 to-emerald-500"
                        />

                        {/* Monthly Expenses */}
                        <StatCard
                            label="Monthly Expenses"
                            value={monthlyExpenses}
                            change="-5.4%"
                            trend="down"
                            icon={<TrendingDown size={32} />}
                            gradient="from-red-500 to-pink-500"
                        />

                        {/* Net Worth */}
                        <StatCard
                            label="Net Worth"
                            value={netWorth}
                            change="+15.3%"
                            trend="up"
                            icon={<BarChart3 size={32} />}
                            gradient="from-purple-500 to-fuchsia-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
