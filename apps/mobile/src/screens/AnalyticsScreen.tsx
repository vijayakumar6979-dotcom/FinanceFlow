import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createAnalyticsService, FinancialHealthScore } from '@financeflow/shared';
import { supabase } from '../services/supabase';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryArea, VictoryAxis } from 'victory-native';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
    const [score, setScore] = useState<FinancialHealthScore | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const analyticsService = createAnalyticsService(supabase);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const health = await analyticsService.calculateFinancialHealth(user.id);
                setScore(health);
                const overview = await analyticsService.getOverviewStats(user.id);
                setStats(overview);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-slate-900 justify-center items-center">
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    const getScoreColor = (s: number) => {
        if (s >= 90) return ['#10B981', '#059669'];
        if (s >= 70) return ['#3B82F6', '#2563EB'];
        return ['#F59E0B', '#D97706'];
    };

    return (
        <View className="flex-1 bg-slate-900">
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="p-6">
                        <Text className="text-3xl font-bold text-white mb-2">Analytics</Text>
                        <Text className="text-slate-400 mb-6">Financial Overview</Text>

                        {/* Health Score Card */}
                        {score && (
                            <View className="mb-6 rounded-3xl overflow-hidden shadow-lg shadow-blue-500/20">
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                    className="p-6"
                                >
                                    <View className="flex-row justify-between items-center mb-4">
                                        <Text className="text-white font-semibold text-lg">Health Score</Text>
                                        <View className="bg-white/10 px-3 py-1 rounded-full">
                                            <Text className="text-white text-xs">{score.rating}</Text>
                                        </View>
                                    </View>

                                    <View className="items-center mb-4">
                                        <View className="w-32 h-32 rounded-full border-8 border-white/10 justify-center items-center">
                                            <Text className="text-4xl font-bold text-white">{score.overall}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between flex-wrap gap-2">
                                        {Object.entries(score.breakdown).slice(0, 3).map(([key, val]) => (
                                            <View key={key} className="bg-black/20 px-3 py-2 rounded-lg flex-1 min-w-[30%]">
                                                <Text className="text-slate-400 text-xs capitalize mb-1">{key}</Text>
                                                <Text className="text-white font-bold">{val}/100</Text>
                                            </View>
                                        ))}
                                    </View>
                                </LinearGradient>
                            </View>
                        )}

                        {/* Quick Stats Grid */}
                        {stats && (
                            <View className="flex-row flex-wrap gap-4 mb-6">
                                <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="bg-green-500/20 p-2 rounded-lg">
                                            <ArrowUpRight size={20} color="#10B981" />
                                        </View>
                                    </View>
                                    <Text className="text-slate-400 text-xs">Income</Text>
                                    <Text className="text-white font-bold text-lg mt-1">${stats.totalIncome.toLocaleString()}</Text>
                                </View>
                                <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="bg-red-500/20 p-2 rounded-lg">
                                            <ArrowDownRight size={20} color="#EF4444" />
                                        </View>
                                    </View>
                                    <Text className="text-slate-400 text-xs">Expense</Text>
                                    <Text className="text-white font-bold text-lg mt-1">${stats.totalExpenses.toLocaleString()}</Text>
                                </View>
                            </View>
                        )}

                        {/* Chart Section */}
                        <View className="bg-white/5 rounded-3xl p-4 border border-white/10">
                            <Text className="text-white font-semibold mb-4">Net Worth Trend</Text>
                            <View pointerEvents="none">
                                <VictoryChart
                                    width={width - 80}
                                    height={200}
                                    theme={VictoryTheme.material}
                                    padding={{ top: 10, bottom: 30, left: 50, right: 30 }}
                                >
                                    <VictoryAxis
                                        dependentAxis
                                        style={{
                                            axis: { stroke: "transparent" },
                                            tickLabels: { fill: "#94A3B8", fontSize: 10 }
                                        }}
                                    />
                                    <VictoryAxis
                                        style={{
                                            axis: { stroke: "transparent" },
                                            tickLabels: { fill: "#94A3B8", fontSize: 10 }
                                        }}
                                    />
                                    <VictoryArea
                                        style={{ data: { fill: "rgba(0, 102, 255, 0.2)", stroke: "#0066FF", strokeWidth: 3 } }}
                                        data={[
                                            { x: 1, y: 10000 },
                                            { x: 2, y: 12000 },
                                            { x: 3, y: 11500 },
                                            { x: 4, y: 14000 },
                                            { x: 5, y: 16500 },
                                            { x: 6, y: 18000 }
                                        ]}
                                        interpolation="natural"
                                    />
                                </VictoryChart>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="mt-6 bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-600/30"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold">Download Full Report</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AnalyticsScreen;
