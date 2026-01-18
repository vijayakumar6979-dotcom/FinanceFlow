import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Download,
    TrendingUp,
    TrendingDown,
    Wallet,
    Calendar
} from 'lucide-react';
import { useTransactions, useMonthlyStats } from '@/hooks/useTransactions';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionStats } from '@/components/transactions/TransactionStats';
import { CashFlowChart } from '@/components/transactions/CashFlowChart';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';

export default function TransactionsPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Fetch data
    const { data: transactions, isLoading } = useTransactions(filters);
    const { data: monthlyStats } = useMonthlyStats(currentYear, currentMonth);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#121629] to-[#1A1F3A] p-6">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0066FF] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                            Transactions
                        </h1>
                        <p className="text-[#94A3B8] mt-2">
                            Track and manage all your financial transactions
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${showFilters
                                    ? 'bg-gradient-to-r from-[#0066FF] to-[#8B5CF6] text-white'
                                    : 'bg-[#1A1F3A] text-[#94A3B8] hover:bg-[#252B4A]'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>

                        <button
                            className="px-4 py-2 rounded-xl bg-[#1A1F3A] text-[#94A3B8] hover:bg-[#252B4A] flex items-center gap-2 transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Transaction
                        </button>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                        <input
                            type="text"
                            placeholder="Search transactions by description, amount, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF] focus:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <TransactionStats stats={monthlyStats} />

            {/* Cash Flow Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <CashFlowChart />
            </motion.div>

            {/* Filters Panel */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                >
                    <TransactionFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                </motion.div>
            )}

            {/* Transactions List */}
            <TransactionsList
                transactions={transactions}
                isLoading={isLoading}
                searchQuery={searchQuery}
            />

            {/* Add Transaction Modal */}
            {showAddModal && (
                <AddTransactionModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
}
