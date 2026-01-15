import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Plus, Wallet, Building2, CreditCard, Banknote, Search } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useLayoutStore } from '@/store/layoutStore';
import { formatCurrency } from '@financeflow/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Mock Data (matches web)
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
        usage: 12.25
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

export function AccountsScreen({ navigation }: any) {
    const [filterType, setFilterType] = useState('all');

    // Calculate totals
    const totalAssets = MOCK_ACCOUNTS.filter(a => a.type !== 'credit_card').reduce((sum, a) => sum + a.balance, 0);
    const totalDebt = MOCK_ACCOUNTS.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + Math.abs(a.balance), 0);
    const netWorth = totalAssets - totalDebt;

    const filteredAccounts = MOCK_ACCOUNTS.filter(a => {
        if (filterType === 'all') return true;
        if (filterType === 'banks') return a.type.startsWith('bank');
        if (filterType === 'cards') return a.type === 'credit_card';
        if (filterType === 'ewallets') return a.type === 'ewallet';
        return a.type === 'cash';
    });

    const renderAccountCard = ({ item }: any) => {
        const isDebt = item.type === 'credit_card';
        return (
            <TouchableOpacity
                className="mb-4 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm"
                onPress={() => navigation.navigate('AccountDetail', { id: item.id })}
            >
                <View className="p-5">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center overflow-hidden">
                                {item.institution?.logo ? (
                                    <Image source={{ uri: item.institution.logo }} className="w-full h-full" />
                                ) : (
                                    <Wallet size={20} color="#64748B" />
                                )}
                            </View>
                            <View>
                                <Text className="text-slate-900 dark:text-white font-semibold text-lg">{item.name}</Text>
                                <Text className="text-slate-500 dark:text-gray-400 text-xs">
                                    {item.type === 'cash' ? 'Cash' : `${item.institution?.name} • ${item.accountNumber?.slice(-4) || '****'}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-500 dark:text-gray-400 text-xs mb-1">
                            {isDebt ? 'Outstanding Balance' : 'Available Balance'}
                        </Text>
                        <Text className={`text-2xl font-bold font-mono ${isDebt ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(item.balance)}
                        </Text>
                    </View>

                    {item.type === 'credit_card' && (
                        <View className="mt-4 space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-slate-500 dark:text-gray-400 text-xs">Limit: {formatCurrency(item.creditLimit)}</Text>
                                <Text className="text-slate-500 dark:text-gray-400 text-xs">Usage: {item.usage}%</Text>
                            </View>
                            <View className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <View
                                    className={`h-full ${item.usage > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                    style={{ width: `${item.usage}%` }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-[#0A0E27]">
            <View className="pt-14 px-6 pb-4">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-3xl font-bold text-slate-900 dark:text-white">Accounts</Text>
                        <Text className="text-slate-500 dark:text-gray-400 text-sm">Net Worth: {formatCurrency(netWorth)}</Text>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 items-center justify-center"
                        onPress={() => navigation.navigate('AddAccount')}
                    >
                        <Plus size={20} color="#60A5FA" />
                    </TouchableOpacity>
                </View>

                {/* Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    {['all', 'banks', 'cards', 'ewallets'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setFilterType(type)}
                            className={`px-5 py-2 rounded-full mr-3 border ${filterType === type
                                ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/50'
                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10'
                                }`}
                        >
                            <Text className={`${filterType === type ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-gray-400'} font-medium capitalize`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredAccounts}
                renderItem={renderAccountCard}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 24, paddingTop: 0 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
