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

        // Get user info
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        // Fetch categories to understand the structure
        const { data: categories } = await supabaseClient
            .from('transaction_categories')
            .select('id, name, type');

        // Fetch last 90 days of transactions for trend analysis
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const { data: transactions } = await supabaseClient
            .from('transactions')
            .select(`
                amount,
                date,
                category_id,
                transaction_categories (name, type)
            `)
            .eq('user_id', user.id)
            .gte('date', ninetyDaysAgo.toISOString())
            .eq('transaction_categories.type', 'expense');

        // Prepare data summary for AI
        const spendingByCategory: Record<string, number> = {};
        transactions?.forEach(t => {
            const catName = t.transaction_categories?.name || 'Uncategorized';
            spendingByCategory[catName] = (spendingByCategory[catName] || 0) + Math.abs(t.amount);
        });

        const GrokApiKey = Deno.env.get('GROK_API_KEY');
        if (!GrokApiKey) {
            return new Response(
                JSON.stringify({ error: 'Config error: GROK_API_KEY not set' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const prompt = `You are a financial planning AI. Analyze the user's spending data and suggest a realistic monthly budget for each category.
        
        Spending Data (Last 90 days totals):
        ${JSON.stringify(spendingByCategory, null, 2)}
        
        Available Categories:
        ${JSON.stringify(categories?.filter(c => c.type === 'expense').map(c => c.name), null, 2)}
        
        Return a JSON object with:
        1. "recommendations": Array of objects { category_id, category_name, suggested_amount, reason, emoji }
        2. "insight": A overall summary of their spending habits.
        
        Keep amounts realistic for a monthly period (divide the 90-day data appropriately).
        Focus on categories where they spend most.`;

        const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GrokApiKey}`,
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: 'You are a helpful financial advisor.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            }),
        });

        const grokData = await grokResponse.json();
        const content = JSON.parse(grokData.choices[0].message.content);

        // Map category names back to IDs
        const finalRecommendations = content.recommendations.map((rec: any) => {
            const category = categories?.find(c => c.name.toLowerCase() === rec.category_name.toLowerCase());
            return {
                ...rec,
                category_id: category?.id
            };
        });

        return new Response(
            JSON.stringify({
                recommendations: finalRecommendations,
                insight: content.insight
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
