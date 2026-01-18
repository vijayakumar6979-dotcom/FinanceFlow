import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { createAnalyticsService, FinancialHealthScore } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const FinancialHealthCard = () => {
    const { user } = useAuth();
    const [scoreData, setScoreData] = useState<FinancialHealthScore | null>(null);
    const [loading, setLoading] = useState(true);
    const analyticsService = createAnalyticsService(supabase);

    useEffect(() => {
        if (user) {
            fetchScore();
        }
    }, [user]);

    const fetchScore = async () => {
        try {
            const data = await analyticsService.calculateFinancialHealth(user!.id);
            setScoreData(data);
        } catch (error) {
            console.error('Failed to fetch health score:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </Card>
        );
    }

    if (!scoreData) return null;

    const getColor = (score: number) => {
        if (score >= 90) return 'text-green-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Gauge Section */}
                <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * scoreData.overall) / 100}
                            className={`${getColor(scoreData.overall)} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getColor(scoreData.overall)}`}>
                            {scoreData.overall}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-gray-400 font-medium">
                            {scoreData.rating}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Financial Health Score</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">
                            Your financial health is {scoreData.rating}. {scoreData.insights[0]}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(scoreData.breakdown).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-gray-400 capitalize">
                                    <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span>{value}/100</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${getColor(value).replace('text-', 'bg-')}`}
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                            {scoreData.overall >= 70 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            <span>{scoreData.insights[1]}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        View Analysis
                    </Button>
                </div>
            </div>
        </Card>
    );
};
