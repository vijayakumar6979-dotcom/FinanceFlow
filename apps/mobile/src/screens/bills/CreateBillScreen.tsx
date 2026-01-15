import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, Search, Calendar, DollarSign } from 'lucide-react-native';
import { useTheme, MALAYSIAN_BILL_PROVIDERS, Bill } from '@financeflow/shared';
import clsx from 'clsx';

const STEPS = [
    { id: 1, title: 'Provider' },
    { id: 2, title: 'Details' },
    { id: 3, title: 'Plan' },
];

export default function CreateBillScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Bill>>({
        currency: 'MYR',
        auto_pay_enabled: false,
        is_variable: false,
        due_day: 1
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => {
        if (step > 1) setStep(s => s - 1);
        else navigation.goBack();
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setTimeout(() => {
            const { Alert } = require('react-native');
            Alert.alert("Success", "Bill created successfully!");
            navigation.goBack();
            setIsLoading(false);
        }, 1500);
    };

    const updateField = (field: keyof Bill, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectProvider = (providerId: string) => {
        const provider = MALAYSIAN_BILL_PROVIDERS.find(p => p.id === providerId);
        if (provider) {
            setFormData(prev => ({
                ...prev,
                provider_id: provider.id,
                provider_name: provider.name,
                provider_category: provider.category,
                provider_logo: provider.logo,
                is_variable: provider.isVariable,
                bill_name: `${provider.name} Bill`,
                estimated_amount: provider.averageAmount
            }));
            handleNext();
        }
    };

    const filteredProviders = MALAYSIAN_BILL_PROVIDERS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                    <ArrowLeft size={24} color={isDark ? 'white' : '#0f172a'} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">New Bill</Text>
                <View className="w-8" />
            </View>

            {/* Steps Progress */}
            <View className="flex-row justify-center items-center mb-8 px-6">
                {STEPS.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <View className="items-center">
                            <View
                                className={clsx(
                                    "w-8 h-8 rounded-full items-center justify-center mb-1",
                                    step >= s.id ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                                )}
                            >
                                <Text className={clsx("font-bold text-xs", step >= s.id ? "text-white" : "text-slate-500")}>
                                    {s.id}
                                </Text>
                            </View>
                            <Text className={clsx("text-xs font-medium", step >= s.id ? "text-blue-600" : "text-slate-400")}>
                                {s.title}
                            </Text>
                        </View>
                        {index < STEPS.length - 1 && (
                            <View className={clsx(
                                "h-[2px] w-12 mx-2 mb-4",
                                step > s.id ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Step 1: Provider */}
                {step === 1 && (
                    <View>
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Provider</Text>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search TNB, TIME..."
                            placeholderTextColor="#9ca3af"
                            className="bg-white dark:bg-white/5 p-4 rounded-xl text-slate-900 dark:text-white mb-4"
                        />
                        <View className="flex-row flex-wrap gap-3">
                            {filteredProviders.map(p => (
                                <TouchableOpacity
                                    key={p.id}
                                    onPress={() => selectProvider(p.id)}
                                    className="w-[48%] bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 items-center gap-2"
                                >
                                    <View className="w-10 h-10 rounded-full items-center justify-center overflow-hidden" style={{ backgroundColor: p.logo ? 'white' : p.color }}>
                                        {p.logo ? (
                                            <Image source={{ uri: p.logo }} className="w-8 h-8" resizeMode="contain" />
                                        ) : (
                                            <Text className="text-white font-bold">{p.name[0]}</Text>
                                        )}
                                    </View>
                                    <Text className="text-slate-900 dark:text-white font-medium">{p.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <View className="space-y-6">
                        <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-full items-center justify-center overflow-hidden" style={{
                                backgroundColor: formData.provider_logo ? 'white' : (MALAYSIAN_BILL_PROVIDERS.find(p => p.id === formData.provider_id)?.color || '#666')
                            }}>
                                {formData.provider_logo ? (
                                    <Image source={{ uri: formData.provider_logo }} className="w-8 h-8" resizeMode="contain" />
                                ) : (
                                    <Text className="text-white font-bold">{formData.provider_name?.[0]}</Text>
                                )}
                            </View>
                            <View>
                                <Text className="font-bold text-slate-900 dark:text-white">{formData.provider_name}</Text>
                                <Text className="text-xs text-slate-500">{formData.provider_category}</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Bill Name</Text>
                            <TextInput
                                value={formData.bill_name}
                                onChangeText={(t) => updateField('bill_name', t)}
                                className="bg-white dark:bg-white/5 p-4 rounded-xl text-slate-900 dark:text-white"
                            />
                        </View>

                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">
                                {formData.is_variable ? 'Estimated Amount (MYR)' : 'Fixed Amount (MYR)'}
                            </Text>
                            <TextInput
                                value={String(formData.is_variable ? formData.estimated_amount : formData.fixed_amount || '')}
                                onChangeText={(t) => updateField(formData.is_variable ? 'estimated_amount' : 'fixed_amount', Number(t))}
                                keyboardType="numeric"
                                className="bg-white dark:bg-white/5 p-4 rounded-xl text-slate-900 dark:text-white text-xl font-bold"
                            />
                        </View>
                    </View>
                )}

                {/* Step 3: Plan */}
                {step === 3 && (
                    <View className="space-y-6">
                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">Due Day of Month</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {[1, 5, 10, 15, 20, 25, 28].map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => updateField('due_day', day)}
                                        className={clsx(
                                            "w-12 h-12 rounded-full items-center justify-center",
                                            formData.due_day === day ? "bg-blue-600" : "bg-white dark:bg-white/10"
                                        )}
                                    >
                                        <Text className={clsx("font-bold", formData.due_day === day ? "text-white" : "text-slate-900 dark:text-white")}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="bg-white dark:bg-white/5 p-4 rounded-xl flex-row justify-between items-center">
                            <View>
                                <Text className="font-bold text-slate-900 dark:text-white">Auto Pay</Text>
                                <Text className="text-xs text-slate-500">Mark as paid automatically</Text>
                            </View>
                            <Switch
                                value={formData.auto_pay_enabled}
                                onValueChange={(v) => updateField('auto_pay_enabled', v)}
                                trackColor={{ true: '#2563eb', false: '#cbd5e1' }}
                            />
                        </View>

                        <View className="bg-white dark:bg-white/5 p-4 rounded-xl flex-row justify-between items-center">
                            <View>
                                <Text className="font-bold text-slate-900 dark:text-white">Budget Sync</Text>
                                <Text className="text-xs text-slate-500">Include in budget</Text>
                            </View>
                            <Switch
                                value={formData.auto_sync_budget}
                                onValueChange={(v) => updateField('auto_sync_budget', v)}
                                trackColor={{ true: '#2563eb', false: '#cbd5e1' }}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            <View className="p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950">
                <TouchableOpacity
                    onPress={step < 3 ? handleNext : handleSubmit}
                    disabled={step === 1 && !formData.provider_id}
                    className={clsx(
                        "w-full py-4 rounded-xl items-center",
                        step === 1 && !formData.provider_id ? "bg-slate-200 dark:bg-white/10" : "bg-blue-600"
                    )}
                >
                    <Text className={clsx("font-bold", step === 1 && !formData.provider_id ? "text-slate-400" : "text-white")}>
                        {isLoading ? 'Saving...' : step < 3 ? 'Next Step' : 'Save Bill'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
