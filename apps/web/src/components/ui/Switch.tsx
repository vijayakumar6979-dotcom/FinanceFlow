import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 16 },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 24 },
};

export function Switch({
    checked,
    onChange,
    label,
    disabled = false,
    size = 'md',
    className
}: SwitchProps) {
    return (
        <div className={cn("flex items-center", className)}>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                className={cn(
                    "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-base",
                    sizes[size].track,
                    checked ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled}
            >
                <span className="sr-only">{label || 'Toggle'}</span>
                <motion.span
                    layout
                    initial={false}
                    animate={{ x: checked ? sizes[size].translate : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                        "inline-block rounded-full bg-white shadow-sm ring-0",
                        sizes[size].thumb
                    )}
                />
            </button>
            {label && (
                <span
                    className={cn(
                        "ml-3 text-sm font-medium",
                        disabled ? "text-gray-400" : "text-gray-900 dark:text-gray-100"
                    )}
                    onClick={() => !disabled && onChange(!checked)}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
