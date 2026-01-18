// Edge Function: suggest-transaction-category
// Endpoint: /functions/v1/suggest-transaction-category
// Purpose: AI-powered category suggestion using Grok API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get request body
        const { description, amount, date, userCategories, recentTransactions } = await req.json()

        if (!description) {
            throw new Error('Description is required')
        }

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // Get user
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Fetch user's categories if not provided
        let categories = userCategories
        if (!categories) {
            const { data } = await supabaseClient
                .from('transaction_categories')
                .select('id, name, type, group_name')
                .or(`user_id.eq.${user.id},is_system.eq.true`)

            categories = data || []
        }

        // Fetch recent transactions for pattern learning if not provided
        let recent = recentTransactions
        if (!recent) {
            const { data } = await supabaseClient
                .from('transactions')
                .select('description, category:transaction_categories(name)')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(50)

            recent = data || []
        }

        // Check categorization patterns (AI learning)
        const { data: patterns } = await supabaseClient
            .from('transaction_categorization_patterns')
            .select('*')
            .eq('user_id', user.id)
            .order('confidence_score', { ascending: false })
            .limit(10)

        // Build Grok API prompt
        const grokPrompt = `You are a transaction categorization AI. Suggest the most appropriate category for this transaction.

User's Categories:
${categories.map((c: any) => `- ${c.name} (${c.type})`).join('\n')}

Transaction Details:
- Description: "${description}"
- Amount: RM ${amount || 'unknown'}
- Date: ${date || 'today'}

User's Historical Patterns:
${recent.slice(0, 10).map((t: any) => `"${t.description}" → ${t.category?.name || 'Uncategorized'}`).join('\n')}

Learned Patterns:
${patterns?.map((p: any) => `"${p.description_pattern}" → Category ID: ${p.category_id} (confidence: ${p.confidence_score})`).join('\n') || 'None yet'}

Rules:
1. Return ONLY the category name from the user's categories list
2. Use user's existing categories
3. If no exact match, suggest the closest category
4. Consider context (amount, time, day of week)
5. Learn from user's historical patterns

Examples:
- "Starbucks coffee" → Food & Dining
- "Shell petrol" → Transportation
- "Salary" → Salary
- "Netflix subscription" → Entertainment
- "Grab ride" → Transportation
- "Guardian pharmacy" → Healthcare

Suggest category for the transaction above (return ONLY the category name):`;

        // Call Grok API
        const grokApiKey = Deno.env.get('GROK_API_KEY')
        if (!grokApiKey) {
            throw new Error('GROK_API_KEY not configured')
        }

        const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${grokApiKey}`
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: 'You are a financial transaction categorization expert. Always respond with just the category name, nothing else.' },
                    { role: 'user', content: grokPrompt }
                ],
                temperature: 0.3,
                max_tokens: 50
            })
        })

        if (!grokResponse.ok) {
            throw new Error(`Grok API error: ${grokResponse.statusText}`)
        }

        const grokData = await grokResponse.json()
        const suggestedCategoryName = grokData.choices[0]?.message?.content?.trim()

        // Find matching category
        const matchedCategory = categories.find((c: any) =>
            c.name.toLowerCase() === suggestedCategoryName?.toLowerCase()
        )

        // Calculate confidence score
        let confidenceScore = 0.5
        if (matchedCategory) {
            // Check if pattern exists
            const existingPattern = patterns?.find((p: any) =>
                p.category_id === matchedCategory.id &&
                description.toLowerCase().includes(p.description_pattern.toLowerCase())
            )

            if (existingPattern) {
                confidenceScore = existingPattern.confidence_score
            } else {
                // New pattern, medium confidence
                confidenceScore = 0.7
            }
        }

        return new Response(
            JSON.stringify({
                suggested_category_id: matchedCategory?.id || null,
                suggested_category_name: matchedCategory?.name || suggestedCategoryName,
                confidence_score: confidenceScore,
                raw_response: suggestedCategoryName
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
