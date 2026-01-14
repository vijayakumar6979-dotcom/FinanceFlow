import React, { useState } from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SelectOption {
    label: string;
    value: string;
    icon?: React.ReactNode
}

interface SelectProps {
    label: string;
    value: string | string[];
    options: SelectOption[];
    onChange: (value: string | string[] | any) => void;
    placeholder?: string;
    searchable?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
}

export function Select({
    label,
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    searchable,
    multiple,
    disabled,
    className
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();

    // Snap points
    const snapPoints = React.useMemo(() => ['50%', '90%'], []);

    const handleSheetChanges = React.useCallback((index: number) => {
        if (index === -1) {
            setIsOpen(false);
            setSearchQuery(''); // Reset search on close
        }
    }, []);

    const openSheet = () => {
        setIsOpen(true);
        bottomSheetRef.current?.expand();
    };

    const closeSheet = () => {
        bottomSheetRef.current?.close();
    };

    const filteredOptions = searchable
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    const selectedLabel = React.useMemo(() => {
        if (Array.isArray(value)) {
            return value.length > 0 ? `${value.length} selected` : placeholder;
        }
        return options.find(opt => opt.value === value)?.label || placeholder;
    }, [value, options, placeholder]);

    const isSelected = (itemValue: string) => {
        if (Array.isArray(value)) return value.includes(itemValue);
        return value === itemValue;
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => !disabled && openSheet()}
                disabled={disabled}
                className={cn("mb-4", className)}
            >
                <BlurView
                    intensity={20}
                    tint="dark"
                    className={cn(
                        "rounded-xl p-4 border border-white/20 flex-row items-center justify-between",
                        disabled && "opacity-50"
                    )}
                >
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs mb-1 font-medium">{label}</Text>
                        <Text className={cn("text-base font-medium", value ? "text-white" : "text-gray-500")}>
                            {selectedLabel}
                        </Text>
                    </View>
                    <Icon name="chevron-down" size={20} color="#94A3B8" />
                </BlurView>
            </TouchableOpacity>

            {isOpen && (
                // We define BottomSheet here. Note: It usually needs to be inside a GestureHandlerRootView provider high up in the tree.
                // Assuming App root has GestureHandlerRootView.
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onChange={handleSheetChanges}
                    backgroundStyle={{ backgroundColor: '#1A1F3A' }} // dark-elevated
                    handleIndicatorStyle={{ backgroundColor: '#FFFFFF' }}
                    topInset={insets.top}
                >
                    <View className="flex-1 px-4 bg-dark-elevated">
                        <Text className="text-white text-xl font-bold mb-4 mt-2 text-center">{label}</Text>

                        {searchable && (
                            <View className="mb-4 bg-white/5 rounded-xl flex-row items-center px-3 border border-white/10">
                                <Icon name="search" size={18} color="#9CA3AF" />
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search..."
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 p-3 text-white text-base"
                                />
                            </View>
                        )}

                        <BottomSheetFlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (multiple) {
                                            const currentVal = Array.isArray(value) ? value : [];
                                            const newValue = currentVal.includes(item.value)
                                                ? currentVal.filter(v => v !== item.value)
                                                : [...currentVal, item.value];
                                            onChange(newValue);
                                        } else {
                                            onChange(item.value);
                                            closeSheet();
                                        }
                                    }}
                                    className={cn(
                                        "flex-row items-center p-4 border-b border-white/10 rounded-lg mb-1",
                                        isSelected(item.value) ? "bg-primary-500/10" : ""
                                    )}
                                >
                                    {item.icon && <View className="mr-3">{item.icon}</View>}
                                    <Text className={cn(
                                        "flex-1 text-base",
                                        isSelected(item.value) ? "text-primary-400 font-bold" : "text-white"
                                    )}>
                                        {item.label}
                                    </Text>
                                    {isSelected(item.value) && (
                                        <Icon name="check" size={20} color="#0066FF" />
                                    )}
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 24 }}
                        />
                    </View>
                </BottomSheet>
            )}
        </>
    );
}
