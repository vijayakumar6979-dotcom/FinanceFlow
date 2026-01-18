import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit,
    Trash2,
    CheckCircle,
    Calendar,
    DollarSign
} from 'lucide-react';
import { useBill, useDeleteBill } from '@/hooks/useBills';
import { useBillPayments } from '@/hooks/useBillPayments';
import { formatBillAmount, getPaymentStatusConfig, getBillCategoryConfig } from '@financeflow/shared';
import { MarkAsPaidModal } from '@/components/bills/MarkAsPaidModal';
import { PaymentHistory } from '@/components/bills/PaymentHistory';
import { AIPredictionCard } from '@/components/bills/AIPredictionCard';
import { BudgetImpactCard } from '@/components/bills/BudgetImpactCard';
import { ExportBills } from '@/components/bills/ExportBills';
import toast from 'react-hot-toast';

export default function BillDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: bill, isLoading } = useBill(id!);
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
            <div className="flex items-center justify-center min-h-screen">
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

    const statusConfig = getPaymentStatusConfig(bill.current_status || 'unpaid');
    const categoryConfig = getBillCategoryConfig(bill.provider_category);
    const amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/bills')}
                            className="p-2 rounded-xl bg-dark-elevated border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{bill.bill_name}</h1>
                            <p className="text-slate-400 mt-1">{bill.provider_name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/bills/${id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-white/10 rounded-xl text-white hover:border-primary-500/50 transition-all"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteBill.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-white/10 rounded-xl text-red-400 hover:border-red-500/50 transition-all disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
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
                            className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    {bill.provider_logo ? (
                                        <img src={bill.provider_logo} alt={bill.provider_name} className="w-16 h-16 rounded-xl object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                            <DollarSign className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{bill.provider_name}</h2>
                                        <p className="text-sm text-slate-400">{bill.provider_category}</p>
                                    </div>
                                </div>
                                <span
                                    className="px-4 py-2 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: statusConfig.bgColor,
                                        color: statusConfig.color,
                                    }}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Bill Amount</p>
                                    <p className="text-3xl font-bold text-white">
                                        {formatBillAmount(amount, bill.currency, bill.is_variable)}
                                    </p>
                                    {bill.is_variable && (
                                        <p className="text-xs text-slate-400 mt-1">Estimated amount</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Next Due Date</p>
                                    <p className="text-2xl font-bold text-white">
                                        {bill.next_due_date ? new Date(bill.next_due_date).toLocaleDateString('en-MY', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : `${bill.due_day}th of month`}
                                    </p>
                                    {bill.days_until_due !== undefined && bill.current_status !== 'paid' && (
                                        <p className={`text-sm mt-1 ${bill.days_until_due < 0 ? 'text-red-400' :
                                            bill.days_until_due <= 3 ? 'text-orange-400' :
                                                'text-green-400'
                                            }`}>
                                            {bill.days_until_due < 0
                                                ? `${Math.abs(bill.days_until_due)} days overdue`
                                                : `${bill.days_until_due} days remaining`
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                            <div className="space-y-3">
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
                                className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                            >
                                <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                                <p className="text-slate-300">{bill.notes}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Quick Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        {bill.current_status !== 'paid' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                <button
                                    onClick={() => setShowMarkAsPaid(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Mark as Paid
                                </button>
                            </motion.div>
                        )}

                        {/* Category */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                        >
                            <h3 className="text-sm font-medium text-slate-400 mb-3">Category</h3>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${categoryConfig.color}20` }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: categoryConfig.color }}
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{categoryConfig.label}</p>
                                    <p className="text-xs text-slate-400">Bill Category</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reminders */}
                        {bill.reminder_days && bill.reminder_days.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                            >
                                <h3 className="text-sm font-medium text-slate-400 mb-3">Reminders</h3>
                                <div className="space-y-2">
                                    {bill.reminder_days.map((days) => (
                                        <div key={days} className="flex items-center gap-2 text-sm text-slate-300">
                                            <Calendar className="w-4 h-4 text-primary-400" />
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
                            className="p-6 rounded-2xl bg-dark-elevated border border-white/10"
                        >
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Created</h3>
                            <p className="text-white">
                                {bill.created_at ? new Date(bill.created_at).toLocaleDateString('en-MY', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : 'Unknown'}
                            </p>
                        </motion.div>

                        {/* Export Bills */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <ExportBills payments={useBillPayments(bill.id).data} />
                        </motion.div>

                        {/* Budget Impact Card */}
                        <BudgetImpactCard bill={bill} />

                        {/* AI Prediction Card */}
                        <AIPredictionCard bill={bill} />
                    </div>
                </div>

                {/* Payment History Section */}
                <div className="mt-8">
                    <PaymentHistory bill={bill} />
                </div>
            </div>

            {/* Mark as Paid Modal */}
            <MarkAsPaidModal
                bill={bill}
                isOpen={showMarkAsPaid}
                onClose={() => setShowMarkAsPaid(false)}
            />
        </>
    );
}

// Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    );
}
