
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AlertCircle, Coffee, Car, ShoppingBag, Film } from 'lucide-react'

// Helper for dynamic icons
const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
    switch (name) {
        case 'coffee': return <Coffee size={size} color={color} />;
        case 'car': return <Car size={size} color={color} />;
        case 'shopping-bag': return <ShoppingBag size={size} color={color} />;
        case 'film': return <Film size={size} color={color} />;
        default: return null;
    }
}

export function BudgetProgress() {
    const budgets = [
        {
            id: '1',
            category: 'Food & Dining',
            spent: 450,
            total: 500,
            color: '#FF6B6B',
            icon: 'coffee',
        },
        {
            id: '2',
            category: 'Transportation',
            spent: 180,
            total: 300,
            color: '#4ECDC4',
            icon: 'car',
        },
        {
            id: '3',
            category: 'Shopping',
            spent: 520,
            total: 400,
            color: '#FF8B94',
            icon: 'shopping-bag',
        },
        {
            id: '4',
            category: 'Entertainment',
            spent: 150,
            total: 200,
            color: '#A8E6CF',
            icon: 'film',
        },
    ]

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Budget Overview</h3>

            <div className="space-y-6">
                {budgets.map((budget) => {
                    const percentage = (budget.spent / budget.total) * 100
                    const isOverBudget = percentage > 100
                    const isWarning = percentage > 80 && percentage <= 100
                    console.log(isWarning)

                    return (
                        <div key={budget.id}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${budget.color}20` }}
                                    >
                                        <Icon name={budget.icon} size={16} color={budget.color} />
                                    </div>
                                    <span className="text-slate-900 dark:text-white font-medium">{budget.category}</span>

                                    {isOverBudget && (
                                        <AlertCircle size={16} className="text-red-500" />
                                    )}
                                    {isWarning && (
                                        <AlertCircle size={16} className="text-yellow-500" />
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className={`font-bold ${isOverBudget ? 'text-red-500' :
                                        isWarning ? 'text-yellow-500' :
                                            'text-slate-900 dark:text-white'
                                        }`}>
                                        ${budget.spent}
                                    </span>
                                    <span className="text-gray-400"> / ${budget.total}</span>
                                </div>
                            </div>

                            <ProgressBar
                                value={budget.spent}
                                max={budget.total}
                                color={
                                    budget.category === 'Food & Dining' ? 'red' :
                                        budget.category === 'Transportation' ? 'teal' :
                                            budget.category === 'Shopping' ? 'pink' : 'green'
                                } // Simplified mapping for demo
                                size="md"
                            />

                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400">
                                    ${Math.max(0, budget.total - budget.spent)} remaining
                                </span>
                                <span className={`text-xs font-medium ${isOverBudget ? 'text-red-500' :
                                    isWarning ? 'text-yellow-500' :
                                        'text-gray-400'
                                    }`}>
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
