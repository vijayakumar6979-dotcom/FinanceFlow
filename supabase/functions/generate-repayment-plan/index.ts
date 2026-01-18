import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ==================================================================
// Repayment Calculation Functions (matching shared/utils)
// ==================================================================

function calculateMonthlyPayment(balance: number, aprPercentage: number, months: number): number {
    if (months <= 0 || balance <= 0) return 0;
    if (aprPercentage === 0) return balance / months;

    const monthlyRate = aprPercentage / 100 / 12;
    const payment = (monthlyRate * balance) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(payment * 100) / 100;
}

function calculateTotalInterest(balance: number, monthlyPayment: number, aprPercentage: number): number {
    if (monthlyPayment <= 0 || balance <= 0) return 0;

    const monthlyRate = aprPercentage / 100 / 12;
    let remainingBalance = balance;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600;

    while (remainingBalance > 0.01 && months < maxMonths) {
        const interestCharge = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestCharge;

        if (principalPayment <= 0) {
            throw new Error('Monthly payment too low to cover interest');
        }

        totalInterest += interestCharge;
        remainingBalance -= principalPayment;
        months++;
    }

    return Math.round(totalInterest * 100) / 100;
}

function calculatePayoffDate(durationMonths: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + durationMonths);
    return date.toISOString().split('T')[0];
}

function calculateMinimumPayment(balance: number, minPercentage: number = 5.0, minAmount: number = 25): number {
    const percentagePayment = balance * (minPercentage / 100);
    return Math.max(percentagePayment, minAmount);
}

function calculatePayoffMonths(balance: number, monthlyPayment: number, aprPercentage: number): number {
    if (monthlyPayment <= 0 || balance <= 0) return 0;

    const monthlyRate = aprPercentage / 100 / 12;
    let remainingBalance = balance;
    let months = 0;
    const maxMonths = 600;

    while (remainingBalance > 0.01 && months < maxMonths) {
        const interestCharge = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestCharge;

        if (principalPayment <= 0) {
            return maxMonths;
        }

        remainingBalance -= principalPayment;
        months++;
    }

    return months;
}

// ==================================================================
// Main Edge Function
// ==================================================================

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        // Parse request
        const { accountId, userIncome } = await req.json();

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

        const outstandingBalance = Math.abs(account.balance);
        const apr = account.interest_rate || 18.0; // Default 18% APR
        const minPaymentPercentage = account.minimum_payment_percentage || 5.0;

        if (outstandingBalance <= 0) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'No outstanding balance - account is paid off!',
                    plans: [],
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // ==============================================================
        // Step 2: Calculate Minimum Payment Scenario (for comparison)
        // ==============================================================
        const minPayment = calculateMinimumPayment(outstandingBalance, minPaymentPercentage);
        const minMonths = calculatePayoffMonths(outstandingBalance, minPayment, apr);
        const minInterest = calculateTotalInterest(outstandingBalance, minPayment, apr);

        // ==============================================================
        // Step 3: Generate Standard Repayment Plans
        // ==============================================================
        const plans = [];

        // Aggressive Plan: 6 months
        try {
            const aggressivePayment = calculateMonthlyPayment(outstandingBalance, apr, 6);
            const aggressiveInterest = calculateTotalInterest(outstandingBalance, aggressivePayment, apr);

            plans.push({
                plan_name: 'aggressive',
                monthly_payment: aggressivePayment,
                duration_months: 6,
                total_interest: aggressiveInterest,
                payoff_date: calculatePayoffDate(6),
                initial_balance: outstandingBalance,
                interest_rate: apr,
                interest_saved_vs_minimum: minInterest - aggressiveInterest,
                pros: [
                    `Save RM${(minInterest - aggressiveInterest).toFixed(2)} in interest vs minimum payments`,
                    'Debt-free in just 6 months',
                    'Lowest total interest paid',
                    'Fastest credit score improvement',
                ],
                cons: [
                    `High monthly commitment: RM${aggressivePayment.toFixed(2)}`,
                    'May strain monthly budget',
                    'Less flexibility for emergencies',
                ],
                budget_adjustments: [],
            });
        } catch (error) {
            console.log('Aggressive plan not feasible:', error.message);
        }

        // Balanced Plan: 12 months
        try {
            const balancedPayment = calculateMonthlyPayment(outstandingBalance, apr, 12);
            const balancedInterest = calculateTotalInterest(outstandingBalance, balancedPayment, apr);

            plans.push({
                plan_name: 'balanced',
                monthly_payment: balancedPayment,
                duration_months: 12,
                total_interest: balancedInterest,
                payoff_date: calculatePayoffDate(12),
                initial_balance: outstandingBalance,
                interest_rate: apr,
                interest_saved_vs_minimum: minInterest - balancedInterest,
                pros: [
                    `Save RM${(minInterest - balancedInterest).toFixed(2)} in interest`,
                    'Moderate monthly payment',
                    'Good balance between speed and affordability',
                    'Debt-free in 1 year',
                ],
                cons: [
                    `Monthly payment: RM${balancedPayment.toFixed(2)}`,
                    'Still requires budget discipline',
                ],
                budget_adjustments: [],
            });
        } catch (error) {
            console.log('Balanced plan not feasible:', error.message);
        }

        // Conservative Plan: 24 months
        try {
            const conservativePayment = calculateMonthlyPayment(outstandingBalance, apr, 24);
            const conservativeInterest = calculateTotalInterest(outstandingBalance, conservativePayment, apr);

            plans.push({
                plan_name: 'conservative',
                monthly_payment: conservativePayment,
                duration_months: 24,
                total_interest: conservativeInterest,
                payoff_date: calculatePayoffDate(24),
                initial_balance: outstandingBalance,
                interest_rate: apr,
                interest_saved_vs_minimum: minInterest - conservativeInterest,
                pros: [
                    `Lower monthly payment: RM${conservativePayment.toFixed(2)}`,
                    'More budget flexibility',
                    'Easier to maintain',
                    `Still save RM${(minInterest - conservativeInterest).toFixed(2)} vs minimum`,
                ],
                cons: [
                    'Longer 2-year timeline',
                    'More total interest paid',
                    'Slower credit score improvement',
                ],
                budget_adjustments: [],
            });
        } catch (error) {
            console.log('Conservative plan not feasible:', error.message);
        }

        if (plans.length === 0) {
            throw new Error('Unable to generate feasible repayment plans. Balance may be too high or interest rate too low.');
        }

        // ==============================================================
        // Step 4: Call Grok API for Personalized Recommendations
        // ==============================================================
        const grokApiKey = Deno.env.get('GROK_API_KEY');
        let grokRecommendations: string[] = [];
        let budgetAdjustments: Array<{ category: string; amount: number; action: string }> = [];

        if (grokApiKey && userIncome) {
            const prompt = `You are a debt repayment advisor. Create personalized recommendations for credit card debt repayment.

Credit Card Details:
- Outstanding Balance: RM${outstandingBalance.toFixed(2)}
- Interest Rate: ${apr}% APR
- Minimum Payment: RM${minPayment.toFixed(2)} (${minPaymentPercentage}% of balance)
- User's Monthly Income: RM${userIncome ? userIncome.toFixed(2) : 'Not provided'}

Generated Plans:
${plans.map(p => `- ${p.plan_name}: RM${p.monthly_payment.toFixed(2)}/month for ${p.duration_months} months (Interest: RM${p.total_interest.toFixed(2)})`).join('\n')}

Provide personalized recommendations in JSON format:
{
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3"
  ],
  "budgetAdjustments": [
    {
      "category": "Category name",
      "amount": number,
      "action": "Reduce/Cancel/Optimize"
    }
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
                            { role: 'system', content: 'You are a financial advisor specializing in debt repayment.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.7,
                    }),
                });

                if (grokResponse.ok) {
                    const grokData = await grokResponse.json();
                    const content = grokData.choices[0].message.content;

                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const aiAdvice = JSON.parse(jsonMatch[0]);
                        grokRecommendations = aiAdvice.recommendations || [];
                        budgetAdjustments = aiAdvice.budgetAdjustments || [];
                    }
                }
            } catch (grokError) {
                console.error('Grok API error:', grokError);
            }
        }

        // ==============================================================
        // Step 5: Add Fallback Recommendations
        // ==============================================================
        if (grokRecommendations.length === 0) {
            grokRecommendations = [
                `Start with the Balanced plan (RM${plans.find(p => p.plan_name === 'balanced')?.monthly_payment.toFixed(2) || '0'}/month) for sustainable repayment`,
                `Paying minimum only will cost you RM${minInterest.toFixed(2)} in interest over ${minMonths} months`,
                'Consider balance transfer to 0% APR card to save on interest',
                'Set up automatic payments to avoid late fees',
            ];
        }

        // Add budget adjustments to plans
        plans.forEach(plan => {
            plan.budget_adjustments = budgetAdjustments;
        });

        // ==============================================================
        // Step 6: Save Plans to Database
        // ==============================================================
        // First, deactivate old plans
        await supabaseClient
            .from('repayment_plans')
            .update({ is_active: false })
            .eq('account_id', accountId);

        // Insert new plans
        const { error: insertError } = await supabaseClient
            .from('repayment_plans')
            .insert(plans.map(p => ({
                ...p,
                account_id: accountId,
                is_active: true,
                is_selected: false,
            })));

        if (insertError) {
            console.error('Error saving repayment plans:', insertError);
        }

        // ==============================================================
        // Step 7: Return Response
        // ==============================================================
        return new Response(
            JSON.stringify({
                success: true,
                account: {
                    id: account.id,
                    name: account.name,
                    outstandingBalance,
                    creditLimit: account.credit_limit,
                    apr,
                },
                plans,
                minimumPaymentScenario: {
                    monthlyPayment: minPayment,
                    duration: minMonths,
                    totalInterest: minInterest,
                    totalPaid: outstandingBalance + minInterest,
                },
                recommendations: grokRecommendations,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    userIncomeProvided: !!userIncome,
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
