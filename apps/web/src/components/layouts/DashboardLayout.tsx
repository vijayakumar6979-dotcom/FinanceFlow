import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useLayoutStore } from '@/store/layoutStore';
import clsx from 'clsx';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { sidebarCollapsed } = useLayoutStore();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-base text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Sidebar />
            <Header />

            <main
                className={clsx(
                    "pt-20 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out min-h-screen",
                    sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <MobileBottomNav />

            {/* Placeholders for Modals/Panels */}
            {/* <SearchModal /> */}
            {/* <NotificationPanel /> */}
        </div>
    );
}

