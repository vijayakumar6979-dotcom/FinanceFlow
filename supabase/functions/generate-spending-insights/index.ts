// Edge Function: generate-spending-insights
// Schedule: Weekly on Monday at 8 AM (0 8 * * 1)
// Purpose: Generate AI-powered spending insights using Grok API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const grokApiKey = Deno.env.get('GROK_API_KEY')
        if (!grokApiKey) {
            throw new Error('GROK_API_KEY not configured')
        }

        // Calculate date ranges
        const today = new Date()
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - 7)
        const lastWeekStart = new Date(weekStart)
        lastWeekStart.setDate(weekStart.getDate() - 7)

        // Get all users
        const { data: users } = await supabaseAdmin
            .from('profiles')
            .select('id, email, fcm_token')

        const results = {
            users_analyzed: 0,
            insights_generated: 0,
            notifications_sent: 0
        }

        for (const user of users || []) {
            try {
                // Get this week's transactions
                const { data: thisWeekTxs } = await supabaseAdmin
                    .from('transactions')
                    .select('*, category:transaction_categories(name, type)')
                    .eq('user_id', user.id)
                    .gte('date', weekStart.toISOString())
                    .lt('date', today.toISOString())

                if (!thisWeekTxs || thisWeekTxs.length === 0) continue

                // Get last week's transactions for comparison
                const { data: lastWeekTxs } = await supabaseAdmin
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('date', lastWeekStart.toISOString())
                    .lt('date', weekStart.toISOString())

                // Get user's budgets
                const { data: budgets } = await supabaseAdmin
                    .from('budgets')
                    .select('*, periods:budget_periods(*)')
                    .eq('user_id', user.id)
                    .eq('is_active', true)

                results.users_analyzed++

                // Calculate statistics
                const thisWeekIncome = thisWeekTxs
                    .filter((t: any) => t.type === 'income')
                    .reduce((sum: number, t: any) => sum + t.amount, 0)

                const thisWeekExpenses = thisWeekTxs
                    .filter((t: any) => t.type === 'expense')
                    .reduce((sum: number, t: any) => sum + t.amount, 0)

                const lastWeekExpenses = lastWeekTxs
                    ?.filter((t: any) => t.type === 'expense')
                    .reduce((sum: number, t: any) => sum + t.amount, 0) || 0

                const changePercent = lastWeekExpenses > 0
                    ? ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100
                    : 0

                // Category breakdown
                const categoryBreakdown = thisWeekTxs
                    .filter((t: any) => t.type === 'expense')
                    .reduce((acc: any, t: any) => {
                        const catName = t.category?.name || 'Uncategorized'
                        if (!acc[catName]) acc[catName] = 0
                        acc[catName] += t.amount
                        return acc
                    }, {})

                // Build Grok prompt
                const grokPrompt = `Analyze this user's weekly spending and provide insights.

Weekly Transactions Summary:
- Total Income: RM ${thisWeekIncome.toFixed(2)}
- Total Expenses: RM ${thisWeekExpenses.toFixed(2)}
- Net Cash Flow: RM ${(thisWeekIncome - thisWeekExpenses).toFixed(2)}
- Change from Last Week: ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%

Category Breakdown:
${Object.entries(categoryBreakdown)
                        .sort(([, a]: any, [, b]: any) => b - a)
                        .map(([cat, amt]: any) => `- ${cat}: RM ${amt.toFixed(2)}`)
                        .join('\n')}

Budgets:
${budgets?.map((b: any) => {
                            const currentPeriod = b.periods?.[0]
                            const spent = currentPeriod?.spent || 0
                            const percentage = (spent / b.amount) * 100
                            return `- ${b.name}: RM ${spent.toFixed(2)} / RM ${b.amount.toFixed(2)} (${percentage.toFixed(0)}%)`
                        }).join('\n') || 'No active budgets'}

Last Week Comparison:
- Last Week Expenses: RM ${lastWeekExpenses.toFixed(2)}

Provide insights in JSON format:
{
  "summary": "Brief overview of the week",
  "trends": [
    {
      "category": "Category name",
      "change": "+25%",
      "insight": "What changed",
      "recommendation": "Actionable advice"
    }
  ],
  "achievements": ["Positive behaviors"],
  "alerts": ["Areas of concern"],
  "prediction": "Month-end forecast"
}

Focus on:
1. Spending patterns and changes
2. Budget adherence
3. Unusual categories
4. Actionable recommendations
5. Positive reinforcement`

                // Call Grok API
                const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${grokApiKey}`
                    },
                    body: JSON.stringify({
                        model: 'grok-beta',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a financial advisor AI. Provide insights in valid JSON format only.'
                            },
                            { role: 'user', content: grokPrompt }
                        ],
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                })

                if (!grokResponse.ok) {
                    console.error(`Grok API error for user ${user.id}`)
                    continue
                }

                const grokData = await grokResponse.json()
                let insightsText = grokData.choices[0]?.message?.content?.trim()

                // Remove markdown if present
                insightsText = insightsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

                let insights
                try {
                    insights = JSON.parse(insightsText)
                } catch (parseError) {
                    console.error(`Failed to parse insights for user ${user.id}`)
                    continue
                }

                // Store insights
                await supabaseAdmin
                    .from('spending_insights')
                    .insert({
                        user_id: user.id,
                        week_start: weekStart.toISOString().split('T')[0],
                        week_end: today.toISOString().split('T')[0],
                        insights: insights,
                        total_income: thisWeekIncome,
                        total_expenses: thisWeekExpenses,
                        created_at: new Date().toISOString()
                    })

                results.insights_generated++

                // Send notification
                if (user.fcm_token) {
                    // TODO: Send FCM notification with insights
                    console.log(`Would send insights notification to ${user.email}`)
                    results.notifications_sent++
                }

            } catch (userError) {
                console.error(`Error analyzing user ${user.id}:`, userError)
            }
        }

        console.log('Weekly insights generation complete:', results)

        return new Response(
            JSON.stringify({
                success: true,
                ...results
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Fatal error in generate-spending-insights:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
