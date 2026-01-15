import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Receipt, Wallet, PieChart, TrendingDown, TrendingUp, BarChart3, Settings, Moon, LogOut } from 'lucide-react-native';
import { useTheme } from '@financeflow/shared/src/hooks/useTheme';
import { useAuth } from '@financeflow/shared/src/hooks/useAuth';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, screen: 'Home' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, screen: 'Transactions' },
    { id: 'accounts', label: 'Accounts', icon: Wallet, screen: 'Accounts' },
    { id: 'budgets', label: 'Budgets', icon: PieChart, screen: 'Budgets' },
    { id: 'goals', label: 'Financial Goals', icon: TrendingUp, screen: 'Goals' },
    { id: 'bills', label: 'Bills', icon: Receipt, screen: 'Bills' },
    { id: 'loans', label: 'Loans', icon: TrendingDown, screen: 'Loans' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, screen: 'Analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, screen: 'Settings' },
];

interface DrawerMenuProps {
    visible: boolean;
    onClose: () => void;
    navigation: any;
}

export function DrawerMenu({ visible, onClose, navigation }: DrawerMenuProps) {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(visible ? 0 : -320);
    const { theme, toggleTheme } = useTheme();
    const { signOut, user } = useAuth();

    useEffect(() => {
        translateX.value = withTiming(visible ? 0 : -320, { duration: 300 });
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <TouchableOpacity
                className="flex-1 bg-black/50"
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Drawer */}
                <Animated.View
                    className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-[#121629]"
                    style={[animatedStyle, { paddingTop: insets.top }]}
                    onStartShouldSetResponder={() => true}
                >
                    <View className="flex-1">
                        {/* User Profile Section */}
                        <View className="p-6 border-b border-white/10">
                            <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-3">
                                <Text className="text-white text-xl font-bold">{user?.name?.charAt(0) || 'U'}</Text>
                            </View>
                            <Text className="text-white text-lg font-semibold">{user?.name || 'User'}</Text>
                            <Text className="text-gray-400 text-sm">{user?.email}</Text>
                        </View>

                        {/* Menu Items */}
                        <ScrollView className="flex-1 py-4">
                            {menuItems.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => {
                                        onClose();
                                        navigation.navigate(item.screen);
                                    }}
                                    className="flex-row items-center px-6 py-4"
                                >
                                    <item.icon size={24} color="#94A3B8" />
                                    <Text className="text-white ml-4 text-base">{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Bottom Actions */}
                        <View className="p-6 border-t border-white/10">
                            <View className="flex-row items-center mb-6 justify-between">
                                <View className="flex-row items-center">
                                    <Moon size={20} color="#94A3B8" />
                                    <Text className="text-white ml-3">Dark Mode</Text>
                                </View>
                                <Switch
                                    value={theme === 'dark'}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: "#767577", true: "#0066FF" }}
                                />
                            </View>

                            <TouchableOpacity className="flex-row items-center" onPress={() => signOut()}>
                                <LogOut size={20} color="#EF4444" />
                                <Text className="text-red-500 ml-3">Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}
