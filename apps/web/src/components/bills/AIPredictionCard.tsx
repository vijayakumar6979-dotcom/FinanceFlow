import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Sparkles, Calendar } from 'lucide-react';
import { useBillPrediction } from '@/hooks/useBillPredictions';
import type { Bill } from '@financeflow/shared';

interface AIPredictionCardProps {
    bill: Bill;
}

export function AIPredictionCard({ bill }: AIPredictionCardProps) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: prediction, isLoading } = useBillPrediction(bill.id, currentMonth);

    if (!bill.is_variable) {
        return null; // Only show for variable bills
    }

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl bg-dark-elevated border border-white/10 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-white/5 rounded"></div>
            </div>
        );
    }

    if (!prediction) {
        return null;
    }

    const confidenceColor =
        prediction.confidence_score >= 80
            ? 'text-green-400'
            : prediction.confidence_score >= 60
                ? 'text-yellow-400'
                : 'text-orange-400';

    const confidenceLabel =
        prediction.confidence_score >= 80
            ? 'High Confidence'
            : prediction.confidence_score >= 60
                ? 'Medium Confidence'
                : 'Low Confidence';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">AI Prediction</h3>
                    <p className="text-sm text-slate-400">Powered by Grok AI</p>
                </div>
            </div>

            {/* Prediction Amount */}
            <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Predicted Amount</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">
                        RM {prediction.predicted_amount.toFixed(2)}
                    </p>
                    {bill.estimated_amount && (
                        <p className="text-sm text-slate-400">
                            (vs RM {bill.estimated_amount.toFixed(2)} estimated)
                        </p>
                    )}
                </div>
            </div>

            {/* Amount Range */}
            {prediction.amount_range_min != null && prediction.amount_range_max != null && (
                <div className="mb-4 p-3 rounded-xl bg-dark-base/50">
                    <p className="text-xs text-slate-400 mb-2">Expected Range</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500">Min</p>
                            <p className="text-sm font-semibold text-white">
                                RM {prediction.amount_range_min.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                    style={{
                                        width: `${((prediction.predicted_amount - prediction.amount_range_min) /
                                            (prediction.amount_range_max - prediction.amount_range_min)) *
                                            100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Max</p>
                            <p className="text-sm font-semibold text-white">
                                RM {prediction.amount_range_max.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Confidence Score */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${confidenceColor}`} />
                    <span className={`text-sm font-medium ${confidenceColor}`}>
                        {confidenceLabel}
                    </span>
                </div>
                <span className="text-sm text-slate-400">
                    {prediction.confidence_score}% confidence
                </span>
            </div>

            {/* Factors */}
            {prediction.factors && prediction.factors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400">Key Factors:</p>
                    <div className="space-y-1">
                        {prediction.factors.slice(0, 3).map((factor, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5"></div>
                                <p className="text-xs text-slate-300">{factor}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prediction Date */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>
                    Predicted on {prediction.created_at ? new Date(prediction.created_at).toLocaleDateString('en-MY') : 'N/A'}
                </span>
            </div>
        </motion.div>
    );
}
