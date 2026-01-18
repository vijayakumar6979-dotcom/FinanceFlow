import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Loan {
    id: string;
    name: string;
    loan_name: string;
    loan_type: string;
    lender_name: string;
    current_balance: number;
    interest_rate: number;
    monthly_payment: number;
    remaining_months: number;
}

interface PayoffStrategyRequest {
    userId: string;
    extraPaymentAmount?: number;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
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
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const requestData: PayoffStrategyRequest = await req.json()
        const extraPayment = requestData.extraPaymentAmount || 0

        // Fetch user's loans
        const { data: loans, error: loansError } = await supabaseClient
            .from('loans')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')

        if (loansError || !loans || loans.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No active loans found' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404,
                }
            )
        }

        // Fetch user profile for income/expenses
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        // Calculate strategies locally (fallback if Grok API not available)
        const strategies = calculateStrategies(loans, extraPayment)

        // Try to enhance with Grok AI if API key is available
        const grokApiKey = Deno.env.get('GROK_API_KEY')

        if (grokApiKey) {
            try {
                const aiEnhancedStrategies = await enhanceWithGrokAI(
                    loans,
                    profile,
                    extraPayment,
                    strategies,
                    grokApiKey
                )

                // Save strategies to database
                await saveStrategies(supabaseClient, user.id, aiEnhancedStrategies)

                return new Response(
                    JSON.stringify(aiEnhancedStrategies),
                    {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    }
                )
            } catch (aiError) {
                console.error('Grok AI error, falling back to local calculations:', aiError)
            }
        }

        // Fallback: Return local calculations
        await saveStrategies(supabaseClient, user.id, strategies)

        return new Response(
            JSON.stringify(strategies),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})

function calculateStrategies(loans: any[], extraPayment: number) {
    // Current Plan
    const currentPlan = {
        type: 'current',
        name: 'Current Plan',
        description: 'Continue with minimum payments on all loans',
        payoffOrder: loans.map(loan => ({
            loanId: loan.id,
            loanName: loan.loan_name || loan.name,
            reason: 'Minimum payment'
        })),
        ...simulatePayoff(loans, 0)
    }

    // Snowball Method (smallest balance first)
    const snowballLoans = [...loans].sort((a, b) => a.current_balance - b.current_balance)
    const snowballMethod = {
        type: 'snowball',
        name: 'Snowball Method',
        description: 'Pay off smallest balances first for quick wins',
        payoffOrder: snowballLoans.map(loan => ({
            loanId: loan.id,
            loanName: loan.loan_name || loan.name,
            reason: `Balance: RM ${loan.current_balance.toLocaleString()}`
        })),
        ...simulatePayoff(snowballLoans, extraPayment),
        pros: ['Quick psychological wins', 'Builds momentum', 'Frees up cash flow faster'],
        cons: ['May pay more interest than Avalanche method']
    }

    // Avalanche Method (highest interest first)
    const avalancheLoans = [...loans].sort((a, b) => b.interest_rate - a.interest_rate)
    const avalancheMethod = {
        type: 'avalanche',
        name: 'Avalanche Method',
        description: 'Pay off highest interest rates first for maximum savings',
        payoffOrder: avalancheLoans.map(loan => ({
            loanId: loan.id,
            loanName: loan.loan_name || loan.name,
            reason: `Interest Rate: ${loan.interest_rate}%`
        })),
        ...simulatePayoff(avalancheLoans, extraPayment),
        pros: ['Maximum interest savings', 'Mathematically optimal', 'Faster payoff'],
        cons: ['May take longer to see first loan paid off']
    }

    const bestStrategy = avalancheMethod.interestSaved >= snowballMethod.interestSaved ? 'avalanche' : 'snowball'
    const best = bestStrategy === 'avalanche' ? avalancheMethod : snowballMethod

    return {
        currentPlan,
        snowballMethod,
        avalancheMethod,
        recommendation: {
            bestStrategy,
            reasoning: `Save RM ${best.interestSaved.toLocaleString()} in interest and become debt-free ${best.monthsSaved} months earlier`,
            customAdvice: [
                `Focus RM ${extraPayment} extra per month on ${best.payoffOrder[0].loanName}`,
                'Set up auto-debit to never miss payments',
                'Review spending to free up more for debt payoff'
            ]
        },
        quickWins: [
            'Pay extra this month to build momentum',
            'Set up automatic payments',
            'Track your progress monthly'
        ],
        milestones: calculateMilestones(loans, best)
    }
}

function simulatePayoff(loans: any[], extraPayment: number) {
    let totalInterest = 0
    let maxMonths = 0

    loans.forEach(loan => {
        const monthlyRate = loan.interest_rate / 100 / 12
        const payment = loan.monthly_payment + (extraPayment / loans.length)

        let balance = loan.current_balance
        let months = 0
        let interest = 0

        while (balance > 0 && months < 600) {
            const interestPayment = balance * monthlyRate
            const principalPayment = Math.min(payment - interestPayment, balance)
            balance -= principalPayment
            interest += interestPayment
            months++
        }

        totalInterest += interest
        if (months > maxMonths) maxMonths = months
    })

    const payoffDate = new Date()
    payoffDate.setMonth(payoffDate.getMonth() + maxMonths)

    // Calculate baseline
    const baselineInterest = loans.reduce((sum, loan) => {
        const monthlyRate = loan.interest_rate / 100 / 12
        let balance = loan.current_balance
        let interest = 0
        let months = 0

        while (balance > 0 && months < 600) {
            const interestPayment = balance * monthlyRate
            const principalPayment = Math.min(loan.monthly_payment - interestPayment, balance)
            balance -= principalPayment
            interest += interestPayment
            months++
        }

        return sum + interest
    }, 0)

    return {
        payoffDate: payoffDate.toISOString().split('T')[0],
        totalInterest: Math.round(totalInterest * 100) / 100,
        interestSaved: Math.round((baselineInterest - totalInterest) * 100) / 100,
        monthsSaved: Math.max(0, Math.round((baselineInterest - totalInterest) / 100))
    }
}

function calculateMilestones(loans: any[], strategy: any) {
    const now = new Date()
    const milestones = []

    if (loans.length > 0) {
        const firstLoanDate = new Date(now)
        firstLoanDate.setMonth(firstLoanDate.getMonth() + 12)

        milestones.push({
            achievement: 'First loan paid off',
            estimatedDate: firstLoanDate.toISOString().split('T')[0],
            impact: `Free up RM ${loans[0].monthly_payment.toLocaleString()}/month`
        })
    }

    const halfwayDate = new Date(now)
    halfwayDate.setMonth(halfwayDate.getMonth() + 24)

    milestones.push({
        achievement: '50% debt-free',
        estimatedDate: halfwayDate.toISOString().split('T')[0],
        impact: 'Halfway to financial freedom!'
    })

    return milestones
}

async function enhanceWithGrokAI(
    loans: any[],
    profile: any,
    extraPayment: number,
    baseStrategies: any,
    apiKey: string
) {
    const prompt = `You are a debt payoff strategist for Malaysian users. Analyze these loans and enhance the repayment strategies.

User's Loans:
${loans.map(loan => `- ${loan.loan_name}: RM ${loan.current_balance} at ${loan.interest_rate}% (RM ${loan.monthly_payment}/month)`).join('\n')}

Extra Payment Available: RM ${extraPayment}

Provide enhanced recommendations in JSON format with:
1. Customized advice for this specific situation
2. Quick wins they can implement immediately
3. Milestones to celebrate

Consider Malaysian context (EPF, PTPTN, typical rates).`

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'grok-beta',
            messages: [
                { role: 'system', content: 'You are a financial advisor specializing in debt management for Malaysian users.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7
        })
    })

    if (!response.ok) {
        throw new Error('Grok API request failed')
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Try to parse JSON from AI response
    try {
        const aiEnhancements = JSON.parse(aiResponse)

        // Merge AI enhancements with base strategies
        return {
            ...baseStrategies,
            recommendation: {
                ...baseStrategies.recommendation,
                customAdvice: aiEnhancements.customAdvice || baseStrategies.recommendation.customAdvice
            },
            quickWins: aiEnhancements.quickWins || baseStrategies.quickWins,
            milestones: aiEnhancements.milestones || baseStrategies.milestones
        }
    } catch (parseError) {
        console.error('Failed to parse AI response, using base strategies')
        return baseStrategies
    }
}

async function saveStrategies(supabaseClient: any, userId: string, strategies: any) {
    // Save each strategy to database
    const strategiesToSave = [
        { ...strategies.currentPlan, user_id: userId, is_active: false },
        { ...strategies.snowballMethod, user_id: userId, is_active: false },
        { ...strategies.avalancheMethod, user_id: userId, is_active: false }
    ]

    // Delete existing strategies
    await supabaseClient
        .from('loan_payoff_strategies')
        .delete()
        .eq('user_id', userId)

    // Insert new strategies
    await supabaseClient
        .from('loan_payoff_strategies')
        .insert(strategiesToSave.map(s => ({
            user_id: s.user_id,
            strategy_type: s.type,
            strategy_name: s.name,
            extra_payment_amount: 0,
            loan_priority_order: { order: s.payoffOrder },
            projected_payoff_date: s.payoffDate,
            total_interest: s.totalInterest,
            interest_saved: s.interestSaved || 0,
            months_saved: s.monthsSaved || 0,
            is_active: s.is_active
        })))
}
