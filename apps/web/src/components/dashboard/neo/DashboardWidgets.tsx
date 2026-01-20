import { useState } from 'react'
import Masonry from 'react-masonry-css'
import { Wallet, Receipt, Target, Flag, TrendingDown, TrendingUp, Sparkles, BarChart3, Activity } from 'lucide-react'
import { Widget3D } from './Widget3D'

// Import existing widgets
// import { RecentTransactionsWidget } from '../widgets/RecentTransactionsWidget'
// import { BudgetProgressWidget } from '../widgets/BudgetProgressWidget'
// import { SpendingCategoryWidget } from '../widgets/SpendingCategoryWidget'
// import { UpcomingBillsWidget } from '../widgets/UpcomingBillsWidget'
// import { GoalProgressWidget } from '../widgets/GoalProgressWidget'
// import { CashFlowWidget } from '../widgets/CashFlowWidget'
// import { NetWorthTrendWidget } from '../widgets/NetWorthTrendWidget'
// import { AIRecommendationsWidget } from '../widgets/AIRecommendationsWidget'

export function DashboardWidgets() {
    // Breakpoints for masonry layout
    const breakpointColumnsObj = {
        default: 3,
        1536: 3,
        1280: 2,
        1024: 2,
        768: 1
    }

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-6"
            columnClassName="pl-6 bg-clip-padding"
        >
            {/* AI Insights - High Priority */}
            <Widget3D
                title="AI Insights"
                icon={<Sparkles size={20} />}
                gradient="from-purple-500/20 to-pink-500/20"
            >
                <div className="h-[400px] flex items-center justify-center text-slate-500">
                    AI Recommendations Widget (Coming Soon)
                    {/* <AIRecommendationsWidget /> */}
                </div>
            </Widget3D>

            {/* Recent Transactions */}
            <Widget3D
                title="Recent Transactions"
                icon={<Activity size={20} />}
                gradient="from-blue-500/20 to-cyan-500/20"
            >
                <div className="h-[400px] flex items-center justify-center text-slate-500">
                    Recent Transactions Widget (Coming Soon)
                    {/* <RecentTransactionsWidget /> */}
                </div>
            </Widget3D>

            {/* Budget Progress */}
            <Widget3D
                title="Budget Progress"
                icon={<Target size={20} />}
                gradient="from-emerald-500/20 to-green-500/20"
            >
                <div className="h-[350px] flex items-center justify-center text-slate-500">
                    Budget Progress Widget (Coming Soon)
                    {/* <BudgetProgressWidget /> */}
                </div>
            </Widget3D>

            {/* Upcoming Bills */}
            <Widget3D
                title="Upcoming Bills"
                icon={<Receipt size={20} />}
                gradient="from-orange-500/20 to-red-500/20"
            >
                <div className="h-[350px] flex items-center justify-center text-slate-500">
                    Upcoming Bills Widget (Coming Soon)
                    {/* <UpcomingBillsWidget /> */}
                </div>
            </Widget3D>

            {/* Spending Breakdown */}
            <Widget3D
                title="Spending Breakdown"
                icon={<BarChart3 size={20} />}
                gradient="from-indigo-500/20 to-violet-500/20"
            >
                <div className="h-[350px] flex items-center justify-center text-slate-500">
                    Spending Category Widget (Coming Soon)
                    {/* <SpendingCategoryWidget /> */}
                </div>
            </Widget3D>

            {/* Cash Flow */}
            <Widget3D
                title="Cash Flow"
                icon={<ArrowLeftRightIcon size={20} />}
                gradient="from-cyan-500/20 to-blue-500/20"
            >
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                    Cash Flow Widget (Coming Soon)
                    {/* <CashFlowWidget /> */}
                </div>
            </Widget3D>

            {/* Goals */}
            <Widget3D
                title="Financial Goals"
                icon={<Flag size={20} />}
                gradient="from-yellow-500/20 to-amber-500/20"
            >
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                    Goal Progress Widget (Coming Soon)
                    {/* <GoalProgressWidget /> */}
                </div>
            </Widget3D>

            {/* Net Worth Trend */}
            <Widget3D
                title="Net Worth Trend"
                icon={<TrendingUp size={20} />}
                gradient="from-fuchsia-500/20 to-purple-500/20"
            >
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                    Net Worth Widget (Coming Soon)
                    {/* <NetWorthTrendWidget /> */}
                </div>
            </Widget3D>
        </Masonry>
    )
}

function ArrowLeftRightIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 3 4 7l4 4" />
            <path d="M4 7h16" />
            <path d="m16 21 4-4-4-4" />
            <path d="M20 17H4" />
        </svg>
    )
}
