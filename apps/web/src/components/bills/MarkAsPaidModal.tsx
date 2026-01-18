import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { useMarkBillAsPaid, useGenerateMonthlyPayment, useBillPayments } from '@/hooks/useBillPayments';
import { PAYMENT_METHODS, type Bill, type BillPaymentMethod } from '@financeflow/shared';
import toast from 'react-hot-toast';

interface MarkAsPaidModalProps {
    bill: Bill;
    isOpen: boolean;
    onClose: () => void;
}

export function MarkAsPaidModal({ bill, isOpen, onClose }: MarkAsPaidModalProps) {
    const markAsPaid = useMarkBillAsPaid();
    const generatePayment = useGenerateMonthlyPayment();
    const { data: payments } = useBillPayments(bill.id);

    const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
    const [paidAmount, setPaidAmount] = useState(
        bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0)
    );
    const [paymentMethod, setPaymentMethod] = useState<BillPaymentMethod | ''>('');
    const [notes, setNotes] = useState('');
    const [createTransaction, setCreateTransaction] = useState(false);

    // Find current month's payment
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const currentPayment = payments?.find(
        p => p.due_date >= startOfMonth && p.due_date <= endOfMonth && p.status === 'unpaid'
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // If no payment exists, generate one first
            let paymentId = currentPayment?.id;

            if (!paymentId) {
                const newPayment = await generatePayment.mutateAsync(bill.id);
                paymentId = newPayment.id;
            }

            // Mark as paid
            await markAsPaid.mutateAsync({
                bill_id: bill.id,
                payment_id: paymentId,
                paid_date: paidDate,
                paid_amount: paidAmount,
                payment_method: paymentMethod || undefined,
                create_transaction: createTransaction,
                notes: notes || undefined,
            });

            toast.success('Bill marked as paid!');
            onClose();
        } catch (error) {
            console.error('Error marking bill as paid:', error);
            toast.error('Failed to mark bill as paid');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-dark-elevated border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Mark as Paid</h2>
                                        <p className="text-sm text-slate-400">{bill.bill_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Bill Amount Display */}
                                <div className="p-4 rounded-xl bg-dark-base border border-white/5">
                                    <p className="text-sm text-slate-400 mb-1">Bill Amount</p>
                                    <p className="text-2xl font-bold text-white">
                                        RM {(bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0)).toFixed(2)}
                                    </p>
                                </div>

                                {/* Paid Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        value={paidDate}
                                        onChange={(e) => setPaidDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Paid Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-2" />
                                        Amount Paid
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">RM</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                                            className="w-full pl-12 pr-4 py-3 bg-dark-base border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    {bill.is_variable && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            Adjust if different from estimated amount
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <CreditCard className="w-4 h-4 inline mr-2" />
                                        Payment Method (Optional)
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value as BillPaymentMethod)}
                                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select method...</option>
                                        {PAYMENT_METHODS.map(method => (
                                            <option key={method.value} value={method.value}>{method.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        placeholder="Add any notes..."
                                    />
                                </div>

                                {/* Create Transaction Toggle */}
                                <div className="flex items-center justify-between p-4 bg-dark-base rounded-xl">
                                    <div>
                                        <p className="font-medium text-white">Create Transaction</p>
                                        <p className="text-sm text-slate-400">Add to transaction history</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCreateTransaction(!createTransaction)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${createTransaction ? 'bg-green-500' : 'bg-slate-600'
                                            }`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${createTransaction ? 'translate-x-6' : ''
                                            }`} />
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 bg-dark-base border border-white/10 rounded-xl text-white font-medium hover:border-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={markAsPaid.isPending || generatePayment.isPending}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {markAsPaid.isPending || generatePayment.isPending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Mark as Paid
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
