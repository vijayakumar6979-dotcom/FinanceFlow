/**
 * AIAnalyticsSection Component
 * Displays AI-powered credit card spending analytics
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { createCreditCardAnalyticsService, type CreditCardAnalytics } from '@financeflow/shared';
import { supabase } from '@/services/supabase';

interface AIAnalyticsSectionProps {
    accountId: string;
    creditCardName: string;
    utilization: number;
}

const COLORS = ['#0066FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#F97316'];

export function AIAnalyticsSection({ accountId, creditCardName, utilization }: AIAnalyticsSectionProps) {
    const [analytics, setAnalytics] = useState<CreditCardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const analyticsService = createCreditCardAnalyticsService(supabase);

    useEffect(() => {
        fetchAnalytics();
    }, [accountId]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            const data = await analyticsService.getLatestAnalytics(accountId);
            setAnalytics(data);
        } catch (error: any) {
            if (error.code !== 'PGRST116') { // Ignore "no rows" error
                console.error('Failed to fetch analytics:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAnalytics = async () => {
        try {
            setIsGenerating(true);
            toast.loading('Analyzing spending patterns...');

            // Get the current session for auth headers
            const { data: { session } } = await supabase.auth.getSession();

            console.log('DEBUG: Session Check:', {
                hasSession: !!session,
                accessTokenExists: !!session?.access_token,
                accessTokenLength: session?.access_token?.length,
                user: session?.user?.email
            });

            if (!session) {
                throw new Error('You must be logged in to generate insights');
            }

            console.log('DEBUG: Invoking Function via RAW FETCH...');

            // construct URL
            const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-credit-card-usage`;

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ accountId, dateRange: 180 }),
            });

            console.log('DEBUG: Raw Response Status:', response.status);

            const responseData = await response.json();
            console.log('DEBUG: Raw Response Body:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to generate analytics');
            }

            const data = responseData;
            const error = null;

            toast.dismiss();

            if (error) throw error;

            if (data.success) {
                toast.success('Analytics generated!');
                await fetchAnalytics();
            } else {
                throw new Error(data.error || 'Failed to generate analytics');
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || 'Failed to generate analytics');
            console.error('Generate analytics error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getUtilizationStatus = () => {
        if (utilization > 70) return { color: 'text-red-600 dark:text-red-400', label: 'High', icon: '⚠️' };
        if (utilization > 30) return { color: 'text-yellow-600 dark:text-yellow-400', label: 'Moderate', icon: '⚡' };
        return { color: 'text-green-600 dark:text-green-400', label: 'Healthy', icon: '✓' };
    };

    const utilizationStatus = getUtilizationStatus();

    // Prepare chart data
    const chartData = analytics?.spending_patterns?.map((pattern) => ({
        name: pattern.category,
        value: pattern.percentage,
        insight: pattern.insight,
    })) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        AI-Powered Insights
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Understand your spending patterns and get personalized recommendations
                    </p>
                </div>
                <button
                    onClick={handleGenerateAnalytics}
                    disabled={isGenerating || isLoading}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            {analytics ? 'Refresh Insights' : 'Generate Insights'}
                        </>
                    )}
                </button>
            </div>

            {/* Loading state */}
            {isLoading && !isGenerating && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading insights...</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !analytics && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                        <span className="text-5xl">🧠</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        No AI Insights Yet
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Click "Generate Insights" to analyze your spending patterns with AI
                    </p>
                </div>
            )}

            {/* Analytics content */}
            {!isLoading && analytics && (
                <div className="space-y-6">
                    {/* Utilization Card */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                            <span>📊</span> Credit Utilization Analysis
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-white/60 p-4 backdrop-blur dark:bg-dark-surface/60">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                                <p className={`text-2xl font-bold ${utilizationStatus.color}`}>
                                    {utilizationStatus.icon} {utilizationStatus.label}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/60 p-4 backdrop-blur dark:bg-dark-surface/60">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Utilization</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {utilization.toFixed(1)}%
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/60 p-4 backdrop-blur dark:bg-dark-surface/60">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Credit Score Impact</p>
                                <p className="text-lg font-semibold capitalize text-gray-900 dark:text-white">
                                    {analytics.utilization_analysis?.creditScoreImpact || 'Neutral'}
                                </p>
                            </div>
                        </div>
                        {analytics.utilization_analysis?.recommendation && (
                            <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur dark:bg-dark-surface/60">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    💡 {analytics.utilization_analysis.recommendation}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Spending Patterns */}
                    {chartData.length > 0 && (
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-surface">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                <span>🎯</span> Spending Breakdown
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Chart */}
                                <div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number | undefined) => value ? `${value.toFixed(1)}%` : '0%'} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Category insights */}
                                <div className="space-y-3">
                                    {analytics.spending_patterns?.slice(0, 5).map((pattern, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {pattern.category}
                                                </span>
                                                <span
                                                    className="rounded-full px-2 py-1 text-xs font-semibold"
                                                    style={{
                                                        backgroundColor: `${COLORS[idx % COLORS.length]}20`,
                                                        color: COLORS[idx % COLORS.length],
                                                    }}
                                                >
                                                    {pattern.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {pattern.insight}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Unusual Activity */}
                    {analytics.unusual_activity && analytics.unusual_activity.length > 0 && (
                        <div className="rounded-xl bg-orange-50 p-6 dark:bg-orange-900/20">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-100">
                                <span>🔍</span> Unusual Transactions
                            </h3>
                            <div className="space-y-3">
                                {analytics.unusual_activity.slice(0, 3).map((activity, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg bg-white/60 p-4 backdrop-blur dark:bg-dark-surface/60"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {activity.category} - RM{activity.amount.toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(activity.date).toLocaleDateString('en-MY')}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                                            {activity.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {analytics.recommendations && analytics.recommendations.length > 0 && (
                        <div className="rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900 dark:text-green-100">
                                <span>💡</span> AI Recommendations
                            </h3>
                            <ul className="space-y-2">
                                {analytics.recommendations.map((rec, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-green-800 dark:text-green-200"
                                    >
                                        <span className="mt-0.5 text-green-600 dark:text-green-400">✓</span>
                                        <span className="text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Analysis metadata */}
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Last analyzed: {new Date(analytics.analysis_date).toLocaleDateString('en-MY', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
