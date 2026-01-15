import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from './Card';
import { useKeyPress } from './utils/useKeyPress';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
}

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
}: ModalProps) {
    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on ESC
    useKeyPress('Escape', onClose);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={cn("relative w-full z-10", sizes[size])}
                    >
                        <Card variant="elevated" className="max-h-[90vh] flex flex-col">
                            {(title || showCloseButton) && (
                                <div className="flex items-center justify-between mb-2">
                                    {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export function ModalHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mb-4", className)}>{children}</div>;
}

export function ModalBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("py-2", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mt-6 flex justify-end gap-3", className)}>{children}</div>;
}
