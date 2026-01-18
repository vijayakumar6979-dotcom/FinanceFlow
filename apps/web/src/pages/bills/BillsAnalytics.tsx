import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { BillsAnalytics } from '@/components/bills/BillsAnalytics';
import { ExportBills } from '@/components/bills/ExportBills';

export default function BillsAnalyticsPage() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/bills')}
                        className="p-2 rounded-xl bg-dark-elevated border border-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Bills Analytics</h1>
                        <p className="text-slate-400 mt-1">Insights and statistics</p>
                    </div>
                </div>

                <ExportBills />
            </div>

            {/* Analytics Dashboard */}
            <BillsAnalytics />
        </div>
    );
}
