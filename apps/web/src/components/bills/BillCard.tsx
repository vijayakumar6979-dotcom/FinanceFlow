import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, MoreVertical, Edit2, Trash2, Calendar, Zap, Droplets, Wifi, Smartphone, Tv, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Bill, BillProvider, formatCurrency } from '@financeflow/shared';

interface BillCardProps {
    bill: Bill;
    onPay?: (bill: Bill) => void;
    onEdit?: (bill: Bill) => void;
    onDelete?: (bill: Bill) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'Electricity': <Zap className="w-5 h-5" />,
    'Water': <Droplets className="w-5 h-5" />,
    'Sewerage': <Droplets className="w-5 h-5" />,
    'Internet': <Wifi className="w-5 h-5" />,
    'Mobile': <Smartphone className="w-5 h-5" />,
    'TV': <Tv className="w-5 h-5" />,
    'Insurance': <Shield className="w-5 h-5" />,
};

export function BillCard({ bill, onPay, onEdit, onDelete }: BillCardProps) {
    const navigate = useNavigate();

    // Mock status logic (replace with real date math later)
    const isPaid = bill.status === 'paid';
    const isOverdue = bill.status === 'overdue';
    const isDueSoon = !isPaid && !isOverdue && (bill.days_until_due || 0) <= 7;

    const statusColors = {
        paid: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        overdue: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
        dueSoon: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
        unpaid: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    };

    const currentStatus = isPaid ? 'paid' : isOverdue ? 'overdue' : isDueSoon ? 'dueSoon' : 'unpaid';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative cursor-pointer"
            onClick={() => navigate(`/bills/${bill.id}`)}
        >
            {/* Glow Effect */}
            <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                isOverdue ? "bg-rose-500/20" : isPaid ? "bg-emerald-500/20" : "bg-blue-500/20"
            )} />

            <Card className="relative h-full overflow-hidden border border-white/10 bg-[#121629]/80 backdrop-blur-xl rounded-3xl transition-all duration-300 group-hover:border-white/20">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="p-6 flex flex-col h-full relative">
                    {/* Actions (Hover only) - Absolute Top Right */}
                    <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); onEdit?.(bill); }}>
                            <Edit2 size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full" onClick={(e) => { e.stopPropagation(); onDelete?.(bill); }}>
                            <Trash2 size={14} />
                        </Button>
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4 w-full">
                            <div className={cn(
                                "relative w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300",
                                !bill.provider_logo && "bg-[#1A1F3A] border border-white/5"
                            )}>
                                {bill.provider_logo ? (
                                    <img src={bill.provider_logo} alt={bill.provider_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="relative z-10">
                                        {CATEGORY_ICONS[bill.provider_category] || <Zap className="w-6 h-6 text-primary" />}
                                    </div>
                                )}
                                {!bill.provider_logo && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg text-white leading-tight break-words group-hover:text-primary transition-colors pr-12">
                                    {bill.bill_name}
                                </h3>
                                <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                    {bill.provider_name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Amount</p>
                                <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-500 font-sans">{bill.currency}</span>
                                    {formatCurrency(bill.fixed_amount || bill.estimated_amount || 0, bill.currency).replace(/[^0-9.,]/g, '')}
                                </div>
                                {bill.is_variable && (
                                    <p className="text-[10px] font-medium text-primary/80 mt-1 flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        Estimated Variable
                                    </p>
                                )}
                            </div>

                            {/* Status Badge - Right aligned next to amount */}
                            <div className={cn(
                                "px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md mb-1",
                                statusColors[currentStatus]
                            )}>
                                {isPaid ? <CheckCircle2 size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
                                {isPaid ? "Paid" : isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Upcoming"}
                            </div>
                        </div>

                        {/* Progress/Timeline Strip */}
                        <div className="relative h-1 w-full bg-[#1A1F3A] rounded-full overflow-hidden">
                            <motion.div
                                className={cn("absolute inset-y-0 left-0 rounded-full",
                                    isPaid ? "bg-emerald-500" : isOverdue ? "bg-rose-500" : "bg-primary"
                                )}
                                initial={{ width: "0%" }}
                                animate={{ width: isPaid ? "100%" : isOverdue ? "100%" : "60%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-500">
                                {bill.account_number_masked ? `Acct: •••• ${bill.account_number_masked.slice(-4)}` : 'No Account #'}
                            </span>
                            <span className={cn(
                                "flex items-center gap-1.5",
                                isOverdue ? "text-rose-400" : isDueSoon ? "text-amber-400" : "text-slate-400"
                            )}>
                                {bill.next_due_date ? new Date(bill.next_due_date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }) : `Due ${bill.due_day}${['st', 'nd', 'rd'][((bill.due_day + 90) % 100 - 10) % 10 - 1] || 'th'}`}
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                        {!isPaid ? (
                            <Button
                                className={cn(
                                    "w-full rounded-xl text-sm font-bold shadow-lg transition-all duration-300 group-hover:shadow-primary/25",
                                    isOverdue
                                        ? "bg-gradient-to-r from-rose-600 to-rose-500 hover:to-rose-400 text-white shadow-rose-500/20"
                                        : "bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-white shadow-primary/20"
                                )}
                                onClick={(e) => { e.stopPropagation(); onPay?.(bill); }}
                            >
                                <Zap className="w-4 h-4 mr-2 fill-current" />
                                {isOverdue ? "Pay Immediately" : "Pay Bill"}
                            </Button>
                        ) : (
                            <div className="w-full py-2.5 flex items-center justify-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                <CheckCircle2 className="w-4 h-4" />
                                Payment Complete
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
