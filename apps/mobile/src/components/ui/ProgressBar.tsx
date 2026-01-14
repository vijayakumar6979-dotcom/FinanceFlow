import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'linear' | 'circular';
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    label,
    showPercentage = true,
    size = 'md',
    variant = 'linear',
    className
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withSpring(percentage, { damping: 15 });
    }, [percentage]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`
    }));

    if (variant === 'circular') {
        const sizeValue = size === 'sm' ? 40 : size === 'md' ? 60 : 80;
        const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
        const radius = (sizeValue - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        // We update this via state or re-render since SVG props aren't easily animated with reanimated v2 style props directly on generic components without Animated.createAnimatedComponent
        // For simplicity, we calculate static strokeDashoffset for now or would need AnimatedCircle.
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <View className={cn("items-center justify-center", className)}>
                <Svg width={sizeValue} height={sizeValue}>
                    {/* Background circle */}
                    <Circle
                        cx={sizeValue / 2}
                        cy={sizeValue / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    {/* Note: Gradients in stroke are tricky in RN-SVG without definitions. We use a solid color for now or Defs if we want gradient stroke. */}
                    {/* Lets use a solid color matching the primary brand or use Defs. Svg supports Defs. */}
                    <Circle
                        cx={sizeValue / 2}
                        cy={sizeValue / 2}
                        r={radius}
                        stroke="#0066FF" // Fallback or use Defs for gradient
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${sizeValue / 2} ${sizeValue / 2})`}
                    />
                </Svg>
                <Text className="absolute text-white font-bold">{Math.round(percentage)}%</Text>
            </View>
        );
    }

    const heights = {
        sm: 4,
        md: 8,
        lg: 12
    };

    return (
        <View className={cn("w-full", className)}>
            {label && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-white text-sm">{label}</Text>
                    {showPercentage && (
                        <Text className="text-gray-400 text-sm">{Math.round(percentage)}%</Text>
                    )}
                </View>
            )}

            <View
                className="w-full bg-white/10 rounded-full overflow-hidden"
                style={{ height: heights[size] }}
            >
                <Animated.View style={[animatedStyle, { height: '100%' }]}>
                    <LinearGradient
                        colors={['#0066FF', '#8B5CF6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                </Animated.View>
            </View>
        </View>
    );
}
