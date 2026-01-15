import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, DollarSign, Calendar, Bell, ChevronRight, X } from 'lucide-react-native';
import clsx from 'clsx';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';

// Mock Categories
const CATEGORIES = [
    { id: 'cat1', name: 'Food', icon: '🍔', color: 'bg-orange-500' },
    { id: 'cat2', name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
    { id: 'cat3', name: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { id: 'cat4', name: 'Housing', icon: '🏠', color: 'bg-indigo-500' },
    { id: 'cat5', name: 'Fun', icon: '🎬', color: 'bg-pink-500' },
    { id: 'cat6', name: 'Bills', icon: '💡', color: 'bg-yellow-500' },
];

const STEPS = [
    { id: 1, title: 'Category' },
    { id: 2, title: 'Amount' },
    { id: 3, title: 'Settings' },
];

export default function CreateBudgetScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        name: '',
        period: 'monthly',
        rollover: false,
        alerts: true,
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => {
        if (step > 1) setStep(s => s - 1);
        else navigation.goBack();
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Created Budget Mobile:', formData);
            // Polish: Success Feedback
            // Alert.alert is not available in React Native Web, but fine for mobile
            const { Alert } = require('react-native');
            Alert.alert("Success", "Budget created successfully!");
            navigation.goBack();
        }, 1500);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                    <ArrowLeft size={24} color={isDark ? 'white' : '#0f172a'} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">New Budget</Text>
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
                {/* Step 1: Category */}
                {step === 1 && (
                    <View>
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose Category</Text>
                        <View className="flex-row flex-wrap gap-4">
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => updateField('categoryId', cat.id)}
                                    className={clsx(
                                        "w-[47%] p-4 rounded-2xl border items-center gap-2",
                                        formData.categoryId === cat.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900"
                                    )}
                                >
                                    <Text className="text-3xl">{cat.icon}</Text>
                                    <Text className="font-bold text-slate-900 dark:text-white">{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Amount */}
                {step === 2 && (
                    <View className="space-y-6">
                        <View>
                            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">Set Limit</Text>
                            <Text className="text-slate-500 dark:text-slate-400">Monthly spending cap</Text>
                        </View>

                        <View className="bg-white dark:bg-slate-900 p-6 rounded-3xl items-center border border-slate-200 dark:border-white/10">
                            <Text className="text-slate-400 mb-2">Amount (MYR)</Text>
                            <View className="flex-row items-center">
                                <Text className="text-4xl font-bold text-slate-900 dark:text-white mr-2">RM</Text>
                                <TextInput
                                    value={formData.amount}
                                    onChangeText={(t) => updateField('amount', t)}
                                    placeholder="0"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="numeric"
                                    className="text-4xl font-bold text-slate-900 dark:text-white min-w-[100px] text-center"
                                />
                            </View>
                        </View>

                        {/* AI Tip */}
                        <View className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex-row gap-3">
                            <View className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/30 items-center justify-center">
                                <DollarSign size={16} color="#6366f1" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-slate-900 dark:text-white mb-1">Smart Suggestion</Text>
                                {!isLoading ? (
                                    <View>
                                        <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">
                                            You usually spend ~RM 450 here.
                                        </Text>
                                        <TouchableOpacity onPress={() => updateField('amount', '450')}>
                                            <Text className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-2">Use RM 450</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text className="text-slate-500 text-xs">Analyzing...</Text>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 3: Settings */}
                {step === 3 && (
                    <View className="space-y-4">
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">Final Touches</Text>

                        <View className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                            <View className="p-4 flex-row items-center justify-between border-b border-slate-100 dark:border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                                        <Calendar size={18} color="#3b82f6" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Rollover</Text>
                                        <Text className="text-xs text-slate-500">Carry forward remaining</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={formData.rollover}
                                    onValueChange={(v) => updateField('rollover', v)}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                />
                            </View>

                            <View className="p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 items-center justify-center">
                                        <Bell size={18} color="#f59e0b" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Smart Alerts</Text>
                                        <Text className="text-xs text-slate-500">Notify at 75% & 90%</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={formData.alerts}
                                    onValueChange={(v) => updateField('alerts', v)}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2 mt-4">Custom Name (Optional)</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(t) => updateField('name', t)}
                                placeholder="e.g. Weekend Eats"
                                placeholderTextColor="#94a3b8"
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View className="p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950">
                {step < 3 ? (
                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={(step === 1 && !formData.categoryId) || (step === 2 && !formData.amount)}
                        className={clsx(
                            "w-full py-4 rounded-xl items-center",
                            ((step === 1 && !formData.categoryId) || (step === 2 && !formData.amount))
                                ? "bg-slate-200 dark:bg-slate-800"
                                : "bg-blue-600"
                        )}
                    >
                        <Text className={clsx("font-bold", ((step === 1 && !formData.categoryId) || (step === 2 && !formData.amount)) ? "text-slate-400" : "text-white")}>
                            Next Step
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-blue-600 py-4 rounded-xl items-center"
                    >
                        <Text className="text-white font-bold">{isLoading ? 'Creating...' : 'Create Budget'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
