import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

interface IconProps {
    name: keyof typeof Feather.glyphMap;
    size?: number;
    color?: string;
    className?: string; // allow tailwind classes
}

export function Icon({ name, size = 24, color = '#FFFFFF', className }: IconProps) {
    // We wrap in View if className is provided to allow positioning, though NativeWind on Icons is tricky.
    // Best to just pass size/color prop or wrap in a styled View.
    if (className) {
        return (
            <View className={className}>
                <Feather name={name} size={size} color={color} />
            </View>
        );
    }
    return <Feather name={name} size={size} color={color} />;
}
