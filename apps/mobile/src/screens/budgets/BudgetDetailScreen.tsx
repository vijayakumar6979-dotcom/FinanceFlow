import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Edit2, Trash2, Calendar } from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@financeflow/shared';

const MOCK_DATA = [
    { value: 120, label: 'W1', frontColor: '#3b82f6' },
    { value: 250, label: 'W2', frontColor: '#3b82f6' },
    { value: 180, label: 'W3', frontColor: '#3b82f6' },
    { value: 100, label: 'W4', frontColor: '#e2e8f0' }, // Current week
];

export default function BudgetDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // In a real app, fetch budget by ID from route.params
    const budgetName = "Food & Dining";
    const spent = 650;
    const total = 800;
    const percent = Math.round((spent / total) * 100);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ArrowLeft size={24} color={isDark ? 'white' : '#0f172a'} />
                </TouchableOpacity>
                <View className="flex-row gap-2">
                    <TouchableOpacity className="p-2 bg-white dark:bg-white/10 rounded-full">
                        <Edit2 size={20} color={isDark ? 'white' : '#0f172a'} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                        <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{budgetName}</Text>
                    <Text className="text-slate-500 dark:text-slate-400">Monthly Budget</Text>
                </View>

                {/* Main Card */}
                <View className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-500">Spent</Text>
                        <Text className="text-slate-500">Remaining</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-3xl font-bold text-slate-900 dark:text-white">RM {spent}</Text>
                        <Text className="text-xl font-bold text-emerald-500">RM {total - spent}</Text>
                    </View>

                    <View className="h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                        <View
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percent}%` }}
                        />
                    </View>
                    <Text className="text-right text-xs text-slate-400">{percent}% used</Text>
                </View>

                {/* Spending Trends */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Weekly Spending</Text>
                    <View className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 items-center justify-center overflow-hidden">
                        <BarChart
                            data={MOCK_DATA}
                            barWidth={32}
                            barBorderRadius={6}
                            frontColor="#3b82f6"
                            yAxisThickness={0}
                            xAxisThickness={0}
                            hideRules
                            height={150}
                            width={280}
                            labelTextStyle={{ color: isDark ? 'white' : 'gray' }}
                        />
                    </View>
                </View>

                {/* Recent Transactions Mock */}
                <View className="mb-10">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</Text>
                    {[1, 2, 3].map(i => (
                        <View key={i} className="flex-row justify-between items-center py-4 border-b border-slate-100 dark:border-white/5">
                            <View className="flex-row gap-3 items-center">
                                <View className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full items-center justify-center">
                                    <Text>🍔</Text>
                                </View>
                                <View>
                                    <Text className="font-bold text-slate-900 dark:text-white">McDonald's</Text>
                                    <Text className="text-xs text-slate-500">Today, 12:30 PM</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-slate-900 dark:text-white">- RM 24.50</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
