// Edge Function: detect-duplicate-transactions
// Purpose: Detect potential duplicate transactions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
        const { description, amount, date, category_id } = await req.json()

        if (!description || !amount || !date) {
            throw new Error('Description, amount, and date are required')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Calculate date range (±3 days)
        const transactionDate = new Date(date)
        const startDate = new Date(transactionDate)
        startDate.setDate(startDate.getDate() - 3)
        const endDate = new Date(transactionDate)
        endDate.setDate(endDate.getDate() + 3)

        // Fetch potentially duplicate transactions
        const { data: recentTransactions, error } = await supabaseClient
            .from('transactions')
            .select('id, description, amount, date, category_id, category:transaction_categories(name)')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString())
            .order('date', { ascending: false })

        if (error) throw error

        // Calculate similarity scores
        const duplicates = recentTransactions
            .map((tx: any) => {
                let similarityScore = 0

                // Exact amount match (highest weight)
                if (Math.abs(tx.amount - amount) < 0.01) {
                    similarityScore += 0.5
                }

                // Category match
                if (category_id && tx.category_id === category_id) {
                    similarityScore += 0.2
                }

                // Description similarity (simple word matching)
                const descWords = description.toLowerCase().split(/\s+/)
                const txWords = tx.description.toLowerCase().split(/\s+/)
                const commonWords = descWords.filter((word: string) =>
                    txWords.includes(word) && word.length > 3 // Ignore short words
                )
                const descSimilarity = commonWords.length / Math.max(descWords.length, txWords.length)
                similarityScore += descSimilarity * 0.3

                return {
                    ...tx,
                    similarity_score: similarityScore
                }
            })
            .filter((tx: any) => tx.similarity_score > 0.5) // Only show if >50% similar
            .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
            .slice(0, 5) // Top 5 matches

        const isDuplicate = duplicates.length > 0 && duplicates[0].similarity_score > 0.8

        return new Response(
            JSON.stringify({
                is_duplicate: isDuplicate,
                confidence: duplicates[0]?.similarity_score || 0,
                potential_duplicates: duplicates.map((tx: any) => ({
                    id: tx.id,
                    description: tx.description,
                    amount: tx.amount,
                    date: tx.date,
                    category: tx.category?.name,
                    similarity_score: tx.similarity_score
                }))
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
