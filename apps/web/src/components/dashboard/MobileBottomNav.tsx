import React from 'react'
import { Home, Wallet, Plus, Flag, MoreHorizontal } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'


export const MobileBottomNav: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            icon: <Home size={24} />,
            path: '/dashboard'
        },
        {
            id: 'accounts',
            label: 'Accounts',
            icon: <Wallet size={24} />,
            path: '/accounts'
        },
        {
            id: 'add',
            label: 'Add',
            icon: <Plus size={28} />,
            path: '#add', // Open modal usually
            isSpecial: true
        },
        {
            id: 'goals',
            label: 'Goals',
            icon: <Flag size={24} />,
            path: '/goals'
        },
        {
            id: 'more',
            label: 'More',
            icon: <MoreHorizontal size={24} />,
            path: '/settings'
        }
    ]

    return (
        <nav className="
      fixed bottom-0 left-0 right-0 z-50
      h-16 px-2
      bg-dark-surface/80 backdrop-blur-2xl
      border-t border-white/10
      flex items-center justify-around
      safe-area-inset-bottom
      lg:hidden
    ">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path

                if (item.isSpecial) {
                    // Special FAB button in center
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)} // Should open add modal
                            className="
                relative -mt-8
                w-14 h-14 rounded-full
                bg-gradient-to-br from-blue-500 to-purple-600
                flex items-center justify-center
                shadow-lg shadow-blue-500/50
                active:scale-95 transition-transform
              "
                        >
                            <div className="text-white">{item.icon}</div>
                            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg animate-pulse"></div>
                        </button>
                    )
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`
              flex flex-col items-center justify-center
              min-w-[60px] py-2
              active:scale-95 transition-all
              ${isActive ? 'text-blue-400' : 'text-gray-400'}
            `}
                    >
                        <div className="relative">
                            {item.icon}
                            {isActive && (
                                <div className="absolute inset-0 bg-blue-500/30 blur-lg animate-pulse"></div>
                            )}
                        </div>
                        <span className="text-xs font-medium mt-1">{item.label}</span>

                        {/* Active indicator */}
                        {isActive && (
                            <div className="
                absolute bottom-0 left-1/2 -translate-x-1/2
                w-1 h-1 rounded-full
                bg-blue-400
              "></div>
                        )}
                    </button>
                )
            })}
        </nav>
    )
}
