import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0E27]">
            <StatusBar style="light" />
            <View className="flex-1 px-6 justify-center">
                <View className="mb-10 items-center">
                    <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4">
                        <Text className="text-white text-3xl font-bold">F</Text>
                    </View>
                    <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
                    <Text className="text-gray-400 text-base">Sign in to your account</Text>
                </View>

                <View className="space-y-4">
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
                            placeholder="••••••••"
                            placeholderTextColor="#64748B"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 py-4 rounded-xl items-center mt-6"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        className="mt-4 items-center"
                    >
                        <Text className="text-gray-400">
                            Don't have an account? <Text className="text-blue-500 font-bold">Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
