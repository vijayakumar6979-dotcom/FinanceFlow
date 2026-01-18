import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, AccountStatistics } from '@financeflow/shared';
import { accountService } from '@/services/account.service';
import { TrendingUp, ShoppingBag, CreditCard, LayoutGrid, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountStatisticsCardProps {
    accountId: string;
    currency?: string;
}

export function AccountStatisticsCard({ accountId, currency = 'MYR' }: AccountStatisticsCardProps) {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AccountStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (accountId) {
            fetchStats();
        }
    }, [accountId]);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await accountService.getStatistics(accountId);
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch account statistics:', err);
            setError('Failed to load statistics');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none min-h-[200px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </Card>
        );
    }

    if (error || !stats) {
        return (
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
                    <AlertCircle className="w-10 h-10 text-slate-300 dark:text-gray-600" />
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Could not load usage statistics</p>
                    <Button variant="ghost" size="sm" onClick={fetchStats} className="text-blue-500">Retry</Button>
                </div>
            </Card>
        );
    }

    const hasData = stats.total_transactions > 0;

    if (!hasData) {
        return (
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Statistics</h3>
                <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
                    <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-gray-600" />
                    <p className="text-slate-500 dark:text-gray-400 text-sm">No transactions found for this account yet.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Usage Statistics</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Total Spend */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-red-100 dark:bg-red-800/30 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Spend</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.total_spend, currency)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">{stats.total_transactions} transactions</p>
                    </div>
                </div>

                {/* Average Transaction */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Average Txn</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.average_transaction_amount, currency)}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">per transaction</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Most Frequent Category */}
                {stats.most_frequent_category && (
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                                <LayoutGrid className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Top Category</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400">{stats.most_frequent_category.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                {stats.most_frequent_category.count} txns
                            </span>
                        </div>
                    </div>
                )}

                {/* Largest Transaction */}
                {stats.largest_transaction && (
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full text-amber-600 dark:text-amber-400">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Largest Spend</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 truncate max-w-[120px]">{stats.largest_transaction.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(stats.largest_transaction.amount, currency)}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-500">{new Date(stats.largest_transaction.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>

            <Button variant="outline" className="w-full text-xs h-8 border-dashed border-gray-300 dark:border-white/20 text-slate-500 dark:text-gray-400" onClick={() => navigate('/transactions')}>
                View Transaction History
            </Button>
        </Card>
    );
}
