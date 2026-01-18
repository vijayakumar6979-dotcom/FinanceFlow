import { useState } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';

interface BillCalendarEvent {
    id: string;
    billName: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    providerLogo?: string;
}

interface PaymentCalendarProps {
    isOpen: boolean;
    onClose: () => void;
    bills: any[];
}

export function PaymentCalendar({ isOpen, onClose, bills }: PaymentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!isOpen) return null;

    // Get calendar data for current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Group bills by date
    const billsByDate: Record<number, BillCalendarEvent[]> = {};
    bills.forEach(bill => {
        if (bill.due_day && bill.due_day <= daysInMonth) {
            if (!billsByDate[bill.due_day]) {
                billsByDate[bill.due_day] = [];
            }
            billsByDate[bill.due_day].push({
                id: bill.id,
                billName: bill.bill_name,
                amount: bill.fixed_amount || bill.estimated_amount || 0,
                status: bill.status || 'unpaid',
                providerLogo: bill.provider_logo
            });
        }
    });

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const selectedDayBills = selectedDate ? billsByDate[selectedDate.getDate()] || [] : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card
                className="bg-white dark:bg-[#121629] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                            <CalendarIcon size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Calendar</h2>
                            <p className="text-sm text-slate-500">View all bills by due date</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                        <X size={20} />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                        >
                            Previous
                        </Button>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {monthNames[month]} {year}
                        </h3>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                        >
                            Next
                        </Button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="mb-6">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const dayBills = billsByDate[day] || [];
                                const hasBills = dayBills.length > 0;
                                const isToday = new Date().getDate() === day &&
                                    new Date().getMonth() === month &&
                                    new Date().getFullYear() === year;
                                const isSelected = selectedDate?.getDate() === day;

                                const paidCount = dayBills.filter(b => b.status === 'paid').length;
                                const overdueCount = dayBills.filter(b => b.status === 'overdue').length;
                                const unpaidCount = dayBills.filter(b => b.status === 'unpaid').length;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(new Date(year, month, day))}
                                        className={`
                      aspect-square rounded-lg border-2 transition-all relative
                      ${isSelected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                                : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                            }
                      ${isToday ? 'ring-2 ring-blue-400' : ''}
                    `}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                {day}
                                            </span>
                                            {hasBills && (
                                                <div className="flex gap-0.5 mt-1">
                                                    {paidCount > 0 && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    )}
                                                    {unpaidCount > 0 && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    )}
                                                    {overdueCount > 0 && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Upcoming</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Overdue</span>
                        </div>
                    </div>

                    {/* Selected Date Bills */}
                    {selectedDate && (
                        <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                Bills due on {monthNames[month]} {selectedDate.getDate()}, {year}
                            </h4>
                            {selectedDayBills.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No bills due on this date</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedDayBills.map(bill => (
                                        <div
                                            key={bill.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                {bill.status === 'paid' && <CheckCircle size={20} className="text-green-500" />}
                                                {bill.status === 'unpaid' && <Clock size={20} className="text-blue-500" />}
                                                {bill.status === 'overdue' && <AlertCircle size={20} className="text-red-500" />}
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{bill.billName}</p>
                                                    <p className="text-sm text-slate-500 capitalize">{bill.status}</p>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(bill.amount, 'MYR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
