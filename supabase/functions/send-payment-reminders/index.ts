import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Cron Job: Send Payment Reminders
 * This function should be scheduled to run daily (e.g., at 9:00 AM)
 * It checks all active loans and sends reminders based on payment due dates
 */
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Verify this is a cron job request (check for secret key)
        const authHeader = req.headers.get('Authorization')
        const cronSecret = Deno.env.get('CRON_SECRET')

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for cron jobs
        )

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Get all active loans
        const { data: loans, error: loansError } = await supabaseClient
            .from('loans')
            .select(`
        id,
        user_id,
        name,
        loan_name,
        monthly_payment,
        payment_day,
        reminder_days,
        lender_name,
        lender_color
      `)
            .eq('status', 'active')

        if (loansError) {
            throw loansError
        }

        if (!loans || loans.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No active loans found', remindersSent: 0 }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            )
        }

        let remindersSent = 0
        let remindersSkipped = 0
        const errors: string[] = []

        // Process each loan
        for (const loan of loans) {
            try {
                const dueDay = loan.payment_day
                const nextDueDate = calculateNextDueDate(dueDay)
                const daysUntilDue = Math.floor((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                // Get user's reminder preferences
                const reminderDays = loan.reminder_days || [7, 3, 1]

                // Check if today is a reminder day
                const shouldSendReminder =
                    daysUntilDue === 0 || // Due today
                    daysUntilDue < 0 || // Overdue
                    reminderDays.includes(daysUntilDue)

                if (!shouldSendReminder) {
                    remindersSkipped++
                    continue
                }

                // Determine reminder type and priority
                let reminderType: string
                let priority: string
                let title: string
                let message: string

                if (daysUntilDue < 0) {
                    reminderType = 'overdue'
                    priority = 'urgent'
                    title = '🚨 Payment Overdue!'
                    message = `Your ${loan.loan_name || loan.name} payment of RM ${loan.monthly_payment.toFixed(2)} is ${Math.abs(daysUntilDue)} day(s) overdue. Pay now to avoid late fees.`
                } else if (daysUntilDue === 0) {
                    reminderType = 'due_today'
                    priority = 'urgent'
                    title = '⏰ Payment Due Today'
                    message = `Don't forget! Your ${loan.loan_name || loan.name} payment of RM ${loan.monthly_payment.toFixed(2)} is due today.`
                } else if (daysUntilDue === 1) {
                    reminderType = '1_day'
                    priority = 'high'
                    title = '📅 Payment Due Tomorrow'
                    message = `Reminder: Your ${loan.loan_name || loan.name} payment of RM ${loan.monthly_payment.toFixed(2)} is due tomorrow.`
                } else if (daysUntilDue === 3) {
                    reminderType = '3_days'
                    priority = 'medium'
                    title = '📆 Payment Due in 3 Days'
                    message = `Upcoming: Your ${loan.loan_name || loan.name} payment of RM ${loan.monthly_payment.toFixed(2)} is due in 3 days.`
                } else if (daysUntilDue === 7) {
                    reminderType = '7_days'
                    priority = 'low'
                    title = '📌 Payment Due in 7 Days'
                    message = `Heads up! Your ${loan.loan_name || loan.name} payment of RM ${loan.monthly_payment.toFixed(2)} is due next week.`
                } else {
                    remindersSkipped++
                    continue
                }

                // Create notification in database
                const { error: notifError } = await supabaseClient
                    .from('notifications')
                    .insert({
                        user_id: loan.user_id,
                        title,
                        message,
                        type: 'loan_payment_reminder',
                        category: 'loans',
                        priority,
                        metadata: {
                            loanId: loan.id,
                            loanName: loan.loan_name || loan.name,
                            amount: loan.monthly_payment,
                            dueDate: nextDueDate.toISOString(),
                            daysUntilDue,
                            reminderType,
                            lenderName: loan.lender_name,
                            lenderColor: loan.lender_color
                        },
                        is_read: false,
                        created_at: new Date().toISOString()
                    })

                if (notifError) {
                    errors.push(`Failed to create notification for loan ${loan.id}: ${notifError.message}`)
                    continue
                }

                // TODO: Send push notification via Firebase Cloud Messaging
                // This would require Firebase Admin SDK integration
                // For now, we're just creating the in-app notification

                remindersSent++
            } catch (error) {
                errors.push(`Error processing loan ${loan.id}: ${error.message}`)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                summary: {
                    totalLoans: loans.length,
                    remindersSent,
                    remindersSkipped,
                    errors: errors.length
                },
                errors: errors.length > 0 ? errors : undefined,
                timestamp: new Date().toISOString()
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})

/**
 * Calculate next due date based on payment day
 */
function calculateNextDueDate(paymentDay: number): Date {
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    let nextDueDate: Date

    if (currentDay <= paymentDay) {
        // Due date is this month
        nextDueDate = new Date(currentYear, currentMonth, paymentDay)
    } else {
        // Due date is next month
        nextDueDate = new Date(currentYear, currentMonth + 1, paymentDay)
    }

    nextDueDate.setHours(0, 0, 0, 0)
    return nextDueDate
}
