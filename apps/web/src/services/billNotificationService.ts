import { supabase } from '@/services/supabase';
import type { Bill } from '@financeflow/shared';

/**
 * Service for managing bill notifications and reminders
 */
export const billNotificationService = {
    /**
     * Create notification for upcoming bill
     */
    async createBillReminder(
        bill: Bill,
        daysUntilDue: number
    ): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const amount = bill.is_variable
                ? (bill.estimated_amount || 0)
                : (bill.fixed_amount || 0);

            let title = '';
            let message = '';

            if (daysUntilDue === 0) {
                title = `Bill Due Today: ${bill.bill_name}`;
                message = `Your ${bill.provider_name} bill of RM ${amount.toFixed(2)} is due today!`;
            } else if (daysUntilDue < 0) {
                title = `Overdue Bill: ${bill.bill_name}`;
                message = `Your ${bill.provider_name} bill of RM ${amount.toFixed(2)} is ${Math.abs(daysUntilDue)} days overdue!`;
            } else {
                title = `Upcoming Bill: ${bill.bill_name}`;
                message = `Your ${bill.provider_name} bill of RM ${amount.toFixed(2)} is due in ${daysUntilDue} days`;
            }

            // Create in-app notification
            await supabase
                .from('notifications')
                .insert({
                    user_id: user.id,
                    type: 'bill_reminder',
                    title,
                    message,
                    data: {
                        bill_id: bill.id,
                        bill_name: bill.bill_name,
                        amount,
                        due_date: bill.next_due_date,
                        days_until_due: daysUntilDue,
                    },
                    is_read: false,
                });

            // Send push notification if enabled
            if (bill.notifications_enabled) {
                await this.sendPushNotification(user.id, title, message, {
                    bill_id: bill.id,
                    type: 'bill_reminder',
                });
            }
        } catch (error) {
            console.error('Error creating bill reminder:', error);
        }
    },

    /**
     * Send push notification via Firebase
     */
    async sendPushNotification(
        userId: string,
        title: string,
        body: string,
        data?: Record<string, any>
    ): Promise<void> {
        try {
            // Get user's FCM tokens
            const { data: tokens } = await supabase
                .from('fcm_tokens')
                .select('token')
                .eq('user_id', userId)
                .eq('is_active', true);

            if (!tokens || tokens.length === 0) return;

            // Call Firebase Cloud Messaging via Edge Function
            await supabase.functions.invoke('send-push-notification', {
                body: {
                    tokens: tokens.map(t => t.token),
                    notification: {
                        title,
                        body,
                    },
                    data,
                },
            });
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    },

    /**
     * Check bills and send reminders
     */
    async checkAndSendReminders(): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get all active bills
            const { data: bills } = await supabase
                .from('bills')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .eq('notifications_enabled', true);

            if (!bills) return;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const bill of bills) {
                if (!bill.next_due_date || !bill.reminder_days) continue;

                const dueDate = new Date(bill.next_due_date);
                dueDate.setHours(0, 0, 0, 0);

                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                // Check if we should send a reminder
                if (bill.reminder_days.includes(daysUntilDue)) {
                    await this.createBillReminder(bill, daysUntilDue);
                }

                // Send overdue notification
                if (daysUntilDue < 0 && bill.current_status !== 'paid') {
                    await this.createBillReminder(bill, daysUntilDue);
                }
            }
        } catch (error) {
            console.error('Error checking and sending reminders:', error);
        }
    },

    /**
     * Create notification for bill payment confirmation
     */
    async createPaymentConfirmation(bill: Bill, amount: number): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const title = `Payment Confirmed: ${bill.bill_name}`;
            const message = `Your payment of RM ${amount.toFixed(2)} for ${bill.provider_name} has been recorded`;

            await supabase
                .from('notifications')
                .insert({
                    user_id: user.id,
                    type: 'payment_confirmation',
                    title,
                    message,
                    data: {
                        bill_id: bill.id,
                        bill_name: bill.bill_name,
                        amount,
                    },
                    is_read: false,
                });
        } catch (error) {
            console.error('Error creating payment confirmation:', error);
        }
    },

    /**
     * Create notification for bill anomaly
     */
    async createAnomalyAlert(
        bill: Bill,
        currentAmount: number,
        expectedAmount: number,
        severity: 'low' | 'medium' | 'high'
    ): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const percentageChange = ((currentAmount - expectedAmount) / expectedAmount) * 100;

            const title = `Unusual Bill Amount: ${bill.bill_name}`;
            const message = `Your ${bill.provider_name} bill is ${Math.abs(percentageChange).toFixed(1)}% ${currentAmount > expectedAmount ? 'higher' : 'lower'} than usual (RM ${currentAmount.toFixed(2)} vs RM ${expectedAmount.toFixed(2)})`;

            await supabase
                .from('notifications')
                .insert({
                    user_id: user.id,
                    type: 'bill_anomaly',
                    title,
                    message,
                    data: {
                        bill_id: bill.id,
                        bill_name: bill.bill_name,
                        current_amount: currentAmount,
                        expected_amount: expectedAmount,
                        severity,
                    },
                    is_read: false,
                });

            // Send push notification for medium/high severity
            if (severity !== 'low' && bill.notifications_enabled) {
                await this.sendPushNotification(user.id, title, message, {
                    bill_id: bill.id,
                    type: 'bill_anomaly',
                });
            }
        } catch (error) {
            console.error('Error creating anomaly alert:', error);
        }
    },
};
