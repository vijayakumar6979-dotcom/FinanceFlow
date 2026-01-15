import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { AccountsScreen } from '../screens/accounts/AccountsScreen';
import { AddAccountScreen } from '../screens/accounts/AddAccountScreen';
import { AccountDetailScreen } from '../screens/accounts/AccountDetailScreen';
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
const MoreScreen = () => <View className="flex-1 items-center justify-center bg-gray-900"><Text className="text-white">More</Text></View>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
    return (
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
                component={AddTransactionScreen} // Reusing for now
                options={{ tabBarLabel: 'Add', presentation: 'modal' }}
            />
            <Tab.Screen
                name="Accounts"
                component={AccountsScreen}
                options={{
                    tabBarLabel: 'Accounts',
                    tabBarIcon: ({ color }) => <Wallet size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="More"
                component={MoreScreen}
                options={{ tabBarLabel: 'More' }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { drawerOpen, setDrawerOpen } = useLayoutStore();

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="AccountDetail"
                    component={AccountDetailScreen}
                />
                <Stack.Screen
                    name="AddAccount"
                    component={AddAccountScreen}
                    options={{ presentation: 'modal' }}
                />
            </Stack.Navigator>

            <DrawerMenu
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navigation={{ navigate: () => { } }}
            />
        </>
    );
}
