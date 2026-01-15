import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
};

export function Badge({
    className,
    variant = 'default',
    size = 'md',
    dot = false,
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {dot && (
                <span className={cn(
                    "mr-1.5 h-2 w-2 rounded-full",
                    variant === 'default' ? 'bg-gray-500' :
                        variant === 'success' ? 'bg-emerald-500' :
                            variant === 'warning' ? 'bg-amber-500' :
                                variant === 'danger' ? 'bg-rose-500' :
                                    'bg-sky-500'
                )} />
            )}
            {children}
        </span>
    );
}
