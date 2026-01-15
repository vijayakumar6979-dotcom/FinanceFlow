import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    PieChart,
    TrendingDown,
    TrendingUp,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';
import { useAuth } from '@financeflow/shared';
import clsx from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/transactions', badge: 5 },
    { id: 'accounts', label: 'Accounts', icon: Wallet, path: '/accounts' },
    { id: 'budgets', label: 'Budgets', icon: PieChart, path: '/budgets' },
    { id: 'loans', label: 'Loans', icon: TrendingDown, path: '/loans' },
    { id: 'investments', label: 'Investments', icon: TrendingUp, path: '/investments' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, sidebarOpen, setSidebarOpen } = useLayoutStore();
    const { user, signOut } = useAuth();

    const sidebarClass = clsx(
        'fixed left-0 top-0 h-full bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-white/10 transition-all duration-300 ease-in-out z-40 flex flex-col',
        {
            'w-20': sidebarCollapsed,
            'w-[280px]': !sidebarCollapsed,
            '-translate-x-full lg:translate-x-0': !sidebarOpen, // Hide on mobile by default
            'translate-x-0': sidebarOpen // Show on mobile when open
        }
    );

    return (
        <>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={sidebarClass}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <span className={clsx("ml-3 font-bold text-xl tracking-tight transition-opacity duration-200",
                        sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 text-gray-900 dark:text-white"
                    )}>
                        FinanceFlow
                    </span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)} // Close on mobile click
                            className={({ isActive }) => clsx(
                                "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-purple-500/10 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
                                    )}
                                    <item.icon size={22} className={clsx("transition-colors", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />

                                    <span className={clsx("ml-3 font-medium transition-all duration-200 whitespace-nowrap",
                                        sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                                    )}>
                                        {item.label}
                                    </span>

                                    {item.badge && !sidebarCollapsed && (
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/20">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Toggle Button (Desktop) */}
                <div className="hidden lg:flex px-3 pb-4">
                    <button
                        onClick={toggleSidebar}
                        className="w-full h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className={clsx("flex items-center", sidebarCollapsed ? "justify-center" : "justify-between")}>
                        <div className="flex items-center items-center overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-0.5">
                                    {(user as any)?.photoURL ? (
                                        <img src={(user as any).photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={clsx("ml-3 transition-all duration-200", sidebarCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
