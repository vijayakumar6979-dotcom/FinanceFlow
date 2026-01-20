import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { BillsAnalytics } from '@/components/bills/BillsAnalytics';
import { ExportBills } from '@/components/bills/ExportBills';

export default function BillsAnalyticsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white pb-20 overflow-x-hidden relative">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8 max-w-7xl z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/bills')}
                            className="p-3 rounded-2xl bg-[#1A1F3A] border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 transition-all shadow-lg"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </motion.button>
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-black tracking-tight"
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                                    Bills
                                </span>
                                <span className="text-primary ml-3">Analytics</span>
                            </motion.h1>
                            <p className="text-slate-400 mt-1 text-lg">Deep dive into your recurring expenses</p>
                        </div>
                    </div>

                    <ExportBills />
                </div>

                {/* Analytics Dashboard */}
                <BillsAnalytics />
            </div>
        </div>
    );
}
