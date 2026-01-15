
import { StatCard } from '@/components/ui/StatCard'
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'

// Mock hook used until real data hook is available
const useFinancialData = () => {
    return {
        summary: {
            totalBalance: 24500.50,
            totalIncome: 8250.00,
            totalExpenses: 3450.25,
            savingsRate: 28.5
        },
        loading: false
    }
}

export function FinancialSummary() {
    const { summary, loading } = useFinancialData()

    const summaryCards = [
        {
            title: 'Total Balance',
            value: summary.totalBalance,
            change: 12.5,
            trend: 'up' as const,
            icon: <Wallet size={24} />,
        },
        {
            title: 'Total Income',
            value: summary.totalIncome,
            change: 8.2,
            trend: 'up' as const,
            icon: <TrendingUp size={24} />,
        },
        {
            title: 'Total Expenses',
            value: summary.totalExpenses,
            change: -5.4,
            trend: 'down' as const,
            icon: <TrendingDown size={24} />,
        },
        {
            title: 'Savings Rate',
            value: summary.savingsRate,
            change: 3.1,
            trend: 'up' as const,
            icon: <PieChart size={24} />,
            suffix: '%',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, index) => (
                <StatCard key={index} {...card} loading={loading} />
            ))}
        </div>
    )
}
