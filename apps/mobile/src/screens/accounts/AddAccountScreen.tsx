import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { X, Check, Building2, CreditCard, Wallet, Banknote, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

type Step = 'type_selection' | 'details' | 'confirmation';
type AccountType = 'bank' | 'credit_card' | 'ewallet' | 'cash';

export function AddAccountScreen({ navigation }: any) {
    const [step, setStep] = useState<Step>('type_selection');
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [formData, setFormData] = useState({ name: '', balance: '', accountNumber: '', creditLimit: '' });

    const handleSave = () => {
        // Mock save
        navigation.goBack();
    };

    const renderTypeSelection = () => (
        <View className="flex-row flex-wrap justify-between p-4">
            {[
                { id: 'bank', label: 'Bank', icon: Building2, color: '#60A5FA', bg: 'bg-blue-400/10' },
                { id: 'credit_card', label: 'Card', icon: CreditCard, color: '#F87171', bg: 'bg-red-400/10' },
                { id: 'ewallet', label: 'E-Wallet', icon: Wallet, color: '#C084FC', bg: 'bg-purple-400/10' },
                { id: 'cash', label: 'Cash', icon: Banknote, color: '#4ADE80', bg: 'bg-green-400/10' }
            ].map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                        setAccountType(item.id as AccountType);
                        setStep('details');
                    }}
                    className="w-[48%] mb-4 bg-white/5 rounded-2xl p-6 items-center border border-white/5"
                >
                    <View className={`p-4 rounded-full mb-3 ${item.bg}`}>
                        <item.icon size={28} color={item.color} />
                    </View>
                    <Text className="text-white font-medium">{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderDetailsForm = () => (
        <ScrollView className="p-6">
            <View className="mb-6">
                <Text className="text-gray-400 mb-2 font-medium">Account Name</Text>
                <TextInput
                    placeholder="e.g. Maybank Savings"
                    placeholderTextColor="#64748B"
                    value={formData.name}
                    onChangeText={(t) => setFormData(prev => ({ ...prev, name: t }))}
                    className="bg-white/5 text-white p-4 rounded-xl border border-white/10"
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-400 mb-2 font-medium">Balance</Text>
                <TextInput
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor="#64748B"
                    value={formData.balance}
                    onChangeText={(t) => setFormData(prev => ({ ...prev, balance: t }))}
                    className="bg-white/5 text-white p-4 rounded-xl border border-white/10"
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-400 mb-2 font-medium">Details</Text>
                <TouchableOpacity className="flex-row items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                    <Text className="text-white">Select Institution</Text>
                    <ChevronRight size={20} color="#64748B" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-600 p-4 rounded-xl items-center mt-4"
            >
                <Text className="text-white font-bold text-lg">Create Account</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <View className="pt-4 px-4 flex-row justify-between items-center bg-[#0A0E27] z-10 border-b border-white/5 h-20">
                <TouchableOpacity onPress={() => step === 'type_selection' ? navigation.goBack() : setStep('type_selection')} className="p-2">
                    <Text className="text-blue-400 font-medium">{step === 'type_selection' ? 'Cancel' : 'Back'}</Text>
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg">
                    {step === 'type_selection' ? 'Add Account' : 'Account Details'}
                </Text>
                <View className="w-12" />
            </View>

            {step === 'type_selection' ? renderTypeSelection() : renderDetailsForm()}
        </View>
    );
}
