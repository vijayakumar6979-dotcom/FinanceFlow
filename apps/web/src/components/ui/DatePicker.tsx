import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useClickOutside } from './utils/useClickOutside';

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    label?: string;
    error?: string;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    label,
    error,
    // minDate,
    // maxDate,
    className
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleSelect = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative mb-4", className)} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-12 bg-white dark:bg-dark-surface border rounded-xl flex items-center px-4 cursor-pointer transition-all duration-200",
                    isOpen ? "ring-2 ring-primary-500/20 border-primary-500" : "border-gray-200 dark:border-white/10 hover:border-primary-300",
                    error && "border-red-500"
                )}
            >
                <CalendarIcon size={20} className="text-gray-400 mr-2" />
                <span className={cn("flex-grow", !value && "text-gray-400")}>
                    {value ? format(value, 'MMM dd, yyyy') : 'Select date'}
                </span>
            </div>

            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute z-50 mt-1 p-4 bg-white dark:bg-dark-elevated border border-gray-100 dark:border-white/10 rounded-xl shadow-xl w-72"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                            </button>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day) => {
                                const isSelected = value && isSameDay(day, value);
                                const isCurrentMonth = isSameMonth(day, currentMonth);

                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => handleSelect(day)}
                                        className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors",
                                            isSelected
                                                ? "bg-primary-500 text-white shadow-glow-blue"
                                                : isToday(day)
                                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold"
                                                    : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white",
                                            !isCurrentMonth && "invisible"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
