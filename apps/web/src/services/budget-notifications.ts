import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Budget, BudgetPeriod } from '@financeflow/shared';

// Firebase messaging instance
let messaging: any = null;

// Initialize Firebase Messaging
export const initializeFirebaseMessaging = async () => {
    try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const { app } = await import('@/services/firebase');
            messaging = getMessaging(app);

            // Request permission for notifications
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                });
                console.log('FCM Token:', token);
                return token;
            }
        }
    } catch (error) {
        console.error('Error initializing Firebase Messaging:', error);
    }
    return null;
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
    if (messaging) {
        return onMessage(messaging, callback);
    }
};

// Budget Notification Types
export enum BudgetNotificationType {
    THRESHOLD_ALERT = 'threshold_alert',
    DAILY_SUMMARY = 'daily_summary',
    WEEKLY_REVIEW = 'weekly_review',
    MONTH_END_SUMMARY = 'month_end_summary',
    BUDGET_EXCEEDED = 'budget_exceeded',
    ROLLOVER_NOTIFICATION = 'rollover_notification',
}

interface BudgetNotificationPayload {
    type: BudgetNotificationType;
    budgetId: string;
    budgetName: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    icon?: string;
    badge?: string;
    tag?: string;
}

/**
 * Send budget threshold alert notification
 * Triggered when budget reaches 75%, 90%, or 100% of allocated amount
 */
export const sendBudgetThresholdAlert = async (
    budget: Budget,
    period: BudgetPeriod,
    threshold: number
): Promise<void> => {
    const percentage = Math.round((period.spent_amount / budget.amount) * 100);

    let emoji = '⚠️';
    let urgency = 'warning';

    if (percentage >= 100) {
        emoji = '🚨';
        urgency = 'critical';
    } else if (percentage >= 90) {
        emoji = '⚠️';
        urgency = 'high';
    }

    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.THRESHOLD_ALERT,
        budgetId: budget.id,
        budgetName: budget.name,
        title: `${emoji} Budget Alert: ${budget.name}`,
        body: `You've spent ${percentage}% (RM ${period.spent_amount.toLocaleString()}) of your RM ${budget.amount.toLocaleString()} budget. ${percentage >= 100
                ? 'Budget exceeded!'
                : `RM ${(budget.amount - period.spent_amount).toLocaleString()} remaining.`
            }`,
        data: {
            budgetId: budget.id,
            percentage,
            spent: period.spent_amount,
            total: budget.amount,
            urgency,
        },
        icon: budget.emoji || '💰',
        badge: '/badge-icon.png',
        tag: `budget-${budget.id}-threshold`,
    };

    await sendNotification(notification);
};

/**
 * Send daily budget summary
 * Triggered at end of day (8 PM) to show spending summary
 */
export const sendDailySummary = async (
    budgets: Budget[],
    periods: BudgetPeriod[],
    todaySpending: number
): Promise<void> => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = periods.reduce((sum, p) => sum + p.spent_amount, 0);
    const onTrackCount = periods.filter(p => p.status === 'on_track').length;
    const atRiskCount = periods.filter(p => ['warning', 'critical', 'exceeded'].includes(p.status)).length;

    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.DAILY_SUMMARY,
        budgetId: 'all',
        budgetName: 'Daily Summary',
        title: '📊 Daily Budget Summary',
        body: `Today's spending: RM ${todaySpending.toLocaleString()}. ${onTrackCount > 0 ? `${onTrackCount} budgets on track. ` : ''
            }${atRiskCount > 0 ? `${atRiskCount} need attention. ` : ''
            }Total: RM ${totalSpent.toLocaleString()} / RM ${totalBudget.toLocaleString()}`,
        data: {
            todaySpending,
            totalBudget,
            totalSpent,
            onTrackCount,
            atRiskCount,
        },
        icon: '📊',
        tag: 'daily-summary',
    };

    await sendNotification(notification);
};

/**
 * Send weekly budget review
 * Triggered every Sunday at 6 PM
 */
export const sendWeeklyReview = async (
    budgets: Budget[],
    periods: BudgetPeriod[],
    weeklySpending: number,
    weeklyAverage: number
): Promise<void> => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = periods.reduce((sum, p) => sum + p.spent_amount, 0);
    const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

    const trend = weeklySpending > weeklyAverage ? '📈 Up' : weeklySpending < weeklyAverage ? '📉 Down' : '➡️ Stable';
    const trendPercentage = weeklyAverage > 0
        ? Math.abs(Math.round(((weeklySpending - weeklyAverage) / weeklyAverage) * 100))
        : 0;

    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.WEEKLY_REVIEW,
        budgetId: 'all',
        budgetName: 'Weekly Review',
        title: '📅 Weekly Budget Review',
        body: `This week: RM ${weeklySpending.toLocaleString()} (${trend} ${trendPercentage}% from avg). Overall: ${percentageUsed}% of monthly budget used. ${percentageUsed > 75 ? 'Consider slowing down spending.' : 'Great progress!'
            }`,
        data: {
            weeklySpending,
            weeklyAverage,
            totalBudget,
            totalSpent,
            percentageUsed,
            trend,
        },
        icon: '📅',
        tag: 'weekly-review',
    };

    await sendNotification(notification);
};

/**
 * Send month-end budget summary
 * Triggered on last day of month at 8 PM
 */
export const sendMonthEndSummary = async (
    budgets: Budget[],
    periods: BudgetPeriod[],
    monthlySpending: number,
    savingsAmount: number
): Promise<void> => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = periods.reduce((sum, p) => sum + p.spent_amount, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

    const performanceEmoji = percentageUsed <= 90 ? '🎉' : percentageUsed <= 100 ? '✅' : '⚠️';
    const performanceText = percentageUsed <= 90
        ? 'Excellent budget management!'
        : percentageUsed <= 100
            ? 'You stayed within budget!'
            : 'Budget exceeded this month.';

    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.MONTH_END_SUMMARY,
        budgetId: 'all',
        budgetName: 'Month End Summary',
        title: `${performanceEmoji} Month-End Budget Report`,
        body: `${performanceText} Spent: RM ${totalSpent.toLocaleString()} (${percentageUsed}%). ${remaining > 0
                ? `Saved: RM ${remaining.toLocaleString()}. `
                : `Over by: RM ${Math.abs(remaining).toLocaleString()}. `
            }Keep up the good work!`,
        data: {
            totalBudget,
            totalSpent,
            remaining,
            percentageUsed,
            savingsAmount,
            monthlySpending,
        },
        icon: performanceEmoji,
        tag: 'month-end-summary',
    };

    await sendNotification(notification);
};

/**
 * Send budget exceeded notification
 * Triggered immediately when budget is exceeded
 */
export const sendBudgetExceededAlert = async (
    budget: Budget,
    period: BudgetPeriod,
    excessAmount: number
): Promise<void> => {
    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.BUDGET_EXCEEDED,
        budgetId: budget.id,
        budgetName: budget.name,
        title: `🚨 Budget Exceeded: ${budget.name}`,
        body: `You've exceeded your ${budget.name} budget by RM ${excessAmount.toLocaleString()}. Total spent: RM ${period.spent_amount.toLocaleString()} of RM ${budget.amount.toLocaleString()}. Consider adjusting your spending.`,
        data: {
            budgetId: budget.id,
            excessAmount,
            spent: period.spent_amount,
            total: budget.amount,
        },
        icon: '🚨',
        badge: '/badge-icon.png',
        tag: `budget-${budget.id}-exceeded`,
    };

    await sendNotification(notification);
};

/**
 * Send rollover notification
 * Triggered when budget period ends and rollover is enabled
 */
export const sendRolloverNotification = async (
    budget: Budget,
    rolloverAmount: number,
    newPeriodStart: string
): Promise<void> => {
    const notification: BudgetNotificationPayload = {
        type: BudgetNotificationType.ROLLOVER_NOTIFICATION,
        budgetId: budget.id,
        budgetName: budget.name,
        title: `💰 Budget Rollover: ${budget.name}`,
        body: `RM ${rolloverAmount.toLocaleString()} has been rolled over to your new ${budget.period} budget starting ${new Date(newPeriodStart).toLocaleDateString()}. New total: RM ${(budget.amount + rolloverAmount).toLocaleString()}.`,
        data: {
            budgetId: budget.id,
            rolloverAmount,
            newPeriodStart,
            newTotal: budget.amount + rolloverAmount,
        },
        icon: '💰',
        tag: `budget-${budget.id}-rollover`,
    };

    await sendNotification(notification);
};

/**
 * Core function to send notification via Firebase Cloud Messaging
 */
const sendNotification = async (payload: BudgetNotificationPayload): Promise<void> => {
    try {
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(payload.title, {
                body: payload.body,
                icon: payload.icon || '/logo.png',
                badge: payload.badge || '/badge-icon.png',
                tag: payload.tag,
                data: payload.data,
                requireInteraction: payload.type === BudgetNotificationType.BUDGET_EXCEEDED,
            });
        }

        // Log notification for debugging
        console.log('Budget Notification Sent:', payload);

        // TODO: Send to backend for FCM delivery to mobile devices
        // await fetch('/api/notifications/send', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload),
        // });
    } catch (error) {
        console.error('Error sending budget notification:', error);
    }
};

/**
 * Schedule notifications based on budget settings
 */
export const scheduleBudgetNotifications = (budget: Budget, period: BudgetPeriod): void => {
    // Check threshold alerts
    if (budget.notifications_enabled && budget.alert_thresholds) {
        const percentage = (period.spent_amount / budget.amount) * 100;

        budget.alert_thresholds.forEach(threshold => {
            if (percentage >= threshold && percentage < threshold + 5) {
                // Send alert if just crossed threshold (within 5% margin)
                sendBudgetThresholdAlert(budget, period, threshold);
            }
        });
    }

    // Check if exceeded
    if (period.spent_amount > budget.amount) {
        const excessAmount = period.spent_amount - budget.amount;
        sendBudgetExceededAlert(budget, period, excessAmount);
    }
};
