import { FinancialOverviewHero } from '@/components/dashboard/FinancialOverviewHero'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export default function Dashboard() {
    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <FinancialOverviewHero />
                <QuickActions />
                <DashboardWidgets />
            </div>
        </ErrorBoundary>
    )
}
