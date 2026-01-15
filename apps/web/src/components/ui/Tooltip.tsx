import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export function Tooltip({
    content,
    children,
    position = 'top',
    delay = 200,
    className
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
        bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
        left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
        right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2',
    };

    const animations = {
        top: { y: 10, opacity: 0 },
        bottom: { y: -10, opacity: 0 },
        left: { x: 10, opacity: 0 },
        right: { x: -10, opacity: 0 },
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setTimeout(() => setIsVisible(true), delay)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={animations[position]}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        exit={animations[position]}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm dark:bg-gray-700 whitespace-nowrap",
                            positions[position],
                            className
                        )}
                        role="tooltip"
                    >
                        {content}
                        <div
                            className={cn(
                                "absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45",
                                position === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
                                position === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
                                position === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
                                position === 'right' && "left-[-4px] top-1/2 -translate-y-1/2",
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
