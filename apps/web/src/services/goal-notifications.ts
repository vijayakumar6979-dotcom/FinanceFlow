import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Goal, GoalMilestone, GoalContribution } from '@financeflow/shared';

// Firebase messaging instance (shared with budget notifications)
let messaging: any = null;

// Initialize Firebase Messaging (if not already initialized)
export const initializeFirebaseMessaging = async () => {
    try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const { app } = await import('@/services/firebase');
            messaging = getMessaging(app);

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                });
                return token;
            }
        }
    } catch (error) {
        console.error('Error initializing Firebase Messaging:', error);
    }
    return null;
};

// Goal Notification Types
export enum GoalNotificationType {
    MILESTONE_ACHIEVED = 'milestone_achieved',
    PROGRESS_UPDATE = 'progress_update',
    DEADLINE_REMINDER = 'deadline_reminder',
    CONTRIBUTION_REMINDER = 'contribution_reminder',
    GOAL_COMPLETED = 'goal_completed',
    GOAL_AT_RISK = 'goal_at_risk',
    MONTHLY_PROGRESS = 'monthly_progress',
}

interface GoalNotificationPayload {
    type: GoalNotificationType;
    goalId: string;
    goalName: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    icon?: string;
    badge?: string;
    tag?: string;
    actions?: Array<{ action: string; title: string }>;
}

/**
 * Send milestone achievement notification
 * Triggered when goal reaches 25%, 50%, 75%, or 100%
 */
export const sendMilestoneAchievedNotification = async (
    goal: Goal,
    milestone: GoalMilestone
): Promise<void> => {
    const progress = Math.round((goal.current_amount / goal.target_amount) * 100);

    let emoji = '🎯';
    let celebration = '';

    if (milestone.percentage >= 100 || milestone.target_amount >= goal.target_amount) {
        emoji = '🎉';
        celebration = ' Congratulations!';
    } else if (milestone.percentage >= 75) {
        emoji = '🌟';
        celebration = ' Almost there!';
    } else if (milestone.percentage >= 50) {
        emoji = '🚀';
        celebration = ' Halfway there!';
    } else if (milestone.percentage >= 25) {
        emoji = '✨';
        celebration = ' Great start!';
    }

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.MILESTONE_ACHIEVED,
        goalId: goal.id,
        goalName: goal.name,
        title: `${emoji} Milestone Achieved: ${goal.name}`,
        body: `${celebration} You've reached ${milestone.percentage}% of your goal! Current: RM ${goal.current_amount.toLocaleString()} / RM ${goal.target_amount.toLocaleString()}. Keep going!`,
        data: {
            goalId: goal.id,
            milestoneId: milestone.id,
            percentage: milestone.percentage,
            currentAmount: goal.current_amount,
            targetAmount: goal.target_amount,
        },
        icon: goal.emoji || emoji,
        badge: '/badge-icon.png',
        tag: `goal-${goal.id}-milestone-${milestone.percentage}`,
        actions: [
            { action: 'view', title: 'View Goal' },
            { action: 'contribute', title: 'Add More' },
        ],
    };

    await sendNotification(notification);

    // Show confetti animation if 100% reached
    if (progress >= 100) {
        triggerConfettiCelebration();
    }
};

/**
 * Send progress update notification
 * Triggered after each contribution
 */
export const sendProgressUpdateNotification = async (
    goal: Goal,
    contribution: GoalContribution,
    newProgress: number
): Promise<void> => {
    const remaining = goal.target_amount - goal.current_amount;
    const targetDate = new Date(goal.target_date);
    const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.PROGRESS_UPDATE,
        goalId: goal.id,
        goalName: goal.name,
        title: `💰 Contribution Added: ${goal.name}`,
        body: `+RM ${contribution.amount.toLocaleString()} added! Progress: ${newProgress}% (RM ${goal.current_amount.toLocaleString()} / RM ${goal.target_amount.toLocaleString()}). ${remaining > 0
                ? `RM ${remaining.toLocaleString()} to go in ${daysLeft} days.`
                : 'Goal achieved!'
            }`,
        data: {
            goalId: goal.id,
            contributionId: contribution.id,
            contributionAmount: contribution.amount,
            newProgress,
            remaining,
            daysLeft,
        },
        icon: goal.emoji || '💰',
        tag: `goal-${goal.id}-progress`,
    };

    await sendNotification(notification);
};

/**
 * Send deadline reminder notification
 * Triggered 30 days, 7 days, and 1 day before target date
 */
export const sendDeadlineReminderNotification = async (
    goal: Goal,
    daysLeft: number
): Promise<void> => {
    const progress = Math.round((goal.current_amount / goal.target_amount) * 100);
    const remaining = goal.target_amount - goal.current_amount;
    const dailyRequired = remaining / daysLeft;

    let emoji = '⏰';
    let urgency = '';

    if (daysLeft <= 1) {
        emoji = '🚨';
        urgency = 'URGENT: ';
    } else if (daysLeft <= 7) {
        emoji = '⚠️';
        urgency = 'Important: ';
    }

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.DEADLINE_REMINDER,
        goalId: goal.id,
        goalName: goal.name,
        title: `${emoji} ${urgency}Goal Deadline: ${goal.name}`,
        body: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left! Progress: ${progress}%. ${remaining > 0
                ? `Need RM ${remaining.toLocaleString()} more (RM ${dailyRequired.toFixed(0)}/day).`
                : 'You\'re ahead of schedule!'
            }`,
        data: {
            goalId: goal.id,
            daysLeft,
            progress,
            remaining,
            dailyRequired,
        },
        icon: goal.emoji || emoji,
        tag: `goal-${goal.id}-deadline-${daysLeft}`,
        actions: [
            { action: 'contribute', title: 'Contribute Now' },
            { action: 'adjust', title: 'Adjust Goal' },
        ],
    };

    await sendNotification(notification);
};

/**
 * Send contribution reminder notification
 * Triggered based on auto-contribute settings (weekly, biweekly, monthly)
 */
export const sendContributionReminderNotification = async (
    goal: Goal,
    suggestedAmount: number
): Promise<void> => {
    const progress = Math.round((goal.current_amount / goal.target_amount) * 100);
    const targetDate = new Date(goal.target_date);
    const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.CONTRIBUTION_REMINDER,
        goalId: goal.id,
        goalName: goal.name,
        title: `💡 Time to Contribute: ${goal.name}`,
        body: `Don't forget your ${goal.auto_contribute_frequency || 'regular'} contribution! Suggested: RM ${suggestedAmount.toLocaleString()}. Progress: ${progress}% with ${daysLeft} days left.`,
        data: {
            goalId: goal.id,
            suggestedAmount,
            progress,
            daysLeft,
            frequency: goal.auto_contribute_frequency,
        },
        icon: goal.emoji || '💡',
        tag: `goal-${goal.id}-reminder`,
        actions: [
            { action: 'contribute', title: `Add RM ${suggestedAmount}` },
            { action: 'skip', title: 'Skip This Time' },
        ],
    };

    await sendNotification(notification);
};

/**
 * Send goal completed notification
 * Triggered when goal reaches 100% or target amount
 */
export const sendGoalCompletedNotification = async (
    goal: Goal,
    completionDate: string
): Promise<void> => {
    const daysEarly = Math.ceil((new Date(goal.target_date).getTime() - new Date(completionDate).getTime()) / (1000 * 60 * 60 * 24));
    const earlyText = daysEarly > 0 ? ` ${daysEarly} days early!` : '!';

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.GOAL_COMPLETED,
        goalId: goal.id,
        goalName: goal.name,
        title: `🎉 Goal Completed: ${goal.name}`,
        body: `Congratulations! You've achieved your goal of RM ${goal.target_amount.toLocaleString()}${earlyText} Time to celebrate and set your next goal! 🎊`,
        data: {
            goalId: goal.id,
            completionDate,
            targetAmount: goal.target_amount,
            daysEarly,
        },
        icon: goal.emoji || '🎉',
        badge: '/badge-icon.png',
        tag: `goal-${goal.id}-completed`,
        actions: [
            { action: 'celebrate', title: 'View Achievement' },
            { action: 'new-goal', title: 'Set New Goal' },
        ],
    };

    await sendNotification(notification);
    triggerConfettiCelebration();
};

/**
 * Send goal at risk notification
 * Triggered when goal is unlikely to be achieved by target date
 */
export const sendGoalAtRiskNotification = async (
    goal: Goal,
    requiredDailyContribution: number,
    feasibilityScore: number
): Promise<void> => {
    const progress = Math.round((goal.current_amount / goal.target_amount) * 100);
    const remaining = goal.target_amount - goal.current_amount;

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.GOAL_AT_RISK,
        goalId: goal.id,
        goalName: goal.name,
        title: `⚠️ Goal At Risk: ${goal.name}`,
        body: `Your goal may be at risk! Progress: ${progress}%. To stay on track, you need to save RM ${requiredDailyContribution.toFixed(0)}/day. Consider adjusting your target date or increasing contributions.`,
        data: {
            goalId: goal.id,
            progress,
            remaining,
            requiredDailyContribution,
            feasibilityScore,
        },
        icon: goal.emoji || '⚠️',
        tag: `goal-${goal.id}-at-risk`,
        actions: [
            { action: 'adjust-date', title: 'Extend Deadline' },
            { action: 'contribute', title: 'Contribute More' },
        ],
    };

    await sendNotification(notification);
};

/**
 * Send monthly progress report
 * Triggered on 1st of each month
 */
export const sendMonthlyProgressReport = async (
    goals: Goal[],
    totalContributions: number,
    goalsOnTrack: number
): Promise<void> => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const totalProgress = activeGoals.reduce((sum, g) => sum + (g.current_amount / g.target_amount) * 100, 0) / activeGoals.length;

    const notification: GoalNotificationPayload = {
        type: GoalNotificationType.MONTHLY_PROGRESS,
        goalId: 'all',
        goalName: 'Monthly Report',
        title: '📊 Monthly Goals Report',
        body: `Great work this month! You contributed RM ${totalContributions.toLocaleString()} across ${activeGoals.length} goals. ${goalsOnTrack} goal${goalsOnTrack !== 1 ? 's' : ''} on track. Average progress: ${totalProgress.toFixed(0)}%. Keep it up!`,
        data: {
            totalContributions,
            activeGoals: activeGoals.length,
            goalsOnTrack,
            averageProgress: totalProgress,
        },
        icon: '📊',
        tag: 'monthly-goals-report',
    };

    await sendNotification(notification);
};

/**
 * Core function to send notification via Firebase Cloud Messaging
 */
const sendNotification = async (payload: GoalNotificationPayload): Promise<void> => {
    try {
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(payload.title, {
                body: payload.body,
                icon: payload.icon || '/logo.png',
                badge: payload.badge || '/badge-icon.png',
                tag: payload.tag,
                data: payload.data,
                requireInteraction: payload.type === GoalNotificationType.GOAL_COMPLETED,
            });

            // Handle notification actions
            if (payload.actions) {
                notification.onclick = () => {
                    window.focus();
                    window.location.href = `/goals/${payload.goalId}`;
                };
            }
        }

        // Log notification for debugging
        console.log('Goal Notification Sent:', payload);

        // TODO: Send to backend for FCM delivery to mobile devices
        // await fetch('/api/notifications/send', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload),
        // });
    } catch (error) {
        console.error('Error sending goal notification:', error);
    }
};

/**
 * Trigger confetti celebration animation
 */
const triggerConfettiCelebration = (): void => {
    // Dispatch custom event for confetti animation
    window.dispatchEvent(new CustomEvent('goal-celebration', {
        detail: { type: 'confetti' }
    }));
};

/**
 * Schedule goal notifications based on settings
 */
export const scheduleGoalNotifications = (goal: Goal): void => {
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Deadline reminders
    if (daysLeft === 30 || daysLeft === 7 || daysLeft === 1) {
        sendDeadlineReminderNotification(goal, daysLeft);
    }

    // Contribution reminders (based on auto-contribute settings)
    if (goal.auto_contribute_enabled && goal.auto_contribute_amount) {
        const today = new Date().getDay();
        const dayOfMonth = new Date().getDate();

        if (
            (goal.auto_contribute_frequency === 'weekly' && today === (goal.auto_contribute_day || 1)) ||
            (goal.auto_contribute_frequency === 'biweekly' && today === (goal.auto_contribute_day || 1) && Math.floor(dayOfMonth / 7) % 2 === 0) ||
            (goal.auto_contribute_frequency === 'monthly' && dayOfMonth === (goal.auto_contribute_day || 1))
        ) {
            sendContributionReminderNotification(goal, goal.auto_contribute_amount);
        }
    }

    // At-risk check
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const remaining = goal.target_amount - goal.current_amount;
    const requiredDaily = remaining / Math.max(1, daysLeft);

    if (daysLeft < 30 && progress < 50 && requiredDaily > goal.auto_contribute_amount!) {
        sendGoalAtRiskNotification(goal, requiredDaily, progress);
    }
};
