import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
    const translateX = useSharedValue(value ? 20 : 2);

    React.useEffect(() => {
        translateX.value = withSpring(value ? 20 : 2, { damping: 15 });
    }, [value]);

    const handlePress = () => {
        if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onValueChange(!value);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {value ? (
                <LinearGradient
                    colors={['#0066FF', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-12 h-7 rounded-full justify-center"
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    <Animated.View
                        style={[animatedStyle]}
                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                </LinearGradient>
            ) : (
                <View
                    className="w-12 h-7 bg-white/20 rounded-full justify-center"
                    style={{ opacity: disabled ? 0.5 : 1 }}
                >
                    <Animated.View
                        style={[animatedStyle]}
                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}
