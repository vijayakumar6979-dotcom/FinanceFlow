import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, TrendingUp, TrendingDown, ArrowUpDown, Hash } from 'lucide-react';
import { createTransactionService, Transaction } from '@financeflow/shared';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@financeflow/shared';

const transactionService = createTransactionService(supabase);

export function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, [filterType]);

    const loadTransactions = async () => {
        setIsLoading(true);
        try {
            const data = await transactionService.getAll({
                type: filterType || undefined
            });
            setTransactions(data);
        } catch (error) {
            console.error('Failed to load transactions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        count: transactions.length
    };
    const net = stats.income - stats.expenses;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track all your financial activity</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { }}>
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Transaction
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Income</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                {formatCurrency(stats.income)}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border-red-200 dark:border-red-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                {formatCurrency(stats.expenses)}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Net Cash Flow</p>
                            <h3 className={`text-2xl font-bold mt-2 ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(net)}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                            <ArrowUpDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Count</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.count}
                            </h3>
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                            <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & List */}
            <Card className="p-6">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFilterType(e.target.value || null)}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No transactions found. Start by adding one!</div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' :
                                        tx.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {tx.type === 'income' ? <TrendingUp size={18} /> :
                                            tx.type === 'expense' ? <TrendingDown size={18} /> : <ArrowUpDown size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                                        <p className="text-sm text-gray-500">{tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'income' ? 'text-green-600' :
                                    tx.type === 'expense' ? 'text-red-600' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Modal Placeholder */}
            {isAddModalOpen && <AddTransactionModal onClose={() => setIsAddModalOpen(false)} onSave={() => { setIsAddModalOpen(false); loadTransactions(); }} />}
        </div>
    );
}
