import React from 'react';
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
    // Mock status logic (replace with real date math later)
    const isPaid = bill.status === 'paid';
    const isOverdue = bill.status === 'overdue';
    const isDueSoon = !isPaid && !isOverdue && (bill.days_until_due || 0) <= 7;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Card className={cn(
                "relative overflow-hidden border transition-all duration-300",
                isOverdue ? "border-red-500/50 shadow-red-500/10" :
                    isPaid ? "border-emerald-500/50" :
                        isDueSoon ? "border-amber-500/50 shadow-amber-500/10" :
                            "border-gray-200 dark:border-white/10"
            )}>
                {/* Status Strip */}
                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    isOverdue ? "bg-red-500" :
                        isPaid ? "bg-emerald-500" :
                            isDueSoon ? "bg-amber-500" : "bg-blue-500"
                )} />

                <div className="p-5 pl-7">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                                !bill.provider_logo && "bg-gradient-to-br from-gray-700 to-gray-900"
                            )}
                                style={{
                                    background: bill.provider_logo ? 'white' : undefined,
                                    // Use provider color if available, handled in parent or mock
                                }}
                            >
                                {bill.provider_logo ? (
                                    <img src={bill.provider_logo} alt={bill.provider_name} className="w-full h-full object-contain p-1" />
                                ) : (
                                    CATEGORY_ICONS[bill.provider_category] || <Calendar className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{bill.bill_name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {bill.provider_name} • {bill.account_number_masked || '****'}
                                </p>
                            </div>
                        </div>

                        {/* Actions Dropdown Trigger (Simplified to buttons for now) */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-500" onClick={() => onEdit?.(bill)}>
                                <Edit2 size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => onDelete?.(bill)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Amount</p>
                            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                                {bill.is_variable ? '~ ' : ''}
                                {formatCurrency(bill.fixed_amount || bill.estimated_amount || 0, bill.currency)}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Due Date</p>
                            <div className={cn(
                                "flex items-center gap-1.5 font-bold text-sm",
                                isOverdue ? "text-red-500" : isPaid ? "text-emerald-500" : isDueSoon ? "text-amber-500" : "text-slate-700 dark:text-slate-300"
                            )}>
                                <Clock size={14} />
                                {isPaid ? "Paid" : <span>{bill.due_day}{['st', 'nd', 'rd'][((bill.due_day + 90) % 100 - 10) % 10 - 1] || 'th'} of month</span>}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    {!isPaid && (
                        <Button
                            className={cn(
                                "w-full h-9",
                                isOverdue ? "bg-red-500 hover:bg-red-600 text-white" :
                                    isDueSoon ? "bg-amber-500 hover:bg-amber-600 text-white" :
                                        "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
                            )}
                            onClick={() => onPay?.(bill)}
                        >
                            {isOverdue ? "Pay Immediately" : "Mark as Paid"}
                        </Button>
                    )}
                    {isPaid && (
                        <div className="w-full h-9 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium">
                            <CheckCircle2 size={16} /> Paid
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
