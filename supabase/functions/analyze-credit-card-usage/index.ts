import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CategoryTotals {
    [category: string]: {
        total: number;
        count: number;
    };
}

interface SpendingPattern {
    category: string;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    insight: string;
}

interface UtilizationAnalysis {
    status: 'high' | 'moderate' | 'healthy';
    recommendation: string;
    creditScoreImpact: 'negative' | 'neutral' | 'positive';
}

interface UnusualActivity {
    date: string;
    amount: number;
    category: string;
    reason: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        console.log('DEBUG: Auth Header Present:', !!authHeader);

        if (!authHeader) {
            return new Response(
                JSON.stringify({ success: false, error: 'Missing Authorization Header' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            );
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('DEBUG: Token extracted, length:', token.length);

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        // Get user explicitly using the token
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

        if (authError || !user) {
            console.error('DEBUG: Auth Error Details:', JSON.stringify(authError));
            console.error('DEBUG: User object:', JSON.stringify(user));
            return new Response(
                JSON.stringify({ success: false, error: 'Unauthorized', debug: authError }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            );
        }
        // Parse request body
        const { accountId, dateRange = 180 } = await req.json(); // Default: last 6 months

        if (!accountId) {
            throw new Error('accountId is required');
        }

        // ==============================================================
        // Step 1: Fetch Account Details
        // ==============================================================
        const { data: account, error: accountError } = await supabaseClient
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .single();

        if (accountError || !account) {
            throw new Error('Account not found');
        }

        if (account.account_type !== 'credit_card') {
            throw new Error('This endpoint is only for credit card accounts');
        }

        // Calculate utilization
        const utilization = account.credit_limit > 0
            ? Math.abs((account.balance / account.credit_limit) * 100)
            : 0;

        // ==============================================================
        // Step 2: Fetch Transactions (Last 6 months)
        // ==============================================================
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - dateRange);

        const { data: transactions, error: txError } = await supabaseClient
            .from('transactions')
            .select('*, category:categories(name, icon)')
            .eq('account_id', accountId)
            .gte('date', dateThreshold.toISOString())
            .order('date', { ascending: false });

        if (txError) {
            console.error('Error fetching transactions:', txError);
            throw new Error('Failed to fetch transactions');
        }

        // ==============================================================
        // Step 3: Aggregate Transactions by Category
        // ==============================================================
        const categoryTotals: CategoryTotals = {};
        let totalSpent = 0;

        transactions?.forEach(tx => {
            if (tx.type === 'expense') {
                const categoryName = tx.category?.name || 'Uncategorized';
                if (!categoryTotals[categoryName]) {
                    categoryTotals[categoryName] = { total: 0, count: 0 };
                }
                categoryTotals[categoryName].total += tx.amount;
                categoryTotals[categoryName].count += 1;
                totalSpent += tx.amount;
            }
        });

        // Calculate percentages
        const categoryBreakdown: Record<string, number> = {};
        Object.entries(categoryTotals).forEach(([category, data]) => {
            categoryBreakdown[category] = totalSpent > 0
                ? (data.total / totalSpent) * 100
                : 0;
        });

        // ==============================================================
        // Step 4: Detect Unusual Activity
        // ==============================================================
        const averageTransaction = totalSpent / (transactions?.length || 1);
        const unusualThreshold = averageTransaction * 2; // 2x average

        const unusualActivity: UnusualActivity[] = transactions
            ?.filter(tx => tx.amount > unusualThreshold && tx.type === 'expense')
            .slice(0, 5) // Top 5 unusual
            .map(tx => ({
                date: tx.date,
                amount: tx.amount,
                category: tx.category?.name || 'Uncategorized',
                reason: `Unusually high amount (${((tx.amount / averageTransaction) * 100).toFixed(0)}% above average)`,
            })) || [];

        // ==============================================================
        // Step 5: Call Grok API for AI Analysis
        // ==============================================================
        const grokApiKey = Deno.env.get('GROK_API_KEY');
        let spendingPatterns: SpendingPattern[] = [];
        let utilizationAnalysis: UtilizationAnalysis;
        let recommendations: string[] = [];

        if (grokApiKey) {
            // Prepare transaction summary for Grok
            const transactionSummary = `Total transactions: ${transactions?.length || 0}, Total spent: RM${totalSpent.toFixed(2)}`;

            const prompt = `You are a financial analyst specializing in credit card usage. Analyze this credit card spending data and provide insights.

Credit Card: ${account.name}
Credit Limit: RM${account.credit_limit?.toFixed(2) || '0'}
Current Balance: RM${Math.abs(account.balance).toFixed(2)}
Utilization: ${utilization.toFixed(1)}%
Last ${dateRange} days transactions:
${transactionSummary}

Category breakdown:
${Object.entries(categoryBreakdown).map(([cat, pct]) => `- ${cat}: ${pct.toFixed(1)}%`).join('\n')}

Provide analysis in JSON format:
{
  "spendingPatterns": [
    {
      "category": "Category Name",
      "percentage": number,
      "trend": "increasing" | "decreasing" | "stable",
      "insight": "Brief insight about this category"
    }
  ],
  "utilizationAnalysis": {
    "status": "high" | "moderate" | "healthy",
    "recommendation": "string",
    "creditScoreImpact": "negative" | "neutral" | "positive"
  },
  "topRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}`;

            try {
                const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${grokApiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'grok-beta',
                        messages: [
                            { role: 'system', content: 'You are a financial advisor AI specialized in credit card analysis.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.7,
                    }),
                });

                if (grokResponse.ok) {
                    const grokData = await grokResponse.json();
                    const content = grokData.choices[0].message.content;

                    // Parse JSON from response
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const analysis = JSON.parse(jsonMatch[0]);
                        spendingPatterns = analysis.spendingPatterns || [];
                        utilizationAnalysis = analysis.utilizationAnalysis;
                        recommendations = analysis.topRecommendations || [];
                    }
                }
            } catch (grokError) {
                console.error('Grok API error:', grokError);
                // Fall through to fallback analysis
            }
        }

        // ==============================================================
        // Step 6: Fallback Analysis (if Grok API unavailable)
        // ==============================================================
        if (!spendingPatterns.length) {
            // Generate basic spending patterns from category breakdown
            spendingPatterns = Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, percentage]) => ({
                    category,
                    percentage: parseFloat(percentage.toFixed(1)),
                    trend: 'stable' as const,
                    insight: `${category} represents ${percentage.toFixed(1)}% of your spending`,
                }));
        }

        if (!utilizationAnalysis) {
            // Generate basic utilization analysis
            let status: 'high' | 'moderate' | 'healthy';
            let recommendation: string;
            let creditScoreImpact: 'negative' | 'neutral' | 'positive';

            if (utilization > 70) {
                status = 'high';
                recommendation = 'Your credit utilization is high. Consider paying down your balance to improve your credit score.';
                creditScoreImpact = 'negative';
            } else if (utilization > 30) {
                status = 'moderate';
                recommendation = 'Your credit utilization is moderate. Keep it below 30% for optimal credit score impact.';
                creditScoreImpact = 'neutral';
            } else {
                status = 'healthy';
                recommendation = 'Great job! Your credit utilization is healthy. Maintain this level for best credit score.';
                creditScoreImpact = 'positive';
            }

            utilizationAnalysis = { status, recommendation, creditScoreImpact };
        }

        if (!recommendations.length) {
            // Generate basic recommendations
            recommendations = [
                `Current utilization: ${utilization.toFixed(1)}%. ${utilizationAnalysis.recommendation}`,
                `Total spent in last ${dateRange} days: RM${totalSpent.toFixed(2)}`,
            ];

            if (unusualActivity.length > 0) {
                recommendations.push(`${unusualActivity.length} unusual transactions detected - review for accuracy`);
            }
        }

        // ==============================================================
        // Step 7: Save Analytics to Database
        // ==============================================================
        const { error: insertError } = await supabaseClient
            .from('credit_card_analytics')
            .upsert({
                account_id: accountId,
                analysis_date: new Date().toISOString().split('T')[0],
                spending_patterns: spendingPatterns,
                utilization_analysis: utilizationAnalysis,
                unusual_activity: unusualActivity,
                recommendations,
            }, {
                onConflict: 'account_id,analysis_date',
            });

        if (insertError) {
            console.error('Error saving analytics:', insertError);
        }

        // ==============================================================
        // Step 8: Return Analysis
        // ==============================================================
        return new Response(
            JSON.stringify({
                success: true,
                account: {
                    id: account.id,
                    name: account.name,
                    creditLimit: account.credit_limit,
                    balance: account.balance,
                    utilization: utilization.toFixed(1),
                },
                analysis: {
                    spendingPatterns,
                    utilizationAnalysis,
                    unusualActivity,
                    recommendations,
                },
                metadata: {
                    transactionCount: transactions?.length || 0,
                    totalSpent,
                    dateRange,
                    analysisDate: new Date().toISOString(),
                },
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );
    } catch (error) {
        console.error('Function error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
});
