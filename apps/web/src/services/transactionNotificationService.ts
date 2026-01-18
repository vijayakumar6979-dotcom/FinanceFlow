// Transaction Notification Service
// Handles all transaction-related notifications via Firebase Cloud Messaging

import { getMessaging } from 'firebase-admin/messaging';
import { supabase } from './supabase';

export const transactionNotificationService = {

    /**
     * Send notification for large transactions (>RM 1000 or >2x average)
     */
    async sendLargeTransactionAlert(transaction: {
        id: string;
        user_id: string;
        amount: number;
        description: string;
        type: 'income' | 'expense';
    }) {
        try {
            // Get user's FCM token
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token')
                .eq('id', transaction.user_id)
                .single();

            if (!profile?.fcm_token) return;

            const messaging = getMessaging();
            const emoji = transaction.type === 'income' ? '💰' : '💸';

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: `${emoji} Large ${transaction.type === 'income' ? 'Income' : 'Expense'}`,
                    body: `RM ${transaction.amount.toFixed(2)} - ${transaction.description}`
                },
                data: {
                    type: 'large_transaction',
                    transaction_id: transaction.id,
                    amount: transaction.amount.toString()
                },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'transactions',
                        color: transaction.type === 'income' ? '#10B981' : '#EF4444'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            });

            console.log(`Large transaction alert sent to user ${transaction.user_id}`);
        } catch (error) {
            console.error('Failed to send large transaction alert:', error);
        }
    },

    /**
     * Send notification when budget threshold is reached
     */
    async sendBudgetThresholdAlert(data: {
        user_id: string;
        budget_name: string;
        spent: number;
        limit: number;
        percentage: number;
    }) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token')
                .eq('id', data.user_id)
                .single();

            if (!profile?.fcm_token) return;

            const messaging = getMessaging();
            const emoji = data.percentage >= 100 ? '🚨' : '⚠️';

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: `${emoji} ${data.budget_name} Budget at ${data.percentage}%`,
                    body: `You've spent RM ${data.spent.toFixed(2)} of RM ${data.limit.toFixed(2)}`
                },
                data: {
                    type: 'budget_threshold',
                    budget_name: data.budget_name,
                    percentage: data.percentage.toString()
                },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'budgets',
                        color: data.percentage >= 100 ? '#EF4444' : '#F59E0B'
                    }
                }
            });

            console.log(`Budget threshold alert sent to user ${data.user_id}`);
        } catch (error) {
            console.error('Failed to send budget threshold alert:', error);
        }
    },

    /**
     * Send notification for unusual spending
     */
    async sendUnusualSpendingAlert(data: {
        user_id: string;
        category: string;
        amount: number;
        usual_amount: number;
        percentage_diff: number;
    }) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token')
                .eq('id', data.user_id)
                .single();

            if (!profile?.fcm_token) return;

            const messaging = getMessaging();

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: '🔔 Unusual Spending Detected',
                    body: `Your ${data.category} expense (RM ${data.amount.toFixed(2)}) is ${data.percentage_diff}% higher than usual (RM ${data.usual_amount.toFixed(2)})`
                },
                data: {
                    type: 'unusual_spending',
                    category: data.category,
                    amount: data.amount.toString()
                },
                android: {
                    priority: 'default',
                    notification: {
                        channelId: 'insights'
                    }
                }
            });

            console.log(`Unusual spending alert sent to user ${data.user_id}`);
        } catch (error) {
            console.error('Failed to send unusual spending alert:', error);
        }
    },

    /**
     * Send daily summary notification
     */
    async sendDailySummary(data: {
        user_id: string;
        date: string;
        total_spent: number;
        transaction_count: number;
        largest_expense: {
            amount: number;
            description: string;
        };
    }) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token, notification_settings')
                .eq('id', data.user_id)
                .single();

            if (!profile?.fcm_token) return;

            // Check if daily summary is enabled
            const settings = profile.notification_settings || {};
            if (settings.daily_summary === false) return;

            const messaging = getMessaging();

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: '📊 Daily Summary',
                    body: `Today: RM ${data.total_spent.toFixed(2)} spent across ${data.transaction_count} transactions. Largest: RM ${data.largest_expense.amount.toFixed(2)} at ${data.largest_expense.description}`
                },
                data: {
                    type: 'daily_summary',
                    date: data.date,
                    total_spent: data.total_spent.toString()
                },
                android: {
                    priority: 'default',
                    notification: {
                        channelId: 'summaries'
                    }
                }
            });

            console.log(`Daily summary sent to user ${data.user_id}`);
        } catch (error) {
            console.error('Failed to send daily summary:', error);
        }
    },

    /**
     * Send weekly recap notification
     */
    async sendWeeklyRecap(data: {
        user_id: string;
        week_start: string;
        week_end: string;
        total_income: number;
        total_expenses: number;
        net: number;
        top_category: {
            name: string;
            amount: number;
        };
    }) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token, notification_settings')
                .eq('id', data.user_id)
                .single();

            if (!profile?.fcm_token) return;

            const settings = profile.notification_settings || {};
            if (settings.weekly_recap === false) return;

            const messaging = getMessaging();

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: '📈 Weekly Recap',
                    body: `This week: RM ${data.total_income.toFixed(2)} income, RM ${data.total_expenses.toFixed(2)} expenses. Net: RM ${data.net.toFixed(2)}. Top category: ${data.top_category.name}`
                },
                data: {
                    type: 'weekly_recap',
                    week_start: data.week_start,
                    net: data.net.toString()
                },
                android: {
                    priority: 'default',
                    notification: {
                        channelId: 'summaries'
                    }
                }
            });

            console.log(`Weekly recap sent to user ${data.user_id}`);
        } catch (error) {
            console.error('Failed to send weekly recap:', error);
        }
    },

    /**
     * Send notification when recurring transaction is created
     */
    async sendRecurringTransactionCreated(data: {
        user_id: string;
        description: string;
        amount: number;
        frequency: string;
    }) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token')
                .eq('id', data.user_id)
                .single();

            if (!profile?.fcm_token) return;

            const messaging = getMessaging();

            await messaging.send({
                token: profile.fcm_token,
                notification: {
                    title: '✅ Recurring Transaction Created',
                    body: `${data.description} - RM ${data.amount.toFixed(2)} every ${data.frequency}`
                },
                data: {
                    type: 'recurring_created',
                    description: data.description
                },
                android: {
                    priority: 'default',
                    notification: {
                        channelId: 'transactions'
                    }
                }
            });

            console.log(`Recurring transaction notification sent to user ${data.user_id}`);
        } catch (error) {
            console.error('Failed to send recurring transaction notification:', error);
        }
    }
};
