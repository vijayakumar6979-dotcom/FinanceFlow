import { AIInsightsBanner } from '@/components/dashboard/AIInsightsBanner'
import { EnhancedFinancialHero } from '@/components/dashboard/EnhancedFinancialHero'
import { WidgetGrid } from '@/components/dashboard/WidgetGrid'
import { QuickActionsFAB } from '@/components/dashboard/QuickActionsFAB'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { RealtimeStatus } from '@/components/ui/RealtimeStatus'
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'

// Import all widgets
import { RecentTransactionsWidget } from '@/components/dashboard/widgets/RecentTransactionsWidget'
import { BudgetProgressWidget } from '@/components/dashboard/widgets/BudgetProgressWidget'
import { SpendingCategoryWidget } from '@/components/dashboard/widgets/SpendingCategoryWidget'
import { UpcomingBillsWidget } from '@/components/dashboard/widgets/UpcomingBillsWidget'
import { GoalProgressWidget } from '@/components/dashboard/widgets/GoalProgressWidget'
import { CashFlowWidget } from '@/components/dashboard/widgets/CashFlowWidget'
import { NetWorthTrendWidget } from '@/components/dashboard/widgets/NetWorthTrendWidget'
import { AIRecommendationsWidget } from '@/components/dashboard/widgets/AIRecommendationsWidget'

export default function Dashboard() {
    // Real-time connection status
    const { status } = useRealtimeSubscription({
        table: 'transactions',
        event: '*'
    })

    // Define available widgets
    const availableWidgets = [
        {
            id: 'recent-transactions',
            name: 'Recent Transactions',
            component: RecentTransactionsWidget,
            defaultSize: { w: 6, h: 4 },
            minSize: { w: 4, h: 3 },
            category: 'Transactions'
        },
        {
            id: 'budget-progress',
            name: 'Budget Progress',
            component: BudgetProgressWidget,
            defaultSize: { w: 3, h: 4 },
            minSize: { w: 3, h: 3 },
            category: 'Budgets'
        },
        {
            id: 'spending-category',
            name: 'Spending by Category',
            component: SpendingCategoryWidget,
            defaultSize: { w: 3, h: 4 },
            minSize: { w: 3, h: 3 },
            category: 'Analytics'
        },
        {
            id: 'upcoming-bills',
            name: 'Upcoming Bills',
            component: UpcomingBillsWidget,
            defaultSize: { w: 4, h: 3 },
            minSize: { w: 3, h: 3 },
            category: 'Bills'
        },
        {
            id: 'goal-progress',
            name: 'Goal Progress',
            component: GoalProgressWidget,
            defaultSize: { w: 4, h: 3 },
            minSize: { w: 3, h: 3 },
            category: 'Goals'
        },
        {
            id: 'cash-flow',
            name: 'Cash Flow',
            component: CashFlowWidget,
            defaultSize: { w: 4, h: 3 },
            minSize: { w: 4, h: 3 },
            category: 'Analytics'
        },
        {
            id: 'net-worth-trend',
            name: 'Net Worth Trend',
            component: NetWorthTrendWidget,
            defaultSize: { w: 6, h: 3 },
            minSize: { w: 4, h: 3 },
            category: 'Analytics'
        },
        {
            id: 'ai-recommendations',
            name: 'AI Recommendations',
            component: AIRecommendationsWidget,
            defaultSize: { w: 6, h: 4 },
            minSize: { w: 4, h: 3 },
            category: 'AI Insights'
        }
    ]

    return (
        <ErrorBoundary>
            <div className="space-y-6 pb-24">
                {/* AI Insights Banner */}
                <AIInsightsBanner />

                {/* Enhanced Hero Section */}
                <EnhancedFinancialHero />

                {/* Customizable Widget Grid */}
                <WidgetGrid availableWidgets={availableWidgets} />

                {/* Floating Action Button */}
                <QuickActionsFAB />
            </div>
        </ErrorBoundary>
    )
}
