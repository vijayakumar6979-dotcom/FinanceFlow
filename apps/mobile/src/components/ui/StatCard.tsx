import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Card } from './Card';
import { Skeleton } from './Skeleton';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: number;
    change?: number;
    trend?: 'up' | 'down';
    icon: React.ReactNode;
    loading?: boolean;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    trend,
    icon,
    loading,
    prefix = '$',
    suffix = '',
    className
}: StatCardProps) {
    const animatedValue = useSharedValue(0);

    useEffect(() => {
        animatedValue.value = withTiming(value, { duration: 1000 });
    }, [value]);

    // Note: For actual number animation display in Text, we'd need Reanimated Text or state update via runOnJS.
    // For simplicity MVP, we just display the value directly or use a simple formatted string.
    // Implementing true animated numbers requires a bit more boilerplate in RN Reanimated 2/3.

    if (loading) {
        return (
            <Card variant="glass" className={className}>
                <Skeleton variant="text" width={80} height={16} />
                <Skeleton variant="text" width={120} height={32} />
            </Card>
        );
    }

    return (
        <Card variant="glass" className={className}>
            <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                    <Text className="text-gray-400 text-sm mb-2 font-medium">{title}</Text>
                    <Text className="text-white text-3xl font-bold font-mono">
                        {prefix}{value.toLocaleString()}{suffix}
                    </Text>
                </View>

                <LinearGradient
                    colors={['#0066FF', '#8B5CF6']}
                    className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
                    style={{ shadowColor: '#0066FF', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}
                >
                    {icon}
                </LinearGradient>
            </View>

            {change !== undefined && (
                <View className="flex-row items-center">
                    <Icon
                        name={trend === 'up' ? 'trending-up' : 'trending-down'}
                        size={16}
                        color={trend === 'up' ? '#10B981' : '#EF4444'}
                    />
                    <Text className={cn("ml-1 text-sm font-medium", trend === 'up' ? 'text-green-500' : 'text-red-500')}>
                        {Math.round(Math.abs(change))}%
                    </Text>
                    <Text className="text-gray-400 text-sm ml-2">vs last month</Text>
                </View>
            )}
        </Card>
    );
}
