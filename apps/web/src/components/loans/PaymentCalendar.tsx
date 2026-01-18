import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@financeflow/shared';

interface PaymentEvent {
    id: string;
    loanName: string;
    amount: number;
    date: Date;
    status: 'upcoming' | 'due-soon' | 'overdue' | 'paid';
    lenderColor?: string;
}

interface PaymentCalendarProps {
    payments: PaymentEvent[];
}

export function PaymentCalendar({ payments }: PaymentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getPaymentsForDay = (day: number): PaymentEvent[] => {
        return payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return (
                paymentDate.getDate() === day &&
                paymentDate.getMonth() === currentDate.getMonth() &&
                paymentDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const getStatusColor = (status: PaymentEvent['status']) => {
        switch (status) {
            case 'paid': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'due-soon': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            case 'overdue': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
            default: return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
        }
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square p-2" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayPayments = getPaymentsForDay(day);
            const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square p-2 rounded-lg border transition-colors cursor-pointer ${isToday
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30'
                        }`}
                >
                    <div className="h-full flex flex-col">
                        <span className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300'
                            }`}>
                            {day}
                        </span>

                        {dayPayments.length > 0 && (
                            <div className="flex-1 space-y-1 overflow-hidden">
                                {dayPayments.slice(0, 2).map((payment, index) => (
                                    <div
                                        key={payment.id}
                                        className={`text-xs px-1.5 py-0.5 rounded truncate ${getStatusColor(payment.status)}`}
                                        style={{
                                            borderLeft: payment.lenderColor ? `3px solid ${payment.lenderColor}` : undefined
                                        }}
                                    >
                                        {formatCurrency(payment.amount)}
                                    </div>
                                ))}
                                {dayPayments.length > 2 && (
                                    <div className="text-xs text-slate-500 dark:text-gray-400 px-1.5">
                                        +{dayPayments.length - 2} more
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const upcomingCount = payments.filter(p => p.status === 'upcoming' || p.status === 'due-soon').length;

    return (
        <Card className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                        <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Payment Calendar
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            {upcomingCount} payment{upcomingCount !== 1 ? 's' : ''} this month
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white min-w-[140px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-gray-300">Total Payments This Month:</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(totalPayments)}
                </span>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-xs text-slate-600 dark:text-gray-300">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-xs text-slate-600 dark:text-gray-300">Due Soon</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-xs text-slate-600 dark:text-gray-300">Paid</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-xs text-slate-600 dark:text-gray-300">Overdue</span>
                </div>
            </div>
        </Card>
    );
}
