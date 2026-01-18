export interface BudgetTemplate {
    id: string;
    name: string;
    description: string;
    strategy: '50/30/20' | 'zero-based' | 'envelope' | 'minimum' | 'custom';
    categories: {
        name: string;
        percentage?: number;
        fixedAmount?: number;
        description: string;
        icon: string;
        color: string;
    }[];
}

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
    {
        id: '50-30-20',
        name: '50/30/20 Rule',
        description: 'Balanced approach: 50% Needs, 30% Wants, 20% Savings',
        strategy: '50/30/20',
        categories: [
            {
                name: 'Needs (Essential)',
                percentage: 50,
                description: 'Housing, food, utilities, transport, insurance',
                icon: '🏠',
                color: '#10B981',
            },
            {
                name: 'Wants (Lifestyle)',
                percentage: 30,
                description: 'Entertainment, dining out, hobbies, shopping',
                icon: '🎉',
                color: '#F59E0B',
            },
            {
                name: 'Savings & Debt',
                percentage: 20,
                description: 'Emergency fund, investments, debt payments',
                icon: '💰',
                color: '#0066FF',
            },
        ],
    },
    {
        id: 'zero-based',
        name: 'Zero-Based Budget',
        description: 'Assign every ringgit a purpose. Income = Expenses + Savings',
        strategy: 'zero-based',
        categories: [
            {
                name: 'Housing',
                percentage: 30,
                description: 'Rent/mortgage, property tax, maintenance',
                icon: '🏠',
                color: '#8B5CF6',
            },
            {
                name: 'Food & Groceries',
                percentage: 15,
                description: 'Groceries, meal prep, household supplies',
                icon: '🛒',
                color: '#10B981',
            },
            {
                name: 'Transportation',
                percentage: 10,
                description: 'Fuel, public transport, car maintenance',
                icon: '🚗',
                color: '#F59E0B',
            },
            {
                name: 'Utilities',
                percentage: 8,
                description: 'Electricity, water, internet, phone',
                icon: '⚡',
                color: '#06B6D4',
            },
            {
                name: 'Insurance',
                percentage: 7,
                description: 'Health, life, car, home insurance',
                icon: '🛡️',
                color: '#EC4899',
            },
            {
                name: 'Debt Payments',
                percentage: 10,
                description: 'Credit cards, loans, installments',
                icon: '💳',
                color: '#EF4444',
            },
            {
                name: 'Savings',
                percentage: 10,
                description: 'Emergency fund, retirement, investments',
                icon: '💰',
                color: '#0066FF',
            },
            {
                name: 'Personal & Entertainment',
                percentage: 10,
                description: 'Dining, hobbies, subscriptions, fun',
                icon: '🎭',
                color: '#F59E0B',
            },
        ],
    },
    {
        id: 'envelope',
        name: 'Envelope System',
        description: 'Cash-based categories with strict limits per envelope',
        strategy: 'envelope',
        categories: [
            {
                name: 'Groceries',
                percentage: 20,
                description: 'Weekly grocery shopping',
                icon: '🛒',
                color: '#10B981',
            },
            {
                name: 'Dining Out',
                percentage: 10,
                description: 'Restaurants, cafes, food delivery',
                icon: '🍽️',
                color: '#F59E0B',
            },
            {
                name: 'Entertainment',
                percentage: 8,
                description: 'Movies, events, hobbies',
                icon: '🎬',
                color: '#EC4899',
            },
            {
                name: 'Shopping',
                percentage: 12,
                description: 'Clothing, personal items',
                icon: '🛍️',
                color: '#8B5CF6',
            },
            {
                name: 'Transportation',
                percentage: 15,
                description: 'Fuel, parking, tolls',
                icon: '🚗',
                color: '#06B6D4',
            },
            {
                name: 'Personal Care',
                percentage: 5,
                description: 'Haircuts, cosmetics, wellness',
                icon: '💅',
                color: '#EC4899',
            },
            {
                name: 'Miscellaneous',
                percentage: 10,
                description: 'Unexpected expenses',
                icon: '📦',
                color: '#64748B',
            },
            {
                name: 'Savings',
                percentage: 20,
                description: 'Emergency fund and goals',
                icon: '💰',
                color: '#0066FF',
            },
        ],
    },
    {
        id: 'minimum',
        name: 'Minimum Budget',
        description: 'Essential expenses only - Emergency mode',
        strategy: 'minimum',
        categories: [
            {
                name: 'Housing',
                percentage: 35,
                description: 'Rent/mortgage only',
                icon: '🏠',
                color: '#8B5CF6',
            },
            {
                name: 'Food',
                percentage: 25,
                description: 'Groceries only, no dining out',
                icon: '🍞',
                color: '#10B981',
            },
            {
                name: 'Utilities',
                percentage: 15,
                description: 'Essential utilities only',
                icon: '⚡',
                color: '#06B6D4',
            },
            {
                name: 'Transportation',
                percentage: 15,
                description: 'Commute to work only',
                icon: '🚌',
                color: '#F59E0B',
            },
            {
                name: 'Minimum Debt Payments',
                percentage: 10,
                description: 'Minimum required payments',
                icon: '💳',
                color: '#EF4444',
            },
        ],
    },
];

/**
 * Calculate budget amounts based on income and template
 */
export function calculateBudgetFromTemplate(
    template: BudgetTemplate,
    monthlyIncome: number
): { category: string; amount: number; percentage: number; icon: string; color: string }[] {
    return template.categories.map(cat => ({
        category: cat.name,
        amount: cat.fixedAmount || Math.round((monthlyIncome * (cat.percentage || 0)) / 100),
        percentage: cat.percentage || 0,
        icon: cat.icon,
        color: cat.color,
    }));
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): BudgetTemplate | undefined {
    return BUDGET_TEMPLATES.find(t => t.id === id);
}
