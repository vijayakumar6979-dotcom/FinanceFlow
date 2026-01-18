import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BUDGET_TEMPLATES, calculateBudgetFromTemplate, type BudgetTemplate } from '@/constants/budget-templates';

interface BudgetTemplatesProps {
    onSelectTemplate: (template: BudgetTemplate, calculatedBudgets: any[]) => void;
    className?: string;
}

export function BudgetTemplates({ onSelectTemplate, className = '' }: BudgetTemplatesProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [showCalculation, setShowCalculation] = useState(false);

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        setShowCalculation(true);
    };

    const handleUseTemplate = () => {
        if (!selectedTemplate || !monthlyIncome) return;

        const template = BUDGET_TEMPLATES.find(t => t.id === selectedTemplate);
        if (!template) return;

        const calculatedBudgets = calculateBudgetFromTemplate(template, parseFloat(monthlyIncome));
        onSelectTemplate(template, calculatedBudgets);
    };

    const selectedTemplateData = BUDGET_TEMPLATES.find(t => t.id === selectedTemplate);
    const calculatedBudgets = selectedTemplateData && monthlyIncome
        ? calculateBudgetFromTemplate(selectedTemplateData, parseFloat(monthlyIncome))
        : [];

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Budget Templates</h2>
                <p className="text-slate-400">
                    Choose a proven budgeting strategy and customize it to your income
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BUDGET_TEMPLATES.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className={`p-6 cursor-pointer transition-all hover:shadow-xl ${selectedTemplate === template.id
                                    ? 'ring-2 ring-primary-500 bg-primary-500/10'
                                    : 'hover:border-primary-500/50'
                                }`}
                            onClick={() => handleTemplateSelect(template.id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                                    <p className="text-sm text-slate-400">{template.description}</p>
                                </div>
                                {selectedTemplate === template.id && (
                                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Category Preview */}
                            <div className="space-y-2">
                                {template.categories.slice(0, 3).map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{cat.icon}</span>
                                            <span className="text-slate-300">{cat.name}</span>
                                        </div>
                                        <span className="text-slate-400">{cat.percentage}%</span>
                                    </div>
                                ))}
                                {template.categories.length > 3 && (
                                    <div className="text-xs text-slate-500">
                                        +{template.categories.length - 3} more categories
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Income Input & Calculation */}
            {showCalculation && selectedTemplateData && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                >
                    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-primary-500/30">
                        <h3 className="text-lg font-bold text-white mb-4">
                            Calculate Your {selectedTemplateData.name}
                        </h3>

                        {/* Income Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Monthly Income (MYR)
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    RM
                                </div>
                                <input
                                    type="number"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                    placeholder="5000"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Calculated Budgets */}
                        {monthlyIncome && parseFloat(monthlyIncome) > 0 && (
                            <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-medium text-slate-300">Budget Breakdown:</h4>
                                {calculatedBudgets.map((budget) => (
                                    <div
                                        key={budget.category}
                                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{budget.icon}</span>
                                            <div>
                                                <div className="text-white font-medium">{budget.category}</div>
                                                <div className="text-xs text-slate-400">{budget.percentage}%</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-bold">
                                                RM {budget.amount.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-400">per month</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            onClick={handleUseTemplate}
                            disabled={!monthlyIncome || parseFloat(monthlyIncome) <= 0}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                            icon={<ArrowRight size={18} />}
                        >
                            Use This Template
                        </Button>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
