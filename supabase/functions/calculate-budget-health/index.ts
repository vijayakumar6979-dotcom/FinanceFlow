import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        // Fetch current budgets and their current periods
        const { data: budgets } = await supabaseClient
            .from('budgets')
            .select(`
                id,
                name,
                amount,
                category_id,
                budget_periods (
                    spent_amount,
                    start_date,
                    end_date
                )
            `)
            .eq('user_id', user.id);

        if (!budgets || budgets.length === 0) {
            return new Response(
                JSON.stringify({ score: 100, status: 'Prudence', insight: 'No budgets defined yet. Total financial freedom!' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const healthData = budgets.map(b => ({
            name: b.name,
            limit: b.amount,
            spent: b.budget_periods?.[0]?.spent_amount || 0,
            remaining: b.amount - (b.budget_periods?.[0]?.spent_amount || 0)
        }));

        const totalBudget = healthData.reduce((acc, h) => acc + h.limit, 0);
        const totalSpent = healthData.reduce((acc, h) => acc + h.spent, 0);
        const utilization = (totalSpent / totalBudget) * 100;

        const GrokApiKey = Deno.env.get('GROK_API_KEY');
        if (!GrokApiKey) {
            throw new Error('GROK_API_KEY not configured');
        }

        const prompt = `You are a financial health auditor. Analyze these budgets and spending levels.
        
        Budget Status:
        ${JSON.stringify(healthData, null, 2)}
        
        Total Utilization: ${utilization.toFixed(1)}%
        
        Return JSON object:
        1. "score": Number (0-100), where 100 is perfect discipline.
        2. "status": String (e.g., "Optimal", "Vulnerable", "Critical")
        3. "insight": Short, punchy summary of current financial health.
        4. "warnings": Array of strings for specific categories at risk.`;

        const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GrokApiKey}`,
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: 'You are an elite financial coach.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
            }),
        });

        const grokData = await grokResponse.json();
        const result = JSON.parse(grokData.choices[0].message.content);

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
