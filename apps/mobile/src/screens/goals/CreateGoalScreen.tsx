import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Target, Calendar } from 'lucide-react-native';
import clsx from 'clsx';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';

const GOAL_TYPES = [
    { id: 'savings', name: 'Savings', icon: '💰', color: 'bg-emerald-500', desc: 'Rainy day fund' },
    { id: 'debt', name: 'Debt Payoff', icon: '💳', color: 'bg-red-500', desc: 'Clear debt fast' },
    { id: 'invest', name: 'Investing', icon: '📈', color: 'bg-blue-500', desc: 'Grow wealth' },
    { id: 'custom', name: 'Custom', icon: '🎯', color: 'bg-purple-500', desc: 'Anything else' },
];

const STEPS = [
    { id: 1, title: 'Type' },
    { id: 2, title: 'Target' },
    { id: 3, title: 'Plan' },
];

export default function CreateGoalScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        name: '',
        targetAmount: '',
        targetDate: '',
        autoContribute: false,
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
            console.log('Created Goal Mobile:', formData);
            const { Alert } = require('react-native');
            Alert.alert("Success", "Goal created successfully!");
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
                <Text className="text-lg font-bold text-slate-900 dark:text-white">New Goal</Text>
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
                {/* Step 1: Type & Name */}
                {step === 1 && (
                    <View>
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Goal Type</Text>
                        <View className="gap-3 mb-6">
                            {GOAL_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={() => updateField('type', type.id)}
                                    className={clsx(
                                        "p-4 rounded-2xl border flex-row items-center gap-4",
                                        formData.type === type.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900"
                                    )}
                                >
                                    <View className={clsx("w-10 h-10 rounded-full items-center justify-center opacity-80", type.color)}>
                                        <Text>{type.icon}</Text>
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-900 dark:text-white text-base">{type.name}</Text>
                                        <Text className="text-xs text-slate-500">{type.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Goal Name</Text>
                        <TextInput
                            value={formData.name}
                            onChangeText={(t) => updateField('name', t)}
                            placeholder="e.g. Dream House"
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                        />
                    </View>
                )}

                {/* Step 2: Amount & Date */}
                {step === 2 && (
                    <View className="space-y-6">
                        <View className="bg-white dark:bg-slate-900 p-6 rounded-3xl items-center border border-slate-200 dark:border-white/10">
                            <Text className="text-slate-400 mb-2">Target Amount (MYR)</Text>
                            <View className="flex-row items-center">
                                <Text className="text-4xl font-bold text-slate-900 dark:text-white mr-2">RM</Text>
                                <TextInput
                                    value={formData.targetAmount}
                                    onChangeText={(t) => updateField('targetAmount', t)}
                                    placeholder="0"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="numeric"
                                    className="text-4xl font-bold text-slate-900 dark:text-white min-w-[100px] text-center"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Target Date</Text>
                            <TextInput // Simple text input for mock, real app would use DatePicker
                                value={formData.targetDate}
                                onChangeText={(t) => updateField('targetDate', t)}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#94a3b8"
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                            />
                        </View>

                        {/* AI Tip */}
                        <View className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex-row gap-3">
                            <View className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/30 items-center justify-center">
                                <Target size={16} color="#6366f1" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-slate-900 dark:text-white mb-1">Feasibility Check</Text>
                                <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">
                                    High chance of success! Saving RM 850/mo fits your budget.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 3: Automation */}
                {step === 3 && (
                    <View className="space-y-4">
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automation</Text>

                        <View className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                            <View className="p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
                                        <RefreshCw size={18} color="#10b981" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-900 dark:text-white">Auto-Contribute</Text>
                                        <Text className="text-xs text-slate-500">Save automatically</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={formData.autoContribute}
                                    onValueChange={(v) => updateField('autoContribute', v)}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                />
                            </View>
                        </View>

                        <View className="mt-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 items-center">
                            <Text className="text-slate-500 dark:text-slate-400 text-center">
                                Saving <Text className="font-bold text-slate-900 dark:text-white">RM {formData.targetAmount}</Text> for <Text className="font-bold text-slate-900 dark:text-white">{formData.name}</Text>.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View className="p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950">
                {step < 3 ? (
                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={(step === 1 && !formData.type) || (step === 2 && !formData.targetAmount)}
                        className={clsx(
                            "w-full py-4 rounded-xl items-center",
                            ((step === 1 && !formData.type) || (step === 2 && !formData.targetAmount))
                                ? "bg-slate-200 dark:bg-slate-800"
                                : "bg-blue-600"
                        )}
                    >
                        <Text className={clsx("font-bold", ((step === 1 && !formData.type) || (step === 2 && !formData.targetAmount)) ? "text-slate-400" : "text-white")}>
                            Next Step
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-blue-600 py-4 rounded-xl items-center"
                    >
                        <Text className="text-white font-bold">{isLoading ? 'Creating...' : 'Create Goal'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
