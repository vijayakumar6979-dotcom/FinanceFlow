import React from 'react'
import { AccountsWidget } from './widgets/AccountsWidget'
import { ArrowLeftRight, Receipt, Target, Flag, TrendingDown, TrendingUp, Sparkles, PieChart, Activity } from 'lucide-react'
import { Widget3D } from './Widget3D'

// Placeholder widgets
const TransactionsWidget = () => (
    <Widget3D title="Recent Transactions" icon={<ArrowLeftRight size={20} />} gradient="from-orange-500/20 to-red-500/20">
        <div className="space-y-4 text-gray-400 text-sm">
            <p>Transactions list placeholder...</p>
        </div>
    </Widget3D>
)

const BillsDueWidget = () => (
    <Widget3D title="Upcoming Bills" icon={<Receipt size={20} />} gradient="from-red-500/20 to-pink-500/20">
        <div className="text-gray-400 text-sm">No bills due this week.</div>
    </Widget3D>
)

const BudgetProgressWidget = () => (
    <Widget3D title="Budget Progress" icon={<Target size={20} />} gradient="from-purple-500/20 to-indigo-500/20">
        <div className="text-gray-400 text-sm">Budget progress charts...</div>
    </Widget3D>
)

const GoalsWidget = () => (
    <Widget3D title="Financial Goals" icon={<Flag size={20} />} gradient="from-green-500/20 to-emerald-500/20">
        <div className="text-gray-400 text-sm">Goals list...</div>
    </Widget3D>
)

const LoansWidget = () => (
    <Widget3D title="Loans Payment" icon={<TrendingDown size={20} />} gradient="from-yellow-500/20 to-orange-500/20">
        <div className="text-gray-400 text-sm">Loan details...</div>
    </Widget3D>
)

const InvestmentsWidget = () => (
    <Widget3D title="Investments" icon={<TrendingUp size={20} />} gradient="from-cyan-500/20 to-blue-500/20">
        <div className="text-gray-400 text-sm">Portfolio summary...</div>
    </Widget3D>
)

const AIInsightsWidget = () => (
    <Widget3D title="AI Insights" icon={<Sparkles size={20} />} gradient="from-indigo-500/20 to-violet-500/20">
        <div className="text-gray-400 text-sm">AI analysis of your spending...</div>
    </Widget3D>
)

const SpendingBreakdownWidget = () => (
    <Widget3D title="Spending Breakdown" icon={<PieChart size={20} />} gradient="from-pink-500/20 to-rose-500/20">
        <div className="text-gray-400 text-sm">Pie chart...</div>
    </Widget3D>
)

const CashFlowWidget = () => (
    <Widget3D title="Cash Flow" icon={<Activity size={20} />} gradient="from-emerald-500/20 to-teal-500/20">
        <div className="text-gray-400 text-sm">Cash flow chart...</div>
    </Widget3D>
)

export const DashboardWidgets: React.FC = () => {
    return (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid">
                <AccountsWidget />
            </div>
            <div className="break-inside-avoid">
                <TransactionsWidget />
            </div>
            <div className="break-inside-avoid">
                <BillsDueWidget />
            </div>
            <div className="break-inside-avoid">
                <BudgetProgressWidget />
            </div>
            <div className="break-inside-avoid">
                <GoalsWidget />
            </div>
            <div className="break-inside-avoid">
                <LoansWidget />
            </div>
            <div className="break-inside-avoid">
                <InvestmentsWidget />
            </div>
            <div className="break-inside-avoid">
                <AIInsightsWidget />
            </div>
            {/* 
      <div className="break-inside-avoid">
        <SpendingBreakdownWidget />
      </div>
      <div className="break-inside-avoid">
        <CashFlowWidget />
      </div> 
      */}
        </div>
    )
}
