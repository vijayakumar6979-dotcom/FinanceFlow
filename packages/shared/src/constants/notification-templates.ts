/**
 * Notification Template Identifiers
 * These must match the workflow identifiers created in Novu dashboard
 */

export const NOTIFICATION_TEMPLATES = {
    // Bill Notifications
    BILL_REMINDER: 'bill-reminder',
    BILL_OVERDUE: 'bill-overdue',
    BILL_PAID: 'bill-paid',

    // Budget Notifications
    BUDGET_ALERT_80: 'budget-alert-80',
    BUDGET_ALERT_90: 'budget-alert-90',
    BUDGET_EXCEEDED: 'budget-exceeded',

    // Goal Notifications
    GOAL_MILESTONE_25: 'goal-milestone-25',
    GOAL_MILESTONE_50: 'goal-milestone-50',
    GOAL_MILESTONE_75: 'goal-milestone-75',
    GOAL_ACHIEVED: 'goal-achieved',

    // Transaction Notifications
    LARGE_TRANSACTION: 'large-transaction',
    UNUSUAL_SPENDING: 'unusual-spending',

    // Loan Notifications
    LOAN_PAYMENT_DUE: 'loan-payment-due',
    LOAN_PAYMENT_OVERDUE: 'loan-payment-overdue',

    // Account Notifications
    LOW_BALANCE: 'low-balance',
    ACCOUNT_SUMMARY_DAILY: 'account-summary-daily',
    ACCOUNT_SUMMARY_WEEKLY: 'account-summary-weekly',
} as const

export type NotificationTemplate =
    (typeof NOTIFICATION_TEMPLATES)[keyof typeof NOTIFICATION_TEMPLATES]

/**
 * Notification Payload Types
 */

export interface BillReminderPayload {
    billName: string
    amount: number
    dueDate: string
    accountName: string
    daysUntilDue: number
}

export interface BudgetAlertPayload {
    budgetName: string
    category: string
    percentage: number
    spent: number
    limit: number
    remaining: number
}

export interface GoalMilestonePayload {
    goalName: string
    percentage: number
    currentAmount: number
    targetAmount: number
    remaining: number
}

export interface TransactionAlertPayload {
    amount: number
    merchant: string
    category: string
    accountName: string
    date: string
}

export interface LoanPaymentPayload {
    loanName: string
    amount: number
    dueDate: string
    accountName: string
    daysUntilDue?: number
}

export interface AccountSummaryPayload {
    totalBalance: number
    totalIncome: number
    totalExpenses: number
    netChange: number
    period: 'daily' | 'weekly'
    topExpenseCategory: string
}

export interface LowBalancePayload {
    accountName: string
    currentBalance: number
    threshold: number
}
