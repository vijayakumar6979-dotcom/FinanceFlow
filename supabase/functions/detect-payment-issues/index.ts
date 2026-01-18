import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentAnomaly {
    loanId: string;
    loanName: string;
    anomalyType: 'missed_payment' | 'late_payment' | 'unusual_amount' | 'payment_pattern_change' | 'high_utilization';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    detectedAt: string;
    metadata?: Record<string, any>;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // Fetch user's loans
        const { data: loans, error: loansError } = await supabaseClient
            .from('loans')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')

        if (loansError) {
            throw loansError
        }

        if (!loans || loans.length === 0) {
            return new Response(
                JSON.stringify({ anomalies: [], message: 'No active loans found' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            )
        }

        // Fetch payment history for the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const { data: payments, error: paymentsError } = await supabaseClient
            .from('loan_payments')
            .select('*')
            .in('loan_id', loans.map(l => l.id))
            .gte('payment_date', sixMonthsAgo.toISOString())
            .order('payment_date', { ascending: false })

        if (paymentsError) {
            console.error('Error fetching payments:', paymentsError)
        }

        const anomalies: PaymentAnomaly[] = []
        const today = new Date()

        // Analyze each loan for anomalies
        for (const loan of loans) {
            const loanPayments = payments?.filter(p => p.loan_id === loan.id) || []

            // 1. Check for missed payments
            const daysSinceLastPayment = loanPayments.length > 0
                ? Math.floor((today.getTime() - new Date(loanPayments[0].payment_date).getTime()) / (1000 * 60 * 60 * 24))
                : 999

            if (daysSinceLastPayment > 35) {
                anomalies.push({
                    loanId: loan.id,
                    loanName: loan.loan_name || loan.name,
                    anomalyType: 'missed_payment',
                    severity: daysSinceLastPayment > 60 ? 'critical' : 'high',
                    description: `No payment recorded for ${daysSinceLastPayment} days`,
                    recommendation: 'Make a payment immediately to avoid late fees and credit score damage',
                    detectedAt: today.toISOString(),
                    metadata: { daysSinceLastPayment }
                })
            }

            // 2. Check for late payment pattern
            const latePayments = loanPayments.filter(p => {
                const paymentDate = new Date(p.payment_date)
                const dueDay = loan.payment_day
                return paymentDate.getDate() > dueDay + 5 // More than 5 days late
            })

            if (latePayments.length >= 2 && loanPayments.length >= 3) {
                const latePercentage = (latePayments.length / loanPayments.length) * 100
                anomalies.push({
                    loanId: loan.id,
                    loanName: loan.loan_name || loan.name,
                    anomalyType: 'late_payment',
                    severity: latePercentage > 50 ? 'high' : 'medium',
                    description: `${latePayments.length} of last ${loanPayments.length} payments were late (${latePercentage.toFixed(0)}%)`,
                    recommendation: 'Set up auto-debit to ensure on-time payments',
                    detectedAt: today.toISOString(),
                    metadata: { lateCount: latePayments.length, totalCount: loanPayments.length }
                })
            }

            // 3. Check for unusual payment amounts
            if (loanPayments.length >= 3) {
                const amounts = loanPayments.slice(0, 6).map(p => p.amount)
                const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
                const stdDev = Math.sqrt(
                    amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length
                )

                const recentAmount = amounts[0]
                const deviation = Math.abs(recentAmount - avgAmount)

                if (stdDev > 0 && deviation > stdDev * 2) {
                    anomalies.push({
                        loanId: loan.id,
                        loanName: loan.loan_name || loan.name,
                        anomalyType: 'unusual_amount',
                        severity: 'low',
                        description: `Recent payment of RM ${recentAmount.toFixed(2)} is unusual (avg: RM ${avgAmount.toFixed(2)})`,
                        recommendation: 'Verify this payment amount is correct',
                        detectedAt: today.toISOString(),
                        metadata: { recentAmount, avgAmount, deviation }
                    })
                }
            }

            // 4. Check for payment pattern changes
            if (loanPayments.length >= 6) {
                const recent3 = loanPayments.slice(0, 3)
                const previous3 = loanPayments.slice(3, 6)

                const recentAvg = recent3.reduce((sum, p) => sum + p.amount, 0) / 3
                const previousAvg = previous3.reduce((sum, p) => sum + p.amount, 0) / 3

                const percentageChange = ((recentAvg - previousAvg) / previousAvg) * 100

                if (Math.abs(percentageChange) > 30) {
                    anomalies.push({
                        loanId: loan.id,
                        loanName: loan.loan_name || loan.name,
                        anomalyType: 'payment_pattern_change',
                        severity: percentageChange < 0 ? 'medium' : 'low',
                        description: `Payment amount ${percentageChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(percentageChange).toFixed(0)}%`,
                        recommendation: percentageChange < 0
                            ? 'Consider increasing payments to avoid extending loan term'
                            : 'Great job increasing payments! This will save on interest',
                        detectedAt: today.toISOString(),
                        metadata: { percentageChange, recentAvg, previousAvg }
                    })
                }
            }

            // 5. Check for high loan utilization (for revolving loans)
            if (loan.loan_type === 'personal' || loan.loan_type === 'credit_card') {
                const utilization = (loan.current_balance / loan.original_amount) * 100

                if (utilization > 80) {
                    anomalies.push({
                        loanId: loan.id,
                        loanName: loan.loan_name || loan.name,
                        anomalyType: 'high_utilization',
                        severity: utilization > 90 ? 'high' : 'medium',
                        description: `Loan utilization at ${utilization.toFixed(0)}% (RM ${loan.current_balance.toFixed(2)} of RM ${loan.original_amount.toFixed(2)})`,
                        recommendation: 'High utilization can impact credit score. Consider paying down the balance',
                        detectedAt: today.toISOString(),
                        metadata: { utilization, currentBalance: loan.current_balance, originalAmount: loan.original_amount }
                    })
                }
            }

            // 6. Check for missed payment status
            if (loan.missed_payments && loan.missed_payments > 0) {
                anomalies.push({
                    loanId: loan.id,
                    loanName: loan.loan_name || loan.name,
                    anomalyType: 'missed_payment',
                    severity: loan.missed_payments > 2 ? 'critical' : 'high',
                    description: `${loan.missed_payments} missed payment(s) on record`,
                    recommendation: 'Contact lender immediately to discuss payment plan options',
                    detectedAt: today.toISOString(),
                    metadata: { missedPayments: loan.missed_payments }
                })
            }
        }

        // Sort by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        anomalies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

        return new Response(
            JSON.stringify({
                success: true,
                anomalies,
                summary: {
                    total: anomalies.length,
                    critical: anomalies.filter(a => a.severity === 'critical').length,
                    high: anomalies.filter(a => a.severity === 'high').length,
                    medium: anomalies.filter(a => a.severity === 'medium').length,
                    low: anomalies.filter(a => a.severity === 'low').length
                }
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
