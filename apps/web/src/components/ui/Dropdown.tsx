import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useClickOutside } from './utils/useClickOutside';

interface DropdownItem {
    id: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
    divider?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    className?: string;
    menuClassName?: string;
}

export function Dropdown({
    trigger,
    items,
    position = 'bottom-right',
    className,
    menuClassName
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    const positions = {
        'bottom-left': 'top-full left-0 mt-2',
        'bottom-right': 'top-full right-0 mt-2',
        'top-left': 'bottom-full left-0 mb-2',
        'top-right': 'bottom-full right-0 mb-2',
    };

    return (
        <div className={cn("relative inline-block", className)} ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            "absolute z-50 w-56 rounded-xl bg-white dark:bg-dark-elevated border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden backdrop-blur-xl",
                            positions[position],
                            menuClassName
                        )}
                    >
                        <div className="p-1">
                            {items.map((item, index) => (
                                <React.Fragment key={item.id || index}>
                                    {item.divider ? (
                                        <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-1 mx-2" />
                                    ) : (
                                        <button
                                            onClick={() => {
                                                item.onClick?.();
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                                                item.danger
                                                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                                            )}
                                        >
                                            {item.icon && <span className={item.danger ? "text-red-500" : "text-gray-400"}>{item.icon}</span>}
                                            {item.label}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
