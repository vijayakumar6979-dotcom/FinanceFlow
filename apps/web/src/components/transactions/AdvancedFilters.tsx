import { useState } from 'react'
import { X, Calendar, DollarSign, Tag, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface AdvancedFiltersProps {
    onApply: (filters: TransactionFilters) => void
    onClear: () => void
}

export interface TransactionFilters {
    dateRange?: { from: string; to: string }
    types?: ('income' | 'expense' | 'transfer')[]
    categories?: string[]
    accounts?: string[]
    amountRange?: { min: number; max: number }
    tags?: string[]
    hasReceipt?: boolean
    isRecurring?: boolean
}

export function AdvancedFilters({ onApply, onClear }: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<TransactionFilters>({})

    const handleApply = () => {
        onApply(filters)
        setIsOpen(false)
    }

    const handleClear = () => {
        setFilters({})
        onClear()
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="gap-2"
            >
                <Filter className="w-4 h-4" />
                Advanced Filters
            </Button>
        )
    }

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Advanced Filters
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={filters.dateRange?.from || ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    dateRange: { ...filters.dateRange!, from: e.target.value }
                                })
                            }
                            className="px-3 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                        />
                        <input
                            type="date"
                            value={filters.dateRange?.to || ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    dateRange: { ...filters.dateRange!, to: e.target.value }
                                })
                            }
                            className="px-3 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                {/* Transaction Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transaction Type
                    </label>
                    <div className="space-y-2">
                        {['income', 'expense', 'transfer'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.types?.includes(type as any) || false}
                                    onChange={(e) => {
                                        const types = filters.types || []
                                        setFilters({
                                            ...filters,
                                            types: e.target.checked
                                                ? [...types, type as any]
                                                : types.filter((t) => t !== type)
                                        })
                                    }}
                                    className="w-4 h-4 text-primary-600 rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Amount Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Amount Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.amountRange?.min || ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    amountRange: {
                                        ...filters.amountRange!,
                                        min: parseFloat(e.target.value) || 0
                                    }
                                })
                            }
                            className="px-3 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.amountRange?.max || ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    amountRange: {
                                        ...filters.amountRange!,
                                        max: parseFloat(e.target.value) || 0
                                    }
                                })
                            }
                            className="px-3 py-2 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                {/* Receipt Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Receipt Status
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="receipt"
                                checked={filters.hasReceipt === undefined}
                                onChange={() =>
                                    setFilters({ ...filters, hasReceipt: undefined })
                                }
                                className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">All</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="receipt"
                                checked={filters.hasReceipt === true}
                                onChange={() => setFilters({ ...filters, hasReceipt: true })}
                                className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                With Receipt
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="receipt"
                                checked={filters.hasReceipt === false}
                                onChange={() => setFilters({ ...filters, hasReceipt: false })}
                                className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Without Receipt
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <Button variant="outline" onClick={handleClear}>
                    Clear All
                </Button>
                <Button onClick={handleApply} className="gap-2">
                    <Filter className="w-4 h-4" />
                    Apply Filters
                </Button>
            </div>
        </Card>
    )
}
