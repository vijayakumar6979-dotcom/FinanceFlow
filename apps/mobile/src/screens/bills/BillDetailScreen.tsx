import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Clock, Calendar, PieChart, AlertTriangle } from 'lucide-react-native';
import { useTheme, Bill, MALAYSIAN_BILL_PROVIDERS, formatCurrency } from '@financeflow/shared';
import clsx from 'clsx';
import { BarChart } from 'react-native-gifted-charts';

export default function BillDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { billId } = route.params as { billId: string };

    // Mock Bill Data
    const bill: Bill = {
        id: '1',
        user_id: 'u1',
        provider_id: 'tnb',
        provider_name: 'TNB',
        provider_category: 'Electricity',
        bill_name: 'TNB Bill',
        is_variable: true,
        estimated_amount: 154.20,
        currency: 'MYR',
        auto_pay_enabled: false,
        auto_sync_budget: true,
        due_day: 15,
        status: 'unpaid',
        days_until_due: 5,
        account_number: '2200 1234 5678',
        provider_logo: undefined
    };

    const providerColor = MALAYSIAN_BILL_PROVIDERS.find(p => p.id === bill.provider_id)?.color || '#666';

    const historyData = [
        { value: 145, label: 'Jan', frontColor: providerColor },
        { value: 160, label: 'Feb', frontColor: providerColor },
        { value: 130, label: 'Mar', frontColor: providerColor },
        { value: 180, label: 'Apr', frontColor: providerColor },
        { value: 154, label: 'May', frontColor: '#ef4444' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ArrowLeft size={24} color={isDark ? 'white' : '#0f172a'} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Bill Details</Text>
                <TouchableOpacity className="p-2">
                    <Text className="text-blue-600 font-bold">Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                <View className="items-center mb-8 mt-2">
                    <View className="w-20 h-20 rounded-full items-center justify-center mb-4 shadow-xl" style={{ backgroundColor: providerColor }}>
                        <Text className="text-white font-bold text-3xl">{bill.provider_name[0]}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">{bill.bill_name}</Text>
                    <Text className="text-slate-500 mb-2">{bill.provider_category} • {bill.account_number}</Text>

                    <View className={clsx(
                        "px-3 py-1 rounded-full flex-row items-center gap-2",
                        bill.status === 'overdue' ? "bg-red-100 dark:bg-red-900/20" : "bg-amber-100 dark:bg-amber-900/20"
                    )}>
                        <Clock size={14} color={bill.status === 'overdue' ? '#ef4444' : '#f59e0b'} />
                        <Text className={clsx(
                            "font-bold text-xs",
                            bill.status === 'overdue' ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                        )}>
                            Due in {bill.days_until_due} days
                        </Text>
                    </View>
                </View>

                <View className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 mb-6 items-center">
                    <Text className="text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">Current Amount</Text>
                    <Text className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {formatCurrency(bill.estimated_amount || 0, 'MYR')}
                    </Text>

                    <TouchableOpacity className="w-full bg-slate-900 dark:bg-white py-4 rounded-xl items-center">
                        <Text className="text-white dark:text-slate-900 font-bold">Mark as Paid</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-8">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">History Trend</Text>
                    <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                        <BarChart
                            data={historyData}
                            barWidth={22}
                            noOfSections={3}
                            barBorderRadius={4}
                            frontColor={providerColor}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            hideRules
                            height={150}
                            width={300}
                        />
                    </View>
                </View>

                <View className="gap-4 pb-10">
                    <View className="bg-white dark:bg-slate-900 p-4 rounded-xl flex-row justify-between items-center border border-slate-200 dark:border-white/5">
                        <View className="flex-row items-center gap-3">
                            <Calendar size={18} color="#94a3b8" />
                            <Text className="text-slate-700 dark:text-slate-300">Next Due Date</Text>
                        </View>
                        <Text className="font-bold text-slate-900 dark:text-white">15th May</Text>
                    </View>

                    <View className="bg-white dark:bg-slate-900 p-4 rounded-xl flex-row justify-between items-center border border-slate-200 dark:border-white/5">
                        <View className="flex-row items-center gap-3">
                            <PieChart size={18} color="#94a3b8" />
                            <Text className="text-slate-700 dark:text-slate-300">Auto Pay</Text>
                        </View>
                        <Text className="font-bold text-slate-900 dark:text-white">{bill.auto_pay_enabled ? 'On' : 'Off'}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
