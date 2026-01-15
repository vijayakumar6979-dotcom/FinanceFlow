import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: number;
    onChange: (value: number) => void;
    currency?: string;
    label?: string;
    error?: string;
    large?: boolean;
}

export function CurrencyInput({
    value,
    onChange,
    currency = 'USD',
    label,
    error,
    large = false,
    className,
    ...props
}: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Format number to currency string
    const formatValue = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    };

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(value ? formatValue(value) : '');
        }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only numbers and one decimal point
        if (/^[\d.,]*$/.test(inputValue)) {
            setDisplayValue(inputValue);

            // Parse to number for parent
            const cleanValue = inputValue.replace(/,/g, '');
            const numValue = parseFloat(cleanValue);

            if (!isNaN(numValue)) {
                onChange(numValue);
            } else if (inputValue === '') {
                onChange(0);
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setDisplayValue(value ? formatValue(value) : '');
        props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        // On focus, remove formatting to make editing easier
        setDisplayValue(value ? value.toString() : '');
        props.onFocus?.(e);
    };

    const getCurrencySymbol = (code: string) => {
        try {
            return (0).toLocaleString('en-US', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
        } catch (e) {
            return '$';
        }
    };

    return (
        <div className={cn("relative mb-4", className)}>
            {label && <label className={cn("block font-medium text-gray-700 dark:text-gray-300 mb-1", large ? "text-base" : "text-sm")}>{label}</label>}

            <div className="relative">
                <span className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none",
                    large ? "left-4 text-2xl" : "left-4 text-base"
                )}>
                    {getCurrencySymbol(currency)}
                </span>

                <input
                    type="text"
                    inputMode="decimal"
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={cn(
                        "w-full bg-white dark:bg-dark-surface border rounded-xl outline-none transition-all duration-200 text-gray-900 dark:text-white font-mono",
                        large ? "h-16 pl-10 text-3xl font-bold" : "h-12 pl-10 text-base",
                        error
                            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                        className
                    )}
                    placeholder="0.00"
                    {...props}
                />
            </div>

            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}
