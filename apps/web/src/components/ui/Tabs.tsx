import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils/cn';

export interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    variant?: 'line' | 'pill' | 'card';
    className?: string;
    fullWidth?: boolean;
}

export function Tabs({
    tabs,
    activeTab,
    onChange,
    variant = 'line',
    className,
    fullWidth = false
}: TabsProps) {
    return (
        <div className={cn(
            "relative pb-2 overflow-x-auto", // allow scroll on mobile
            variant === 'card' ? 'flex items-center gap-2 p-1 bg-gray-100 dark:bg-dark-elevated rounded-xl' : 'flex items-center border-b border-gray-200 dark:border-white/10',
            className
        )}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors outline-none",
                            fullWidth ? "flex-1" : "flex-shrink-0",
                            variant === 'line' && (isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"),
                            variant === 'pill' && (isActive ? "text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"),
                            variant === 'card' && (isActive ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"),
                            variant === 'card' && "rounded-lg py-2" // Adjust padding for card variant
                        )}
                    >
                        {/* Background for Pill & Card variants */}
                        {(variant === 'pill' || variant === 'card') && isActive && (
                            <motion.div
                                layoutId={`tab-bg-${variant}`}
                                className={cn(
                                    "absolute inset-0 rounded-lg -z-10",
                                    variant === 'pill' ? "bg-primary-500 shadow-md" : "bg-white dark:bg-white/10 shadow-sm"
                                )}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {tab.icon}
                        {tab.label}

                        {/* Underline for Line variant */}
                        {variant === 'line' && isActive && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
