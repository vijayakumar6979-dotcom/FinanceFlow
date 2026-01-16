import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
    const navigation = useNavigation<any>();
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !fullName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, fullName);
            Alert.alert('Success', 'Account created! Please verify your email.');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0E27]">
            <StatusBar style="light" />
            <View className="flex-1 px-6 justify-center">
                <View className="mb-8 items-center">
                    <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
                    <Text className="text-gray-400 text-base">Start your financial journey</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-400 mb-2">Full Name</Text>
                        <TextInput
                            className="bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10"
                            placeholder="John Doe"
                            placeholderTextColor="#64748B"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2">Email</Text>
                        <TextInput
                            className="bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10"
                            placeholder="you@example.com"
                            placeholderTextColor="#64748B"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2">Password</Text>
                        <TextInput
                            className="bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10"
                            placeholder="Create a password"
                            placeholderTextColor="#64748B"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 py-4 rounded-xl items-center mt-6"
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        className="mt-4 items-center"
                    >
                        <Text className="text-gray-400">
                            Already have an account? <Text className="text-blue-500 font-bold">Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
