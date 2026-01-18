// Edge Function: detect-spending-anomalies
// Schedule: Daily at 2 AM (0 2 * * *)
// Purpose: Detect unusual spending patterns and alert users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get yesterday's date
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // Get all users
        const { data: users } = await supabaseAdmin
            .from('profiles')
            .select('id, email')

        const results = {
            users_analyzed: 0,
            anomalies_detected: 0,
            notifications_sent: 0
        }

        for (const user of users || []) {
            try {
                // Get yesterday's transactions
                const { data: yesterdayTxs } = await supabaseAdmin
                    .from('transactions')
                    .select('*, category:transaction_categories(name)')
                    .eq('user_id', user.id)
                    .gte('date', yesterdayStr)
                    .lt('date', new Date().toISOString().split('T')[0])

                if (!yesterdayTxs || yesterdayTxs.length === 0) continue

                // Get historical data (last 90 days)
                const ninetyDaysAgo = new Date()
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

                const { data: historicalTxs } = await supabaseAdmin
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('date', ninetyDaysAgo.toISOString())
                    .lt('date', yesterdayStr)

                if (!historicalTxs || historicalTxs.length === 0) continue

                results.users_analyzed++

                // Analyze each yesterday's transaction
                for (const tx of yesterdayTxs) {
                    // Get same category historical transactions
                    const categoryHistory = historicalTxs.filter(
                        (t: any) => t.category_id === tx.category_id && t.type === tx.type
                    )

                    if (categoryHistory.length < 5) continue // Need at least 5 data points

                    // Calculate statistics
                    const amounts = categoryHistory.map((t: any) => t.amount)
                    const mean = amounts.reduce((sum: number, val: number) => sum + val, 0) / amounts.length

                    // Calculate standard deviation
                    const variance = amounts.reduce((sum: number, val: number) =>
                        sum + Math.pow(val - mean, 2), 0
                    ) / amounts.length
                    const stdDev = Math.sqrt(variance)

                    // Detect anomaly (>2 standard deviations)
                    const zScore = Math.abs((tx.amount - mean) / stdDev)

                    if (zScore > 2) {
                        const isHigher = tx.amount > mean
                        const percentDiff = Math.round(((tx.amount / mean) - 1) * 100)

                        const severity = zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low'
                        const reason = `This ${tx.category?.name || 'transaction'} (RM ${tx.amount.toFixed(2)}) is ${Math.abs(percentDiff)}% ${isHigher ? 'higher' : 'lower'} than your usual RM ${mean.toFixed(2)}`

                        // Mark as anomaly
                        await supabaseAdmin
                            .from('transactions')
                            .update({
                                is_anomaly: true,
                                anomaly_reason: reason,
                                anomaly_severity: severity
                            })
                            .eq('id', tx.id)

                        results.anomalies_detected++

                        // Send notification
                        const { data: profile } = await supabaseAdmin
                            .from('profiles')
                            .select('fcm_token')
                            .eq('id', user.id)
                            .single()

                        if (profile?.fcm_token) {
                            // TODO: Send FCM notification
                            console.log(`Would send anomaly notification to ${user.email}`)
                            results.notifications_sent++
                        }
                    }
                }

            } catch (userError) {
                console.error(`Error analyzing user ${user.id}:`, userError)
            }
        }

        console.log('Anomaly detection complete:', results)

        return new Response(
            JSON.stringify({
                success: true,
                ...results
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Fatal error in detect-spending-anomalies:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
