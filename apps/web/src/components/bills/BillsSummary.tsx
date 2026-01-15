import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';
import { CheckCircle2, Clock, AlertTriangle, Receipt } from 'lucide-react';

interface BillsSummaryProps {
    totalMonthly: number;
    dueAmount: number;
    paidAmount: number;
    overdueAmount: number;
    dueCount: number;
    paidCount: number;
    overdueCount: number;
}

export function BillsSummary({
    totalMonthly, dueAmount, paidAmount, overdueAmount,
    dueCount, paidCount, overdueCount
}: BillsSummaryProps) {
    const cards = [
        {
            label: "Total Monthly",
            amount: totalMonthly,
            count: null,
            icon: Receipt,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Due Soon",
            amount: dueAmount,
            count: dueCount,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Paid",
            amount: paidAmount,
            count: paidCount,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Overdue",
            amount: overdueAmount,
            count: overdueCount,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10",
            animate: overdueCount > 0
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <Card key={idx} className="p-4 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                            <card.icon size={20} className={card.animate ? "animate-pulse" : ""} />
                        </div>
                        {card.count !== null && (
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                                {card.count} bills
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(card.amount, 'MYR')}
                        </h3>
                    </div>
                </Card>
            ))}
        </div>
    );
}
