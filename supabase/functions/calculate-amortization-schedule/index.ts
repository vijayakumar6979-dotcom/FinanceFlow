import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AmortizationRequest {
    loanId: string;
    principal: number;
    annualRate: number;
    termMonths: number;
    startDate: string;
    monthlyPayment?: number;
}

interface AmortizationEntry {
    loan_id: string;
    payment_number: number;
    payment_date: string;
    payment_amount: number;
    principal_amount: number;
    interest_amount: number;
    remaining_balance: number;
    is_paid: boolean;
}

function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    if (annualRate === 0) {
        return principal / termMonths;
    }

    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

    return Math.round(payment * 100) / 100;
}

function generateAmortizationSchedule(
    loanId: string,
    principal: number,
    annualRate: number,
    termMonths: number,
    startDate: string,
    monthlyPayment?: number
): AmortizationEntry[] {
    const schedule: AmortizationEntry[] = [];
    const payment = monthlyPayment || calculateMonthlyPayment(principal, annualRate, termMonths);
    const monthlyRate = annualRate / 100 / 12;

    let remainingBalance = principal;
    const start = new Date(startDate);

    for (let i = 1; i <= termMonths; i++) {
        const interestAmount = remainingBalance * monthlyRate;
        const principalAmount = payment - interestAmount;
        remainingBalance -= principalAmount;

        // Handle final payment rounding
        if (i === termMonths) {
            remainingBalance = 0;
        }

        const paymentDate = new Date(start);
        paymentDate.setMonth(paymentDate.getMonth() + i);

        schedule.push({
            loan_id: loanId,
            payment_number: i,
            payment_date: paymentDate.toISOString().split('T')[0],
            payment_amount: Math.round(payment * 100) / 100,
            principal_amount: Math.round(principalAmount * 100) / 100,
            interest_amount: Math.round(interestAmount * 100) / 100,
            remaining_balance: Math.max(0, Math.round(remainingBalance * 100) / 100),
            is_paid: false
        });
    }

    return schedule;
}

serve(async (req) => {
    // Handle CORS preflight
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

        // TEMPORARY: Auth check disabled for testing in Supabase Dashboard
        // TODO: Re-enable this before production deployment
        // const {
        //     data: { user },
        // } = await supabaseClient.auth.getUser()

        // if (!user) {
        //     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //         status: 401,
        //     })
        // }

        const requestData: AmortizationRequest = await req.json()

        // Validate input
        if (!requestData.loanId || !requestData.principal || !requestData.annualRate || !requestData.termMonths || !requestData.startDate) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                }
            )
        }

        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(
            requestData.loanId,
            requestData.principal,
            requestData.annualRate,
            requestData.termMonths,
            requestData.startDate,
            requestData.monthlyPayment
        )

        // Delete existing schedule for this loan
        await supabaseClient
            .from('loan_amortization_schedule')
            .delete()
            .eq('loan_id', requestData.loanId)

        // Insert new schedule
        const { error: insertError } = await supabaseClient
            .from('loan_amortization_schedule')
            .insert(schedule)

        if (insertError) {
            console.error('Error inserting schedule:', insertError)
            return new Response(
                JSON.stringify({ error: 'Failed to save amortization schedule' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500,
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                schedule: schedule.slice(0, 12), // Return first 12 months
                totalEntries: schedule.length
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
