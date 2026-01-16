import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
    const navigation = useNavigation<any>();
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    // Step state
    const [step, setStep] = useState(1);

    // Form Data
    const [currency, setCurrency] = useState('MYR');
    const [budgetStartDay, setBudgetStartDay] = useState('1');

    const handleFinish = async () => {
        setLoading(true);
        try {
            await updateProfile({
                currency,
                budget_start_day: parseInt(budgetStartDay),
                updated_at: new Date().toISOString()
            });
            // Navigate to main app
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0E27]">
            <StatusBar style="light" />
            <View className="flex-1 px-6 py-8">
                {/* Progress */}
                <View className="flex-row justify-between mb-8">
                    {[1, 2].map(i => (
                        <View
                            key={i}
                            className={`h-1 flex-1 mx-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-white/10'}`}
                        />
                    ))}
                </View>

                <View className="flex-1 justify-center">
                    {step === 1 ? (
                        <View>
                            <View className="mb-8 items-center">
                                <Text className="text-white text-3xl font-bold mb-2">Preferences</Text>
                                <Text className="text-gray-400 text-center text-base">Select your default currency</Text>
                            </View>

                            <View className="space-y-4">
                                {['MYR', 'USD', 'SGD', 'EUR'].map(curr => (
                                    <TouchableOpacity
                                        key={curr}
                                        onPress={() => setCurrency(curr)}
                                        className={`p-4 rounded-xl border ${currency === curr ? 'bg-blue-600/20 border-blue-600' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`text-lg font-medium ${currency === curr ? 'text-blue-400' : 'text-white'}`}>
                                            {curr}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View className="mb-8 items-center">
                                <Text className="text-white text-3xl font-bold mb-2">Budgeting</Text>
                                <Text className="text-gray-400 text-center text-base">When does your budget cycle start?</Text>
                            </View>

                            <View className="space-y-4">
                                {['1', '15', '25'].map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => setBudgetStartDay(day)}
                                        className={`p-4 rounded-xl border ${budgetStartDay === day ? 'bg-blue-600/20 border-blue-600' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`text-lg font-medium ${budgetStartDay === day ? 'text-blue-400' : 'text-white'}`}>
                                            Day {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View className="flex-row justify-between pt-6">
                    {step > 1 ? (
                        <TouchableOpacity
                            onPress={() => setStep(step - 1)}
                            className="bg-white/5 py-4 px-8 rounded-xl"
                        >
                            <Text className="text-white font-semibold">Back</Text>
                        </TouchableOpacity>
                    ) : <View />}

                    <TouchableOpacity
                        onPress={() => step < 2 ? setStep(step + 1) : handleFinish()}
                        className="bg-blue-600 py-4 px-8 rounded-xl min-w-[120px] items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold">{step === 2 ? 'Finish' : 'Next'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
