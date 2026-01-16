import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    Wallet,

    TrendingDown,
    TrendingUp,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    ArrowLeftRight,
    Target,
    Flag
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';
import { useAuth } from '@financeflow/shared';
import clsx from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'accounts', label: 'Accounts', icon: Wallet, path: '/accounts' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
    { id: 'bills', label: 'Bills', icon: Receipt, path: '/bills', badge: 2, badgeColor: 'warning' },
    { id: 'loans', label: 'Loans', icon: TrendingDown, path: '/loans' },
    { id: 'budgets', label: 'Budgets', icon: Target, path: '/budgets' },
    { id: 'goals', label: 'Goals', icon: Flag, path: '/goals' },
    { id: 'investments', label: 'Investments', icon: TrendingUp, path: '/investments' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, sidebarOpen, setSidebarOpen } = useLayoutStore();
    const { user, signOut } = useAuth();

    const sidebarClass = clsx(
        'fixed left-0 top-0 h-full bg-dark-surface/80 backdrop-blur-2xl border-r border-white/10 transition-all duration-500 ease-out z-40 flex flex-col',
        {
            'w-20': sidebarCollapsed,
            'w-72': !sidebarCollapsed,
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
                <div className="h-16 flex items-center justify-center border-b border-white/10 relative">
                    {sidebarCollapsed ? (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                            <span className="text-white font-bold text-xl">F</span>
                            <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-lg animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-6 w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative shrink-0">
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
                <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)} // Close on mobile click
                                className={({ isActive }) => clsx(
                                    "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active indicator - neon left border */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full">
                                                <div className="w-full h-full bg-blue-500 blur-md"></div>
                                            </div>
                                        )}

                                        {/* Icon with glow on active */}
                                        <div className={clsx(
                                            "relative flex items-center justify-center w-6 h-6 shrink-0",
                                            isActive ? "text-blue-400" : ""
                                        )}>
                                            <Icon size={24} />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-blue-500/30 blur-lg animate-pulse"></div>
                                            )}
                                        </div>

                                        {/* Label */}
                                        <span className={clsx(
                                            "flex-1 font-medium transition-all duration-300 whitespace-nowrap",
                                            sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                                        )}>
                                            {item.label}
                                        </span>

                                        {/* Badge */}
                                        {!sidebarCollapsed && item.badge && (
                                            <div className={clsx(
                                                "px-2 py-0.5 rounded-full text-xs font-bold animate-pulse shrink-0",
                                                item.badgeColor === 'warning'
                                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            )}>
                                                {item.badge}
                                            </div>
                                        )}

                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Toggle Button (Desktop) */}
                <div className="hidden lg:flex justify-center pb-6">
                    <button
                        onClick={toggleSidebar}
                        className="w-12 h-12 rounded-full bg-dark-elevated border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
                    >
                        {sidebarCollapsed ? <ChevronRight size={20} className="text-gray-400 group-hover:text-white" /> : <ChevronLeft size={20} className="text-gray-400 group-hover:text-white" />}
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                    <div className={clsx("flex items-center", sidebarCollapsed ? "justify-center" : "justify-between")}>
                        <div className="flex items-center overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px] shrink-0">
                                <div className="w-full h-full rounded-full bg-dark-surface p-0.5">
                                    {(user as any)?.photoURL ? (
                                        <img src={(user as any).photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={clsx("ml-3 transition-all duration-200", sidebarCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                                <p className="text-sm font-semibold text-white truncate max-w-[120px]">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
