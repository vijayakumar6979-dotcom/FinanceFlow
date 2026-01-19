import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Receipt,
    Calendar,
    CheckCircle,
    AlertTriangle,
    Plus,
    Filter,
    Search,
    BarChart3
} from 'lucide-react';
import { useBills, useBillSummary } from '@/hooks/useBills';
import { formatBillAmount, getPaymentStatusConfig, getBillCategoryConfig } from '@financeflow/shared';
import type { Bill } from '@financeflow/shared';

export default function Bills() {
    const navigate = useNavigate();
    const { data: bills, isLoading } = useBills();
    const { data: summary } = useBillSummary();
    const [filter, setFilter] = React.useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredBills = React.useMemo(() => {
        if (!bills) return [];

        let filtered = bills;

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(bill => bill.status === filter);
        }

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(bill =>
                bill.bill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bill.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [bills, filter, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                        Bills & Payments
                    </h1>
                    <p className="text-slate-400 mt-2">Manage recurring bills and never miss a payment</p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/bills/analytics')}
                        className="flex items-center gap-2 px-6 py-3 bg-dark-elevated border border-white/10 rounded-xl text-white font-semibold hover:border-primary-500/50 transition-all"
                    >
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/bills/new')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow"
                    >
                        <Plus className="w-5 h-5" />
                        Add Bill
                    </motion.button>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard
                        icon={Receipt}
                        label="Total Monthly Bills"
                        value={`RM ${summary.total_monthly.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                        color="blue"
                    />
                    <SummaryCard
                        icon={Calendar}
                        label="Due This Month"
                        value={`RM ${summary.due_this_month.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                        subtitle={`${summary.due_this_month.count} bills`}
                        color="orange"
                    />
                    <SummaryCard
                        icon={CheckCircle}
                        label="Paid This Month"
                        value={`RM ${summary.paid_this_month.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                        subtitle={`${summary.paid_this_month.count} bills`}
                        color="green"
                    />
                    <SummaryCard
                        icon={AlertTriangle}
                        label="Overdue Bills"
                        value={`RM ${summary.overdue.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                        subtitle={`${summary.overdue.count} bills`}
                        color="red"
                        pulse={summary.overdue.count > 0}
                    />
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search bills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'unpaid', 'paid', 'overdue'] as const).map((status) => (
                        <motion.button
                            key={status}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${filter === status
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-dark-elevated text-slate-400 hover:text-white border border-white/10'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Bills Grid */}
            {filteredBills.length === 0 ? (
                <div className="text-center py-16">
                    <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                        {searchQuery || filter !== 'all' ? 'No bills found' : 'No bills added yet'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                        {searchQuery || filter !== 'all'
                            ? 'Try adjusting your filters or search query'
                            : 'Add your first recurring bill to stay on top of payments'
                        }
                    </p>
                    {!searchQuery && filter === 'all' && (
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-semibold shadow-glow-blue"
                        >
                            Add Bill
                        </motion.button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBills.map((bill) => (
                        <BillCard key={bill.id} bill={bill} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Summary Card Component
interface SummaryCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    subtitle?: string;
    color: 'blue' | 'orange' | 'green' | 'red';
    pulse?: boolean;
}

function SummaryCard({ icon: Icon, label, value, subtitle, color, pulse }: SummaryCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
        orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
        green: 'from-green-500/20 to-green-600/20 border-green-500/30',
        red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    };

    const iconColors = {
        blue: 'text-blue-400',
        orange: 'text-orange-400',
        green: 'text-green-400',
        red: 'text-red-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl ${pulse ? 'animate-pulse' : ''}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-dark-base/50 ${iconColors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">{label}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
        </motion.div>
    );
}

// Bill Card Component
interface BillCardProps {
    bill: Bill;
}

function BillCard({ bill }: BillCardProps) {
    const statusConfig = getPaymentStatusConfig(bill.status || 'unpaid');
    const categoryConfig = getBillCategoryConfig(bill.provider_category);
    const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-dark-elevated border border-white/10 backdrop-blur-xl hover:border-primary-500/50 transition-all cursor-pointer"
        >
            {/* Provider Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {bill.provider_logo ? (
                        <img src={bill.provider_logo} alt={bill.provider_name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-white" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-white">{bill.bill_name}</h3>
                        <p className="text-sm text-slate-400">{bill.provider_name}</p>
                    </div>
                </div>
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color,
                    }}
                >
                    {statusConfig.label}
                </span>
            </div>

            {/* Amount */}
            <div className="mb-4">
                <p className="text-3xl font-bold text-white">
                    {formatBillAmount(amount, bill.currency, bill.is_variable)}
                </p>
                {bill.is_variable && (
                    <p className="text-xs text-slate-400 mt-1">Estimated amount</p>
                )}
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between text-sm">
                <div>
                    <p className="text-slate-400">Due Date</p>
                    <p className="text-white font-medium">
                        {bill.next_due_date ? new Date(bill.next_due_date).toLocaleDateString('en-MY', {
                            day: 'numeric',
                            month: 'short'
                        }) : `${bill.due_day}th of month`}
                    </p>
                </div>
                {bill.days_until_due !== undefined && bill.status !== 'paid' && (
                    <div className="text-right">
                        <p className="text-slate-400">Days Until Due</p>
                        <p className={`font-medium ${bill.days_until_due < 0 ? 'text-red-400' :
                            bill.days_until_due <= 3 ? 'text-orange-400' :
                                'text-green-400'
                            }`}>
                            {bill.days_until_due < 0 ? `${Math.abs(bill.days_until_due)} days overdue` : `${bill.days_until_due} days`}
                        </p>
                    </div>
                )}
            </div>

            {/* Category Badge */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-base/50 text-xs font-medium text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryConfig.color }}></span>
                    {categoryConfig.label}
                </span>
            </div>
        </motion.div>
    );
}
