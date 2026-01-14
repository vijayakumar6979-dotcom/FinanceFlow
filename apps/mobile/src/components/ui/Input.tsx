import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    success?: boolean;
    disabled?: boolean;
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    showClearButton?: boolean;
    className?: string;
}

export function Input({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    success,
    disabled,
    secureTextEntry,
    multiline,
    numberOfLines = 1,
    maxLength,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    prefixIcon,
    suffixIcon,
    showClearButton,
    className
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        top: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, -8]
        }),
        fontSize: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12]
        })
    };

    const getBorderColor = () => {
        if (error) return '#EF4444';
        if (success) return '#10B981';
        if (isFocused) return '#0066FF';
        return 'rgba(255, 255, 255, 0.2)';
    };

    return (
        <View className={cn("mb-4", className)}>
            <View className="relative">
                <BlurView
                    intensity={20}
                    tint="dark"
                    className="rounded-xl overflow-hidden"
                    style={{
                        borderWidth: 2,
                        borderColor: getBorderColor(),
                        // Shadow not supported well on Android with BlurView wrapper sometimes, but trying
                    }}
                >
                    <View className="flex-row items-center px-4 py-3">
                        {prefixIcon && <View className="mr-2">{prefixIcon}</View>}

                        <View className="flex-1 min-h-[50px] justify-center">
                            <Animated.Text
                                style={[
                                    labelStyle,
                                    {
                                        position: 'absolute',
                                        left: 0,
                                        color: getBorderColor(),
                                        backgroundColor: '#121629', // Match background to hide border line
                                        paddingHorizontal: 4,
                                        zIndex: 1
                                    }
                                ]}
                            >
                                {label}
                            </Animated.Text>

                            <TextInput
                                value={value}
                                onChangeText={onChangeText}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={isFocused ? placeholder : ''}
                                placeholderTextColor="#64748B"
                                editable={!disabled}
                                secureTextEntry={secureTextEntry && !showPassword}
                                multiline={multiline}
                                numberOfLines={numberOfLines}
                                maxLength={maxLength}
                                keyboardType={keyboardType}
                                autoCapitalize={autoCapitalize}
                                className="text-white text-base pt-2 font-medium"
                                style={{
                                    minHeight: multiline ? 80 : 24,
                                    textAlignVertical: multiline ? 'top' : 'center'
                                }}
                            />
                        </View>

                        {secureTextEntry && (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        )}

                        {showClearButton && value.length > 0 && (
                            <TouchableOpacity onPress={() => onChangeText('')} className="ml-2" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Icon name="x" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        )}

                        {suffixIcon && <View className="ml-2">{suffixIcon}</View>}
                    </View>
                </BlurView>
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}

            {maxLength && (
                <Text className="text-gray-400 text-xs mt-1 ml-1 text-right">
                    {value.length}/{maxLength}
                </Text>
            )}
        </View>
    );
}
