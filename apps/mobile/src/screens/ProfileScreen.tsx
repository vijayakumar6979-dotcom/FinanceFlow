import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const navigation = useNavigation<any>();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0E27]">
            <StatusBar style="light" />
            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="text-white text-3xl font-bold mb-8">Profile</Text>

                {/* User Card */}
                <View className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 items-center">
                    <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                        <Text className="text-white text-2xl font-bold">
                            {user?.user_metadata?.full_name?.[0] || 'U'}
                        </Text>
                    </View>
                    <Text className="text-white text-xl font-bold mb-1">
                        {user?.user_metadata?.full_name || 'User'}
                    </Text>
                    <Text className="text-gray-400">
                        {user?.email}
                    </Text>
                </View>

                {/* Settings Menu */}
                <View className="space-y-4">
                    <Text className="text-gray-500 font-bold uppercase text-sm mb-2">Account</Text>

                    <TouchableOpacity className="bg-white/5 p-4 rounded-xl border border-white/10 flex-row justify-between items-center">
                        <Text className="text-white font-medium">Personal Information</Text>
                        <Text className="text-gray-500">→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white/5 p-4 rounded-xl border border-white/10 flex-row justify-between items-center"
                        onPress={() => navigation.navigate('Security')}
                    >
                        <Text className="text-white font-medium">Security</Text>
                        <Text className="text-gray-500">→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white/5 p-4 rounded-xl border border-white/10 flex-row justify-between items-center">
                        <Text className="text-white font-medium">Preferences</Text>
                        <Text className="text-gray-500">→</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="mt-12 bg-red-500/10 p-4 rounded-xl border border-red-500/20 items-center"
                    onPress={handleLogout}
                >
                    <Text className="text-red-500 font-bold">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
