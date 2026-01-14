import React from 'react';
import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../utils/cn';

interface AvatarProps {
    src?: string;
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline';
    showBorder?: boolean;
    className?: string;
}

export function Avatar({ src, name, size = 'md', status, showBorder, className }: AvatarProps) {
    const sizes = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 56,
        xl: 80
    };

    const fontSize = {
        xs: 10,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 32
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const sizeValue = sizes[size];

    return (
        <View className={cn("relative", className)}>
            {src ? (
                <Image
                    source={{ uri: src }}
                    style={{
                        width: sizeValue,
                        height: sizeValue,
                        borderRadius: sizeValue / 2,
                        borderWidth: showBorder ? 2 : 0,
                        borderColor: '#0066FF'
                    }}
                />
            ) : (
                <LinearGradient
                    colors={['#0066FF', '#8B5CF6']}
                    style={{
                        width: sizeValue,
                        height: sizeValue,
                        borderRadius: sizeValue / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: showBorder ? 2 : 0,
                        borderColor: '#0066FF'
                    }}
                >
                    <Text
                        style={{ fontSize: fontSize[size] }}
                        className="text-white font-bold"
                    >
                        {getInitials(name)}
                    </Text>
                </LinearGradient>
            )}

            {status && (
                <View
                    className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-base",
                        status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    )}
                />
            )}
        </View>
    );
}
