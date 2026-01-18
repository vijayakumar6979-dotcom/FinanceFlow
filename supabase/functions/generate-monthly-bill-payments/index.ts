import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
        // TEMPORARY: Skip CRON_SECRET check for testing
        // TODO: Re-enable this after testing
        /*
        const authHeader = req.headers.get('Authorization');
        const cronSecret = Deno.env.get('CRON_SECRET');
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
          throw new Error('Unauthorized');
        }
        */

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        );

        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7);

        // Get all active bills
        const { data: bills, error: billsError } = await supabaseClient
            .from('bills')
            .select('*')
            .eq('is_active', true);

        if (billsError) throw billsError;

        const results = {
            processed: 0,
            created: 0,
            skipped: 0,
            errors: 0,
            details: [],
        };

        for (const bill of bills || []) {
            try {
                results.processed++;

                // Check if payment already exists for this month
                const startOfMonth = `${currentMonth}-01`;
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    .toISOString()
                    .slice(0, 10);

                const { data: existingPayment } = await supabaseClient
                    .from('bill_payments')
                    .select('id')
                    .eq('bill_id', bill.id)
                    .gte('due_date', startOfMonth)
                    .lte('due_date', endOfMonth)
                    .single();

                if (existingPayment) {
                    results.skipped++;
                    results.details.push({
                        billId: bill.id,
                        billName: bill.bill_name,
                        status: 'skipped',
                        reason: 'Payment already exists for this month',
                    });
                    continue;
                }

                // Calculate due date for this month
                let dueDate = new Date(now.getFullYear(), now.getMonth(), bill.due_day);

                // If due date has passed, use next month
                if (dueDate < now) {
                    dueDate = new Date(now.getFullYear(), now.getMonth() + 1, bill.due_day);
                }

                // Determine amount
                let amount = bill.is_variable ? (bill.estimated_amount || 0) : (bill.fixed_amount || 0);

                // Try to get AI prediction if available
                const predictionMonth = dueDate.toISOString().slice(0, 7);
                const { data: prediction } = await supabaseClient
                    .from('bill_predictions')
                    .select('predicted_amount')
                    .eq('bill_id', bill.id)
                    .eq('prediction_month', predictionMonth)
                    .single();

                if (prediction && bill.is_variable) {
                    amount = prediction.predicted_amount;
                }

                // Create payment
                const { data: newPayment, error: paymentError } = await supabaseClient
                    .from('bill_payments')
                    .insert({
                        bill_id: bill.id,
                        user_id: bill.user_id,
                        amount,
                        due_date: dueDate.toISOString().slice(0, 10),
                        status: 'unpaid',
                    })
                    .select()
                    .single();

                if (paymentError) {
                    results.errors++;
                    results.details.push({
                        billId: bill.id,
                        billName: bill.bill_name,
                        status: 'error',
                        error: paymentError.message,
                    });
                    continue;
                }

                results.created++;
                results.details.push({
                    billId: bill.id,
                    billName: bill.bill_name,
                    status: 'created',
                    paymentId: newPayment.id,
                    amount,
                    dueDate: dueDate.toISOString().slice(0, 10),
                });
            } catch (error) {
                results.errors++;
                results.details.push({
                    billId: bill.id,
                    billName: bill.bill_name,
                    status: 'error',
                    error: error.message,
                });
            }
        }

        return new Response(JSON.stringify(results), {
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
