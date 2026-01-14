import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from './utils/cn';
import { useClickOutside } from './utils/useClickOutside';

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    multiple?: boolean;
    className?: string;
}

export function Select({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select option...',
    error,
    disabled = false,
    searchable = false,
    multiple = false,
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isSelected = (optionValue: string) => {
        if (multiple && Array.isArray(value)) {
            return value.includes(optionValue);
        }
        return value === optionValue;
    };

    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(optionValue)) {
                onChange(currentValues.filter(v => v !== optionValue));
            } else {
                onChange([...currentValues, optionValue]);
            }
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const removeValue = (e: React.MouseEvent, valToRemove: string) => {
        e.stopPropagation();
        if (Array.isArray(value)) {
            onChange(value.filter(v => v !== valToRemove));
        }
    };

    const displayValue = () => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return <span className="text-gray-400">{placeholder}</span>;
        }

        if (multiple && Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map(val => {
                        const option = options.find(o => o.value === val);
                        return (
                            <span key={val} className="flex items-center gap-1 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                                {option?.label}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:text-primary-900 dark:hover:text-primary-100"
                                    onClick={(e) => removeValue(e, val)}
                                />
                            </span>
                        );
                    })}
                </div>
            );
        }

        const option = options.find(o => o.value === value);
        return (
            <div className="flex items-center gap-2">
                {option?.icon}
                <span className="text-gray-900 dark:text-gray-100">{option?.label}</span>
            </div>
        );
    };

    return (
        <div className={cn("relative mb-4", className)} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}

            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "relative min-h-[48px] w-full bg-white dark:bg-dark-surface border rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between px-4 py-2",
                    disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-white/5" : "hover:border-primary-300 dark:hover:border-primary-700",
                    isOpen ? "ring-2 ring-primary-500/20 border-primary-500" : "border-gray-200 dark:border-white/10",
                    error && "border-red-500 hover:border-red-500",
                )}
            >
                <div className="flex-grow">{displayValue()}</div>
                <ChevronDown
                    size={20}
                    className={cn("text-gray-400 transition-transform duration-200 ml-2", isOpen && "rotate-180")}
                />
            </div>

            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-elevated border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                        {searchable && (
                            <div className="p-2 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white dark:bg-dark-elevated">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-white"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors",
                                            isSelected(option.value)
                                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {option.icon}
                                            {option.label}
                                        </div>
                                        {isSelected(option.value) && <Check size={16} className="text-primary-500" />}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No options found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
