// Bill Management Constants
// Categories, payment methods, and reminder presets for Malaysian bills

import type { BillCategory, BillPaymentMethod } from '../types/bills';

// Bill Categories
export const BILL_CATEGORIES: { value: BillCategory; label: string; icon: string; color: string }[] = [
    { value: 'Electricity', label: 'Electricity', icon: 'Zap', color: '#FFD700' },
    { value: 'Water', label: 'Water', icon: 'Droplet', color: '#0066CC' },
    { value: 'Sewerage', label: 'Sewerage', icon: 'Waves', color: '#0099CC' },
    { value: 'Internet', label: 'Internet & TV', icon: 'Wifi', color: '#FF0000' },
    { value: 'Mobile', label: 'Mobile & Phone', icon: 'Smartphone', color: '#82D243' },
    { value: 'TV', label: 'Streaming & Entertainment', icon: 'Tv', color: '#E50914' },
    { value: 'Insurance', label: 'Insurance', icon: 'Shield', color: '#ED1B24' },
    { value: 'Streaming', label: 'Streaming Services', icon: 'Play', color: '#1DB954' },
    { value: 'Other', label: 'Other Bills', icon: 'FileText', color: '#6B7280' },
];

// Payment Methods
export const PAYMENT_METHODS: { value: BillPaymentMethod; label: string; icon: string }[] = [
    { value: 'Online Banking', label: 'Online Banking', icon: 'Globe' },
    { value: 'Credit Card', label: 'Credit Card', icon: 'CreditCard' },
    { value: 'Auto Debit', label: 'Auto Debit', icon: 'Repeat' },
    { value: 'ATM', label: 'ATM', icon: 'Landmark' },
    { value: 'Cash', label: 'Cash', icon: 'Banknote' },
    { value: 'Other', label: 'Other', icon: 'MoreHorizontal' },
];

// Reminder Presets
export const REMINDER_PRESETS = [
    { days: 7, label: '7 days before', enabled: true },
    { days: 3, label: '3 days before', enabled: true },
    { days: 1, label: '1 day before', enabled: true },
    { days: 0, label: 'On due date', enabled: false },
];

// Default reminder days
export const DEFAULT_REMINDER_DAYS = [7, 3, 1];

// Payment Status Labels and Colors
export const PAYMENT_STATUS_CONFIG = {
    paid: {
        label: 'Paid',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: 'CheckCircle',
    },
    unpaid: {
        label: 'Unpaid',
        color: '#6B7280',
        bgColor: 'rgba(107, 116, 128, 0.1)',
        icon: 'Circle',
    },
    overdue: {
        label: 'Overdue',
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: 'AlertCircle',
    },
    partial: {
        label: 'Partial',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: 'AlertTriangle',
    },
};

// Bill Status Labels
export const BILL_STATUS_CONFIG = {
    active: {
        label: 'Active',
        color: '#10B981',
    },
    archived: {
        label: 'Archived',
        color: '#6B7280',
    },
};

// Currency Options
export const CURRENCY_OPTIONS = [
    { value: 'MYR', label: 'MYR (Malaysian Ringgit)', symbol: 'RM' },
    { value: 'USD', label: 'USD (US Dollar)', symbol: '$' },
    { value: 'SGD', label: 'SGD (Singapore Dollar)', symbol: 'S$' },
    { value: 'EUR', label: 'EUR (Euro)', symbol: '€' },
];

// Default currency
export const DEFAULT_CURRENCY = 'MYR';

// Due Day Options (common bill due dates)
export const DUE_DAY_PRESETS = [1, 5, 10, 15, 20, 25, 30];

// Helper functions
export function getBillCategoryConfig(category: BillCategory) {
    return BILL_CATEGORIES.find(c => c.value === category) || BILL_CATEGORIES[BILL_CATEGORIES.length - 1];
}

export function getPaymentMethodConfig(method: BillPaymentMethod) {
    return PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[PAYMENT_METHODS.length - 1];
}

export function getPaymentStatusConfig(status: string) {
    return PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG] || PAYMENT_STATUS_CONFIG.unpaid;
}

export function getCurrencySymbol(currency: string): string {
    const currencyConfig = CURRENCY_OPTIONS.find(c => c.value === currency);
    return currencyConfig?.symbol || 'RM';
}

// Calculate next due date based on due day
export function calculateNextDueDate(dueDay: number, fromDate: Date = new Date()): Date {
    const nextDue = new Date(fromDate);
    nextDue.setDate(dueDay);

    // If the due date has passed this month, move to next month
    if (nextDue <= fromDate) {
        nextDue.setMonth(nextDue.getMonth() + 1);
    }

    // Handle months with fewer days (e.g., Feb 30 -> Feb 28/29)
    if (nextDue.getDate() !== dueDay) {
        nextDue.setDate(0); // Set to last day of previous month
    }

    return nextDue;
}

// Calculate days until due
export function calculateDaysUntilDue(dueDate: Date | string): number {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

// Determine payment status based on due date and paid status
export function determinePaymentStatus(dueDate: Date | string, paidDate?: Date | string | null): 'paid' | 'unpaid' | 'overdue' {
    if (paidDate) {
        return 'paid';
    }

    const daysUntil = calculateDaysUntilDue(dueDate);

    if (daysUntil < 0) {
        return 'overdue';
    }

    return 'unpaid';
}

// Format bill amount display
export function formatBillAmount(amount: number, currency: string = 'MYR', isVariable: boolean = false): string {
    const symbol = getCurrencySymbol(currency);
    const formattedAmount = amount.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (isVariable) {
        return `~${symbol} ${formattedAmount}`;
    }

    return `${symbol} ${formattedAmount}`;
}
