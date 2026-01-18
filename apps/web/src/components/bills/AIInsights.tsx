import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';

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
            <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-slate-500">Loading AI insights...</span>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-200 dark:border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Insights</h3>
                    <p className="text-sm text-slate-500">Powered by machine learning</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Prediction */}
                {prediction && (
                    <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-blue-200 dark:border-blue-500/20">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    Next Month Prediction
                                </h4>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {bill.currency} {prediction.predicted_amount.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span>Confidence: {(prediction.confidence * 100).toFixed(0)}%</span>
                                    <span>•</span>
                                    <span className="capitalize">{prediction.trend} trend</span>
                                </div>
                                {prediction.factors && prediction.factors.length > 0 && (
                                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                                        {prediction.factors.map((factor, idx) => (
                                            <div key={idx}>• {factor}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Spending Trend */}
                {trend && (
                    <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-purple-200 dark:border-purple-500/20">
                        <div className="flex items-start gap-3">
                            <TrendingUp className={`w-5 h-5 mt-0.5 ${trend.direction === 'increasing' ? 'text-red-500' : 'text-green-500'}`} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    Spending Trend
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300">
                                    <span className={`font-bold ${trend.direction === 'increasing' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {trend.percentage}% {trend.direction}
                                    </span>
                                    {' '}over last 3 months
                                </p>
                                {trend.isSignificant && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        ⚠️ Significant change detected - review usage patterns
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Anomaly */}
                {recentAnomaly && (
                    <div className={`p-4 rounded-lg border ${recentAnomaly.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30'
                        : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/30'
                        }`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${recentAnomaly.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                                }`} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    Anomaly Detected
                                </h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                    {recentAnomaly.message}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    💡 {recentAnomaly.recommendation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Recommendations */}
                <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-green-200 dark:border-green-500/20">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                Recommendations
                            </h4>
                            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                {bill.is_variable && payments.length > 3 && (
                                    <li>• Set up payment alerts to avoid surprises</li>
                                )}
                                {trend && trend.direction === 'increasing' && trend.isSignificant && (
                                    <li>• Review usage to identify cost-saving opportunities</li>
                                )}
                                {bill.auto_pay_enabled ? (
                                    <li>• Auto-pay is enabled - payments are automated ✓</li>
                                ) : (
                                    <li>• Enable auto-pay to never miss a payment</li>
                                )}
                                {payments.length < 3 && (
                                    <li>• Build payment history for better predictions</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
