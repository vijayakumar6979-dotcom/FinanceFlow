import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, X, Percent, DollarSign } from 'lucide-react'

interface SplitTransactionProps {
    totalAmount: number
    onSplitsChange: (splits: TransactionSplit[]) => void
}

export interface TransactionSplit {
    id: string
    category: string
    amount: number
    percentage: number
    notes?: string
}

const CATEGORIES = [
    'Food & Dining',
    'Shopping',
    'Transport',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Personal Care',
    'Groceries',
    'Other'
]

export function SplitTransaction({ totalAmount, onSplitsChange }: SplitTransactionProps) {
    const [splits, setSplits] = useState<TransactionSplit[]>([
        { id: '1', category: '', amount: totalAmount, percentage: 100, notes: '' }
    ])

    const addSplit = () => {
        const newSplit: TransactionSplit = {
            id: Date.now().toString(),
            category: '',
            amount: 0,
            percentage: 0,
            notes: ''
        }
        setSplits([...splits, newSplit])
    }

    const removeSplit = (id: string) => {
        if (splits.length === 1) return
        const newSplits = splits.filter(s => s.id !== id)
        redistributeAmounts(newSplits)
    }

    const updateSplit = (id: string, field: keyof TransactionSplit, value: any) => {
        const newSplits = splits.map(split => {
            if (split.id === id) {
                return { ...split, [field]: value }
            }
            return split
        })

        if (field === 'amount') {
            // Recalculate percentages
            newSplits.forEach(split => {
                split.percentage = (split.amount / totalAmount) * 100
            })
        } else if (field === 'percentage') {
            // Recalculate amounts
            newSplits.forEach(split => {
                if (split.id === id) {
                    split.amount = (totalAmount * value) / 100
                }
            })
        }

        setSplits(newSplits)
        onSplitsChange(newSplits)
    }

    const redistributeAmounts = (newSplits: TransactionSplit[]) => {
        const equalAmount = totalAmount / newSplits.length
        const equalPercentage = 100 / newSplits.length

        newSplits.forEach(split => {
            split.amount = equalAmount
            split.percentage = equalPercentage
        })

        setSplits(newSplits)
        onSplitsChange(newSplits)
    }

    const totalAllocated = splits.reduce((sum, split) => sum + split.amount, 0)
    const remaining = totalAmount - totalAllocated
    const isValid = Math.abs(remaining) < 0.01

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Split Transaction
                </label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSplit}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Split
                </Button>
            </div>

            <div className="space-y-3">
                {splits.map((split, index) => (
                    <Card key={split.id} className="p-4 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-3">
                                {/* Category */}
                                <div>
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Category {index + 1}
                                    </label>
                                    <select
                                        value={split.category}
                                        onChange={(e) => updateSplit(split.id, 'category', e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount and Percentage */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <DollarSign className="w-3 h-3 inline mr-1" />
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={split.amount.toFixed(2)}
                                            onChange={(e) => updateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <Percent className="w-3 h-3 inline mr-1" />
                                            Percentage
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={split.percentage.toFixed(1)}
                                            onChange={(e) => updateSplit(split.id, 'percentage', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={split.notes || ''}
                                        onChange={(e) => updateSplit(split.id, 'notes', e.target.value)}
                                        placeholder="Add notes..."
                                        className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            {/* Remove Button */}
                            {splits.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSplit(split.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors mt-6"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <Card className={`p-4 ${isValid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Total Allocated</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {splits.length} {splits.length === 1 ? 'category' : 'categories'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            RM {totalAllocated.toFixed(2)}
                        </p>
                        {!isValid && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                Remaining: RM {remaining.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
                {isValid && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ All amounts allocated correctly
                    </p>
                )}
            </Card>
        </div>
    )
}
