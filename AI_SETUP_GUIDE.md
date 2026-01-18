# Dashboard-Based Edge Function Deployment (GROQ VERSION - ROBUST)

**Use this version.** It includes fixes for the "recommendations.map is not a function" error by robustly handling the AI's response.

## 1. generate-budget-recommendations (Robust)
Copy/Paste this into the `generate-budget-recommendations` function.

```typescript
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
        console.log("🚀 Function started: generate-budget-recommendations (Robust)");

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { data: categories } = await supabaseClient
            .from('transaction_categories')
            .select('id, name, type');

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const { data: transactions } = await supabaseClient
            .from('transactions')
            .select(`amount, date, category_id, transaction_categories (name, type)`)
            .eq('user_id', user.id)
            .gte('date', ninetyDaysAgo.toISOString())
            .eq('transaction_categories.type', 'expense');

        const spendingByCategory: Record<string, number> = {};
        transactions?.forEach(t => {
            const catName = t.transaction_categories?.name || 'Uncategorized';
            spendingByCategory[catName] = (spendingByCategory[catName] || 0) + Math.abs(t.amount);
        });

        const GroqApiKey = Deno.env.get('GROK_API_KEY');
        if (!GroqApiKey) throw new Error('GROK_API_KEY not set');

        // Stronger Prompt
        const prompt = `Analyze this spending data and suggest a monthly budget.
        Spending: ${JSON.stringify(spendingByCategory)}
        Categories: ${JSON.stringify(categories?.filter(c => c.type === 'expense').map(c => c.name))}
        
        IMPORTANT: Return ONLY valid JSON. Structure:
        {
          "recommendations": [
            { "category_name": "Food", "amount": 500, "reason": "Based on..." }
          ],
          "insight": "General insight..."
        }`;

        console.log("🤖 Calling Groq API...");

        const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GroqApiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are a financial API. You output strictly valid JSON.' }, 
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
            }),
        });

        if (!grokResponse.ok) {
            const errorText = await grokResponse.text();
            throw new Error(`Groq API Error (${grokResponse.status}): ${errorText}`);
        }

        const grokData = await grokResponse.json();
        let rawContent = grokData.choices[0].message.content;
        console.log("📄 Raw AI Response:", rawContent);

        // Robust Parsing (Handle Markdown blocks if present)
        let content;
        try {
            content = JSON.parse(rawContent);
        } catch (e) {
            console.log("⚠️ Initial Parse failed, trying regex extraction...");
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                content = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse JSON from AI response");
            }
        }

        if (!content.recommendations || !Array.isArray(content.recommendations)) {
             console.error("❌ Invalid JSON Structure:", content);
             throw new Error("AI returned JSON, but missing 'recommendations' array.");
        }

        const finalRecommendations = content.recommendations.map((rec: any) => {
            const category = categories?.find(c => c.name.toLowerCase() === rec.category_name.toLowerCase());
            return { ...rec, category_id: category?.id };
        });

        return new Response(JSON.stringify({ recommendations: finalRecommendations, insight: content.insight }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("🔥 CRITICAL ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
```

## 2. calculate-budget-health (Robust)
Copy/Paste this into the `calculate-budget-health` function.

```typescript
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
        console.log("🚀 Function started: calculate-budget-health (Robust)");
        
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { data: budgets } = await supabaseClient
            .from('budgets')
            .select(`id, name, amount, budget_periods(spent_amount)`)
            .eq('user_id', user.id);

        if (!budgets || budgets.length === 0) {
            return new Response(JSON.stringify({ score: 100, status: 'Prudence', insight: 'No budgets defined yet.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const healthData = budgets.map(b => ({
            name: b.name,
            limit: b.amount,
            spent: b.budget_periods?.[0]?.spent_amount || 0
        }));

        const GroqApiKey = Deno.env.get('GROK_API_KEY');
        if (!GroqApiKey) throw new Error('GROK_API_KEY not set');

        const prompt = `Analyze these budgets: ${JSON.stringify(healthData)}. 
        IMPORTANT: Return ONLY valid JSON with structure: { "score": 85, "status": "Good", "insight": "...", "warnings": [] }`;

        const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GroqApiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'system', content: 'You are a financial API. Output valid JSON only.' }, { role: 'user', content: prompt }],
                temperature: 0.5,
                response_format: { type: "json_object" }
            }),
        });

        if (!grokResponse.ok) {
            const errorText = await grokResponse.text();
            throw new Error(`Groq API Error (${grokResponse.status}): ${errorText}`);
        }

        const grokData = await grokResponse.json();
        const content = JSON.parse(grokData.choices[0].message.content); // Llama usually behaves better with json_object mode, but adding fallback parsing is good practice if this fails too.

        return new Response(JSON.stringify(content), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("🔥 ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
```

## 3. analyze-goal-feasibility (Robust)
Copy/Paste this into the `analyze-goal-feasibility` function.

```typescript
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
        console.log("🚀 Function started: analyze-goal-feasibility (Robust)");

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { data: goals } = await supabaseClient
            .from('goals')
            .select(`*, goal_contributions(amount)`)
            .eq('user_id', user.id);

        if (!goals || goals.length === 0) {
            return new Response(JSON.stringify({ message: "No goals identified." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const GroqApiKey = Deno.env.get('GROK_API_KEY');
        if (!GroqApiKey) throw new Error('GROK_API_KEY not set');

        const prompt = `Analyze these goals: ${JSON.stringify(goals)}. 
        IMPORTANT: Return ONLY valid JSON with structure: { "feasibility_score": 80, "analysis": ["..."], "strategic_move": "..." }`;

        const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GroqApiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'system', content: 'You are a financial API. Output valid JSON only.' }, { role: 'user', content: prompt }],
                temperature: 0.6,
                response_format: { type: "json_object" }
            }),
        });

        if (!grokResponse.ok) {
            const errorText = await grokResponse.text();
            throw new Error(`Groq API Error (${grokResponse.status}): ${errorText}`);
        }

        const grokData = await grokResponse.json();
        const content = JSON.parse(grokData.choices[0].message.content);

        return new Response(JSON.stringify(content), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("🔥 ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
```
