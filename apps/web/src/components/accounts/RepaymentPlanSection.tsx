/**
 * RepaymentPlanSection Component
 * Displays all repayment plans for a credit card with comparison and selection
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { createCreditCardAnalyticsService, type RepaymentPlan } from '@financeflow/shared';
import { supabase } from '@/services/supabase';
import { RepaymentPlanCard } from './RepaymentPlanCard';

interface RepaymentPlanSectionProps {
    accountId: string;
    creditCardName: string;
    outstandingBalance: number;
}

export function RepaymentPlanSection({
    accountId,
    creditCardName,
    outstandingBalance,
}: RepaymentPlanSectionProps) {
    const [plans, setPlans] = useState<RepaymentPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const analyticsService = createCreditCardAnalyticsService(supabase);

    // Fetch existing plans
    useEffect(() => {
        fetchPlans();
    }, [accountId]);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const fetchedPlans = await analyticsService.getRepaymentPlans(accountId);
            setPlans(fetchedPlans);

            // Set selected plan
            const selected = fetchedPlans.find((p) => p.is_selected);
            if (selected) {
                setSelectedPlanId(selected.id);
            }
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePlans = async () => {
        try {
            setIsGenerating(true);
            toast.loading('Generating repayment plans...');

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('You must be logged in to generate plans');
            }

            const { data, error } = await supabase.functions.invoke('generate-repayment-plan', {
                body: { accountId },
            });

            toast.dismiss();

            if (data.success) {
                toast.success('Repayment plans generated!');
                await fetchPlans(); // Refresh to get newly generated plans
            } else {
                throw new Error(data.error || 'Failed to generate plans');
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || 'Failed to generate plans');
            console.error('Generate plans error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectPlan = async (planId: string) => {
        try {
            await analyticsService.selectPlan(planId);
            setSelectedPlanId(planId);
            toast.success('Repayment plan selected!');
        } catch (error: any) {
            toast.error('Failed to select plan');
            console.error('Select plan error:', error);
        }
    };

    if (outstandingBalance <= 0) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                    <span className="text-4xl">🎉</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-900 dark:text-green-100">
                    All Paid Off!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                    Your {creditCardName} has no outstanding balance. Great job!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Smart Repayment Plans
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        AI-powered debt payoff strategies tailored for your situation
                    </p>
                </div>
                <button
                    onClick={handleGeneratePlans}
                    disabled={isGenerating || isLoading}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <span>🤖</span>
                            {plans.length > 0 ? 'Regenerate Plans' : 'Generate Plans'}
                        </>
                    )}
                </button>
            </div>

            {/* Loading state */}
            {isLoading && !isGenerating && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 animate-spin text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading plans...</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && plans.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-elevated">
                        <span className="text-5xl">📊</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        No Repayment Plans Yet
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Click the "Generate Plans" button to create AI-powered repayment strategies
                    </p>
                </div>
            )}

            {/* Plans grid */}
            {!isLoading && plans.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <RepaymentPlanCard
                            key={plan.id}
                            plan={plan}
                            isSelected={plan.id === selectedPlanId}
                            onSelect={() => handleSelectPlan(plan.id)}
                        />
                    ))}
                </div>
            )}

            {/* Comparison info */}
            {plans.length > 1 && (
                <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                        <span>💡</span> Plan Comparison Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <li>• <strong>Aggressive:</strong> Pay off fastest, save most on interest, but highest monthly payment</li>
                        <li>• <strong>Balanced:</strong> Good middle ground between affordability and speed</li>
                        <li>• <strong>Conservative:</strong> Lowest monthly payment, more flexibility, but more interest</li>
                        <li>• All plans save money compared to paying only the minimum!</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
