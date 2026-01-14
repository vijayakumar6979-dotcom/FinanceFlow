import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { TabBar } from '../components/navigation/TabBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { DrawerMenu } from '../components/layout/DrawerMenu';
import { useLayoutStore } from '../store/layoutStore';

// Placeholder Screens
const HomeScreen = () => (
    <View className="flex-1 bg-gray-900 pt-20">
        <ScreenHeader title="Dashboard" showMenu={true} onMenuPress={() => console.log('Menu')} />
        <Text className="text-white p-4">Home Screen Content</Text>
    </View>
);
const TransactionsScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Transactions</Text></View>;
const AddTransactionScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Add Transaction</Text></View>;
const BudgetsScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">Budgets</Text></View>;
const MoreScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">More</Text></View>;

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { drawerOpen, setDrawerOpen } = useLayoutStore();

    return (
        <>
            <Tab.Navigator
                tabBar={(props) => <TabBar {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ tabBarLabel: 'Home' }}
                />
                <Tab.Screen
                    name="Transactions"
                    component={TransactionsScreen}
                    options={{ tabBarLabel: 'Activity' }}
                />
                <Tab.Screen
                    name="Add"
                    component={AddTransactionScreen}
                    options={{ tabBarLabel: 'Add', presentation: 'modal' }} // Add Button Special Handling
                />
                <Tab.Screen
                    name="Budgets"
                    component={BudgetsScreen}
                    options={{ tabBarLabel: 'Budget' }}
                />
                <Tab.Screen
                    name="More"
                    component={MoreScreen}
                    options={{ tabBarLabel: 'More' }}
                />
            </Tab.Navigator>

            <DrawerMenu
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navigation={{ navigate: () => { } }} // Need valid navigation prop
            />
        </>
    );
}
