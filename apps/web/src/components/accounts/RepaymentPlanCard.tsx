/**
 * RepaymentPlanCard Component
 * Displays a single repayment plan with all details
 */

import React from 'react';
import type { RepaymentPlan } from '@financeflow/shared';
import { formatCurrency } from '@financeflow/shared';

interface RepaymentPlanCardProps {
    plan: RepaymentPlan;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
}

export function RepaymentPlanCard({ plan, isSelected, onSelect, className = '' }: RepaymentPlanCardProps) {
    const getPlanLabel = () => {
        switch (plan.plan_name) {
            case 'aggressive':
                return { name: 'Aggressive', color: 'from-red-500 to-orange-500', icon: '🚀' };
            case 'balanced':
                return { name: 'Balanced', color: 'from-blue-500 to-purple-500', icon: '⚖️' };
            case 'conservative':
                return { name: 'Conservative', color: 'from-green-500 to-teal-500', icon: '🛡️' };
            case 'custom':
                return { name: 'Custom', color: 'from-purple-500 to-pink-500', icon: '⚙️' };
            default:
                return { name: plan.plan_name, color: 'from-gray-500 to-gray-600', icon: '📊' };
        }
    };

    const label = getPlanLabel();
    const savingsPercentage = plan.interest_saved_vs_minimum > 0
        ? ((plan.interest_saved_vs_minimum / (plan.initial_balance + plan.total_interest)) * 100).toFixed(1)
        : 0;

    return (
        <div
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${isSelected
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                } ${className}`}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
        >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${label.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{label.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold">{label.name} Plan</h3>
                            <p className="text-sm opacity-90">{plan.duration_months} months</p>
                        </div>
                    </div>
                    {isSelected && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="space-y-4 bg-white p-6 dark:bg-dark-surface">
                {/* Monthly Payment - Large highlight */}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payment</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(plan.monthly_payment, 'MYR')}
                    </p>
                </div>

                {/* Key stats grid */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-dark-elevated">
                    <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Interest</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(plan.total_interest, 'MYR')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Paid</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(plan.total_amount_paid, 'MYR')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Payoff Date</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(plan.payoff_date).toLocaleDateString('en-MY', {
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Interest Saved</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +{formatCurrency(plan.interest_saved_vs_minimum, 'MYR')}
                        </p>
                    </div>
                </div>

                {/* Savings badge */}
                {plan.interest_saved_vs_minimum > 0 && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-green-50 px-4 py-2 dark:bg-green-900/20">
                        <span className="text-xl">💰</span>
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Save {savingsPercentage}% in interest
                        </span>
                    </div>
                )}

                {/* Pros */}
                {plan.pros && plan.pros.length > 0 && (
                    <div>
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                            <span className="text-green-500">✓</span> Advantages
                        </h4>
                        <ul className="space-y-1">
                            {plan.pros.slice(0, 3).map((pro, idx) => (
                                <li
                                    key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    • {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cons */}
                {plan.cons && plan.cons.length > 0 && (
                    <div>
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                            <span className="text-orange-500">!</span> Considerations
                        </h4>
                        <ul className="space-y-1">
                            {plan.cons.slice(0, 2).map((con, idx) => (
                                <li
                                    key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    • {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Progress indicator if payments made */}
                {plan.payments_made > 0 && (
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <div className="mb-1 flex justify-between text-xs font-medium">
                            <span className="text-blue-700 dark:text-blue-400">Progress</span>
                            <span className="text-blue-700 dark:text-blue-400">
                                {plan.payments_made} / {plan.duration_months} payments
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
                            <div
                                className="h-full bg-blue-600 transition-all dark:bg-blue-500"
                                style={{
                                    width: `${(plan.payments_made / plan.duration_months) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Select button */}
                <button
                    className={`w-full rounded-lg py-3 font-semibold transition-colors ${isSelected
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-elevated dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                >
                    {isSelected ? 'Selected Plan' : 'Select This Plan'}
                </button>
            </div>
        </div>
    );
}
