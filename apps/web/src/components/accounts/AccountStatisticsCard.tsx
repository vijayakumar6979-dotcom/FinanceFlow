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
            <div className="min-h-[200px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                <div className="p-3 rounded-full bg-slate-800/50">
                    <AlertCircle className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">Unavailable</p>
                <Button variant="ghost" size="sm" onClick={fetchStats} className="text-primary hover:text-primary/80">Retry</Button>
            </div>
        );
    }

    const hasData = stats.total_transactions > 0;

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="p-4 rounded-full bg-white/5">
                    <LayoutGrid className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                    <p className="text-white font-medium">No Data Available</p>
                    <p className="text-slate-500 text-xs mt-1">Start using this account to see statistics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Usage Statistics</h3>
            </div>

            <div className="flex flex-col gap-4">
                {/* Total Spend */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/10 hover:border-rose-500/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400/60">Total Spend</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white tracking-tight break-all">
                            <span className="text-sm text-slate-400 font-medium mr-1">{currency}</span>
                            {formatCurrency(stats.total_spend, currency).replace(/[^0-9.,]/g, '')}
                        </p>
                        <p className="text-xs font-medium text-rose-400/80 mt-1">{stats.total_transactions} transactions</p>
                    </div>
                </div>

                {/* Average Transaction */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/60">Average Txn</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white tracking-tight break-all">
                            <span className="text-sm text-slate-400 font-medium mr-1">{currency}</span>
                            {formatCurrency(stats.average_transaction_amount, currency).replace(/[^0-9.,]/g, '')}
                        </p>
                        <p className="text-xs font-medium text-blue-400/80 mt-1">per transaction</p>
                    </div>
                </div>
            </div>

            {stats.largest_transaction && (
                <div className="relative p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white">Largest Spend</p>
                                <p className="text-xs text-slate-400 truncate">{stats.largest_transaction.description}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-black text-white">
                                {formatCurrency(stats.largest_transaction.amount, currency)}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                                {new Date(stats.largest_transaction.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Button
                variant="ghost"
                className="w-full py-6 text-xs font-bold uppercase tracking-widest text-slate-500 border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                onClick={() => navigate('/transactions')}
            >
                View Transaction History
            </Button>
        </div>
    );
}
