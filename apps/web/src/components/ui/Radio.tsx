import { motion } from 'framer-motion';
import { cn } from './utils/cn';

interface RadioProps {
    checked: boolean;
    onChange: (value: string) => void;
    value: string;
    label?: string;
    name?: string;
    disabled?: boolean;
    className?: string;
}

export function Radio({
    checked,
    onChange,
    value,
    label,
    name,
    disabled = false,
    className
}: RadioProps) {
    return (
        <label className={cn("flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50", className)}>
            <div className="relative flex items-center">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    className="peer sr-only"
                    checked={checked}
                    onChange={() => !disabled && onChange(value)}
                    disabled={disabled}
                />
                <div
                    className={cn(
                        "w-5 h-5 border-2 rounded-full transition-all duration-200 flex items-center justify-center",
                        checked
                            ? "border-primary-500"
                            : "bg-white dark:bg-dark-elevated border-gray-300 dark:border-gray-600 hover:border-primary-400",
                        "peer-focus:ring-2 peer-focus:ring-primary-500/30"
                    )}
                >
                    {checked && (
                        <motion.div
                            layoutId={`radio-${name}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-sm"
                        />
                    )}
                </div>
            </div>
            {label && (
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 select-none">
                    {label}
                </span>
            )}
        </label>
    );
}
