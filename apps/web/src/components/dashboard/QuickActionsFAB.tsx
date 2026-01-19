import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface QuickAction {
    id: string
    label: string
    icon: React.ReactNode
    color: string
    onClick: () => void
}

export function QuickActionsFAB() {
    const [isOpen, setIsOpen] = useState(false)

    const actions: QuickAction[] = [
        {
            id: 'transaction',
            label: 'Add Transaction',
            icon: <span className="text-lg">💰</span>,
            color: 'from-blue-500 to-cyan-500',
            onClick: () => console.log('Add transaction')
        },
        {
            id: 'bill',
            label: 'Add Bill',
            icon: <span className="text-lg">📄</span>,
            color: 'from-yellow-500 to-amber-500',
            onClick: () => console.log('Add bill')
        },
        {
            id: 'goal',
            label: 'Add Goal',
            icon: <span className="text-lg">🎯</span>,
            color: 'from-purple-500 to-pink-500',
            onClick: () => console.log('Add goal')
        },
        {
            id: 'receipt',
            label: 'Scan Receipt',
            icon: <span className="text-lg">📸</span>,
            color: 'from-green-500 to-emerald-500',
            onClick: () => console.log('Scan receipt')
        }
    ]

    const handleActionClick = (action: QuickAction) => {
        action.onClick()
        setIsOpen(false)
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Action Buttons */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-20 right-0 space-y-3"
                    >
                        {actions.map((action, index) => (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { delay: index * 0.05 }
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.8,
                                    transition: { delay: (actions.length - index - 1) * 0.05 }
                                }}
                                className="flex items-center gap-3"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-dark-elevated px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                                    {action.label}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleActionClick(action)}
                                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
                                >
                                    {action.icon}
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 shadow-2xl hover:shadow-primary-500/50 flex items-center justify-center text-white transition-all hover:scale-110"
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Plus className="w-8 h-8" />
                </motion.div>
            </motion.button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
