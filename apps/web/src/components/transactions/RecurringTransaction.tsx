import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Repeat, Calendar, Infinity, AlertCircle } from 'lucide-react'

interface RecurringTransactionProps {
    onRecurringChange: (recurring: RecurringConfig | null) => void
}

export interface RecurringConfig {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    startDate: string
    endDate?: string
    endAfterOccurrences?: number
    dayOfWeek?: number
    dayOfMonth?: number
}

export function RecurringTransaction({ onRecurringChange }: RecurringTransactionProps) {
    const [enabled, setEnabled] = useState(false)
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
    const [interval, setInterval] = useState(1)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endType, setEndType] = useState<'never' | 'date' | 'occurrences'>('never')
    const [endDate, setEndDate] = useState('')
    const [occurrences, setOccurrences] = useState(12)

    const handleToggle = (value: boolean) => {
        setEnabled(value)
        if (!value) {
            onRecurringChange(null)
        } else {
            updateConfig()
        }
    }

    const updateConfig = () => {
        const config: RecurringConfig = {
            enabled: true,
            frequency,
            interval,
            startDate,
            ...(endType === 'date' && endDate ? { endDate } : {}),
            ...(endType === 'occurrences' ? { endAfterOccurrences: occurrences } : {})
        }
        onRecurringChange(config)
    }

    const getFrequencyLabel = () => {
        if (interval === 1) {
            return frequency === 'daily' ? 'Daily' :
                frequency === 'weekly' ? 'Weekly' :
                    frequency === 'monthly' ? 'Monthly' : 'Yearly'
        }
        return `Every ${interval} ${frequency === 'daily' ? 'days' :
            frequency === 'weekly' ? 'weeks' :
                frequency === 'monthly' ? 'months' : 'years'}`
    }

    return (
        <div className="space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recurring Transaction
                    </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
            </div>

            {enabled && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 space-y-4">
                    {/* Frequency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Frequency
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((freq) => (
                                <button
                                    key={freq}
                                    type="button"
                                    onClick={() => {
                                        setFrequency(freq)
                                        updateConfig()
                                    }}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${frequency === freq
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interval */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Repeat Every
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                value={interval}
                                onChange={(e) => {
                                    setInterval(parseInt(e.target.value) || 1)
                                    updateConfig()
                                }}
                                className="w-20 px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {frequency === 'daily' ? 'day(s)' :
                                    frequency === 'weekly' ? 'week(s)' :
                                        frequency === 'monthly' ? 'month(s)' : 'year(s)'}
                            </span>
                        </div>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value)
                                updateConfig()
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* End Condition */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Condition
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'never'}
                                    onChange={() => {
                                        setEndType('never')
                                        updateConfig()
                                    }}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <Infinity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Never ends</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'date'}
                                    onChange={() => setEndType('date')}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">On date</span>
                            </label>
                            {endType === 'date' && (
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                        updateConfig()
                                    }}
                                    className="ml-6 w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                                />
                            )}

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'occurrences'}
                                    onChange={() => setEndType('occurrences')}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <Repeat className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">After</span>
                            </label>
                            {endType === 'occurrences' && (
                                <div className="ml-6 flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={occurrences}
                                        onChange={(e) => {
                                            setOccurrences(parseInt(e.target.value) || 1)
                                            updateConfig()
                                        }}
                                        className="w-20 px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">occurrences</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                    Recurring Summary
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    This transaction will repeat <strong>{getFrequencyLabel().toLowerCase()}</strong> starting from{' '}
                                    <strong>{new Date(startDate).toLocaleDateString()}</strong>
                                    {endType === 'date' && endDate ? ` until ${new Date(endDate).toLocaleDateString()}` :
                                        endType === 'occurrences' ? ` for ${occurrences} occurrences` :
                                            ' indefinitely'}.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
