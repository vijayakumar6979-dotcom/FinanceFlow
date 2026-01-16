import {
    Menu,
    Search,
    Bell,
    Moon,
    Sun
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';
import { useTheme } from '@financeflow/shared';
import { useAuth } from '@financeflow/shared';

export function Header() {
    const { setSidebarOpen, setSearchModalOpen, setNotificationPanelOpen } = useLayoutStore();
    const { theme, toggleTheme } = useTheme();

    const { user } = useAuth();

    return (
        <header className="h-16 fixed top-0 right-0 left-0 lg:left-72 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/10 z-30 transition-all duration-300 px-4 flex items-center justify-between">
            {/* Left: Mobile Menu & Breadcrumb Placeholder */}
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                {/* Breadcrumb or Page Title can go here via Portal or Context */}
                <h1 className="ml-2 lg:ml-0 text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
                    Dashboard
                </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Global Search Trigger */}
                <button
                    onClick={() => setSearchModalOpen(true)}
                    className="hidden md:flex items-center h-10 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors w-64"
                >
                    <Search size={18} />
                    <span className="ml-3 text-sm">Search...</span>
                    <div className="ml-auto flex items-center space-x-1">
                        <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </button>

                <button
                    onClick={() => setSearchModalOpen(true)}
                    className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                >
                    <Search size={22} />
                </button>

                {/* Theme Toggle */}
                {/* Theme Toggle */}
                <button
                    onClick={() => {
                        console.log('Toggling theme from:', theme);
                        toggleTheme();
                    }}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? (
                        <Moon size={22} className="text-blue-500" />
                    ) : (
                        <Sun size={22} className="text-orange-500" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationPanelOpen(true)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-dark-base rounded-full"></span>
                    </button>
                </div>

                {/* Mobile Profile Dropdown Trigger (visible on sm) */}
                <div className="flex items-center pl-2 border-l border-gray-200 dark:border-white/10">
                    <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1.5px]">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden">
                                {(user as any)?.photoURL ? (
                                    <img src={(user as any).photoURL} alt="Me" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">JD</div>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
