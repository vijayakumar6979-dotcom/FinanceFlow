import React from 'react';
import { Card } from '@/components/ui/Card';
import { useDashboard } from '@/context/DashboardContext';
import { format, isBefore, addDays } from 'date-fns';
import { formatCurrency } from '@financeflow/shared';
import { CalendarClock, AlertCircle, CheckCircle2 } from 'lucide-react';

const mockBills = [
    { id: 1, name: 'Maybank Car Loan', amount: 890, date: new Date(new Date().setDate(25)), status: 'pending', category: 'Loan' },
    { id: 2, name: 'TNB Electric', amount: 145, date: new Date(new Date().setDate(28)), status: 'pending', category: 'Utility' },
    { id: 3, name: 'Netflix', amount: 55, date: new Date(new Date().setDate(2)), status: 'paid', category: 'Subscription' }, // Next cycle effectively if calculated poorly, but sticking to visual demo
    { id: 4, name: 'Maxis WiFi', amount: 129, date: new Date(new Date().setDate(15)), status: 'overdue', category: 'Utility' },
];

export const UpcomingBillsWidget = () => {
    const { dateRange } = useDashboard();

    // Sort: Overdue first, then by date
    const sortedBills = [...mockBills].sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (b.status === 'overdue' && a.status !== 'overdue') return 1;
        return a.date.getTime() - b.date.getTime();
    });

    return (
        <Card className="col-span-12 lg:col-span-4 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-amber-400" />
                    Upcoming Bills
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                    Current Cycle
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {sortedBills.map((bill) => {
                    const isOverdue = bill.status === 'overdue';
                    const isPaid = bill.status === 'paid';

                    return (
                        <div
                            key={bill.id}
                            className={`p-4 rounded-2xl border transition-all hover:translate-x-1 ${isOverdue
                                    ? 'bg-rose-500/10 border-rose-500/20'
                                    : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-200">{bill.name}</span>
                                    <span className="text-xs text-slate-400">{bill.category}</span>
                                </div>
                                <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-white'}`}>
                                    {formatCurrency(bill.amount)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <CalendarClock size={12} />
                                    {format(bill.date, 'MMM do')}
                                </div>

                                {isPaid ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                        <CheckCircle2 size={12} /> Paid
                                    </span>
                                ) : isOverdue ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full animate-pulse">
                                        <AlertCircle size={12} /> Overdue
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Due</span>
                <span className="font-bold text-white font-mono">{formatCurrency(1164)}</span>
            </div>
        </Card>
    );
};
