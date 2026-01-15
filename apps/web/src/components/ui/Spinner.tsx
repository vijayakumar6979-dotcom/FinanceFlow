import { cn } from '@/utils/cn';

interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    variant?: 'primary' | 'white' | 'gray';
}

const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const variants = {
    primary: 'border-primary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
};

export function Spinner({ size = 'md', className, variant = 'primary' }: SpinnerProps) {
    return (
        <div
            className={cn(
                'rounded-full animate-spin border-2',
                sizes[size],
                variants[variant],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}
