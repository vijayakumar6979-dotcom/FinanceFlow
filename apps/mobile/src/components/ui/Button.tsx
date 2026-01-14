import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { cn } from '../../utils/cn';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    onPress: () => void;
    children: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    icon,
    iconPosition = 'left',
    onPress,
    children,
    fullWidth,
    className
}: ButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        if (!disabled && !loading) {
            onPress();
        }
    };

    const sizes = {
        sm: 'h-8 px-4',
        md: 'h-10 px-6',
        lg: 'h-12 px-8',
        xl: 'h-14 px-10'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    const getBaseClasses = () => cn(
        "rounded-xl flex-row items-center justify-center",
        fullWidth ? 'w-full' : '',
        sizes[size],
        className
    );

    const renderContent = (textColor: string) => (
        <>
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <View className="flex-row items-center">
                    {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
                    <Text className={cn("font-bold", textSizes[size], `text-[${textColor}]`)} style={{ color: textColor }}>
                        {children}
                    </Text>
                    {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
                </View>
            )}
        </>
    );

    const Wrapper = ({ children: c }: { children: React.ReactNode }) => (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                className={fullWidth ? 'w-full' : undefined}
            >
                {c}
            </TouchableOpacity>
        </Animated.View>
    );

    if (variant === 'primary') {
        return (
            <Wrapper>
                <LinearGradient
                    colors={['#0066FF', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className={getBaseClasses()}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    {renderContent('#FFFFFF')}
                </LinearGradient>
            </Wrapper>
        );
    }

    if (variant === 'danger') {
        return (
            <Wrapper>
                <View
                    className={cn(getBaseClasses(), "bg-red-500")}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    {renderContent('#FFFFFF')}
                </View>
            </Wrapper>
        );
    }

    if (variant === 'secondary') {
        return (
            <Wrapper>
                <View
                    className={cn(getBaseClasses(), "bg-white dark:bg-dark-elevated border border-gray-200 dark:border-white/10")}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    {renderContent(disabled ? '#94A3B8' : '#0F172A')}
                    {/* Note: Text color handling in RN usually needs explicit style or class if not inherited */}
                </View>
            </Wrapper>
        );
    }

    if (variant === 'outline') {
        return (
            <Wrapper>
                <View
                    className={cn(getBaseClasses(), "bg-transparent border border-primary-500")}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    {renderContent('#0066FF')}
                </View>
            </Wrapper>
        );
    }

    if (variant === 'ghost') {
        return (
            <Wrapper>
                <View
                    className={cn(getBaseClasses(), "bg-transparent")}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    {renderContent(disabled ? '#94A3B8' : '#0F172A')}
                </View>
            </Wrapper>
        );
    }

    return null;
}
