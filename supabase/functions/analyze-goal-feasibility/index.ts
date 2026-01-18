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

        // Fetch user goals and contributions
        const { data: goals } = await supabaseClient
            .from('goals')
            .select(`
                *,
                goal_contributions (
                    amount,
                    contribution_date
                )
            `)
            .eq('user_id', user.id);

        if (!goals || goals.length === 0) {
            return new Response(
                JSON.stringify({ message: "No goals identified. Time to start dreaming!" }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const feasibilityData = goals.map(goal => {
            const targetDate = new Date(goal.target_date);
            const now = new Date();
            const monthsRemaining = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());

            const remainingAmount = goal.target_amount - goal.current_amount;
            const requiredRate = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;

            // Calculate actual savings rate from history
            const contributions = goal.goal_contributions || [];
            const totalContributed = contributions.reduce((sum: number, c: any) => sum + c.amount, 0);

            // Assume 3 month window for "recent" velocity or use goal start date
            const actualVelocity = contributions.length > 0 ? totalContributed / 3 : 0;

            return {
                name: goal.name,
                target_amount: goal.target_amount,
                current_amount: goal.current_amount,
                target_date: goal.target_date,
                months_left: Math.max(0, monthsRemaining),
                required_monthly: requiredRate,
                actual_monthly_velocity: actualVelocity,
                at_risk: actualVelocity < requiredRate && monthsRemaining < 24
            };
        });

        const GrokApiKey = Deno.env.get('GROK_API_KEY');
        if (!GrokApiKey) throw new Error('GROK_API_KEY not configured');

        const prompt = `You are a wealth achievement strategist. Analyze these financial goals and their progress velocity.
        
        Goals Progress:
        ${JSON.stringify(feasibilityData, null, 2)}
        
        Return JSON object:
        1. "feasibility_score": Number (0-100)
        2. "analysis": Array of { goal_name, confidence_level (High/Medium/Low), projection_date (if delayed), advice }
        3. "strategic_move": One major action the user should take right now.`;

        const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GrokApiKey}`,
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: 'You are a pragmatic but encouraging wealth coach.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
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
