import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from './utils/cn';
import { Spinner } from './Spinner';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children?: React.ReactNode;
}

const variants = {
    primary: `bg-gradient-to-r from-primary-600 to-indigo-600 text-white 
    hover:shadow-glow-blue border border-transparent
    dark:from-primary-500 dark:to-indigo-500`,
    secondary: `bg-white text-gray-900 border border-gray-200 
    hover:bg-gray-50 hover:border-gray-300
    dark:bg-dark-elevated dark:text-white dark:border-white/10 dark:hover:bg-white/5`,
    outline: `bg-transparent text-primary-600 border border-primary-600
    hover:bg-primary-50 
    dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/20`,
    ghost: `bg-transparent text-gray-700 hover:bg-gray-100
    dark:text-gray-300 dark:hover:bg-white/5`,
    danger: `bg-red-500 text-white hover:bg-red-600 hover:shadow-glow-red border border-transparent`,
};

const sizes = {
    sm: 'h-8 px-4 text-xs',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    ...props
}, ref) => {
    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-base',
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <Spinner
                    size="sm"
                    className="mr-2"
                    variant={variant === 'outline' || variant === 'ghost' || variant === 'secondary' ? 'primary' : 'white'}
                />
            )}

            {!loading && icon && iconPosition === 'left' && (
                <span className="mr-2">{icon}</span>
            )}

            {children}

            {!loading && icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
            )}
        </motion.button>
    );
});

Button.displayName = 'Button';
