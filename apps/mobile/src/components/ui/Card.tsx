import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { cn } from '../../utils/cn';

interface CardProps {
    variant?: 'glass' | 'elevated' | 'flat';
    size?: 'sm' | 'md' | 'lg';
    pressable?: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    className?: string;
}

export function Card({
    variant = 'glass',
    size = 'md',
    pressable,
    onPress,
    children,
    className
}: CardProps) {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const Container = pressable ? TouchableOpacity : View;

    if (variant === 'glass') {
        return (
            <Container onPress={onPress} activeOpacity={0.8} className="mb-4">
                <BlurView
                    intensity={80}
                    tint="dark"
                    className={cn(
                        "rounded-2xl border border-white/10 overflow-hidden",
                        paddingClasses[size],
                        className
                    )}
                >
                    {children}
                </BlurView>
            </Container>
        );
    }

    if (variant === 'elevated') {
        return (
            <Container onPress={onPress} activeOpacity={0.8} className="mb-4">
                <View className={cn(
                    "rounded-2xl border border-white/10 bg-dark-elevated shadow-lg",
                    paddingClasses[size],
                    className
                )}>
                    {children}
                </View>
            </Container>
        );
    }

    // Flat
    return (
        <Container onPress={onPress} activeOpacity={0.8} className="mb-4">
            <View className={cn(
                "rounded-2xl border border-white/5 bg-white/5",
                paddingClasses[size],
                className
            )}>
                {children}
            </View>
        </Container>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    return <View className={cn("mb-4", className)}>{children}</View>;
}

export function CardBody({ children, className }: { children: React.ReactNode, className?: string }) {
    return <View className={cn("flex-1", className)}>{children}</View>;
}

export function CardFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return <View className={cn("mt-4 pt-4 border-t border-white/10", className)}>{children}</View>;
}
