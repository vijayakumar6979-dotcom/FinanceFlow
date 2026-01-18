import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Calendar, Clock, CheckCircle } from 'lucide-react-native';
import { useTheme, MALAYSIAN_BILL_PROVIDERS, Bill, formatCurrency } from '@financeflow/shared';
import clsx from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';

export default function BillsScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

    // Mock Data
    const bills: Bill[] = MALAYSIAN_BILL_PROVIDERS.slice(0, 4).map((p, i) => ({
        id: `bill-${i}`,
        user_id: 'user-1',
        provider_id: p.id,
        provider_name: p.name,
        provider_category: p.category,
        provider_logo: p.logo,
        bill_name: `${p.name} Bill`,
        estimated_amount: p.averageAmount,
        currency: 'MYR',
        due_day: (i * 5) + 2,
        is_variable: p.isVariable,
        auto_pay_enabled: false,
        auto_sync_budget: true,
        status: i === 0 ? 'overdue' : 'unpaid',
        days_until_due: i * 3
    }));

    const renderBillItem = ({ item }: { item: Bill }) => {
        const isOverdue = item.status === 'overdue';
        return (
            <TouchableOpacity
                className="bg-white dark:bg-slate-900 mb-3 p-4 rounded-2xl flex-row items-center justify-between border border-slate-100 dark:border-white/5"
                onPress={() => navigation.navigate('BillDetail', { billId: item.id })}
            >
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-white/10 overflow-hidden" style={{ backgroundColor: item.provider_logo ? 'white' : undefined }}>
                        {item.provider_logo ? (
                            <Image source={{ uri: item.provider_logo }} className="w-8 h-8" resizeMode="contain" />
                        ) : (
                            <Text className="font-bold text-slate-700 dark:text-white" style={{ fontSize: 16 }}>
                                {item.provider_name[0]}
                            </Text>
                        )}
                    </View>
                    <View>
                        <Text className="font-bold text-slate-900 dark:text-white">{item.bill_name}</Text>
                        <View className="flex-row items-center gap-1">
                            {isOverdue && <Clock size={12} color="#ef4444" />}
                            <Text className={clsx("text-xs", isOverdue ? "text-red-500 font-bold" : "text-slate-500")}>
                                {isOverdue ? 'Overdue' : `Due in ${item.days_until_due} days`}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="font-bold text-slate-900 dark:text-white text-base">
                        {formatCurrency(item.fixed_amount || item.estimated_amount || 0, 'MYR')}
                    </Text>
                    {item.is_variable && <Text className="text-[10px] text-slate-400">Variable</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white">Bills</Text>
                <TouchableOpacity
                    className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-500/30"
                    onPress={() => navigation.navigate('CreateBill')}
                >
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-6 h-32">
                <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    className="w-40 h-28 rounded-2xl p-4 mr-3 justify-between"
                >
                    <View className="flex-row justify-between">
                        <Text className="text-blue-100 text-xs font-medium">Total Monthly</Text>
                        <Calendar size={16} color="white" opacity={0.8} />
                    </View>
                    <Text className="text-white text-2xl font-bold">RM 485</Text>
                    <Text className="text-blue-200 text-xs">4 bills total</Text>
                </LinearGradient>

                <View className="w-40 h-28 bg-white dark:bg-slate-900 rounded-2xl p-4 mr-3 justify-between border border-slate-200 dark:border-white/10">
                    <View className="flex-row justify-between">
                        <Text className="text-slate-500 text-xs font-medium">Due Soon</Text>
                        <Clock size={16} color="#f59e0b" />
                    </View>
                    <Text className="text-slate-900 dark:text-white text-2xl font-bold">RM 150</Text>
                    <Text className="text-slate-400 text-xs">2 bills due</Text>
                </View>
            </ScrollView>

            {/* Filters */}
            <View className="px-6 flex-row gap-2 mb-4">
                {['all', 'unpaid', 'paid'].map(f => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f as any)}
                        className={clsx(
                            "px-4 py-2 rounded-full",
                            filter === f ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-white/10"
                        )}
                    >
                        <Text className={clsx(
                            "capitalize font-medium text-xs",
                            filter === f ? "text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400"
                        )}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            <FlatList
                data={bills}
                keyExtractor={item => item.id}
                renderItem={renderBillItem}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
