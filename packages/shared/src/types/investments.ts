export type InvestmentType = 'stock' | 'crypto' | 'fund' | 'etf' | 'bond' | 'real_estate';

export type InvestmentTransactionType = 'buy' | 'sell' | 'dividend' | 'interest';

export interface Investment {
    id: string;
    user_id: string;
    symbol: string;
    name: string;
    type: InvestmentType;
    quantity: number;
    avg_cost: number;
    currency: string;
    exchange: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    // Calculated fields (optional/frontend)
    current_price?: number;
    current_value?: number;
    profit_loss?: number;
    profit_loss_pct?: number;
}

export interface InvestmentTransaction {
    id: string;
    investment_id: string;
    type: InvestmentTransactionType;
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    fees: number;
    transaction_date: string;
    created_at: string;
}

export interface MarketData {
    symbol: string;
    price: number;
    change: number;
    change_percent: number;
    volume: number;
    high: number;
    low: number;
    market_cap?: number;
    last_updated: string;
}

export interface PortfolioSummary {
    total_value: number;
    total_invested: number;
    total_profit_loss: number;
    total_profit_loss_pct: number;
    daily_change: number;
    daily_change_pct: number;
}

export type AssetAllocation = {
    type: string;
    value: number;
    percentage: number;
}[];
