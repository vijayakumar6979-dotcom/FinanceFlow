import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightsProps {
    bill: any;
    payments: any[];
}

interface PredictionData {
    predicted_amount: number;
    confidence: number;
    trend: string;
    factors: string[];
}

interface AnomalyData {
    is_anomaly: boolean;
    severity: 'low' | 'medium' | 'high';
    deviation_percentage: number;
    average_amount: number;
    message: string;
    recommendation: string;
}

export function AIInsights({ bill, payments }: AIInsightsProps) {
    const [prediction, setPrediction] = useState<PredictionData | null>(null);
    const [recentAnomaly, setRecentAnomaly] = useState<AnomalyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (bill) {
            loadAIInsights();
        }
    }, [bill]);

    const loadAIInsights = async () => {
        setIsLoading(true);
        try {
            // Fetch prediction
            const predictionPromise = fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict-bill-amount`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({
                        bill_id: bill.id,
                        provider_name: bill.provider_name
                    })
                }
            );

            // Check last payment for anomaly
            let anomalyPromise: Promise<Response | null> = Promise.resolve(null);
            if (payments && payments.length > 0) {
                const lastPayment = payments[0];
                anomalyPromise = fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-bill-anomalies`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                        },
                        body: JSON.stringify({
                            bill_id: bill.id,
                            current_amount: parseFloat(lastPayment.amount)
                        })
                    }
                );
            }

            const [predictionRes, anomalyRes] = await Promise.all([predictionPromise, anomalyPromise]);

            if (predictionRes.ok) {
                const predData = await predictionRes.json();
                setPrediction(predData);
            }

            if (anomalyRes && anomalyRes.ok) {
                const anomalyData = await anomalyRes.json();
                if (anomalyData.is_anomaly) {
                    setRecentAnomaly(anomalyData);
                }
            }
        } catch (error) {
            console.error('Failed to load AI insights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTrend = () => {
        if (payments.length < 2) return null;

        const recent = payments.slice(0, 3).map(p => parseFloat(p.amount));
        const older = payments.slice(3, 6).map(p => parseFloat(p.amount));

        if (older.length === 0) return null;

        const recentAvg = recent.reduce((sum, amt) => sum + amt, 0) / recent.length;
        const olderAvg = older.reduce((sum, amt) => sum + amt, 0) / older.length;

        const change = ((recentAvg - olderAvg) / olderAvg) * 100;

        return {
            percentage: Math.abs(change).toFixed(1),
            direction: change > 0 ? 'increasing' : 'decreasing',
            isSignificant: Math.abs(change) > 10
        };
    };

    const trend = calculateTrend();

    if (isLoading) {
        return (
            <div className="relative p-8 rounded-3xl bg-[#121629]/50 border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                <div className="relative flex flex-col items-center justify-center text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-400">Analyzing patterns with AI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-50" />

            <Card className="relative p-6 bg-[#0A0E27]/90 backdrop-blur-xl border border-white/10 rounded-[22px] overflow-hidden">
                {/* Header with Brain Icon */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                        <div className="relative p-3 bg-gradient-to-br from-[#1A1F3A] to-[#0F1225] border border-white/10 rounded-2xl shadow-xl">
                            <Brain className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            AI Intelligence
                        </h3>
                        <p className="text-xs font-medium text-primary/60 uppercase tracking-widest">
                            Real-time Bill Analysis
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Prediction Card */}
                    {prediction && (
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Forecast</span>
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                    <TrendingUp size={14} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-2xl font-black text-white">
                                    <span className="text-sm text-slate-500 mr-1">{bill.currency}</span>
                                    {prediction.predicted_amount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {Math.round(prediction.confidence * 100)}% Confidence
                                </span>
                                <span className="text-slate-500 capitalize">{prediction.trend} trend</span>
                            </div>
                        </div>
                    )}

                    {/* Anomaly Card */}
                    {recentAnomaly && (
                        <div className={cn(
                            "p-4 rounded-2xl border transition-colors group relative overflow-hidden",
                            recentAnomaly.severity === 'high'
                                ? "bg-rose-500/5 border-rose-500/20"
                                : "bg-amber-500/5 border-amber-500/20"
                        )}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            <div className="flex items-start justify-between mb-2">
                                <span className={cn(
                                    "text-xs font-bold uppercase tracking-wider",
                                    recentAnomaly.severity === 'high' ? "text-rose-400" : "text-amber-400"
                                )}>Anomaly</span>
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    recentAnomaly.severity === 'high' ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                                )}>
                                    <AlertTriangle size={14} />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-200 mb-2 leading-snug">
                                {recentAnomaly.message}
                            </p>
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Lightbulb size={12} className="mt-0.5 shrink-0 text-yellow-400" />
                                {recentAnomaly.recommendation}
                            </p>
                        </div>
                    )}

                    {/* General Recommendations / Dynamic Insight */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Insight</span>
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Lightbulb size={14} />
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {bill.is_variable ? (
                                <li className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    Variable bill detected. Auto-adjust budget?
                                </li>
                            ) : (
                                <li className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    Fixed Amount. Good for recurring payment.
                                </li>
                            )}
                            {trend && (
                                <li className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    Spending is {trend.direction} by {trend.percentage}%
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
