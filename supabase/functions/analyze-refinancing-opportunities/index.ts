import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RefinanceRequest {
    loanId: string;
    newRate: number;
    closingCosts?: number;
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

        const requestData: RefinanceRequest = await req.json()

        // Fetch loan
        const { data: loan, error: loanError } = await supabaseClient
            .from('loans')
            .select('*')
            .eq('id', requestData.loanId)
            .eq('user_id', user.id)
            .single()

        if (loanError || !loan) {
            return new Response(
                JSON.stringify({ error: 'Loan not found' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404,
                }
            )
        }

        // Calculate refinancing opportunity
        const currentRate = loan.interest_rate
        const newRate = requestData.newRate
        const closingCosts = requestData.closingCosts || 0
        const remainingMonths = loan.remaining_months || loan.term_months
        const currentBalance = loan.current_balance

        // Calculate current loan interest
        const monthlyRate = currentRate / 100 / 12
        let balance = currentBalance
        let currentInterest = 0

        for (let i = 0; i < remainingMonths; i++) {
            const interest = balance * monthlyRate
            const principal = loan.monthly_payment - interest
            currentInterest += interest
            balance -= principal
        }

        // Calculate new loan payment and interest
        const newMonthlyRate = newRate / 100 / 12
        const newPayment = currentBalance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, remainingMonths)) /
            (Math.pow(1 + newMonthlyRate, remainingMonths) - 1)

        balance = currentBalance
        let newInterest = 0

        for (let i = 0; i < remainingMonths; i++) {
            const interest = balance * newMonthlyRate
            const principal = newPayment - interest
            newInterest += interest
            balance -= principal
        }

        const monthlySavings = loan.monthly_payment - newPayment
        const lifetimeSavings = currentInterest - newInterest - closingCosts
        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 999

        const analysis = {
            loan_id: loan.id,
            analysis_date: new Date().toISOString().split('T')[0],
            current_rate: currentRate,
            new_rate: newRate,
            monthly_savings: Math.round(monthlySavings * 100) / 100,
            lifetime_savings: Math.round(lifetimeSavings * 100) / 100,
            break_even_months: breakEvenMonths,
            is_recommended: lifetimeSavings > 5000 && breakEvenMonths < 36
        }

        // Save analysis
        const { error: insertError } = await supabaseClient
            .from('loan_refinance_analyses')
            .insert(analysis)

        if (insertError) {
            console.error('Error saving analysis:', insertError)
        }

        return new Response(
            JSON.stringify({
                success: true,
                analysis
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
