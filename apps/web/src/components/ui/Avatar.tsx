import { useState } from 'react';
import { cn } from '@/utils/cn';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
}

const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
};

const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
};

export function Avatar({
    src,
    alt = 'Avatar',
    fallback,
    size = 'md',
    status,
    className
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className={cn("relative inline-block", className)}>
            <div className={cn(
                "relative flex items-center justify-center overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
                sizes[size]
            )}>
                {src && !imageError ? (
                    <img
                        src={src}
                        alt={alt}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="font-semibold uppercase">
                        {fallback || alt.charAt(0)}
                    </span>
                )}
            </div>
            {status && (
                <span className={cn(
                    "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900",
                    statusColors[status]
                )} />
            )}
        </div>
    );
}
