import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, Home, Plane, GraduationCap, Car, Heart, TrendingUp, Wallet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalTemplate {
    id: string;
    name: string;
    emoji: string;
    icon: any;
    type: 'savings' | 'debt_payoff' | 'investment';
    description: string;
    suggestedAmount: number;
    suggestedMonths: number;
    color: string;
    tips: string[];
}

const GOAL_TEMPLATES: GoalTemplate[] = [
    {
        id: 'emergency-fund',
        name: 'Emergency Fund',
        emoji: '🛡️',
        icon: Wallet,
        type: 'savings',
        description: '3-6 months of expenses for financial security',
        suggestedAmount: 15000,
        suggestedMonths: 12,
        color: 'from-emerald-500 to-teal-600',
        tips: [
            'Start with RM 1,000 as initial goal',
            'Aim for 3-6 months of living expenses',
            'Keep in high-yield savings account',
        ],
    },
    {
        id: 'vacation',
        name: 'Dream Vacation',
        emoji: '✈️',
        icon: Plane,
        type: 'savings',
        description: 'Save for your next adventure',
        suggestedAmount: 8000,
        suggestedMonths: 8,
        color: 'from-blue-500 to-cyan-600',
        tips: [
            'Research destination costs early',
            'Book flights 2-3 months in advance',
            'Set aside extra 20% for activities',
        ],
    },
    {
        id: 'home-down-payment',
        name: 'Home Down Payment',
        emoji: '🏠',
        icon: Home,
        type: 'savings',
        description: '10-20% down payment for property',
        suggestedAmount: 50000,
        suggestedMonths: 36,
        color: 'from-orange-500 to-red-600',
        tips: [
            'Typical down payment is 10-20%',
            'Factor in closing costs (2-5%)',
            'Consider first-time buyer programs',
        ],
    },
    {
        id: 'car-purchase',
        name: 'New Car',
        emoji: '🚗',
        icon: Car,
        type: 'savings',
        description: 'Save for vehicle down payment or full purchase',
        suggestedAmount: 20000,
        suggestedMonths: 18,
        color: 'from-purple-500 to-pink-600',
        tips: [
            'Aim for 20% down payment minimum',
            'Research insurance costs',
            'Consider certified pre-owned',
        ],
    },
    {
        id: 'education',
        name: 'Education Fund',
        emoji: '🎓',
        icon: GraduationCap,
        type: 'savings',
        description: 'Invest in your future or your children\'s education',
        suggestedAmount: 30000,
        suggestedMonths: 24,
        color: 'from-indigo-500 to-purple-600',
        tips: [
            'Start early for compound growth',
            'Look into education savings plans',
            'Consider scholarships and grants',
        ],
    },
    {
        id: 'debt-payoff',
        name: 'Debt Freedom',
        emoji: '💳',
        icon: TrendingUp,
        type: 'debt_payoff',
        description: 'Pay off credit cards and loans',
        suggestedAmount: 10000,
        suggestedMonths: 12,
        color: 'from-red-500 to-orange-600',
        tips: [
            'Use debt avalanche or snowball method',
            'Pay more than minimum payment',
            'Avoid new debt while paying off',
        ],
    },
    {
        id: 'wedding',
        name: 'Wedding Fund',
        emoji: '💍',
        icon: Heart,
        type: 'savings',
        description: 'Save for your special day',
        suggestedAmount: 25000,
        suggestedMonths: 18,
        color: 'from-pink-500 to-rose-600',
        tips: [
            'Create detailed budget by category',
            'Book vendors 6-12 months ahead',
            'Consider off-peak season discounts',
        ],
    },
    {
        id: 'investment',
        name: 'Investment Portfolio',
        emoji: '📈',
        icon: TrendingUp,
        type: 'investment',
        description: 'Build wealth through investments',
        suggestedAmount: 12000,
        suggestedMonths: 12,
        color: 'from-green-500 to-emerald-600',
        tips: [
            'Diversify across asset classes',
            'Consider index funds for beginners',
            'Invest consistently over time',
        ],
    },
];

interface GoalTemplatesProps {
    onSelectTemplate: (template: GoalTemplate, customAmount?: number, customMonths?: number) => void;
}

export function GoalTemplates({ onSelectTemplate }: GoalTemplatesProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [customMonths, setCustomMonths] = useState<string>('');

    const handleTemplateClick = (template: GoalTemplate) => {
        setSelectedTemplate(template);
        setCustomAmount(template.suggestedAmount.toString());
        setCustomMonths(template.suggestedMonths.toString());
    };

    const handleApplyTemplate = () => {
        if (!selectedTemplate) return;

        const amount = parseFloat(customAmount) || selectedTemplate.suggestedAmount;
        const months = parseInt(customMonths) || selectedTemplate.suggestedMonths;

        onSelectTemplate(selectedTemplate, amount, months);
        setSelectedTemplate(null);
    };

    const monthlyContribution = selectedTemplate && customAmount && customMonths
        ? (parseFloat(customAmount) / parseInt(customMonths)).toFixed(2)
        : '0';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Goal Templates</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose a pre-built goal strategy</p>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {GOAL_TEMPLATES.map((template, index) => {
                    const Icon = template.icon;
                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={cn(
                                    "p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2",
                                    selectedTemplate?.id === template.id
                                        ? "border-primary-500 shadow-lg shadow-primary-500/20"
                                        : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                )}
                                onClick={() => handleTemplateClick(template)}
                            >
                                {/* Icon & Emoji */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "p-3 rounded-xl bg-gradient-to-br",
                                        template.color
                                    )}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <span className="text-3xl">{template.emoji}</span>
                                </div>

                                {/* Name & Type */}
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{template.name}</h4>
                                <span className={cn(
                                    "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-3",
                                    template.type === 'savings' ? "bg-emerald-500/10 text-emerald-500" :
                                        template.type === 'debt_payoff' ? "bg-red-500/10 text-red-500" :
                                            "bg-blue-500/10 text-blue-500"
                                )}>
                                    {template.type.replace('_', ' ')}
                                </span>

                                {/* Description */}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Suggested Amount */}
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            RM {template.suggestedAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                        {template.suggestedMonths} months • RM {(template.suggestedAmount / template.suggestedMonths).toFixed(0)}/mo
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Customization Modal */}
            {selectedTemplate && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setSelectedTemplate(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-2xl p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-4 rounded-2xl bg-gradient-to-br",
                                        selectedTemplate.color
                                    )}>
                                        <selectedTemplate.icon size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {selectedTemplate.name}
                                            <span className="text-3xl">{selectedTemplate.emoji}</span>
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTemplate.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Customization Form */}
                            <div className="space-y-6">
                                {/* Target Amount */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Target Amount (RM)
                                    </label>
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg focus:border-primary-500 focus:outline-none transition-colors"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Timeline */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Timeline (Months)
                                    </label>
                                    <input
                                        type="number"
                                        value={customMonths}
                                        onChange={(e) => setCustomMonths(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg focus:border-primary-500 focus:outline-none transition-colors"
                                        placeholder="Enter months"
                                    />
                                </div>

                                {/* Monthly Contribution */}
                                <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
                                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                                        Required Monthly Contribution
                                    </p>
                                    <p className="text-3xl font-black text-primary-900 dark:text-primary-100">
                                        RM {monthlyContribution}
                                    </p>
                                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                                        Save this amount each month to reach your goal
                                    </p>
                                </div>

                                {/* Tips */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">💡 Tips for Success</h4>
                                    <ul className="space-y-2">
                                        {selectedTemplate.tips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="text-primary-500 mt-0.5">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setSelectedTemplate(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                                        onClick={handleApplyTemplate}
                                    >
                                        Use This Template
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </div>
    );
}
