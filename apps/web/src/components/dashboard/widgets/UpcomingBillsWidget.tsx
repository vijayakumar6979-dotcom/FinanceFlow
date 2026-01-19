import { useState, useEffect } from 'react'
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'

interface Bill {
    id: string
    provider: string
    amount: number
    due_date: string
    status: 'paid' | 'pending' | 'overdue'
    category: string
}

export function UpcomingBillsWidget() {
    const [bills, setBills] = useState<Bill[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBills()
    }, [])

    const fetchBills = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const today = new Date()
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

            const { data } = await supabase
                .from('bills')
                .select('*')
                .eq('user_id', user.id)
                .gte('due_date', today.toISOString())
                .lte('due_date', nextWeek.toISOString())
                .order('due_date', { ascending: true })
                .limit(5)

            setBills(data || [])
        } catch (error) {
            console.error('Error fetching bills:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'overdue':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />
        }
    }

    const getDaysUntil = (dueDate: string) => {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Tomorrow'
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
        return `in ${diffDays} days`
    }

    if (loading) {
        return (
            <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Bills</h3>
            </div>

            <div className="flex-1 overflow-auto space-y-3">
                {bills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <Calendar className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No upcoming bills</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">You're all caught up!</p>
                    </div>
                ) : (
                    bills.map((bill, index) => (
                        <motion.div
                            key={bill.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border-2 ${bill.status === 'overdue'
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                                : bill.status === 'paid'
                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                    : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    {getStatusIcon(bill.status)}
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{bill.provider}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{bill.category}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Due {getDaysUntil(bill.due_date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right font-mono">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        RM {(bill.amount || 0).toLocaleString()}
                                    </p>
                                    {bill.status === 'pending' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05, color: '#0066FF' }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-xs text-primary-600 dark:text-primary-400 font-bold mt-1"
                                        >
                                            Pay Now
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
