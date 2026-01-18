import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Calendar } from 'lucide-react';
import { FinancialHealthCard } from '@/components/analytics/FinancialHealthCard';
import { QuickStatsGrid } from '@/components/analytics/QuickStatsGrid';
import { NetWorthChart } from '@/components/analytics/NetWorthChart';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';

const AnalyticsPage = () => {
    console.log("AnalyticsPage mounting...");
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'income', label: 'Income & Expense' },
        { id: 'budget', label: 'Budget' },
        { id: 'debt', label: 'Debt' },
        { id: 'investments', label: 'Investments' },
        { id: 'predictions', label: 'Predictions' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        Analytics & Reports
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1">
                        AI-powered insights and comprehensive financial reports
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Reports
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pill" // Using pill variant for better look
                className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-1 rounded-xl"
            />

            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <FinancialHealthCard />
                        <QuickStatsGrid />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <NetWorthChart />
                            <IncomeExpenseChart />
                        </div>
                    </div>
                )}

                {activeTab === 'income' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <IncomeExpenseChart />
                        <div className="text-center py-12 text-slate-500">Detailed Category Breakdown coming soon...</div>
                    </div>
                )}

                {activeTab === 'budget' && (
                    <div className="text-center py-12 text-slate-500 animate-in slide-in-from-bottom-4 duration-500">
                        Budget Analytics coming soon...
                    </div>
                )}

                {activeTab === 'debt' && (
                    <div className="text-center py-12 text-slate-500 animate-in slide-in-from-bottom-4 duration-500">
                        Debt Payoff Calculator coming soon...
                    </div>
                )}

                {activeTab === 'investments' && (
                    <div className="text-center py-12 text-slate-500 animate-in slide-in-from-bottom-4 duration-500">
                        Investment Portfolio Performance coming soon...
                    </div>
                )}

                {activeTab === 'predictions' && (
                    <div className="text-center py-12 text-slate-500 animate-in slide-in-from-bottom-4 duration-500">
                        AI Financial Forecasts coming soon...
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
