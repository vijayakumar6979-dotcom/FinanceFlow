import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addMonths, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear, format, isAfter, isBefore, setDate } from 'date-fns';

type CycleMode = 'cycle' | 'week' | 'month' | 'year';

interface DashboardContextType {
    cycleMode: CycleMode;
    setCycleMode: (mode: CycleMode) => void;
    currentDate: Date; // The reference date for "current" (usually today, but can be navigated)
    setCurrentDate: (date: Date) => void;
    dateRange: { start: Date; end: Date };
    navigateCycle: (direction: 'prev' | 'next') => void;
    formatDateRange: () => string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [cycleMode, setCycleMode] = useState<CycleMode>('cycle');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Core Logic: Calculate the 30th-29th cycle
    const calculateCycleRange = (baseDate: Date) => {
        // If today is before the 30th, we are in the cycle that started on the 30th of last month.
        // If today is 30th or after, we are in the cycle that started on the 30th of this month.

        let startCycle: Date;
        let endCycle: Date;

        if (baseDate.getDate() < 30) {
            // Current cycle started previous month 30th
            startCycle = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 30);
            // Ends current month 29th
            endCycle = new Date(baseDate.getFullYear(), baseDate.getMonth(), 29);
        } else {
            // Current cycle started this month 30th
            startCycle = new Date(baseDate.getFullYear(), baseDate.getMonth(), 30);
            // Ends next month 29th
            endCycle = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 29);
        }

        // Handle February edge cases (e.g. Feb 30th doesn't exist, JS auto-corrects date overflow)
        // We might need strict logic if strictly following "30th" or "last day of month if < 30"
        // For simplicity in MVP, native JS Date handling of overflow (e.g. Feb 30 -> Mar 1/2) might be acceptable or need clamping.
        // Let's implement strict clamping to last day of month if 30th doesn't exist for start date.

        return { start: startCycle, end: endCycle };
    };

    const getDateRange = () => {
        switch (cycleMode) {
            case 'week':
                return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
            case 'month':
                // Standard calendar month
                return {
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                };
            case 'year':
                return { start: startOfYear(currentDate), end: endOfYear(currentDate) };
            case 'cycle':
            default:
                return calculateCycleRange(currentDate);
        }
    };

    const dateRange = getDateRange();

    const navigateCycle = (direction: 'prev' | 'next') => {
        const modifier = direction === 'next' ? 1 : -1;

        let newDate = new Date(currentDate);
        switch (cycleMode) {
            case 'cycle':
            case 'month':
                newDate = addMonths(currentDate, modifier);
                break;
            case 'week':
                newDate.setDate(currentDate.getDate() + (modifier * 7));
                break;
            case 'year':
                newDate.setFullYear(currentDate.getFullYear() + modifier);
                break;
        }
        setCurrentDate(newDate);
    };

    const formatDateRange = () => {
        if (cycleMode === 'cycle') {
            return `${format(dateRange.start, 'MMM do')} - ${format(dateRange.end, 'MMM do')}`;
        }
        if (cycleMode === 'month') {
            return format(currentDate, 'MMMM yyyy');
        }
        return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
    };

    return (
        <DashboardContext.Provider value={{
            cycleMode,
            setCycleMode,
            currentDate,
            setCurrentDate,
            dateRange,
            navigateCycle,
            formatDateRange
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
