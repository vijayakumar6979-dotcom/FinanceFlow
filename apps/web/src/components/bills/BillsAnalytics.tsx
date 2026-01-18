import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useBills, useBillSummary } from '@/hooks/useBills';
import { BILL_CATEGORIES } from '@financeflow/shared';

export function BillsAnalytics() {
    const { data: bills } = useBills();
    const { data: summary } = useBillSummary();

    if (!bills || !summary) {
        return (
            <div className="p-8 rounded-2xl bg-dark-elevated border border-white/10 animate-pulse">
                <div className="h-64 bg-white/5 rounded"></div>
            </div>
        );
    }

    // Calculate derived values
    const totalCount = bills.length;
    const totalMonthlyAmount = summary.total_monthly;
    const averageAmount = totalCount > 0 ? totalMonthlyAmount / totalCount : 0;
    const upcomingCount = summary.due_this_month.count;
    const paidCount = summary.paid_this_month.count;
    const unpaidCount = totalCount - paidCount - summary.overdue.count;
    const overdueCount = summary.overdue.count;

    // Calculate category breakdown
    const categoryBreakdown = bills.reduce((acc, bill) => {
        const category = bill.provider_category;
        const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

        if (!acc[category]) {
            acc[category] = { count: 0, total: 0 };
        }
        acc[category].count++;
        acc[category].total += amount;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const categories = Object.entries(categoryBreakdown)
        .map(([name, data]) => ({
            name,
            count: data.count,
            total: data.total,
            percentage: (data.total / totalMonthlyAmount) * 100,
        }))
        .sort((a, b) => b.total - a.total);

    // Calculate payment status breakdown
    const statusBreakdown = [
        { name: 'Paid', count: paidCount, color: 'bg-green-500' },
        { name: 'Unpaid', count: unpaidCount, color: 'bg-yellow-500' },
        { name: 'Overdue', count: overdueCount, color: 'bg-red-500' },
    ];

    const maxCategoryAmount = Math.max(...categories.map(c => c.total));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-400">Total Bills</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalCount}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-sm text-slate-400">Monthly Total</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        RM {totalMonthlyAmount.toFixed(0)}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-sm text-slate-400">Due Soon</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{upcomingCount}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-sm text-slate-400">Avg Amount</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        RM {averageAmount.toFixed(0)}
                    </p>
                </motion.div>
            </div>

            {/* Category Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
            >
                <h3 className="text-lg font-semibold text-white mb-6">Bills by Category</h3>

                <div className="space-y-4">
                    {categories.map((category, index) => {
                        const categoryInfo = BILL_CATEGORIES.find(c => c.value === category.name);
                        const Icon = categoryInfo?.icon;

                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {Icon && (
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${categoryInfo.color}20` }}
                                            >
                                                <Icon className="w-4 h-4" style={{ color: categoryInfo.color }} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-white">{category.name}</p>
                                            <p className="text-xs text-slate-400">{category.count} bills</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">RM {category.total.toFixed(2)}</p>
                                        <p className="text-xs text-slate-400">{category.percentage.toFixed(1)}%</p>
                                    </div>
                                </div>

                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                            width: `${(category.total / maxCategoryAmount) * 100}%`,
                                            backgroundColor: categoryInfo?.color || '#64748B',
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Payment Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
            >
                <h3 className="text-lg font-semibold text-white mb-6">Payment Status</h3>

                <div className="grid grid-cols-3 gap-4">
                    {statusBreakdown.map((status, index) => (
                        <div key={status.name} className="text-center">
                            <div className={`w-full h-32 rounded-xl ${status.color} bg-opacity-20 flex items-center justify-center mb-3`}>
                                <p className="text-4xl font-bold text-white">{status.count}</p>
                            </div>
                            <p className="text-sm font-medium text-slate-300">{status.name}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
