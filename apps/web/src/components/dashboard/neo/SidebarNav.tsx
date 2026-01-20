import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    Receipt,
    TrendingDown,
    Target,
    Flag,
    TrendingUp,
    BarChart3,
    ChevronLeft
} from 'lucide-react'

export function SidebarNav() {
    const [collapsed, setCollapsed] = useState(false)

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { id: 'accounts', icon: Wallet, label: 'Accounts', path: '/accounts', badge: 3 },
        { id: 'transactions', icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
        { id: 'bills', icon: Receipt, label: 'Bills', path: '/bills', badge: 2, badgeColor: 'warning' },
        { id: 'loans', icon: TrendingDown, label: 'Loans', path: '/loans' },
        { id: 'budgets', icon: Target, label: 'Budgets', path: '/budgets' },
        { id: 'goals', icon: Flag, label: 'Goals', path: '/goals' },
        { id: 'investments', icon: TrendingUp, label: 'Investments', path: '/investments' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ]

    return (
        <aside className={`
      fixed left-0 top-0 h-screen
      ${collapsed ? 'w-20' : 'w-72'}
      bg-[#121629]/80 backdrop-blur-2xl
      border-r border-white/10
      transition-all duration-500 ease-out
      z-40
    `}>
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-center border-b border-white/10">
                {collapsed ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                            <span className="text-white font-bold text-xl">F</span>
                            {/* Pulsing glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-xl animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">FinanceFlow</h1>
                            <p className="text-xs text-gray-400">AI Powered</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="mt-6 px-3">
                {navItems.map((item, index) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 mb-2
                rounded-xl transition-all duration-300
                group relative overflow-hidden
                ${isActive
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
              `}
                            style={{
                                animationDelay: `${index * 50}ms`
                            }}
                        >
                            {/* Active indicator - neon left border */}
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full">
                                            <div className="w-full h-full bg-blue-500 blur-md"></div>
                                        </div>
                                    )}

                                    {/* Icon with glow on active */}
                                    <div className={`
                    relative flex items-center justify-center w-6 h-6
                    ${isActive ? 'text-blue-400' : ''}
                  `}>
                                        <Icon size={24} />
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500/30 blur-lg animate-pulse"></div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    {!collapsed && (
                                        <span className="flex-1 font-medium">{item.label}</span>
                                    )}

                                    {/* Badge */}
                                    {!collapsed && item.badge && (
                                        <div className={`
                      px-2 py-0.5 rounded-full text-xs font-bold
                      ${item.badgeColor === 'warning'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }
                      animate-pulse
                    `}>
                                            {item.badge}
                                        </div>
                                    )}

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#1A1F3A] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
            >
                <ChevronLeft className={`transition-transform text-white ${collapsed ? 'rotate-180' : ''}`} size={20} />
            </button>
        </aside>
    )
}
