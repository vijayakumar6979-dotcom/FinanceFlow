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
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { accountId } = await req.json()

        // 1. Fetch transactions
        const { data: transactions, error: txError } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('account_id', accountId)
            .limit(50)
            .order('date', { ascending: false })

        if (txError) throw txError

        // 2. Mock Grok API Call (Replace with actual fetch to https://api.x.ai/v1/chat/completions)
        // We mock it here to ensure it works without a real key for now
        const analysis = {
            spending_breakdown: [
                { category: 'Dining', percentage: 40 },
                { category: 'Shopping', percentage: 30 },
                { category: 'Travel', percentage: 20 },
                { category: 'Others', percentage: 10 }
            ],
            insights: [
                "Your dining spend is 15% higher than last month.",
                "You are on track to hit your credit limit if spending continues."
            ],
            score: 85
        }

        return new Response(
            JSON.stringify(analysis),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
