import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';
import { Plus, ChevronRight, Target, TrendingDown } from 'lucide-react-native';
import clsx from 'clsx';
import { useTheme } from '@financeflow/shared';
import { useNavigation } from '@react-navigation/native';

// Mock Data
const MOCK_BUDGETS = [
    { id: '1', name: 'Food & Dining', amount: 800, spent: 650, color: '#f97316', icon: '🍔' },
    { id: '2', name: 'Transport', amount: 400, spent: 380, color: '#3b82f6', icon: '🚗' },
    { id: '3', name: 'Shopping', amount: 300, spent: 450, color: '#a855f7', icon: '🛍️' },
];

export default function BudgetsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigation = useNavigation();

    const totalBudget = MOCK_BUDGETS.reduce((acc, b) => acc + b.amount, 0);
    const totalSpent = MOCK_BUDGETS.reduce((acc, b) => acc + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const progress = Math.min(100, (totalSpent / totalBudget) * 100);

    const pieData = MOCK_BUDGETS.map(b => ({
        value: b.amount,
        color: b.color,
        text: b.name
    }));

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4">
                <View>
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</Text>
                    <Text className="text-slate-500 dark:text-slate-400">January 2024</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateBudget' as never)}
                    className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-500/30"
                >
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Overview Chart Card */}
                <View className="mx-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm mb-6 items-center">
                    <View className="items-center justify-center">
                        <PieChart
                            data={pieData}
                            donut
                            radius={80}
                            innerRadius={60}
                            centerLabelComponent={() => (
                                <View className="items-center justify-center">
                                    <Text className="text-xs text-slate-400 font-medium">Remaining</Text>
                                    <Text className="text-xl font-bold text-slate-900 dark:text-white">
                                        RM {remaining}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>

                    <View className="flex-row justify-between w-full mt-6">
                        <View className="items-center flex-1">
                            <Text className="text-slate-400 text-xs mb-1">Total Limit</Text>
                            <Text className="text-slate-900 dark:text-white font-bold text-lg">RM {totalBudget}</Text>
                        </View>
                        <View className="w-[1px] h-full bg-slate-100 dark:bg-white/10" />
                        <View className="items-center flex-1">
                            <Text className="text-slate-400 text-xs mb-1">Spent</Text>
                            <Text className="text-slate-900 dark:text-white font-bold text-lg">RM {totalSpent}</Text>
                        </View>
                    </View>
                </View>

                {/* Budget List */}
                <View className="px-6 space-y-4">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">Categories</Text>

                    {MOCK_BUDGETS.map(budget => {
                        const percent = Math.min(100, Math.round((budget.spent / budget.amount) * 100));
                        const isExceeded = percent >= 100;

                        return (
                            <TouchableOpacity
                                key={budget.id}
                                onPress={() => navigation.navigate('BudgetDetail' as never, { id: budget.id } as never)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm active:scale-98"
                            >
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 items-center justify-center">
                                            <Text className="text-lg">{budget.icon}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-slate-900 dark:text-white text-base">{budget.name}</Text>
                                            <Text className="text-xs text-slate-500">
                                                {percent}% used
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-bold text-slate-900 dark:text-white">RM {budget.spent}</Text>
                                        <Text className="text-xs text-slate-400">of RM {budget.amount}</Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <View
                                        className={clsx(
                                            "h-full rounded-full",
                                            isExceeded ? "bg-red-500" : percent > 85 ? "bg-amber-500" : "bg-blue-500"
                                        )}
                                        style={{ width: `${percent}%` }}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Add New Button Placeholder (Alternative to header button) */}
                <TouchableOpacity
                    className="mx-6 mt-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 items-center justify-center"
                    onPress={() => navigation.navigate('CreateBudget' as never)}
                >
                    <Text className="text-slate-500 dark:text-slate-400 font-medium">+ Add New Budget Category</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
