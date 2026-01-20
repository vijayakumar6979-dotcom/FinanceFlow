import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit,
    Trash2,
    CheckCircle,
    Calendar,
    DollarSign,
    Wallet
} from 'lucide-react';
import { useBill, useDeleteBill } from '@/hooks/useBills';
import { useBillPayments } from '@/hooks/useBillPayments';
import { formatBillAmount, getPaymentStatusConfig, getBillCategoryConfig } from '@financeflow/shared';
import { MarkAsPaidModal } from '@/components/bills/MarkAsPaidModal';
import { PaymentHistory } from '@/components/bills/PaymentHistory';
import { AIInsights } from '@/components/bills/AIInsights';
import { BudgetImpactCard } from '@/components/bills/BudgetImpactCard';
import { ExportBills } from '@/components/bills/ExportBills';
import toast from 'react-hot-toast';

export default function BillDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: bill, isLoading } = useBill(id!);
    const { data: payments } = useBillPayments(id!);
    const deleteBill = useDeleteBill();
    const [showMarkAsPaid, setShowMarkAsPaid] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this bill?')) return;

        try {
            await deleteBill.mutateAsync(id!);
            toast.success('Bill deleted successfully');
            navigate('/bills');
        } catch (error) {
            toast.error('Failed to delete bill');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!bill) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Bill not found</h2>
                <button
                    onClick={() => navigate('/bills')}
                    className="px-6 py-3 bg-primary-500 rounded-xl text-white font-semibold"
                >
                    Back to Bills
                </button>
            </div>
        );
    }

    const statusConfig = getPaymentStatusConfig(bill.status || 'unpaid');
    const categoryConfig = getBillCategoryConfig(bill.provider_category);
    const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8 max-w-6xl z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/bills')}
                            className="p-2.5 rounded-xl bg-[#1A1F3A] border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/20"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{bill.bill_name}</h1>
                            <p className="text-slate-400 font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
                                {bill.provider_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/bills/${id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1A1F3A] border border-white/10 rounded-xl text-white hover:border-primary/50 transition-all font-medium"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDelete}
                            disabled={deleteBill.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-all font-medium disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </motion.button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Bill Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative p-8 rounded-[24px] bg-[#121629]/80 border border-white/10 backdrop-blur-xl overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    {bill.provider_logo ? (
                                        <img src={bill.provider_logo} alt={bill.provider_name} className="w-20 h-20 rounded-2xl object-cover shadow-2xl border border-white/10" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A1F3A] to-[#0A0E27] border border-white/10 flex items-center justify-center shadow-2xl">
                                            <Wallet className="w-8 h-8 text-primary" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{bill.provider_name}</h2>
                                        <p className="text-sm font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg inline-block">{bill.provider_category}</p>
                                    </div>
                                </div>
                                <span
                                    className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border shadow-lg"
                                    style={{
                                        backgroundColor: `${statusConfig.color}15`,
                                        color: statusConfig.color,
                                        borderColor: `${statusConfig.color}30`
                                    }}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Due</p>
                                    <p className="text-4xl font-black text-white tracking-tight">
                                        {formatBillAmount(amount, bill.currency, bill.is_variable)}
                                    </p>
                                    {bill.is_variable && (
                                        <div className="flex items-center gap-1.5 mt-2 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-md w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            Estimated Variable
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Due Date</p>
                                    <p className="text-2xl font-bold text-white">
                                        {bill.next_due_date ? new Date(bill.next_due_date).toLocaleDateString('en-MY', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : `${bill.due_day}th of month`}
                                    </p>
                                    {bill.days_until_due !== undefined && bill.status !== 'paid' && (
                                        <p className={`text-sm font-bold mt-1 ${bill.days_until_due < 0 ? 'text-rose-400' :
                                            bill.days_until_due <= 3 ? 'text-amber-400' :
                                                'text-emerald-400'
                                            }`}>
                                            {bill.days_until_due < 0
                                                ? `${Math.abs(bill.days_until_due)} days OVERDUE`
                                                : `${bill.days_until_due} days remaining`
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Insights Panel - Moved to Main Column for better visibility */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <AIInsights bill={bill} payments={payments || []} />
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-[24px] bg-[#121629]/50 border border-white/5"
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-1 h-5 bg-primary rounded-full" />
                                Payment Details
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Due Day" value={`${bill.due_day}th of each month`} />
                                {bill.payment_method && <InfoRow label="Payment Method" value={bill.payment_method} />}
                                {bill.account_number && <InfoRow label="Account Number" value={bill.account_number} />}
                                <InfoRow label="Auto-Pay" value={bill.auto_pay_enabled ? 'Enabled' : 'Disabled'} />
                                <InfoRow label="Budget Sync" value={bill.auto_sync_budget ? 'Enabled' : 'Disabled'} />
                                <InfoRow label="Notifications" value={bill.notifications_enabled ? 'Enabled' : 'Disabled'} />
                            </div>
                        </motion.div>

                        {/* Notes */}
                        {bill.notes && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-2xl bg-[#121629]/50 border border-white/5"
                            >
                                <h3 className="text-lg font-bold text-white mb-3">Notes</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">{bill.notes}</p>
                            </motion.div>
                        )}

                        {/* Payment History Section */}
                        <div className="mt-8">
                            <PaymentHistory bill={bill} />
                        </div>
                    </div>

                    {/* Right Column - Quick Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        {bill.status !== 'paid' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-1 rounded-[26px] bg-gradient-to-br from-primary via-blue-500 to-purple-600 shadow-glow-blue"
                            >
                                <div className="p-6 rounded-[24px] bg-[#0A0E27]">
                                    <h3 className="text-lg font-bold text-white mb-4">Quick Pay</h3>
                                    <button
                                        onClick={() => setShowMarkAsPaid(true)}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-blue-600 rounded-xl text-white font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Mark as Paid
                                    </button>
                                </div>
                            </motion.div>
                        )}



                        {/* Budget Impact Card */}
                        <BudgetImpactCard bill={bill} />

                        {/* Export Bills */}
                        <ExportBills payments={payments} />

                        {/* Category */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl bg-[#121629]/50 border border-white/5"
                        >
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Category</h3>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: `${categoryConfig.color}20`, border: `1px solid ${categoryConfig.color}40` }}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: categoryConfig.color, boxShadow: `0 0 10px ${categoryConfig.color}` }}
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">{categoryConfig.label}</p>
                                    <p className="text-xs text-slate-400">Recurring Expense</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reminders */}
                        {bill.reminder_days && bill.reminder_days.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-2xl bg-[#121629]/50 border border-white/5"
                            >
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Reminders Set</h3>
                                <div className="space-y-3">
                                    {bill.reminder_days.map((days) => (
                                        <div key={days} className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {days === 0 ? 'On due date' : `${days} days before`}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Created Date */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02]"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-500">Created</span>
                                <span className="text-xs font-bold text-slate-300">
                                    {bill.created_at ? new Date(bill.created_at).toLocaleDateString('en-MY', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'Unknown'}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mark as Paid Modal */}
            <MarkAsPaidModal
                bill={bill}
                isOpen={showMarkAsPaid}
                onClose={() => setShowMarkAsPaid(false)}
            />
        </div>
    );
}

// Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-dashed border-white/10 last:border-0 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-sm font-medium text-slate-400">{label}</span>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
    );
}
