import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Receipt,
    Link as LinkIcon,
    AlertCircle
} from 'lucide-react';
import type { Transaction } from '@financeflow/shared';

interface TransactionsListProps {
    transactions?: Transaction[];
    isLoading: boolean;
    searchQuery: string;
}

export function TransactionsList({ transactions, isLoading, searchQuery }: TransactionsListProps) {
    const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());

    // Filter transactions by search query
    const filteredTransactions = transactions?.filter(tx =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery)
    );

    // Group transactions by date
    const groupedTransactions = filteredTransactions?.reduce((groups, tx) => {
        const date = format(new Date(tx.date), 'yyyy-MM-dd');
        if (!groups[date]) groups[date] = [];
        groups[date].push(tx);
        return groups;
    }, {} as Record<string, Transaction[]>);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-[#1A1F3A] rounded-2xl p-6 animate-pulse">
                        <div className="h-6 bg-[#252B4A] rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-[#252B4A] rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!filteredTransactions || filteredTransactions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.18)] rounded-2xl p-12 text-center"
            >
                <Receipt className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Transactions Found</h3>
                <p className="text-[#94A3B8]">
                    {searchQuery ? 'Try adjusting your search query' : 'Start by adding your first transaction'}
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedTransactions || {}).map(([date, txs], groupIndex) => (
                <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.05 }}
                >
                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent" />
                        <span className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider">
                            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent" />
                    </div>

                    {/* Transactions */}
                    <div className="space-y-3">
                        {txs.map((transaction, txIndex) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                index={txIndex}
                                isSelected={selectedTransactions.has(transaction.id)}
                                onSelect={(id) => {
                                    const newSelected = new Set(selectedTransactions);
                                    if (newSelected.has(id)) {
                                        newSelected.delete(id);
                                    } else {
                                        newSelected.add(id);
                                    }
                                    setSelectedTransactions(newSelected);
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

interface TransactionCardProps {
    transaction: Transaction;
    index: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

function TransactionCard({ transaction, index, isSelected, onSelect }: TransactionCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const isIncome = transaction.type === 'income';
    const hasReceipt = (transaction as any).receipt_urls && (transaction as any).receipt_urls.length > 0;
    const isAnomaly = (transaction as any).is_anomaly;
    const isLinked = transaction.linked_id;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative group bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] border rounded-2xl p-6 hover:transform hover:-translate-y-1 transition-all ${isSelected
                ? 'border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.5)]'
                : 'border-[rgba(255,255,255,0.18)] hover:border-[rgba(255,255,255,0.3)]'
                }`}
        >
            <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Checkbox */}
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(transaction.id)}
                        className="w-5 h-5 rounded border-2 border-[rgba(255,255,255,0.3)] bg-transparent checked:bg-gradient-to-r checked:from-[#0066FF] checked:to-[#8B5CF6] cursor-pointer"
                    />

                    {/* Icon */}
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${isIncome
                        ? 'from-[#10B981] to-[#059669]'
                        : 'from-[#EF4444] to-[#DC2626]'
                        }`}>
                        {transaction.category?.icon ? (
                            <span className="text-2xl">{transaction.category.icon}</span>
                        ) : (
                            <Receipt className="w-6 h-6 text-white" />
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{transaction.description}</h3>
                            {isAnomaly && (
                                <div className="px-2 py-0.5 rounded-full bg-[#F59E0B] bg-opacity-20 border border-[#F59E0B] flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
                                    <span className="text-xs text-[#F59E0B] font-medium">Unusual</span>
                                </div>
                            )}
                            {hasReceipt && (
                                <Receipt className="w-4 h-4 text-[#8B5CF6]" />
                            )}
                            {isLinked && (
                                <LinkIcon className="w-4 h-4 text-[#0066FF]" />
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
                            <span>{transaction.category?.name || 'Uncategorized'}</span>
                            <span>•</span>
                            <span>{(transaction as any).account?.name || 'Unknown Account'}</span>
                            {transaction.tags && transaction.tags.length > 0 && (
                                <>
                                    <span>•</span>
                                    <div className="flex gap-1">
                                        {transaction.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#1A1F3A] text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Amount */}
                    <div className="text-right">
                        <p className={`text-2xl font-bold font-['JetBrains_Mono'] ${isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                            }`}>
                            {isIncome ? '+' : '-'}RM {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-[#94A3B8]">
                            {format(new Date(transaction.date), 'h:mm a')}
                        </p>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg hover:bg-[#1A1F3A] transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-[#94A3B8]" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-[#1A1F3A] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-xl overflow-hidden z-10"
                                >
                                    <button className="w-full px-4 py-3 text-left text-white hover:bg-[#252B4A] flex items-center gap-3 transition-colors">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button className="w-full px-4 py-3 text-left text-white hover:bg-[#252B4A] flex items-center gap-3 transition-colors">
                                        <Copy className="w-4 h-4" />
                                        Duplicate
                                    </button>
                                    <button className="w-full px-4 py-3 text-left text-[#EF4444] hover:bg-[#252B4A] flex items-center gap-3 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Notes (if any) */}
            {transaction.notes && (
                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.12)]">
                    <p className="text-sm text-[#94A3B8]">{transaction.notes}</p>
                </div>
            )}
        </motion.div>
    );
}
