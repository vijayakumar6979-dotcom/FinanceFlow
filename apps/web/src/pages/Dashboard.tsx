
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FinancialSummary } from '@/components/dashboard/FinancialSummary'
import { SpendingTrendsChart } from '@/components/dashboard/SpendingTrendsChart'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { CategoryBreakdownChart } from '@/components/dashboard/CategoryBreakdownChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { AIInsights } from '@/components/dashboard/AIInsights'

export default function Dashboard() {
    return (
        <div className="p-6 md:p-8 max-w-[1920px] mx-auto space-y-6">
            <DashboardHeader />

            <FinancialSummary />

            {/* Row 1: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingTrendsChart />
                <IncomeExpenseChart />
            </div>

            {/* Row 2: Breakdown & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CategoryBreakdownChart />
                </div>
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>
            </div>

            {/* Row 3: Budget, Upcoming Bills, AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BudgetProgress />

                {/* Placeholder for Upcoming Bills - to be implemented */}
                <div className="hidden lg:block">
                    {/* Can be replaced with Timeline component later */}
                </div>

                <AIInsights />
            </div>
        </div>
    )
}
