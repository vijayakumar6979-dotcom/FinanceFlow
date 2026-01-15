import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill for text encoder if needed for some libs in RN
import 'text-encoding-polyfill';

export default function App() {
    const { theme, setTheme } = useTheme();
    const { setColorScheme } = useColorScheme();

    // Hydrate theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('financeflow-theme-mobile');
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setTheme(savedTheme);
                }
            } catch (e) {
                console.error('Failed to load theme', e);
            }
        };
        loadTheme();
    }, []);

    // Sync theme with NativeWind and Persistence
    useEffect(() => {
        setColorScheme(theme);
        AsyncStorage.setItem('financeflow-theme-mobile', theme).catch(err => {
            console.error('Failed to save theme', err);
        });
    }, [theme]);

    return (
        <SafeAreaProvider>
            <RootNavigator />
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
    );
}
