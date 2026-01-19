import { Card } from '@/components/ui/Card'
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Bill {
    id: string
    name: string
    provider: string
    amount: number
    dueDate: string
    status: 'paid' | 'upcoming' | 'overdue'
    category: string
}

interface BillsTimelineProps {
    bills: Bill[]
    currentDate: Date
}

export function BillsTimeline({ bills, currentDate }: BillsTimelineProps) {
    // Sort bills by due date
    const sortedBills = [...bills].sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )

    // Get date range (current month)
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const daysInMonth = endOfMonth.getDate()

    // Generate timeline days
    const timelineDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
        const billsOnDay = sortedBills.filter(bill => {
            const billDate = new Date(bill.dueDate)
            return billDate.getDate() === date.getDate() &&
                billDate.getMonth() === date.getMonth() &&
                billDate.getFullYear() === date.getFullYear()
        })
        return { date, bills: billsOnDay }
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-500'
            case 'upcoming': return 'bg-blue-500'
            case 'overdue': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            case 'upcoming': return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            default: return null
        }
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
    }

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bills Timeline</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Horizontal line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>

                {/* Scrollable container */}
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-2 min-w-max px-2">
                        {timelineDays.map((day, index) => {
                            const hasToday = isToday(day.date)
                            const hasBills = day.bills.length > 0

                            return (
                                <div key={index} className="relative flex flex-col items-center" style={{ minWidth: '80px' }}>
                                    {/* Date marker */}
                                    <div className={`relative z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center ${hasToday
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                                            : hasBills
                                                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        <span className="text-xs font-medium">
                                            {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="text-lg font-bold">{day.date.getDate()}</span>
                                    </div>

                                    {/* Bills on this day */}
                                    {day.bills.length > 0 && (
                                        <div className="mt-4 space-y-2 w-full">
                                            {day.bills.map((bill, billIndex) => (
                                                <motion.div
                                                    key={bill.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: billIndex * 0.1 }}
                                                    className={`p-3 rounded-lg border ${bill.status === 'paid'
                                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                            : bill.status === 'overdue'
                                                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {getStatusIcon(bill.status)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                                                {bill.provider}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                {bill.name}
                                                            </p>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                                                RM {bill.amount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Connector dot */}
                                    {hasBills && (
                                        <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${getStatusColor(day.bills[0].status)}`}></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
