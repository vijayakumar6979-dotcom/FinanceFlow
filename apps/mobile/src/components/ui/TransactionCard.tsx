import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';

interface TransactionCardProps {
    transaction: {
        id: string;
        description: string;
        amount: number;
        type: 'income' | 'expense';
        category: { name: string; icon: string; color: string };
        date: string;
        account?: string;
    };
    onPress?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function TransactionCard({ transaction, onPress, onEdit, onDelete, className }: TransactionCardProps) {
    const renderRightActions = (_progress: any, dragX: any) => {
        // Swipeable actions should be wrapped to be visible
        return (
            <View className="flex-row items-center h-full pl-2">
                {onEdit && (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onEdit?.();
                        }}
                        className="bg-blue-500 w-16 h-[72px] justify-center items-center rounded-xl mr-2"
                    >
                        <Icon name="edit-2" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {onDelete && (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            onDelete?.();
                        }}
                        className="bg-red-500 w-16 h-[72px] justify-center items-center rounded-xl"
                    >
                        <Icon name="trash-2" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Swipeable renderRightActions={onEdit || onDelete ? renderRightActions : undefined}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} className={cn("mb-3", className)}>
                <BlurView
                    intensity={20}
                    tint="dark"
                    className="rounded-xl overflow-hidden border border-white/5"
                >
                    <View className="p-4 flex-row items-center">
                        {/* Icon */}
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-4"
                            style={{ backgroundColor: `${transaction.category.color}20` }}
                        >
                            <Icon
                                name={transaction.category.icon as any}
                                size={20}
                                color={transaction.category.color}
                            />
                        </View>

                        {/* Details */}
                        <View className="flex-1">
                            <Text className="text-white text-base font-semibold" numberOfLines={1}>{transaction.description}</Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-gray-400 text-xs">{transaction.category.name}</Text>
                                <Text className="text-gray-600 mx-2 text-xs">•</Text>
                                <Text className="text-gray-400 text-xs">{transaction.date}</Text>
                            </View>
                        </View>

                        {/* Amount */}
                        <Text
                            className={cn(
                                "text-base font-bold font-mono",
                                transaction.type === 'income' ? 'text-green-500' : 'text-white'
                            )}
                        >
                            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                        </Text>
                    </View>
                </BlurView>
            </TouchableOpacity>
        </Swipeable>
    );
}
