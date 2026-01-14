import React from 'react';
import { Modal as RNModal, View, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
}

export function Modal({
    visible,
    onClose,
    title,
    children,
    fullScreen = false,
    size = 'md',
    showCloseButton = true
}: ModalProps) {
    const insets = useSafeAreaInsets();

    if (fullScreen) {
        return (
            <RNModal
                visible={visible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={onClose}
            >
                <View className="flex-1 bg-dark-base" style={{ paddingTop: insets.top }}>
                    <View className="flex-row items-center justify-between p-4 border-b border-white/10 bg-dark-base z-10">
                        {showCloseButton && (
                            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Icon name="x" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                        {title && <Text className="text-white text-lg font-semibold flex-1 text-center">{title}</Text>}
                        <View className="w-6" />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                    >
                        <ScrollView className="flex-1 p-4">
                            {children}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </RNModal>
        );
    }

    // Centered modal
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-4">
                {visible && (
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="w-full max-w-md"
                    >
                        <BlurView intensity={80} tint="dark" className="rounded-2xl overflow-hidden border border-white/10">
                            {title && (
                                <View className="flex-row items-center justify-between p-4 border-b border-white/10">
                                    <Text className="text-white text-lg font-semibold">{title}</Text>
                                    {showCloseButton && (
                                        <TouchableOpacity onPress={onClose}>
                                            <Icon name="x" size={24} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            <View className="p-6">
                                {children}
                            </View>
                        </BlurView>
                    </Animated.View>
                )}
            </View>
        </RNModal>
    );
}
