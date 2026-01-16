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
import { BudgetsScreen, CreateBudgetScreen, BudgetDetailScreen } from '../screens/budgets';
import { GoalsScreen, CreateGoalScreen, GoalDetailScreen } from '../screens/goals';
import { BillsScreen, CreateBillScreen, BillDetailScreen } from '../screens/bills';
import { InvestmentsScreen } from '../screens/InvestmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SecurityScreen from '../screens/SecurityScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
// import { AddInvestmentScreen } from '../screens/AddInvestmentScreen'; // TODO: Implement

// Placeholder Screens
const HomeScreen = () => (
    <View className="flex-1 bg-gray-900 pt-20">
        <ScreenHeader title="Dashboard" showMenu={true} onMenuPress={() => console.log('Menu')} />
        <Text className="text-white p-4">Home Screen Content</Text>
    </View>
);
import { TransactionsScreen } from '../screens/TransactionsScreen';
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
                options={{ tabBarLabel: 'Add' }}
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
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    // tabBarIcon: ... (if I had an icon)
                }}
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

                {/* Accounts */}
                <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
                <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ presentation: 'modal' }} />

                {/* Budgets */}
                <Stack.Screen name="Budgets" component={BudgetsScreen} />
                <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} options={{ presentation: 'modal' }} />
                <Stack.Screen name="BudgetDetail" component={BudgetDetailScreen} />

                {/* Goals */}
                <Stack.Screen name="Goals" component={GoalsScreen} />
                <Stack.Screen name="CreateGoal" component={CreateGoalScreen} options={{ presentation: 'modal' }} />
                <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />

                {/* Bills */}
                <Stack.Screen name="Bills" component={BillsScreen} />
                <Stack.Screen name="CreateBill" component={CreateBillScreen} options={{ presentation: 'modal' }} />
                <Stack.Screen name="BillDetail" component={BillDetailScreen} />

                {/* Investments */}
                <Stack.Screen name="Investments" component={InvestmentsScreen} />
                {/* Investments */}
                <Stack.Screen name="Investments" component={InvestmentsScreen} />
                {/* <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} options={{ presentation: 'modal' }} /> */}

                {/* Profile & Settings */}
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Security" component={SecurityScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            </Stack.Navigator>

            <DrawerMenu
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navigation={{ navigate: () => { } }}
            />
        </>
    );
}
