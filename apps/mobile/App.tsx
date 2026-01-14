import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';

// Polyfill for text encoder if needed for some libs in RN
import 'text-encoding-polyfill';

export default function App() {
    return (
        <SafeAreaProvider>
            <RootNavigator />
        </SafeAreaProvider>
    );
}
