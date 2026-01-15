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
}
