import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { balance, apr, monthlyBudget } = await req.json()

        // Mock Calculation/AI Logic
        const plans = [
            {
                id: 'aggressive',
                name: 'Aggressive',
                monthly_payment: monthlyBudget,
                months: 6,
                total_interest: 250,
                strategy: "Snowball method focused on highest interest."
            },
            {
                id: 'balanced',
                name: 'Balanced',
                monthly_payment: monthlyBudget * 0.7,
                months: 12,
                total_interest: 500,
                strategy: "Balanced approach to maintain liquidity."
            }
        ]

        return new Response(
            JSON.stringify({ plans }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
