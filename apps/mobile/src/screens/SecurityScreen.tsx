import React, { useState, useEffect } from 'react';
import { View, Text, Switch, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SecurityScreen() {
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        checkBiometricSupport();
        loadBiometricPreference();
    }, []);

    const checkBiometricSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsSupported(compatible && enrolled);
    };

    const loadBiometricPreference = async () => {
        const stored = await AsyncStorage.getItem('biometric_enabled');
        setIsBiometricEnabled(stored === 'true');
    };

    const toggleSwitch = async () => {
        if (!isSupported) {
            Alert.alert('Not Supported', 'Biometric authentication is not available on this device.');
            return;
        }

        const newValue = !isBiometricEnabled;

        if (newValue) {
            // Verify before enabling
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometrics',
            });

            if (result.success) {
                setIsBiometricEnabled(true);
                await AsyncStorage.setItem('biometric_enabled', 'true');
            } else {
                Alert.alert('Authentication Failed', 'Could not verify identity.');
                return;
            }
        } else {
            setIsBiometricEnabled(false);
            await AsyncStorage.setItem('biometric_enabled', 'false');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0E27]">
            <StatusBar style="light" />
            <View className="flex-1 px-6 pt-6">
                <Text className="text-white text-3xl font-bold mb-8">Security</Text>

                <View className="bg-white/5 p-4 rounded-xl border border-white/10 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white font-medium text-lg">Biometric Login</Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            {isSupported ? 'Enable FaceID / TouchID' : 'Not supported on this device'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: "#2563eb" }}
                        thumbColor={isBiometricEnabled ? "#ffffff" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isBiometricEnabled}
                        disabled={!isSupported}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
