import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@financeflow/shared';
import { cn } from '@/utils/cn';

const PLANS = [
    {
        id: 'aggressive',
        name: 'Aggressive',
        monthly: 850,
        duration: 6,
        interest: 245,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/20'
    },
    {
        id: 'balanced',
        name: 'Balanced',
        monthly: 450,
        duration: 12,
        interest: 480,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        id: 'conservative',
        name: 'Conservative',
        monthly: 250,
        duration: 24,
        interest: 950,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
    }
];

export function RepaymentPlanner() {
    const [selectedPlan, setSelectedPlan] = useState('balanced');

    return (
        <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Calculator className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Smart Repayment Plan</h3>
                    <p className="text-xs text-gray-400">AI-optimized strategies to clear your debt</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {PLANS.map((plan) => (
                    <motion.button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        whileHover={{ y: -4 }}
                        className={cn(
                            "relative p-4 rounded-xl border text-left transition-all",
                            selectedPlan === plan.id
                                ? `bg-white/10 ${plan.border} ring-1 ring-white/20`
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                        )}
                    >
                        {selectedPlan === plan.id && (
                            <div className="absolute top-3 right-3 text-white">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                        <p className={cn("font-medium mb-1", plan.color)}>{plan.name}</p>
                        <p className="text-2xl font-bold text-white mb-1">{formatCurrency(plan.monthly)}</p>
                        <p className="text-xs text-gray-400">/month for {plan.duration} months</p>

                        <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Total Interest</span>
                                <span className="text-red-300 font-mono">{formatCurrency(plan.interest)}</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="bg-black/20 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Projected Savings</p>
                        <p className="text-lg font-bold text-green-400">{formatCurrency(965)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Debt Free By</p>
                        <p className="text-lg font-bold text-white">Jan 2025</p>
                    </div>
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">
                    Apply Plan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    );
}
