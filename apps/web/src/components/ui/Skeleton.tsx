import { cn } from './utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    variant = 'rectangular',
    width,
    height,
    className,
    ...props
}: SkeletonProps) {
    const baseStyles = 'bg-gray-200 dark:bg-gray-700 animate-pulse';

    const variants = {
        rectangular: 'rounded-md',
        circular: 'rounded-full',
        text: 'rounded h-4 w-full',
    };

    const style = {
        width,
        height,
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            style={style}
            {...props}
        />
    );
}
