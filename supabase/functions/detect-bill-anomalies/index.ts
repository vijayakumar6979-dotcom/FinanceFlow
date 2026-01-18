import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnomalyRequest {
    billId: string;
    currentAmount: number;
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

        const { billId, currentAmount } = await req.json() as AnomalyRequest;

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
            .select('amount, due_date')
            .eq('bill_id', billId)
            .order('due_date', { ascending: false })
            .limit(12);

        if (paymentsError) throw paymentsError;

        // Detect anomalies
        const anomalyResult = detectAnomaly(payments || [], currentAmount, bill);

        // Update bill with anomaly detection results
        if (anomalyResult.isAnomaly) {
            await supabaseClient
                .from('bills')
                .update({
                    anomaly_detected: true,
                    anomaly_severity: anomalyResult.severity,
                    anomaly_description: anomalyResult.description,
                })
                .eq('id', billId);
        } else {
            await supabaseClient
                .from('bills')
                .update({
                    anomaly_detected: false,
                    anomaly_severity: null,
                    anomaly_description: null,
                })
                .eq('id', billId);
        }

        return new Response(JSON.stringify(anomalyResult), {
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

function detectAnomaly(
    payments: any[],
    currentAmount: number,
    bill: any
): {
    isAnomaly: boolean;
    severity: 'low' | 'medium' | 'high' | null;
    description: string;
    percentageChange: number;
    expectedRange: { min: number; max: number };
    recommendations: string[];
} {
    // If no payment history, can't detect anomalies
    if (!payments || payments.length < 3) {
        return {
            isAnomaly: false,
            severity: null,
            description: 'Insufficient payment history for anomaly detection',
            percentageChange: 0,
            expectedRange: { min: 0, max: 0 },
            recommendations: ['Build payment history for better anomaly detection'],
        };
    }

    // Calculate statistics
    const amounts = payments.map(p => p.amount);
    const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Expected range (2 standard deviations)
    const expectedMin = avg - (2 * stdDev);
    const expectedMax = avg + (2 * stdDev);

    // Calculate percentage change from average
    const percentageChange = ((currentAmount - avg) / avg) * 100;

    // Determine if anomaly
    const isAnomaly = currentAmount < expectedMin || currentAmount > expectedMax;

    let severity: 'low' | 'medium' | 'high' | null = null;
    let description = '';
    const recommendations: string[] = [];

    if (isAnomaly) {
        const deviations = Math.abs((currentAmount - avg) / stdDev);

        if (deviations > 3) {
            severity = 'high';
            description = `Extreme anomaly detected! Bill is ${Math.abs(percentageChange).toFixed(1)}% ${currentAmount > avg ? 'higher' : 'lower'} than average.`;
            recommendations.push('Verify bill accuracy immediately');
            recommendations.push('Check for billing errors or unusual usage');
            if (currentAmount > avg) {
                recommendations.push('Review recent consumption patterns');
                recommendations.push('Contact provider if charge seems incorrect');
            }
        } else if (deviations > 2) {
            severity = 'medium';
            description = `Significant anomaly detected. Bill is ${Math.abs(percentageChange).toFixed(1)}% ${currentAmount > avg ? 'higher' : 'lower'} than average.`;
            recommendations.push('Review bill details');
            if (currentAmount > avg) {
                recommendations.push('Check for increased usage or rate changes');
            } else {
                recommendations.push('Verify if this is a partial bill or credit');
            }
        } else {
            severity = 'low';
            description = `Minor anomaly detected. Bill is ${Math.abs(percentageChange).toFixed(1)}% ${currentAmount > avg ? 'higher' : 'lower'} than usual.`;
            recommendations.push('Monitor next month for patterns');
        }
    } else {
        description = `Bill amount is within normal range (RM ${expectedMin.toFixed(2)} - RM ${expectedMax.toFixed(2)})`;
        recommendations.push('No action needed - amount is consistent with history');
    }

    return {
        isAnomaly,
        severity,
        description,
        percentageChange: Math.round(percentageChange * 10) / 10,
        expectedRange: {
            min: Math.round(expectedMin * 100) / 100,
            max: Math.round(expectedMax * 100) / 100,
        },
        recommendations,
    };
}
