import { View, Text } from 'react-native';

interface DividerProps {
    text?: string;
    spacing?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Divider({ text, spacing = 'md', className }: DividerProps) {
    const spacingClasses = {
        sm: 'my-2',
        md: 'my-4',
        lg: 'my-6'
    };

    if (text) {
        return (
            <View className={`flex-row items-center ${spacingClasses[spacing]} ${className || ''}`}>
                <View className="flex-1 h-[1px] bg-white/10" />
                <Text className="text-gray-400 text-sm mx-4">{text}</Text>
                <View className="flex-1 h-[1px] bg-white/10" />
            </View>
        );
    }

    return <View className={`h-[1px] bg-white/10 ${spacingClasses[spacing]} ${className || ''}`} />;
}
