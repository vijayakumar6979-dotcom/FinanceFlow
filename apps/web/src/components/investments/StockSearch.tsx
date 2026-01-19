import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, TrendingUp, Building2, Globe } from 'lucide-react'

interface Stock {
    symbol: string
    name: string
    exchange: string
    sector: string
    price: number
    change: number
    changePercent: number
}

// Mock Bursa Malaysia stocks
const BURSA_STOCKS: Stock[] = [
    { symbol: 'MAYBANK', name: 'Malayan Banking Berhad', exchange: 'KLSE', sector: 'Financial Services', price: 8.50, change: 0.15, changePercent: 1.79 },
    { symbol: 'CIMB', name: 'CIMB Group Holdings Berhad', exchange: 'KLSE', sector: 'Financial Services', price: 5.20, change: -0.05, changePercent: -0.95 },
    { symbol: 'PBBANK', name: 'Public Bank Berhad', exchange: 'KLSE', sector: 'Financial Services', price: 4.15, change: 0.08, changePercent: 1.97 },
    { symbol: 'TENAGA', name: 'Tenaga Nasional Berhad', exchange: 'KLSE', sector: 'Utilities', price: 9.80, change: 0.20, changePercent: 2.08 },
    { symbol: 'PETGAS', name: 'Petronas Gas Berhad', exchange: 'KLSE', sector: 'Energy', price: 16.50, change: -0.10, changePercent: -0.60 },
    { symbol: 'DIGI', name: 'Digi.Com Berhad', exchange: 'KLSE', sector: 'Telecommunications', price: 3.85, change: 0.05, changePercent: 1.32 },
    { symbol: 'AXIATA', name: 'Axiata Group Berhad', exchange: 'KLSE', sector: 'Telecommunications', price: 2.95, change: 0.02, changePercent: 0.68 },
    { symbol: 'SIME', name: 'Sime Darby Berhad', exchange: 'KLSE', sector: 'Industrial Products', price: 2.10, change: -0.03, changePercent: -1.41 },
    { symbol: 'GENTING', name: 'Genting Berhad', exchange: 'KLSE', sector: 'Consumer Services', price: 4.50, change: 0.10, changePercent: 2.27 },
    { symbol: 'PCHEM', name: 'Petronas Chemicals Group', exchange: 'KLSE', sector: 'Chemicals', price: 7.20, change: 0.15, changePercent: 2.13 }
]

interface StockSearchProps {
    onSelectStock: (stock: Stock) => void
}

export function StockSearch({ onSelectStock }: StockSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedExchange, setSelectedExchange] = useState<'all' | 'KLSE' | 'US'>('KLSE')

    const filteredStocks = BURSA_STOCKS.filter(stock => {
        const matchesSearch =
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.sector.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesExchange = selectedExchange === 'all' || stock.exchange === selectedExchange

        return matchesSearch && matchesExchange
    })

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stocks by symbol, name, or sector..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                />
            </div>

            {/* Exchange Filter */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedExchange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedExchange === 'all'
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                        }`}
                >
                    <Globe className="w-4 h-4 inline mr-1" />
                    All Markets
                </button>
                <button
                    onClick={() => setSelectedExchange('KLSE')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedExchange === 'KLSE'
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                        }`}
                >
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Bursa Malaysia
                </button>
                <button
                    onClick={() => setSelectedExchange('US')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedExchange === 'US'
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                        }`}
                    disabled
                >
                    US Stocks (Coming Soon)
                </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                        <Card
                            key={stock.symbol}
                            className="p-4 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => onSelectStock(stock)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{stock.symbol.slice(0, 2)}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-surface rounded-full text-gray-700 dark:text-gray-300">
                                            {stock.sector}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {stock.exchange}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        RM {stock.price.toFixed(2)}
                                    </p>
                                    <div className={`flex items-center gap-1 justify-end ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        <TrendingUp className={`w-4 h-4 ${stock.change < 0 ? 'rotate-180' : ''}`} />
                                        <span className="text-sm font-medium">
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No stocks found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Try a different search term
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
