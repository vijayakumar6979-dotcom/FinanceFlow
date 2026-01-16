import React from 'react'
import { Plus, Receipt, Target, BarChart2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const QuickActions: React.FC = () => {
    const navigate = useNavigate()

    const actions = [
        {
            id: 'add-transaction',
            label: 'Add Transaction',
            icon: <Plus size={24} />,
            gradient: 'from-blue-500 to-cyan-500',
            onClick: () => navigate('/transactions/new')
        },
        {
            id: 'pay-bill',
            label: 'Pay Bill',
            icon: <Receipt size={24} />,
            gradient: 'from-orange-500 to-yellow-500',
            badge: 2,
            onClick: () => navigate('/bills')
        },
        {
            id: 'check-budget',
            label: 'Check Budget',
            icon: <Target size={24} />,
            gradient: 'from-purple-500 to-pink-500',
            onClick: () => navigate('/budgets')
        },
        {
            id: 'view-analytics',
            label: 'View Analytics',
            icon: <BarChart2 size={24} />,
            gradient: 'from-green-500 to-teal-500',
            onClick: () => navigate('/analytics')
        }
    ]

    return (
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {actions.map((action, index) => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className="
            relative group
            min-w-[200px] p-4 rounded-2xl
            bg-white/5 backdrop-blur-xl
            border border-white/10
            hover:bg-white/10
            transform-gpu transition-all duration-500
            hover:scale-105 hover:-translate-y-1
            cursor-pointer
          "
                    style={{
                        animationDelay: `${index * 100}ms`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Gradient glow */}
                    <div className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br ${action.gradient}
            opacity-0 group-hover:opacity-20
            blur-xl transition-opacity duration-500
            -z-10
          `}></div>

                    {/* Content */}
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`
              w-12 h-12 rounded-xl
              bg-gradient-to-br ${action.gradient}
              flex items-center justify-center
              shadow-lg
              group-hover:scale-110 transition-transform
            `}>
                            <div className="text-white">
                                {action.icon}
                            </div>
                        </div>

                        {/* Label */}
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold">{action.label}</p>
                            {action.badge && (
                                <span className="text-xs text-orange-400">{action.badge} pending</span>
                            )}
                        </div>

                        {/* Arrow */}
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            ))}
        </div>
    )
}
