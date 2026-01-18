import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionRequest {
    billId: string;
    predictionMonth: string;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        );

        // Get user from JWT
        const {
            data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) {
            throw new Error('Not authenticated');
        }

        const { billId, predictionMonth } = await req.json() as PredictionRequest;

        // Get bill details
        const { data: bill, error: billError } = await supabaseClient
            .from('bills')
            .select('*')
            .eq('id', billId)
            .eq('user_id', user.id)
            .single();

        if (billError) throw billError;

        // Get payment history (last 12 months)
        const { data: payments, error: paymentsError } = await supabaseClient
            .from('bill_payments')
            .select('amount, due_date, paid_date')
            .eq('bill_id', billId)
            .order('due_date', { ascending: false })
            .limit(12);

        if (paymentsError) throw paymentsError;

        let predictedAmount: number;
        let confidenceScore: number;
        let amountRangeMin: number;
        let amountRangeMax: number;
        let reasoning: string;
        let factors: string[] = [];
        let recommendations: string[] = [];

        // If bill is fixed amount, prediction is straightforward
        if (!bill.is_variable) {
            predictedAmount = bill.fixed_amount || 0;
            confidenceScore = 100;
            amountRangeMin = predictedAmount;
            amountRangeMax = predictedAmount;
            reasoning = 'This is a fixed-amount bill with consistent monthly charges.';
            factors = ['Fixed billing amount'];
            recommendations = ['No action needed - amount is consistent'];
        } else {
            // Variable bill - use AI or statistical prediction
            const grokApiKey = Deno.env.get('GROK_API_KEY');

            if (grokApiKey && payments && payments.length >= 3) {
                // Use Grok API for AI prediction
                try {
                    const paymentHistory = payments.map(p => ({
                        amount: p.amount,
                        date: p.due_date,
                    }));

                    const prompt = `You are a financial AI assistant. Predict the next bill amount based on historical data.

Bill Details:
- Provider: ${bill.provider_name}
- Category: ${bill.provider_category}
- Current Estimated Amount: RM ${bill.estimated_amount}

Payment History (last ${payments.length} months):
${paymentHistory.map((p, i) => `${i + 1}. ${p.date}: RM ${p.amount}`).join('\n')}

Prediction Month: ${predictionMonth}

Provide a JSON response with:
1. predicted_amount (number): The predicted bill amount
2. confidence_score (number 0-100): How confident you are
3. amount_range_min (number): Minimum expected amount
4. amount_range_max (number): Maximum expected amount
5. reasoning (string): Brief explanation of prediction
6. factors (array of strings): Key factors affecting the prediction
7. recommendations (array of strings): Actionable advice

Consider seasonal patterns, trends, and anomalies. Response must be valid JSON only.`;

                    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${grokApiKey}`,
                        },
                        body: JSON.stringify({
                            model: 'grok-beta',
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are a financial prediction AI. Always respond with valid JSON only.',
                                },
                                {
                                    role: 'user',
                                    content: prompt,
                                },
                            ],
                            temperature: 0.3,
                        }),
                    });

                    if (!grokResponse.ok) {
                        throw new Error('Grok API request failed');
                    }

                    const grokData = await grokResponse.json();
                    const aiResponse = JSON.parse(grokData.choices[0].message.content);

                    predictedAmount = aiResponse.predicted_amount;
                    confidenceScore = aiResponse.confidence_score;
                    amountRangeMin = aiResponse.amount_range_min;
                    amountRangeMax = aiResponse.amount_range_max;
                    reasoning = aiResponse.reasoning;
                    factors = aiResponse.factors;
                    recommendations = aiResponse.recommendations;
                } catch (aiError) {
                    console.error('AI prediction failed, falling back to statistical method:', aiError);
                    // Fallback to statistical prediction
                    const stats = calculateStatisticalPrediction(payments, bill.estimated_amount || 0);
                    predictedAmount = stats.predicted;
                    confidenceScore = stats.confidence;
                    amountRangeMin = stats.min;
                    amountRangeMax = stats.max;
                    reasoning = stats.reasoning;
                    factors = stats.factors;
                    recommendations = stats.recommendations;
                }
            } else {
                // Fallback to statistical prediction
                const stats = calculateStatisticalPrediction(payments || [], bill.estimated_amount || 0);
                predictedAmount = stats.predicted;
                confidenceScore = stats.confidence;
                amountRangeMin = stats.min;
                amountRangeMax = stats.max;
                reasoning = stats.reasoning;
                factors = stats.factors;
                recommendations = stats.recommendations;
            }
        }

        // Store prediction in database
        const { data: prediction, error: predictionError } = await supabaseClient
            .from('bill_predictions')
            .upsert({
                bill_id: billId,
                prediction_month: predictionMonth,
                predicted_amount: predictedAmount,
                confidence_score: confidenceScore,
                amount_range_min: amountRangeMin,
                amount_range_max: amountRangeMax,
                reasoning,
                factors,
                recommendations,
            })
            .select()
            .single();

        if (predictionError) throw predictionError;

        return new Response(JSON.stringify(prediction), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

// Statistical prediction fallback
function calculateStatisticalPrediction(
    payments: any[],
    estimatedAmount: number
): {
    predicted: number;
    confidence: number;
    min: number;
    max: number;
    reasoning: string;
    factors: string[];
    recommendations: string[];
} {
    if (!payments || payments.length === 0) {
        return {
            predicted: estimatedAmount,
            confidence: 50,
            min: estimatedAmount * 0.8,
            max: estimatedAmount * 1.2,
            reasoning: 'No payment history available. Using estimated amount.',
            factors: ['No historical data'],
            recommendations: ['Track actual amounts to improve predictions'],
        };
    }

    const amounts = payments.map(p => p.amount);
    const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Calculate trend
    const trend = amounts.length >= 2 ? (amounts[0] - amounts[amounts.length - 1]) / amounts.length : 0;
    const predicted = avg + trend;

    // Confidence based on consistency
    const coefficientOfVariation = (stdDev / avg) * 100;
    const confidence = Math.max(50, Math.min(95, 100 - coefficientOfVariation));

    return {
        predicted: Math.round(predicted * 100) / 100,
        confidence: Math.round(confidence),
        min: Math.round((predicted - stdDev) * 100) / 100,
        max: Math.round((predicted + stdDev) * 100) / 100,
        reasoning: `Based on ${payments.length} months of history. Average: RM ${avg.toFixed(2)}, Trend: ${trend >= 0 ? '+' : ''}${trend.toFixed(2)}/month`,
        factors: [
            `${payments.length} months of data`,
            `Variation: ${coefficientOfVariation.toFixed(1)}%`,
            trend > 0 ? 'Increasing trend' : trend < 0 ? 'Decreasing trend' : 'Stable',
        ],
        recommendations: [
            coefficientOfVariation > 20 ? 'High variation detected - review usage patterns' : 'Consistent billing pattern',
            trend > 5 ? 'Consider energy-saving measures' : 'Usage is stable',
        ],
    };
}
