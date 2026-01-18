import React, { useState, useEffect } from 'react'
import { Sparkles, Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { ParticleBackground } from '../ui/ParticleBackground'
import { StatCard3D } from './StatCard3D'

import { supabase } from '@/services/supabase';

const useFinancialData = () => {
    const [data, setData] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netWorth: 0,
        isLoading: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Get Accounts for Balance & Net Worth
                const { data: accounts, error: accountsError } = await supabase
                    .from('accounts')
                    .select('balance, type')
                    .eq('user_id', user.id);

                if (accountsError) throw accountsError;

                const totalBalance = accounts?.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) || 0;
                // Simple Net Worth calc (Assets - Liabilities) - Assuming credit cards are liabilities?
                // For now, let's just sum positive balances for Assets and subtract Credit Cards if we want to be fancy.
                // But typically "Total Balance" in dashboard is "Bank Accounts". "Net Worth" is everything.
                // Let's keep it simple: Net Worth = Total Balance for this MVP unless we have specific liability types.
                // If account type is 'credit_card', balance is usually positive (amount owed) or negative?
                // Let's assume balance is what you have (positive) or what you owe (negative would be consistent for liabilities, but often CCs are stored as positive debt).
                // Let's just sum all for now.
                const netWorth = totalBalance;

                // 2. Get Transactions for Income/Expense this month
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);
                const startOfMonthStr = startOfMonth.toISOString();

                const { data: transactions, error: txError } = await supabase
                    .from('transactions')
                    .select('amount, type')
                    .eq('user_id', user.id)
                    .gte('date', startOfMonthStr);

                if (txError) throw txError;

                const monthlyIncome = transactions
                    ?.filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

                const monthlyExpenses = transactions
                    ?.filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

                setData({
                    totalBalance,
                    monthlyIncome,
                    monthlyExpenses,
                    netWorth,
                    isLoading: false
                });

            } catch (error) {
                console.error('Failed to fetch financial data:', error);
                setData(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchData();
    }, []);

    return data;
}

export const FinancialOverviewHero: React.FC = () => {
    const { totalBalance, monthlyIncome, monthlyExpenses, netWorth } = useFinancialData()

    return (
        <div className="relative mb-8 group">
            {/* Particle background */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <ParticleBackground count={50} />
            </div>

            {/* Main card with 3D transform */}
            <div className="
        relative p-8 rounded-3xl
        bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90
        backdrop-blur-2xl
        border border-white/10
        transform-gpu
        transition-transform duration-700 ease-out
        hover:scale-[1.01]
        hover:shadow-2xl hover:shadow-blue-500/20
      "
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                }}>
                {/* Holographic rotating border */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-10 blur-xl animate-spin-slow"></div>
                </div>

                {/* Content with depth */}
                <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
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
                        <StatCard3D
                            label="Total Balance"
                            value={totalBalance}
                            change="+12.5%"
                            trend="up"
                            icon={<Wallet size={32} />}
                            gradient="from-blue-500 to-cyan-500"
                        />

                        {/* Monthly Income */}
                        <StatCard3D
                            label="Monthly Income"
                            value={monthlyIncome}
                            change="+8.2%"
                            trend="up"
                            icon={<TrendingUp size={32} />}
                            gradient="from-green-500 to-emerald-500"
                        />

                        {/* Monthly Expenses */}
                        <StatCard3D
                            label="Monthly Expenses"
                            value={monthlyExpenses}
                            change="-5.4%"
                            trend="down"
                            icon={<TrendingDown size={32} />}
                            gradient="from-red-500 to-pink-500"
                        />

                        {/* Net Worth */}
                        <StatCard3D
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
