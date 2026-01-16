import { MarketData } from '../types/investments';

// Mock data generator for market prices
export const marketService = {
    getQuote: async (symbol: string): Promise<MarketData> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock logic based on symbol to return consistent-ish but random-ish data
        const basePrice = getMockBasePrice(symbol);
        const volatility = 0.02; // 2% daily move
        const randomChange = (Math.random() * volatility * 2) - volatility;
        const currentPrice = basePrice * (1 + randomChange);

        return {
            symbol: symbol.toUpperCase(),
            price: currentPrice,
            change: currentPrice - basePrice,
            change_percent: randomChange * 100,
            volume: Math.floor(Math.random() * 1000000),
            high: currentPrice * 1.01,
            low: currentPrice * 0.99,
            market_cap: 1000000000,
            last_updated: new Date().toISOString()
        };
    },

    getQuotes: async (symbols: string[]): Promise<Map<string, MarketData>> => {
        const quotes = await Promise.all(symbols.map(s => marketService.getQuote(s)));
        const map = new Map<string, MarketData>();
        quotes.forEach(q => map.set(q.symbol, q));
        return map;
    },

    search: async (query: string): Promise<{ symbol: string; name: string; type: string }[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simple mock search
        const mockDb = [
            { symbol: 'MAYBANK', name: 'Malayan Banking Berhad', type: 'Stock' },
            { symbol: 'CIMB', name: 'CIMB Group Holdings', type: 'Stock' },
            { symbol: 'PBBANK', name: 'Public Bank Berhad', type: 'Stock' },
            { symbol: 'TENAGA', name: 'Tenaga Nasional Berhad', type: 'Stock' },
            { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto' },
            { symbol: 'ETH', name: 'Ethereum', type: 'Crypto' },
            { symbol: 'TSLA', name: 'Tesla Inc', type: 'Stock' },
            { symbol: 'AAPL', name: 'Apple Inc', type: 'Stock' },
        ];

        return mockDb.filter(item =>
            item.symbol.includes(query.toUpperCase()) ||
            item.name.toUpperCase().includes(query.toUpperCase())
        );
    }
};

function getMockBasePrice(symbol: string): number {
    const defaults: Record<string, number> = {
        'MAYBANK': 8.50,
        'CIMB': 5.60,
        'PBBANK': 4.20,
        'TENAGA': 10.00,
        'BTC': 45000,
        'ETH': 3000,
        'TSLA': 200,
        'AAPL': 180
    };
    return defaults[symbol.toUpperCase()] || 100; // Default 100
}
