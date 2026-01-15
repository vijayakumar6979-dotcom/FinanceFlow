import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    success?: boolean;
    helperText?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    type = 'text',
    label,
    error,
    success,
    helperText,
    icon,
    iconPosition = 'left',
    fullWidth = true,
    disabled,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Handle auto-filled inputs
    const handleAnimationStart = (e: React.AnimationEvent<HTMLInputElement>) => {
        if (e.animationName === 'onAutoFillStart') {
            setHasValue(true);
        }
    };

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={cn("relative mb-4", fullWidth && "w-full")}>
            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    className={cn(
                        "peer w-full h-12 bg-white dark:bg-dark-surface border rounded-xl outline-none transition-all duration-200 pl-4 pr-4 pt-4 pb-1 text-gray-900 dark:text-white placeholder-transparent",
                        "disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-white/5",
                        error
                            ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            : success
                                ? "border-green-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                : "border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                        icon && iconPosition === 'left' && "pl-10",
                        (isPassword || (icon && iconPosition === 'right')) && "pr-10",
                        className
                    )}
                    placeholder={label} // Required for peer-placeholder-shown
                    disabled={disabled}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        setHasValue(e.target.value.length > 0);
                        props.onBlur?.(e);
                    }}
                    onChange={(e) => {
                        setHasValue(e.target.value.length > 0);
                        props.onChange?.(e);
                    }}
                    onAnimationStart={handleAnimationStart}
                    {...props}
                />

                <label
                    className={cn(
                        "absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400",
                        icon && iconPosition === 'left' && "left-10",
                        (isFocused || hasValue || props.value)
                            ? "top-1 text-xs translate-y-0"
                            : "top-1/2 -translate-y-1/2 text-base"
                    )}
                >
                    {label}
                </label>

                {icon && iconPosition === 'left' && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}

                {!isPassword && icon && iconPosition === 'right' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <div className={cn(
                    "text-xs mt-1 ml-1",
                    error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                )}>
                    {error || helperText}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';
