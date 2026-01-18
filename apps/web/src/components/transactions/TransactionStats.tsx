import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';

interface TransactionStatsProps {
    stats?: {
        income: number;
        expenses: number;
        net: number;
        count: number;
    };
}

export function TransactionStats({ stats }: TransactionStatsProps) {
    const statCards = [
        {
            title: 'Total Income',
            value: `RM ${stats?.income.toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            color: 'from-[#10B981] to-[#059669]',
            glow: '0 0 20px rgba(16, 185, 129, 0.5)',
        },
        {
            title: 'Total Expenses',
            value: `RM ${stats?.expenses.toFixed(2) || '0.00'}`,
            icon: TrendingDown,
            color: 'from-[#EF4444] to-[#DC2626]',
            glow: '0 0 20px rgba(239, 68, 68, 0.5)',
        },
        {
            title: 'Net Cash Flow',
            value: `RM ${stats?.net.toFixed(2) || '0.00'}`,
            icon: Wallet,
            color: stats && stats.net >= 0 ? 'from-[#0066FF] to-[#8B5CF6]' : 'from-[#F59E0B] to-[#D97706]',
            glow: stats && stats.net >= 0 ? '0 0 20px rgba(0, 102, 255, 0.5)' : '0 0 20px rgba(245, 158, 11, 0.5)',
        },
        {
            title: 'Transactions',
            value: stats?.count.toString() || '0',
            icon: Receipt,
            color: 'from-[#8B5CF6] to-[#EC4899]',
            glow: '0 0 20px rgba(139, 92, 246, 0.5)',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl"
                        style={{ background: `linear-gradient(135deg, ${stat.color})`, boxShadow: stat.glow }}
                    />

                    <div className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.18)] rounded-2xl p-6 hover:transform hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <h3 className="text-[#94A3B8] text-sm font-medium mb-2">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white font-['JetBrains_Mono']">
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
