import React from 'react';
import { motion } from 'framer-motion';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { IncomeExpensePulse } from '@/components/dashboard/IncomeExpensePulse';
import { UpcomingBillsWidget } from '@/components/dashboard/UpcomingBillsWidget';
import { DigitalWallet } from '@/components/dashboard/DigitalWallet';
import { AICopilotWidget } from '@/components/dashboard/AICopilotWidget';
import { HealthGauge } from '@/components/dashboard/HealthGauge';
import { format } from 'date-fns';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Inner Dashboard Content to access Context
const DashboardContent = () => {
    const { currentDate } = useDashboard();

    // Mock User Data for Greeting
    const user = { name: 'Alex' };

    return (
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">{user.name}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 font-medium">
                        Here's your financial pulse for {format(currentDate, 'MMMM yyyy')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5">
                        <Search size={18} className="text-slate-500" />
                    </Button>
                    <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 relative">
                        <Bell size={18} className="text-slate-500" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
                    </Button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6">

                {/* Row 1: The Pulse (Chart) + Upcoming Bills */}
                <IncomeExpensePulse />
                <UpcomingBillsWidget />

                {/* Row 2: Digital Wallet (Credit/E-Wallet/Cash) */}
                <DigitalWallet />

                {/* Row 3: Health + AI Copilot + Budget Summary */}
                <HealthGauge />
                <AICopilotWidget />

                {/* Placeholder for Quick Budget/Transaction widget */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                        🚀
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Milestone Tracker</h3>
                    <p className="text-slate-400 text-sm">New Car Fund: 45% Reached</p>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[45%]" />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Main Page Wrapper
const Dashboard = () => {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
};

export default Dashboard;
