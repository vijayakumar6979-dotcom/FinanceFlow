import React, { useEffect, useState } from 'react'
import { AccountsWidget } from './widgets/AccountsWidget'
import { RecentTransactions } from './RecentTransactions'
import { Receipt, Target, Flag, TrendingDown, TrendingUp, Sparkles, PieChart, Activity, Loader2 } from 'lucide-react'
import { Widget3D } from './Widget3D'
import { supabase } from '@/services/supabase'
import { BillService, BudgetService, GoalService } from '@financeflow/shared'

const BillsDueWidget = () => {
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        const fetchBills = async () => {
            const service = new BillService(supabase);
            const bills = await service.getBills();
            // Simple filter for "Upcoming" (e.g., due in next 7 days)
            // For MVP just showing total active bills count or next due date?
            // Let's show count of active bills.
            setCount(bills.length);
        };
        fetchBills();
    }, []);

    return (
        <Widget3D title="Upcoming Bills" icon={<Receipt size={20} />} gradient="from-red-500/20 to-pink-500/20">
            <div className="text-gray-400 text-sm">
                {count === null ? 'Loading...' : count === 0 ? 'No upcoming bills.' : `${count} active bills found.`}
            </div>
        </Widget3D>
    )
}

const BudgetProgressWidget = () => {
    const [stats, setStats] = useState<string>('Loading...');
    useEffect(() => {
        const fetchBudgets = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const service = new BudgetService(supabase);
            const budgets = await service.getBudgets(user.id);
            setStats(`${budgets.length} active budgets`);
        };
        fetchBudgets();
    }, []);

    return (
        <Widget3D title="Budget Progress" icon={<Target size={20} />} gradient="from-purple-500/20 to-indigo-500/20">
            <div className="text-gray-400 text-sm">{stats}</div>
        </Widget3D>
    )
}

const GoalsWidget = () => {
    const [stats, setStats] = useState<string>('Loading...');
    useEffect(() => {
        const fetchGoals = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const service = new GoalService(supabase);
            const goals = await service.getGoals(user.id);
            setStats(`${goals.length} goals in progress`);
        };
        fetchGoals();
    }, []);

    return (
        <Widget3D title="Financial Goals" icon={<Flag size={20} />} gradient="from-green-500/20 to-emerald-500/20">
            <div className="text-gray-400 text-sm">{stats}</div>
        </Widget3D>
    )
}

// Keep placeholders for unimplemented features
const LoansWidget = () => (
    <Widget3D title="Loans Payment" icon={<TrendingDown size={20} />} gradient="from-yellow-500/20 to-orange-500/20">
        <div className="text-gray-400 text-sm">Loan tracking coming soon...</div>
    </Widget3D>
)

const InvestmentsWidget = () => (
    <Widget3D title="Investments" icon={<TrendingUp size={20} />} gradient="from-cyan-500/20 to-blue-500/20">
        <div className="text-gray-400 text-sm">Investment portfolio coming soon...</div>
    </Widget3D>
)

const AIInsightsWidget = () => (
    <Widget3D title="AI Insights" icon={<Sparkles size={20} />} gradient="from-indigo-500/20 to-violet-500/20">
        <div className="text-gray-400 text-sm">AI analysis enabled. Check insights tab.</div>
    </Widget3D>
)

export const DashboardWidgets: React.FC = () => {
    return (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid">
                <AccountsWidget />
            </div>
            <div className="break-inside-avoid">
                <RecentTransactions />
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
        </div>
    )
}
