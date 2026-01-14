import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
    dot?: boolean;
    count?: number;
    className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, dot, count, className }: BadgeProps) {
    const colors = {
        default: 'bg-gray-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const sizes = {
        sm: 'px-2 py-0.5',
        md: 'px-3 py-1',
        lg: 'px-4 py-1.5'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    if (count !== undefined) {
        return (
            <View className={cn(`absolute -top-1 -right-1 ${colors[variant]} rounded-full min-w-[20px] h-5 items-center justify-center`, className)}>
                <Text className="text-white text-xs font-bold">{count > 99 ? '99+' : count}</Text>
            </View>
        );
    }

    return (
        <View className={cn(`rounded-full ${colors[variant]} ${sizes[size]} flex-row items-center`, className)}>
            {dot && <View className="w-2 h-2 rounded-full bg-white mr-2" />}
            <Text className={cn("text-white font-medium", textSizes[size])}>{children}</Text>
        </View>
    );
}
