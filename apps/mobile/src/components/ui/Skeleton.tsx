import React, { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { cn } from '../../utils/cn';

interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: number | string;
    height?: number;
    count?: number;
    className?: string;
}

export function Skeleton({ variant = 'text', width = '100%', height = 16, count = 1, className }: SkeletonProps) {
    const translateX = useSharedValue(-200);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(200, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const getStyle = () => {
        if (variant === 'circular') {
            return { width: height, height, borderRadius: height / 2 };
        }
        if (variant === 'rectangular') {
            return { width, height, borderRadius: 12 };
        }
        return { width, height, borderRadius: 4 };
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        getStyle(),
                        // @ts-ignore - width/height can be string but style expects number sometimes unless separate
                    ]}
                    className={cn(
                        "bg-white/10 overflow-hidden",
                        variant === 'text' ? "mb-2" : "",
                        className
                    )}
                >
                    <Animated.View style={[{ flex: 1, width: '100%' }, animatedStyle]}>
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1, width: 200 }}
                        />
                    </Animated.View>
                </View>
            ))}
        </>
    );
}
