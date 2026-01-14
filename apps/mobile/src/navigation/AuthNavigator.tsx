import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Placeholder Screens
const LoginScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Login Screen</Text></View>;
const SignupScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Signup Screen</Text></View>;
const ForgotPasswordScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Forgot Password</Text></View>;

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}
