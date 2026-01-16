import React, { useEffect, useState } from 'react';
import { Investment, PortfolioSummary, AssetAllocation, formatCurrency } from '@financeflow/shared';
import { investmentService } from '@/services/investment.service';
import { Card } from '@/components/ui/Card'; // Fixed casing
import { Button } from '@/components/ui/Button'; // Fixed casing
import { Plus, TrendingUp, DollarSign, PieChart, Activity } from 'lucide-react';
import { AddInvestmentModal } from '@/components/investments/AddInvestmentModal';

export default function InvestmentsPage() {
    const [stats, setStats] = useState<PortfolioSummary | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [allocation, setAllocation] = useState<AssetAllocation>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [statsData, investData, allocData] = await Promise.all([
                investmentService.getPortfolioSummary(),
                investmentService.getAll(),
                investmentService.getAssetAllocation()
            ]);
            setStats(statsData);
            setInvestments(investData);
            setAllocation(allocData);
        } catch (error) {
            console.error('Failed to load investment data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading portfolio...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Investment Portfolio</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track and manage your assets</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Investment
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Value"
                    value={stats?.total_value || 0}
                    icon={DollarSign}
                    subtext={`${stats?.daily_change_pct.toFixed(2)}% (24h)`}
                    color="blue"
                />
                <SummaryCard
                    title="Total Invested"
                    value={stats?.total_invested || 0}
                    icon={Activity}
                    color="purple"
                />
                <SummaryCard
                    title="Total Profit/Loss"
                    value={stats?.total_profit_loss || 0}
                    icon={TrendingUp}
                    isProfit={stats && stats.total_profit_loss >= 0}
                    color={stats && stats.total_profit_loss >= 0 ? 'green' : 'red'}
                />
                <SummaryCard
                    title="ROI"
                    value={`${stats?.total_profit_loss_pct.toFixed(2)}%`}
                    isCurrency={false}
                    icon={PieChart}
                    color={stats && stats.total_profit_loss_pct >= 0 ? 'green' : 'red'}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Holdings</h2>
                    {investments.length === 0 ? (
                        <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No investments found. Add one to get started!
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {investments.map(inv => (
                                <InvestmentCard key={inv.id} investment={inv} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar / Allocation */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Allocation</h2>
                    <Card className="p-4">
                        <div className="space-y-4">
                            {allocation.map(item => (
                                <div key={item.type} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                                        <span className="capitalize text-gray-600 dark:text-gray-300">{item.type.replace('_', ' ')}</span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">{item.percentage.toFixed(1)}%</span>
                                </div>
                            ))}
                            {allocation.length === 0 && <span className="text-gray-500 text-sm">No data</span>}
                        </div>
                    </Card>
                </div>
            </div>

            <AddInvestmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadData}
            />
        </div>
    );
}

function SummaryCard({ title, value, icon: Icon, subtext, isProfit, color, isCurrency = true }: any) {
    const colorClasses: any = {
        blue: 'text-blue-500 bg-blue-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        green: 'text-green-500 bg-green-500/10',
        red: 'text-red-500 bg-red-500/10'
    };

    return (
        <Card className="p-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {isCurrency ? formatCurrency(value) : value}
                    </h3>
                    {subtext && (
                        <p className={`text-xs mt-1 ${isProfit === false ? 'text-red-500' : 'text-green-500'}`}>
                            {subtext}
                        </p>
                    )}
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );
}

function InvestmentCard({ investment }: { investment: Investment }) {
    return (
        <Card className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-white font-bold text-sm">
                        {investment.symbol.substring(0, 3)}
                    </div>
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-primary-500 transition-colors">{investment.symbol}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{investment.name}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-gray-900 dark:text-white font-bold">{investment.quantity} units</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg: {formatCurrency(investment.avg_cost)}</p>
                </div>
            </div>
        </Card>
    );
}
