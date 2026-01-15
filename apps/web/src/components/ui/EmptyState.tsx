import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center justify-center p-8 text-center", className)}
        >
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-gray-50 dark:bg-white/5 rounded-full ring-4 ring-gray-50 dark:ring-white/5">
                <div className="text-gray-400 dark:text-gray-500">
                    {icon}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400 mb-6">
                {description}
            </p>

            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </motion.div>
    );
}
