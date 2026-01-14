import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Menu } from 'lucide-react-native';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';

interface ScreenHeaderProps {
    title: string;
    showBack?: boolean;
    showMenu?: boolean;
    onBack?: () => void;
    onMenuPress?: () => void;
    rightActions?: React.ReactNode;
    transparent?: boolean;
}

export function ScreenHeader({
    title,
    showBack,
    showMenu,
    onBack,
    onMenuPress,
    rightActions,
    transparent = false
}: ScreenHeaderProps) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <BlurView
                intensity={transparent ? 0 : 80}
                tint={theme === 'dark' ? 'dark' : 'light'}
                className="border-b border-white/10 z-50"
                style={{ paddingTop: insets.top }}
            >
                <View className="flex-row items-center justify-between h-[60px] px-4">
                    {/* Left */}
                    <View className="w-10">
                        {showBack && (
                            <TouchableOpacity onPress={onBack} hitSlop={10}>
                                <ChevronLeft size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                        {showMenu && (
                            <TouchableOpacity onPress={onMenuPress} hitSlop={10}>
                                <Menu size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Center */}
                    <Text className="text-lg font-semibold text-white">{title}</Text>

                    {/* Right */}
                    <View className="w-10 items-end">
                        {rightActions}
                    </View>
                </View>
            </BlurView>
        </>
    );
}
