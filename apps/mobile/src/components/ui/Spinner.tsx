import { ActivityIndicator, View } from 'react-native';

interface SpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    fullScreen?: boolean;
}

export function Spinner({ size = 'large', color = '#0066FF', fullScreen }: SpinnerProps) {
    const spinner = <ActivityIndicator size={size} color={color} />;

    if (fullScreen) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-base">
                {spinner}
            </View>
        );
    }

    return spinner;
}
