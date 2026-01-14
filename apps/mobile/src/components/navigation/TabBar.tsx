import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Home, Receipt, PlusCircle, PieChart, Menu } from 'lucide-react-native';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    const handleTabPress = (route: any, index: number) => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'Add') {
                // Special handling if needed, or just navigate
            }
            navigation.navigate(route.name);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const isFocused = false; // Placeholder

    return (
        <BlurView
            intensity={80}
            tint={theme === 'dark' ? 'dark' : 'light'}
            className="absolute bottom-0 left-0 right-0 border-t border-white/10"
            style={{ paddingBottom: insets.bottom }}
        >
            <View className="flex-row items-center justify-around h-[70px] px-4">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const label = options.tabBarLabel as string;

                    if (route.name === 'Add') {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={() => handleTabPress(route, index)}
                                className="items-center justify-center -mt-8"
                                activeOpacity={0.8}
                            >
                                <View className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg shadow-blue-500/50">
                                    <PlusCircle size={28} color="white" />
                                </View>
                            </TouchableOpacity>
                        );
                    }

                    let IconComponent;
                    switch (route.name) {
                        case 'Home': IconComponent = Home; break;
                        case 'Transactions': IconComponent = Receipt; break;
                        case 'Budgets': IconComponent = PieChart; break;
                        case 'More': IconComponent = Menu; break;
                        default: IconComponent = Home;
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => handleTabPress(route, index)}
                            className="flex-1 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Animated.View className={`items-center ${isFocused ? 'opacity-100' : 'opacity-50'}`}>
                                <IconComponent
                                    size={24}
                                    color={isFocused ? '#0066FF' : '#94A3B8'}
                                />
                                <Text className={`text-[10px] mt-1 font-medium ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {label}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </BlurView>
    );
}
