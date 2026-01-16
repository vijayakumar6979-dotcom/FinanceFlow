import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { investmentService } from '../services/investment.service';
import { Investment, PortfolioSummary, formatCurrency } from '@financeflow/shared';
import { TrendingUp, Plus, DollarSign, Activity, PieChart } from 'lucide-react-native';
import clsx from 'clsx';

export function InvestmentsScreen({ navigation }: any) {
    const [stats, setStats] = useState<PortfolioSummary | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [statsData, investData] = await Promise.all([
                investmentService.getPortfolioSummary(),
                investmentService.getAll()
            ]);
            setStats(statsData);
            setInvestments(investData);
        } catch (error) {
            console.error('Failed to load investment data', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    return (
        <View className="flex-1 bg-gray-900 pt-12">
            <ScreenHeader
                title="Investments"
                showMenu={true}
                onMenuPress={() => navigation.openDrawer && navigation.openDrawer()} // Assuming drawer exists or back
                rightActions={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddInvestment')}
                        className="bg-blue-600 p-2 rounded-lg"
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
            >
                {/* Summary Cards */}
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
                    <SummaryCard
                        title="Total Value"
                        value={stats?.total_value || 0}
                        icon={DollarSign}
                        color="blue"
                        className="w-[48%]"
                    />
                    <SummaryCard
                        title="Profit/Loss"
                        value={stats?.total_profit_loss || 0}
                        icon={TrendingUp}
                        color={stats && stats.total_profit_loss >= 0 ? 'green' : 'red'}
                        className="w-[48%]"
                    />
                </View>

                <Text className="text-white text-lg font-bold mb-4">Your Holdings</Text>

                {isLoading && !refreshing ? (
                    <Text className="text-gray-400 text-center py-10">Loading portfolio...</Text>
                ) : investments.length === 0 ? (
                    <View className="bg-white/5 p-6 rounded-2xl items-center">
                        <Text className="text-gray-400 text-center">No investments found.</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddInvestment')}
                            className="mt-4 bg-blue-600 px-4 py-2 rounded-xl"
                        >
                            <Text className="text-white font-bold">Add Investment</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="gap-3">
                        {investments.map(inv => (
                            <InvestmentCard key={inv.id} investment={inv} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function SummaryCard({ title, value, icon: Icon, color, className }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        red: 'bg-red-500/10 text-red-500',
    };

    // Fallback for icon color
    const iconColor = color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#EF4444';

    return (
        <View className={clsx("bg-white/5 p-4 rounded-2xl border border-white/5", className)}>
            <View className="flex-row justify-between items-start mb-2">
                <View className={clsx("p-2 rounded-lg", colorClasses[color])}>
                    <Icon size={20} color={iconColor} />
                </View>
            </View>
            <Text className="text-gray-400 text-xs mb-1">{title}</Text>
            <Text className="text-white text-lg font-bold" numberOfLines={1} adjustsFontSizeToFit>
                {formatCurrency(value)}
            </Text>
        </View>
    );
}

function InvestmentCard({ investment }: { investment: Investment }) {
    return (
        <TouchableOpacity className="bg-white/5 p-4 rounded-2xl border border-white/5 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                    <Text className="text-white font-bold text-xs">{investment.symbol.substring(0, 3)}</Text>
                </View>
                <View>
                    <Text className="text-white font-bold text-base">{investment.symbol}</Text>
                    <Text className="text-gray-400 text-xs">{investment.name}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-white font-bold">{investment.quantity} units</Text>
                <Text className="text-gray-400 text-xs">Avg: {formatCurrency(investment.avg_cost)}</Text>
            </View>
        </TouchableOpacity>
    );
}
