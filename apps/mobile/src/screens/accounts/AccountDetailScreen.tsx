import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, MoreHorizontal, TrendingUp, Calendar, CreditCard } from 'lucide-react-native';
import { formatCurrency } from '@financeflow/shared';
import { LinearGradient } from 'expo-linear-gradient';

export function AccountDetailScreen({ navigation, route }: any) {
    const { id } = route.params || {};

    // Mock Data Fetch
    // Mock Data (matches AccountsScreen)
    const MOCK_ACCOUNTS = [
        {
            id: '1',
            name: 'Maybank Savings',
            type: 'bank_savings',
            balance: 12450.50,
            currency: 'MYR',
            institution: { name: 'Maybank', logo: 'https://placehold.co/100x100/FFD700/000000?text=M', color: '#FFD700' },
            accountNumber: '123456789012',
            isFavorite: true
        },
        {
            id: '2',
            name: 'Maybank Visa Platinum',
            type: 'credit_card',
            balance: -2450.00,
            currency: 'MYR',
            institution: { name: 'Maybank', logo: 'https://placehold.co/100x100/FFD700/000000?text=M', color: '#FFD700' },
            accountNumber: '4567',
            creditLimit: 20000,
            usage: 0,
        },
        {
            id: '3',
            name: 'GrabPay',
            type: 'ewallet',
            balance: 150.00,
            currency: 'MYR',
            institution: { name: 'GrabPay', logo: 'https://placehold.co/100x100/00B14F/FFFFFF?text=G', color: '#00B14F' },
            linked_phone: '+60123456789'
        },
        {
            id: '4',
            name: 'Cash on Hand',
            type: 'cash',
            balance: 450.00,
            currency: 'MYR'
        }
    ];

    const account = MOCK_ACCOUNTS.find(a => a.id === id) || MOCK_ACCOUNTS[0]; // Fallback to first if not found


    const isCreditCard = account.type === 'credit_card';

    return (
        <View className="flex-1 bg-gray-50 dark:bg-[#0A0E27]">
            {/* Custom Header with Back Button */}
            <View className="absolute top-12 left-4 z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View className="absolute top-12 right-4 z-10">
                <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <MoreHorizontal size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header Gradient */}
                <LinearGradient
                    colors={['#3B82F6', '#1E40AF', '#0A0E27']}
                    className="h-64 items-center justify-center pt-10"
                >
                    <View className="w-20 h-20 rounded-full bg-white mb-4 p-1 overflow-hidden items-center justify-center">
                        {account?.institution?.logo ? (
                            <Image source={{ uri: account.institution.logo }} className="w-full h-full rounded-full" />
                        ) : (
                            <Text className="text-2xl text-black font-bold">{account?.name?.[0] || 'A'}</Text>
                        )}
                    </View>
                    <Text className="text-white text-2xl font-bold">{account.name}</Text>
                    <Text className="text-blue-100 font-mono mt-1">**** {account.accountNumber?.slice(-4) || '****'}</Text>
                </LinearGradient>

                {/* Content */}
                <View className="-mt-6 bg-gray-50 dark:bg-[#0A0E27] rounded-t-3xl min-h-screen p-6">
                    {/* Main Balance Card */}
                    <View className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 mb-6 shadow-sm dark:shadow-none">
                        <Text className="text-slate-500 dark:text-gray-400 text-sm mb-1">
                            {isCreditCard ? 'Outstanding Balance' : 'Current Balance'}
                        </Text>
                        <Text className={`text-4xl font-bold font-mono mb-6 ${isCreditCard ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(account.balance)}
                        </Text>

                        {isCreditCard && (
                            <View className="space-y-4">
                                <View className="flex-row justify-between">
                                    <Text className="text-slate-500 dark:text-gray-400">Available</Text>
                                    <Text className="text-green-600 dark:text-green-400 font-bold">{formatCurrency((account.creditLimit || 0) + account.balance)}</Text>
                                </View>
                                <View className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-green-500"
                                        style={{ width: `${account.usage || 0}%` }}
                                    />
                                </View>
                                <Text className="text-xs text-slate-500 dark:text-gray-500 text-right">Utilization: {account.usage || 0}%</Text>
                            </View>
                        )}
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm dark:shadow-none">
                            <View className="bg-green-100 dark:bg-green-500/20 w-8 h-8 rounded-lg items-center justify-center mb-2">
                                <TrendingUp size={16} color="#4ADE80" />
                            </View>
                            <Text className="text-slate-500 dark:text-gray-400 text-xs">Spent Month</Text>
                            <Text className="text-slate-900 dark:text-white font-bold text-lg">{formatCurrency(1250)}</Text>
                        </View>
                        <View className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm dark:shadow-none">
                            <View className="bg-blue-100 dark:bg-blue-500/20 w-8 h-8 rounded-lg items-center justify-center mb-2">
                                <Calendar size={16} color="#60A5FA" />
                            </View>
                            <Text className="text-slate-500 dark:text-gray-400 text-xs">Last Activity</Text>
                            <Text className="text-slate-900 dark:text-white font-bold text-lg">Today</Text>
                        </View>
                    </View>

                    {/* Recent Transactions Placeholder */}
                    <Text className="text-slate-900 dark:text-white text-lg font-bold mb-4">Recent Transactions</Text>
                    {[1, 2, 3].map(i => (
                        <View key={i} className="flex-row items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl mb-3 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center">
                                    <CreditCard size={18} color="#64748B" />
                                </View>
                                <View>
                                    <Text className="text-slate-900 dark:text-white font-medium">Payment</Text>
                                    <Text className="text-slate-500 dark:text-gray-400 text-xs">Today</Text>
                                </View>
                            </View>
                            <Text className="text-slate-900 dark:text-white font-mono">{formatCurrency(-45.90)}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
