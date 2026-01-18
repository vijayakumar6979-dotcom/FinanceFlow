import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useBillPayments } from '@/hooks/useBillPayments';
import type { Bill } from '@financeflow/shared';

interface PaymentHistoryProps {
    bill: Bill;
}

export function PaymentHistory({ bill }: PaymentHistoryProps) {
    const { data: payments, isLoading } = useBillPayments(bill.id);

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl bg-dark-elevated border border-white/10">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/5 rounded w-1/4"></div>
                    <div className="h-20 bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="p-6 rounded-2xl bg-dark-elevated border border-white/10 text-center">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No payment history yet</p>
            </div>
        );
    }

    // Calculate statistics
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paid_amount || p.amount), 0);
    const avgAmount = totalPaid / payments.filter(p => p.status === 'paid').length || 0;
    const onTimePayments = payments.filter(p => p.status === 'paid' && p.paid_date && p.paid_date <= p.due_date).length;
    const onTimeRate = payments.filter(p => p.status === 'paid').length > 0
        ? (onTimePayments / payments.filter(p => p.status === 'paid').length) * 100
        : 0;

    return (
        <div className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-dark-elevated border border-white/10"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Total Paid</p>
                            <p className="text-lg font-bold text-white">RM {totalPaid.toFixed(2)}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-dark-elevated border border-white/10"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Average Amount</p>
                            <p className="text-lg font-bold text-white">RM {avgAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-dark-elevated border border-white/10"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">On-Time Rate</p>
                            <p className="text-lg font-bold text-white">{onTimeRate.toFixed(0)}%</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Payment List */}
            <div className="p-6 rounded-2xl bg-dark-elevated border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>

                <div className="space-y-3">
                    {payments.map((payment, index) => {
                        const isLate = payment.status === 'paid' && payment.paid_date && payment.paid_date > payment.due_date;
                        const isOverdue = payment.status === 'unpaid' && new Date(payment.due_date) < new Date();

                        return (
                            <motion.div
                                key={payment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-dark-base border border-white/5 hover:border-white/10 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payment.status === 'paid'
                                            ? 'bg-green-500/20'
                                            : isOverdue
                                                ? 'bg-red-500/20'
                                                : 'bg-yellow-500/20'
                                        }`}>
                                        {payment.status === 'paid' ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Clock className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-yellow-500'}`} />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white">
                                                {new Date(payment.due_date).toLocaleDateString('en-MY', {
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            {isLate && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-orange-500/20 text-orange-400 rounded">
                                                    Late
                                                </span>
                                            )}
                                            {isOverdue && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                                                    Overdue
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            Due: {new Date(payment.due_date).toLocaleDateString('en-MY')}
                                            {payment.paid_date && ` • Paid: ${new Date(payment.paid_date).toLocaleDateString('en-MY')}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-white">
                                        RM {(payment.paid_amount || payment.amount).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-400 capitalize">{payment.status}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
