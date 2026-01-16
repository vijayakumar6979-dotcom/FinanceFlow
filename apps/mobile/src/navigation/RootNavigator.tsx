import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';

export default function RootNavigator() {
    const { user, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return null; // Or a splash screen
    }

    return (
        <NavigationContainer>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
