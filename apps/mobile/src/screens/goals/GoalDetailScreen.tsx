import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Edit2, Trash2, Calendar, Plus } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from '@financeflow/shared';

export default function GoalDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const goalName = "MacBook Pro";
    const target = 12000;
    const current = 4500;
    const percent = Math.round((current / target) * 100);

    const pieData = [
        { value: current, color: '#3b82f6' },
        { value: target - current, color: isDark ? '#1e293b' : '#f1f5f9' },
    ];

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
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{goalName}</Text>
                    <Text className="text-slate-500 dark:text-slate-400">Target: 2024-06-01</Text>
                </View>

                {/* Main Progress Ring */}
                <View className="items-center justify-center py-6">
                    <PieChart
                        data={pieData}
                        donut
                        radius={100}
                        innerRadius={80}
                        centerLabelComponent={() => (
                            <View className="items-center">
                                <Text className="text-4xl font-bold text-slate-900 dark:text-white">{percent}%</Text>
                                <Text className="text-xs text-slate-500">Completed</Text>
                            </View>
                        )}
                    />
                </View>

                {/* Stats */}
                <View className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm mb-6">
                    <View className="flex-row justify-between mb-4">
                        <View>
                            <Text className="text-slate-500 text-xs mb-1">Current Balance</Text>
                            <Text className="text-2xl font-bold text-slate-900 dark:text-white">RM {current}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-slate-500 text-xs mb-1">Target</Text>
                            <Text className="text-2xl font-bold text-slate-900 dark:text-white">RM {target}</Text>
                        </View>
                    </View>

                    <TouchableOpacity className="w-full bg-blue-600 py-3 rounded-xl flex-row items-center justify-center gap-2">
                        <Plus size={18} color="white" />
                        <Text className="text-white font-bold">Add Funds</Text>
                    </TouchableOpacity>
                </View>

                {/* History */}
                <View className="mb-10">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">History</Text>
                    {[1, 2, 3].map(i => (
                        <View key={i} className="flex-row justify-between items-start py-4 border-b border-slate-100 dark:border-white/5">
                            <View className="flex-row gap-3">
                                <View className="w-2 h-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                                <View>
                                    <Text className="font-bold text-slate-900 dark:text-white text-base">RM 500</Text>
                                    <Text className="text-xs text-slate-500">Monthly saving</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Calendar size={12} color="#94a3b8" />
                                <Text className="text-xs text-slate-400">Jan 28</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
