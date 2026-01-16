import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { createTransactionService, Transaction, formatCurrency } from '@financeflow/shared';
import { supabase } from '../services/supabase';
import { TrendingUp, TrendingDown, ArrowUpDown, Plus, Filter } from 'lucide-react-native';
import clsx from 'clsx';

const transactionService = createTransactionService(supabase);

export function TransactionsScreen({ navigation }: any) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterType, setFilterType] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const data = await transactionService.getAll({
                type: filterType || undefined,
                limit: 50
            });
            setTransactions(data);
        } catch (error) {
            console.error('Failed to load transactions', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [filterType])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    return (
        <View className="flex-1 bg-gray-900 pt-12">
            <ScreenHeader
                title="Activity"
                showMenu={true}
                onMenuPress={() => navigation.openDrawer && navigation.openDrawer()}
                rightActions={
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => { /* Filter logic */ }}
                            className="bg-white/10 p-2 rounded-lg"
                        >
                            <Filter size={20} color="white" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            onPress={() => navigation.navigate('AddTransaction')}
                            className="bg-blue-600 p-2 rounded-lg"
                        >
                            <Plus size={20} color="white" />
                        </TouchableOpacity> */}
                    </View>
                }
            />

            {/* Filter Tabs */}
            <View className="flex-row px-4 py-2 gap-2">
                {['All', 'Income', 'Expense'].map((type) => {
                    const value = type === 'All' ? null : type.toLowerCase();
                    const isActive = filterType === value;
                    return (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setFilterType(value)}
                            className={clsx(
                                "px-4 py-2 rounded-full border",
                                isActive
                                    ? "bg-blue-600 border-blue-600"
                                    : "bg-transparent border-gray-700"
                            )}
                        >
                            <Text className={clsx("font-medium", isActive ? "text-white" : "text-gray-400")}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
            >
                {isLoading && !refreshing ? (
                    <Text className="text-gray-400 text-center py-10">Loading transactions...</Text>
                ) : transactions.length === 0 ? (
                    <View className="bg-white/5 p-6 rounded-2xl items-center mt-4">
                        <Text className="text-gray-400 text-center">No transactions found.</Text>
                    </View>
                ) : (
                    <View className="gap-3">
                        {transactions.map(tx => (
                            <TransactionCard key={tx.id} transaction={tx} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
    const isIncome = transaction.type === 'income';
    const isExpense = transaction.type === 'expense';

    return (
        <TouchableOpacity className="bg-white/5 p-4 rounded-2xl border border-white/5 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
                <View className={clsx(
                    "w-10 h-10 rounded-full items-center justify-center",
                    isIncome ? "bg-green-500/20" : isExpense ? "bg-red-500/20" : "bg-blue-500/20"
                )}>
                    {isIncome ? <TrendingUp size={20} color="#10B981" /> :
                        isExpense ? <TrendingDown size={20} color="#EF4444" /> :
                            <ArrowUpDown size={20} color="#3B82F6" />}
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-base" numberOfLines={1}>{transaction.description}</Text>
                    <Text className="text-gray-400 text-xs">
                        {transaction.category?.name || 'Uncategorized'} • {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            <View>
                <Text className={clsx(
                    "font-bold text-base text-right",
                    isIncome ? "text-green-500" : isExpense ? "text-red-500" : "text-white"
                )}>
                    {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
