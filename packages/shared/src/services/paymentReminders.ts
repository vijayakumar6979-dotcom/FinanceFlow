/**
 * Payment Reminder Service
 * Generates and sends payment reminders for upcoming loan payments
 * Integrates with Firebase Cloud Messaging for push notifications
 */

import { supabase } from './supabase';

interface PaymentReminder {
    loanId: string;
    loanName: string;
    amount: number;
    dueDate: Date;
    daysUntilDue: number;
    reminderType: '7_days' | '3_days' | '1_day' | 'due_today' | 'overdue';
    priority: 'low' | 'medium' | 'high' | 'urgent';
}

export class PaymentReminderService {
    /**
     * Get all upcoming payment reminders for a user
     */
    static async getUpcomingReminders(userId: string): Promise<PaymentReminder[]> {
        const { data: loans, error } = await supabase
            .from('loans')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error || !loans) {
            console.error('Error fetching loans:', error);
            return [];
        }

        const reminders: PaymentReminder[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const loan of loans) {
            const dueDay = loan.payment_day;
            const nextDueDate = this.calculateNextDueDate(dueDay);
            const daysUntilDue = Math.floor((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Determine reminder type and priority
            let reminderType: PaymentReminder['reminderType'];
            let priority: PaymentReminder['priority'];

            if (daysUntilDue < 0) {
                reminderType = 'overdue';
                priority = 'urgent';
            } else if (daysUntilDue === 0) {
                reminderType = 'due_today';
                priority = 'urgent';
            } else if (daysUntilDue === 1) {
                reminderType = '1_day';
                priority = 'high';
            } else if (daysUntilDue === 3) {
                reminderType = '3_days';
                priority = 'medium';
            } else if (daysUntilDue === 7) {
                reminderType = '7_days';
                priority = 'low';
            } else {
                continue; // Skip if not a reminder day
            }

            reminders.push({
                loanId: loan.id,
                loanName: loan.loan_name || loan.name,
                amount: loan.monthly_payment,
                dueDate: nextDueDate,
                daysUntilDue,
                reminderType,
                priority
            });
        }

        // Sort by priority (urgent first)
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        reminders.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        return reminders;
    }

    /**
     * Calculate next due date based on payment day
     */
    private static calculateNextDueDate(paymentDay: number): Date {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let nextDueDate: Date;

        if (currentDay <= paymentDay) {
            // Due date is this month
            nextDueDate = new Date(currentYear, currentMonth, paymentDay);
        } else {
            // Due date is next month
            nextDueDate = new Date(currentYear, currentMonth + 1, paymentDay);
        }

        nextDueDate.setHours(0, 0, 0, 0);
        return nextDueDate;
    }

    /**
     * Generate notification message for a reminder
     */
    static generateNotificationMessage(reminder: PaymentReminder): {
        title: string;
        body: string;
        icon: string;
    } {
        const formattedAmount = new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(reminder.amount);

        let title: string;
        let body: string;
        let icon: string;

        switch (reminder.reminderType) {
            case 'overdue':
                title = '🚨 Payment Overdue!';
                body = `Your ${reminder.loanName} payment of ${formattedAmount} is overdue. Pay now to avoid late fees.`;
                icon = '🚨';
                break;

            case 'due_today':
                title = '⏰ Payment Due Today';
                body = `Don't forget! ${reminder.loanName} payment of ${formattedAmount} is due today.`;
                icon = '⏰';
                break;

            case '1_day':
                title = '📅 Payment Due Tomorrow';
                body = `Reminder: ${reminder.loanName} payment of ${formattedAmount} is due tomorrow.`;
                icon = '📅';
                break;

            case '3_days':
                title = '📆 Payment Due in 3 Days';
                body = `Upcoming: ${reminder.loanName} payment of ${formattedAmount} is due in 3 days.`;
                icon = '📆';
                break;

            case '7_days':
                title = '📌 Payment Due in 7 Days';
                body = `Heads up! ${reminder.loanName} payment of ${formattedAmount} is due next week.`;
                icon = '📌';
                break;

            default:
                title = 'Payment Reminder';
                body = `${reminder.loanName} payment of ${formattedAmount} is coming up.`;
                icon = '💰';
        }

        return { title, body, icon };
    }

    /**
     * Send push notification via Firebase Cloud Messaging
     */
    static async sendPushNotification(
        userId: string,
        reminder: PaymentReminder,
        _fcmToken: string
    ): Promise<boolean> {
        const message = this.generateNotificationMessage(reminder);

        try {
            // This would integrate with Firebase Admin SDK
            // For now, we'll create a notification record in the database
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    title: message.title,
                    message: message.body,
                    type: 'loan_payment_reminder',
                    category: 'loans',
                    priority: reminder.priority,
                    metadata: {
                        loanId: reminder.loanId,
                        loanName: reminder.loanName,
                        amount: reminder.amount,
                        dueDate: reminder.dueDate.toISOString(),
                        reminderType: reminder.reminderType
                    },
                    is_read: false,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error creating notification:', error);
                return false;
            }

            // TODO: Integrate with Firebase Cloud Messaging
            // const admin = require('firebase-admin');
            // await admin.messaging().send({
            //     token: fcmToken,
            //     notification: {
            //         title: message.title,
            //         body: message.body
            //     },
            //     data: {
            //         loanId: reminder.loanId,
            //         type: 'payment_reminder'
            //     }
            // });

            return true;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }

    /**
     * Check and send reminders for all users (to be called by cron job)
     */
    static async processAllReminders(): Promise<{
        processed: number;
        sent: number;
        failed: number;
    }> {
        let processed = 0;
        let sent = 0;
        let failed = 0;

        try {
            // Get all users with active loans
            const { data: users, error } = await supabase
                .from('profiles')
                .select('id, fcm_token')
                .not('fcm_token', 'is', null);

            if (error || !users) {
                console.error('Error fetching users:', error);
                return { processed, sent, failed };
            }

            for (const user of users) {
                processed++;

                const reminders = await this.getUpcomingReminders(user.id);

                for (const reminder of reminders) {
                    const success = await this.sendPushNotification(
                        user.id,
                        reminder,
                        user.fcm_token
                    );

                    if (success) {
                        sent++;
                    } else {
                        failed++;
                    }
                }
            }
        } catch (error) {
            console.error('Error processing reminders:', error);
        }

        return { processed, sent, failed };
    }

    /**
     * Get reminder settings for a user
     */
    static async getReminderSettings(userId: string): Promise<{
        enabled: boolean;
        reminderDays: number[];
        notificationMethod: 'push' | 'email' | 'both';
    }> {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('notification_settings')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            // Return defaults
            return {
                enabled: true,
                reminderDays: [7, 3, 1],
                notificationMethod: 'push'
            };
        }

        const settings = profile.notification_settings || {};
        return {
            enabled: settings.loan_reminders_enabled ?? true,
            reminderDays: settings.loan_reminder_days || [7, 3, 1],
            notificationMethod: settings.notification_method || 'push'
        };
    }

    /**
     * Update reminder settings for a user
     */
    static async updateReminderSettings(
        userId: string,
        settings: {
            enabled?: boolean;
            reminderDays?: number[];
            notificationMethod?: 'push' | 'email' | 'both';
        }
    ): Promise<boolean> {
        try {
            // Get current settings
            const { data: profile } = await supabase
                .from('profiles')
                .select('notification_settings')
                .eq('id', userId)
                .single();

            const currentSettings = profile?.notification_settings || {};

            // Merge with new settings
            const updatedSettings = {
                ...currentSettings,
                loan_reminders_enabled: settings.enabled ?? currentSettings.loan_reminders_enabled,
                loan_reminder_days: settings.reminderDays ?? currentSettings.loan_reminder_days,
                notification_method: settings.notificationMethod ?? currentSettings.notification_method
            };

            const { error } = await supabase
                .from('profiles')
                .update({ notification_settings: updatedSettings })
                .eq('id', userId);

            if (error) {
                console.error('Error updating settings:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error updating reminder settings:', error);
            return false;
        }
    }
}
