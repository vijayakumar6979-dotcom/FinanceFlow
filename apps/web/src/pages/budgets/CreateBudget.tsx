import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, DollarSign, Calendar, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Budget } from '@financeflow/shared';
import confetti from 'canvas-confetti';

// Mock Categories
const CATEGORIES = [
    { id: 'cat1', name: 'Food & Dining', icon: '🍔', color: 'bg-orange-500' },
    { id: 'cat2', name: 'Transportation', icon: '🚗', color: 'bg-blue-500' },
    { id: 'cat3', name: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { id: 'cat4', name: 'Housing', icon: '🏠', color: 'bg-indigo-500' },
    { id: 'cat5', name: 'Entertainment', icon: '🎬', color: 'bg-pink-500' },
    { id: 'cat6', name: 'Utility', icon: '💡', color: 'bg-yellow-500' },
    { id: 'cat7', name: 'Health', icon: '🏥', color: 'bg-emerald-500' },
    { id: 'cat8', name: 'Travel', icon: '✈️', color: 'bg-teal-500' },
];

const STEPS = [
    { id: 1, title: 'Category', icon: <Check size={18} /> },
    { id: 2, title: 'Amount', icon: <DollarSign size={18} /> },
    { id: 3, title: 'Settings', icon: <Bell size={18} /> },
];

export default function CreateBudget() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Budget>>({
        currency: 'MYR',
        period: 'monthly',
        rollover_enabled: false,
        notifications_enabled: true,
        alert_thresholds: [75, 90, 100]
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

        console.log('Created Budget:', formData);
        setIsLoading(false);
        navigate('/budgets');
    };

    const updateField = (field: keyof Budget, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2" onClick={() => navigate('/budgets')}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Budget</h1>
                    <p className="text-slate-500 dark:text-slate-400">Set spending limits to stay on track</p>
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
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1"
                        >
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose a Category</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateField('category_id', cat.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all hover:scale-105",
                                            formData.category_id === cat.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-2 ring-primary-500/20"
                                                : "border-gray-200 dark:border-white/10 hover:border-primary-200 dark:hover:border-primary-500/30"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xl", cat.color, "bg-opacity-20 text-white")}>
                                            {cat.icon}
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white text-sm">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Set a Limit</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">How much do you want to spend?</p>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">RM</span>
                                        <input
                                            type="number"
                                            value={formData.amount || ''}
                                            onChange={(e) => updateField('amount', Number(e.target.value))}
                                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Period</label>
                                    <select
                                        value={formData.period}
                                        onChange={(e) => updateField('period', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            {/* AI Recommendation Simulation */}
                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                <div className="flex gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg h-fit text-indigo-600 dark:text-indigo-400">
                                        <DollarSign size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Smart Suggestion</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                            Based on your last 3 months, you typically spend around <span className="font-bold text-indigo-600 dark:text-indigo-400">RM 450</span> on this category.
                                        </p>
                                        <Button
                                            variant="ghost"
                                            className="h-auto p-0 mt-2 text-indigo-600 dark:text-indigo-400 text-xs hover:bg-transparent hover:underline"
                                            onClick={() => updateField('amount', 450)}
                                        >
                                            Use suggested RM 450
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 space-y-6"
                        >
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Final Touches</h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary-500 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-slate-900 dark:text-white">Rollover Remaining</span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400">Add leftover money to next month</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.rollover_enabled}
                                        onChange={(e) => updateField('rollover_enabled', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary-500 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-slate-900 dark:text-white">Smart Alerts</span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400">Get notified when nearing limit (75%, 90%)</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications_enabled}
                                        onChange={(e) => updateField('notifications_enabled', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </label>
                            </div>

                            <div className="mt-6">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Custom Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="e.g., Weekend Eats"
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
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
                                (step === 1 && !formData.category_id) ||
                                (step === 2 && !formData.amount)
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
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Budget'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
