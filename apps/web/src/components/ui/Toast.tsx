import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from './utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
};

const bgColors = {
    success: 'bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-amber-50/90 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ duration = 5000, ...props }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...props, id, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {typeof document !== 'undefined' && createPortal(
                <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                layout
                                className={cn(
                                    "pointer-events-auto w-80 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start gap-3",
                                    bgColors[toast.type]
                                )}
                            >
                                <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
                                <div className="flex-grow">
                                    {toast.title && (
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                                            {toast.title}
                                        </h4>
                                    )}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-snug">
                                        {toast.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
