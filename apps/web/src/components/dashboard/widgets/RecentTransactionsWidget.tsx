import { useState, useEffect } from 'react'
import { ArrowRight, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { WidgetSkeleton } from '../skeletons/WidgetSkeleton'

interface Transaction {
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
    category: string
    date: string
}

export function RecentTransactionsWidget() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTransactions()
    }, [])

    // Real-time subscription
    useRealtimeSubscription({
        table: 'transactions',
        event: '*',
        onChange: () => {
            fetchTransactions()
        }
    })

    const fetchTransactions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(8)

            setTransactions(data || [])
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Food & Dining': 'bg-orange-500',
            'Shopping': 'bg-pink-500',
            'Transportation': 'bg-blue-500',
            'Entertainment': 'bg-purple-500',
            'Bills & Utilities': 'bg-yellow-500',
            'Healthcare': 'bg-red-500',
            'Income': 'bg-green-500',
            'Other': 'bg-gray-500'
        }
        return colors[category] || 'bg-gray-500'
    }

    if (loading) {
        return <WidgetSkeleton type="list" />
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-auto space-y-2">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <Receipt className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Add your first transaction to get started</p>
                    </div>
                ) : (
                    transactions.map((transaction, index) => (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className={`w-10 h-10 rounded-lg ${getCategoryColor(transaction.category)} flex items-center justify-center flex-shrink-0`}>
                                {transaction.type === 'income' ? (
                                    <TrendingUp className="w-5 h-5 text-white" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{transaction.description}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
                            </div>
                            <div className="text-right font-mono">
                                <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    RM {(transaction.amount || 0).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase tracking-tight">
                                    {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
