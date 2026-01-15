import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    className?: string;
}

export function Checkbox({
    checked,
    onChange,
    label,
    disabled = false,
    indeterminate = false,
    className
}: CheckboxProps) {
    return (
        <label className={cn("flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50", className)}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={cn(
                        "w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center",
                        checked || indeterminate
                            ? "bg-primary-500 border-primary-500"
                            : "bg-white dark:bg-dark-elevated border-gray-300 dark:border-gray-600 hover:border-primary-400",
                        "peer-focus:ring-2 peer-focus:ring-primary-500/30"
                    )}
                >
                    {(checked || indeterminate) && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            {indeterminate ? (
                                <div className="w-2.5 h-0.5 bg-white rounded-full" />
                            ) : (
                                <Check size={14} className="text-white" strokeWidth={3} />
                            )}
                        </motion.div>
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
