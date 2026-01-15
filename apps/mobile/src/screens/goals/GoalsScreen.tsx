import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Target, Trophy, TrendingUp } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from '@financeflow/shared';

const MOCK_GOALS = [
    { id: '1', name: 'MacBook Pro', target: 12000, current: 4500, emoji: '💻', color: '#3b82f6' },
    { id: '2', name: 'Bali Trip', target: 5000, current: 1200, emoji: '🏝️', color: '#10b981' },
    { id: '3', name: 'Emergency', target: 20000, current: 15400, emoji: '🛡️', color: '#a855f7' },
];

export default function GoalsScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const totalSaved = MOCK_GOALS.reduce((acc, g) => acc + g.current, 0);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4">
                <View>
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">Financial Goals</Text>
                    <Text className="text-slate-500 dark:text-slate-400">Track your dreams</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateGoal' as never)}
                    className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-500/30"
                >
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Summary Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mb-6">
                    <View className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 mr-4 w-40">
                        <View className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full items-center justify-center mb-3">
                            <Trophy size={20} color="#f59e0b" />
                        </View>
                        <Text className="text-slate-500 text-xs mb-1">Total Saved</Text>
                        <Text className="text-lg font-bold text-slate-900 dark:text-white">RM {totalSaved}</Text>
                    </View>

                    <View className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 mr-4 w-40">
                        <View className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-full items-center justify-center mb-3">
                            <TrendingUp size={20} color="#10b981" />
                        </View>
                        <Text className="text-slate-500 text-xs mb-1">Monthly</Text>
                        <Text className="text-lg font-bold text-slate-900 dark:text-white">RM 850</Text>
                    </View>
                </ScrollView>

                {/* Goals List */}
                <View className="px-6 space-y-4">
                    {MOCK_GOALS.map(goal => {
                        const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));

                        // PieChart Data for Ring
                        const pieData = [
                            { value: goal.current, color: goal.color },
                            { value: goal.target - goal.current, color: isDark ? '#1e293b' : '#f1f5f9' }
                        ];

                        return (
                            <TouchableOpacity
                                key={goal.id}
                                onPress={() => navigation.navigate('GoalDetail' as never, { id: goal.id } as never)}
                                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex-row justify-between items-center shadow-sm"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl items-center justify-center">
                                        <Text className="text-xl">{goal.emoji}</Text>
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-900 dark:text-white text-base mb-1">{goal.name}</Text>
                                        <Text className="text-xs text-slate-500">RM {goal.current} / {goal.target}</Text>
                                    </View>
                                </View>

                                {/* Mini Ring Chart */}
                                <View className="items-center justify-center">
                                    <PieChart
                                        data={pieData}
                                        donut
                                        radius={24}
                                        innerRadius={18}
                                        centerLabelComponent={() => null}
                                    />
                                    <View className="absolute">
                                        <Text className="text-[10px] font-bold text-slate-900 dark:text-white">{percent}%</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    className="mx-6 mt-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 items-center justify-center"
                    onPress={() => navigation.navigate('CreateGoal' as never)}
                >
                    <Text className="text-slate-500 dark:text-slate-400 font-medium">+ Add New Goal</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
