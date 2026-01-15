import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Target, Calendar, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Goal } from '@financeflow/shared';
import confetti from 'canvas-confetti';

// Mock Goal Types
const GOAL_TYPES = [
    { id: 'savings', name: 'Savings', icon: '💰', color: 'bg-emerald-500', desc: 'Save for a rainy day' },
    { id: 'debt_payoff', name: 'Debt Payoff', icon: '💳', color: 'bg-red-500', desc: 'Clear your debts faster' },
    { id: 'investment', name: 'Investment', icon: '📈', color: 'bg-blue-500', desc: 'Grow your wealth' },
    { id: 'custom', name: 'Custom Goal', icon: '🎯', color: 'bg-purple-500', desc: 'Anything you want' },
];

const STEPS = [
    { id: 1, title: 'Type', icon: <Check size={18} /> },
    { id: 2, title: 'Target', icon: <Target size={18} /> },
    { id: 3, title: 'Plan', icon: <Calendar size={18} /> },
];

export default function CreateGoal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Goal>>({
        currency: 'MYR',
        priority: 'medium',
        auto_contribute_enabled: false,
        status: 'active'
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        console.log('Created Goal:', formData);
        setIsLoading(false);
        navigate('/goals');
    };

    const updateField = (field: keyof Goal, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2" onClick={() => navigate('/goals')}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Goal</h1>
                    <p className="text-slate-500 dark:text-slate-400">What are you saving for?</p>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10" />
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#0A0E27] px-2">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                step >= s.id
                                    ? "bg-primary-600 text-white"
                                    : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                            )}
                        >
                            {step > s.id ? <Check size={14} /> : s.id}
                        </div>
                        <span className={cn(
                            "text-xs font-medium",
                            step >= s.id ? "text-primary-600 dark:text-primary-400" : "text-gray-500"
                        )}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Steps */}
            <Card className="p-6 min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                    {/* Step 1: Goal Type & Name */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose Goal Type</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {GOAL_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => updateField('goal_type', type.id)}
                                            className={cn(
                                                "text-left p-4 rounded-xl border transition-all hover:scale-[1.02]",
                                                formData.goal_type === type.id
                                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-1 ring-primary-500"
                                                    : "border-gray-200 dark:border-white/10 hover:border-primary-200 dark:hover:border-primary-500/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-lg", type.color, "bg-opacity-20 text-white")}>
                                                    {type.icon}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{type.name}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{type.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Give it a name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="e.g., Summer Vacation"
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Target Amount & Date */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Set Your Target</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">How much do you need?</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Target Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">RM</span>
                                        <input
                                            type="number"
                                            value={formData.target_amount || ''}
                                            onChange={(e) => updateField('target_amount', Number(e.target.value))}
                                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Target Date</label>
                                    <input
                                        type="date"
                                        value={formData.target_date || ''}
                                        onChange={(e) => updateField('target_date', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Starting Balance (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">RM</span>
                                        <input
                                            type="number"
                                            value={formData.current_amount || ''}
                                            onChange={(e) => updateField('current_amount', Number(e.target.value))}
                                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Automation & Confirm */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            {/* AI Recommendation */}
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 flex gap-4 mb-6">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg h-fit">
                                    <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Goal Feasibility</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                                        Saving <span className="font-bold">RM {formData.target_amount || 0}</span> by {formData.target_date || 'date'} requires <span className="font-bold">RM 850/month</span>.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 flex-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[85%]" />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">High Chance</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Automation Plan</h2>

                            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary-500 cursor-pointer transition-colors bg-white dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <RefreshCw size={18} />
                                    </div>
                                    <div>
                                        <span className="block font-medium text-slate-900 dark:text-white">Auto-Contribute</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Regularly save money for this goal</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.auto_contribute_enabled}
                                    onChange={(e) => updateField('auto_contribute_enabled', e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                            </label>

                            {formData.auto_contribute_enabled && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 space-y-4"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Frequency</label>
                                            <select
                                                value={formData.auto_contribute_frequency || 'monthly'}
                                                onChange={(e) => updateField('auto_contribute_frequency', e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                                            >
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                        <div className="w-1/2">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs text-slate-900 dark:text-white">RM</span>
                                                <input
                                                    type="number"
                                                    value={formData.auto_contribute_amount || ''}
                                                    onChange={(e) => updateField('auto_contribute_amount', Number(e.target.value))}
                                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-white"
                                                    placeholder="200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Summary Preview */}
                            <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    You are creating a <span className="font-bold text-slate-900 dark:text-white">{formData.name}</span> goal of <span className="font-bold text-slate-900 dark:text-white">RM {formData.target_amount}</span>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t border-gray-100 dark:border-white/5">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="w-24"
                    >
                        Back
                    </Button>
                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!formData.goal_type || !formData.name)) ||
                                (step === 2 && !formData.target_amount)
                            }
                            className="w-24 bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            Next <ArrowRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-32 bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Goal'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
