/**
 * Notification Helper Functions
 * Utility functions to trigger notifications from anywhere in the app
 */

import { triggerNotification, createSubscriber } from '../services/novu'
import { NOTIFICATION_TEMPLATES } from '../constants/notification-templates'
import type {
    BillReminderPayload,
    BudgetAlertPayload,
    GoalMilestonePayload,
    TransactionAlertPayload,
    LoanPaymentPayload,
    AccountSummaryPayload,
    LowBalancePayload,
} from '../constants/notification-templates'

/**
 * Send a bill reminder notification
 */
export async function sendBillReminder(
    userId: string,
    payload: BillReminderPayload
) {
    return triggerNotification(
        NOTIFICATION_TEMPLATES.BILL_REMINDER,
        userId,
        payload
    )
}

/**
 * Send a budget alert notification
 */
export async function sendBudgetAlert(
    userId: string,
    percentage: number,
    payload: BudgetAlertPayload
) {
    const template =
        percentage >= 100
            ? NOTIFICATION_TEMPLATES.BUDGET_EXCEEDED
            : percentage >= 90
                ? NOTIFICATION_TEMPLATES.BUDGET_ALERT_90
                : NOTIFICATION_TEMPLATES.BUDGET_ALERT_80

    return triggerNotification(template, userId, payload)
}

/**
 * Send a goal milestone notification
 */
export async function sendGoalMilestone(
    userId: string,
    percentage: number,
    payload: GoalMilestonePayload
) {
    const template =
        percentage >= 100
            ? NOTIFICATION_TEMPLATES.GOAL_ACHIEVED
            : percentage >= 75
                ? NOTIFICATION_TEMPLATES.GOAL_MILESTONE_75
                : percentage >= 50
                    ? NOTIFICATION_TEMPLATES.GOAL_MILESTONE_50
                    : NOTIFICATION_TEMPLATES.GOAL_MILESTONE_25

    return triggerNotification(template, userId, payload)
}

/**
 * Send a large transaction alert
 */
export async function sendTransactionAlert(
    userId: string,
    payload: TransactionAlertPayload
) {
    return triggerNotification(
        NOTIFICATION_TEMPLATES.LARGE_TRANSACTION,
        userId,
        payload
    )
}

/**
 * Send a loan payment reminder
 */
export async function sendLoanPaymentReminder(
    userId: string,
    payload: LoanPaymentPayload
) {
    const template =
        payload.daysUntilDue && payload.daysUntilDue < 0
            ? NOTIFICATION_TEMPLATES.LOAN_PAYMENT_OVERDUE
            : NOTIFICATION_TEMPLATES.LOAN_PAYMENT_DUE

    return triggerNotification(template, userId, payload)
}

/**
 * Send a low balance alert
 */
export async function sendLowBalanceAlert(
    userId: string,
    payload: LowBalancePayload
) {
    return triggerNotification(
        NOTIFICATION_TEMPLATES.LOW_BALANCE,
        userId,
        payload
    )
}

/**
 * Send an account summary
 */
export async function sendAccountSummary(
    userId: string,
    payload: AccountSummaryPayload
) {
    const template =
        payload.period === 'daily'
            ? NOTIFICATION_TEMPLATES.ACCOUNT_SUMMARY_DAILY
            : NOTIFICATION_TEMPLATES.ACCOUNT_SUMMARY_WEEKLY

    return triggerNotification(template, userId, payload)
}

/**
 * Initialize user as a Novu subscriber
 * Call this when a user signs up or logs in for the first time
 */
export async function initializeUserNotifications(
    userId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string
) {
    return createSubscriber(userId, email, firstName, lastName, phone)
}
