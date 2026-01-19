export class GrokService {
    private apiKey: string;
    private baseUrl = 'https://api.x.ai/v1/chat/completions';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async callGrok(messages: any[], temperature = 0.7) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'grok-beta',
                    messages,
                    temperature,
                    stream: false
                })
            });

            if (!response.ok) {
                console.error('Grok API Error:', response.statusText);
                throw new Error('Failed to fetch from Grok API');
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Grok Service Error:', error);
            throw error;
        }
    }

    /**
     * Generate general financial insight
     */
    async generateInsight(prompt: string) {
        return this.callGrok([
            { role: 'system', content: 'You are an expert financial advisor AI powered by Grok. Provide concise, actionable, and encouraging financial advice.' },
            { role: 'user', content: prompt }
        ]);
    }

    /**
     * Generate structured budget recommendations
     */
    async generateBudgetRecommendations(input: {
        income: number;
        spendingData: any;
        currentBudgets: any;
        goals: any;
    }) {
        const prompt = `
            Analyze this user's financial data and recommend optimal budget allocations.
            Monthly Income: RM ${input.income}
            Spending Data: ${JSON.stringify(input.spendingData)}
            Current Budgets: ${JSON.stringify(input.currentBudgets)}
            Financial Goals: ${JSON.stringify(input.goals)}

            Provide budget recommendations in valid JSON format ONLY, matching this schema:
            {
                "recommendedBudgets": [
                    {
                        "category": "Category Name",
                        "suggestedAmount": 0,
                        "reasoning": "Reason here",
                        "difficulty": "easy" | "moderate" | "hard",
                        "tips": ["tip 1", "tip 2"]
                    }
                ],
                "budgetStrategy": "50/30/20" | "zero-based" | "envelope",
                "totalBudget": 0,
                "savingsPotential": 0,
                "advice": "General advice"
            }
        `;

        const response = await this.callGrok([
            { role: 'system', content: 'You are a strict JSON-speaking financial planning AI. Only return valid JSON.' },
            { role: 'user', content: prompt }
        ], 0.3); // Lower temp for structured data

        try {
            // value might be wrapped in markdown code blocks
            const cleanJson = response.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Grok JSON:', e);
            return null;
        }
    }

    /**
     * Analyze goal feasibility
     */
    async analyzeGoalFeasibility(input: {
        goalName: string;
        targetAmount: number;
        targetDate: string;
        currentAmount: number;
        monthlyIncome: number;
        monthlyExpenses: number;
    }) {
        const prompt = `
            Analyze if this financial goal is achievable.
            Goal: ${input.goalName} - Save RM ${input.targetAmount} by ${input.targetDate}
            Current Amount: RM ${input.currentAmount}
            Monthly Income: RM ${input.monthlyIncome}
            Monthly Expenses: RM ${input.monthlyExpenses}

            Return valid JSON ONLY:
            {
                "feasibilityScore": 0-100,
                "monthlyContributionNeeded": 0,
                "isAchievable": boolean,
                "requiredAdjustments": [
                    { "category": "Category", "freedAmount": 0 }
                ],
                "alternativeTimelines": [
                    { "months": 0, "monthlyContribution": 0 }
                ],
                "advice": "Advice string"
            }
        `;

        const response = await this.callGrok([
            { role: 'system', content: 'You are a strict JSON-speaking financial planning AI. Only return valid JSON.' },
            { role: 'user', content: prompt }
        ], 0.3);

        try {
            const cleanJson = response.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Grok JSON:', e);
            return null;
        }
    }

    /**
     * Generate debt payoff strategy recommendations for loans
     */
    async generateDebtPayoffStrategy(input: {
        loans: Array<{
            name: string;
            balance: number;
            interestRate: number;
            monthlyPayment: number;
            type: string;
        }>;
        extraPayment: number;
        monthlyIncome?: number;
    }) {
        const prompt = `
            Analyze these loans and provide personalized debt payoff recommendations for a Malaysian user:

            **Loans:**
            ${input.loans.map((loan, i) => `${i + 1}. ${loan.name} (${loan.type}): RM ${loan.balance.toLocaleString()} at ${loan.interestRate}% (RM ${loan.monthlyPayment}/month)`).join('\n')}

            **Extra Payment Available:** RM ${input.extraPayment}/month
            ${input.monthlyIncome ? `**Monthly Income:** RM ${input.monthlyIncome.toLocaleString()}` : ''}

            Provide valid JSON ONLY with this structure:
            {
                "customAdvice": ["tip 1", "tip 2", "tip 3"],
                "quickWins": ["action 1", "action 2", "action 3"],
                "milestones": [
                    {
                        "achievement": "First loan paid off",
                        "estimatedDate": "2026-12-01",
                        "impact": "Free up RM X/month"
                    }
                ]
            }

            Consider Malaysian context (EPF, PTPTN, local banks). Be specific with amounts and dates.
        `;

        const response = await this.callGrok([
            { role: 'system', content: 'You are a Malaysian financial advisor specializing in debt management. Only return valid JSON.' },
            { role: 'user', content: prompt }
        ], 0.7);

        try {
            const cleanJson = response.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Grok JSON:', e);
            // Return fallback
            return this.getFallbackDebtStrategy(input.loans, input.extraPayment);
        }
    }

    /**
     * Analyze refinancing opportunities
     */
    async analyzeRefinancing(input: {
        loanName: string;
        currentBalance: number;
        currentRate: number;
        remainingMonths: number;
        newRate: number;
    }) {
        const prompt = `
            Analyze this refinancing opportunity for a Malaysian borrower:

            **Current Loan:** ${input.loanName}
            - Balance: RM ${input.currentBalance.toLocaleString()}
            - Current Rate: ${input.currentRate}%
            - Remaining: ${input.remainingMonths} months

            **Potential New Rate:** ${input.newRate}%

            Provide valid JSON ONLY:
            {
                "recommendation": "Clear yes/no/maybe with brief explanation",
                "pros": ["pro 1", "pro 2", "pro 3"],
                "cons": ["con 1", "con 2"],
                "actionSteps": ["step 1", "step 2", "step 3"]
            }

            Consider Malaysian context (legal fees, stamp duty, lock-in periods).
        `;

        const response = await this.callGrok([
            { role: 'system', content: 'You are a Malaysian loan refinancing expert. Only return valid JSON.' },
            { role: 'user', content: prompt }
        ], 0.6);

        try {
            const cleanJson = response.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Grok JSON:', e);
            return this.getFallbackRefinancing(input.currentRate, input.newRate);
        }
    }

    /**
     * Generate loan insights
     */
    async generateLoanInsights(input: {
        loanName: string;
        loanType: string;
        balance: number;
        interestRate: number;
        monthlyPayment: number;
    }) {
        const prompt = `
            Analyze this loan and provide insights for a Malaysian borrower:

            **Loan:** ${input.loanName} (${input.loanType})
            - Balance: RM ${input.balance.toLocaleString()}
            - Interest Rate: ${input.interestRate}%
            - Monthly Payment: RM ${input.monthlyPayment.toLocaleString()}

            Provide valid JSON ONLY:
            {
                "insights": ["insight 1", "insight 2"],
                "warnings": ["warning 1"],
                "opportunities": ["opportunity 1", "opportunity 2"]
            }

            Be specific and actionable. Consider Malaysian financial products.
        `;

        const response = await this.callGrok([
            { role: 'system', content: 'You are a Malaysian financial advisor. Only return valid JSON.' },
            { role: 'user', content: prompt }
        ], 0.7);

        try {
            const cleanJson = response.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Grok JSON:', e);
            return this.getFallbackInsights(input.interestRate);
        }
    }

    /**
     * Fallback debt strategy when API fails
     */
    private getFallbackDebtStrategy(_loans: any[], extraPayment: number) {
        return {
            customAdvice: [
                `Focus your RM ${extraPayment} extra payment on the loan with the highest interest rate`,
                'Consider the Avalanche method to maximize interest savings',
                'Set up automatic payments to never miss a due date',
                'Review your budget monthly to find additional funds for debt payoff'
            ],
            quickWins: [
                'Set up auto-debit for all loan payments this week',
                'Call your bank to negotiate a lower interest rate',
                'Cut one unnecessary subscription and redirect to debt',
                'Create a visual debt payoff tracker'
            ],
            milestones: [
                {
                    achievement: 'First loan paid off',
                    estimatedDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    impact: 'Free up monthly cash flow'
                },
                {
                    achievement: '50% debt-free',
                    estimatedDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    impact: 'Halfway to financial freedom!'
                }
            ]
        };
    }

    /**
     * Fallback refinancing analysis
     */
    private getFallbackRefinancing(currentRate: number, newRate: number) {
        const rateDiff = currentRate - newRate;
        const isWorthwhile = rateDiff >= 0.5;

        return {
            recommendation: isWorthwhile
                ? `Yes, refinancing could save you money with a ${rateDiff.toFixed(2)}% rate reduction`
                : `Maybe not - the rate difference is only ${rateDiff.toFixed(2)}%`,
            pros: [
                'Lower monthly payments',
                'Reduced total interest',
                'Potential to pay off faster',
                'Improved cash flow'
            ],
            cons: [
                'Legal fees and stamp duty costs',
                'Possible lock-in penalties',
                'Time and paperwork required'
            ],
            actionSteps: [
                'Get quotes from at least 3 banks',
                'Calculate total costs including fees',
                'Check for prepayment penalties',
                'Compare savings vs. costs',
                'Negotiate with current bank'
            ]
        };
    }

    /**
     * Fallback loan insights
     */
    private getFallbackInsights(interestRate: number) {
        return {
            insights: [
                `Your ${interestRate}% rate is ${interestRate > 6 ? 'above' : 'within'} typical range`,
                'Extra payments can significantly reduce total interest',
                'Consider refinancing if rates have dropped'
            ],
            warnings: [
                'High interest compounds quickly - prioritize for extra payments',
                'Missing payments damages credit score'
            ],
            opportunities: [
                'Negotiate with lender for rate reduction',
                'Make bi-weekly payments to save interest',
                'Round up payments to accelerate payoff'
            ]
        };
    }
}
