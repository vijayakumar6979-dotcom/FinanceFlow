import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'flat';
    size?: 'sm' | 'md' | 'lg';
    hover?: boolean;
    glow?: boolean;
    gradientBorder?: boolean;
}

const variants = {
    default: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg dark:bg-black/20',
    elevated: 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl dark:bg-black/40',
    flat: 'bg-gray-50 border border-gray-100 dark:bg-white/5 dark:border-white/5',
};

const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({
    variant = 'default',
    size = 'md',
    hover = false,
    glow = false,
    gradientBorder = false,
    children,
    className,
    ...props
}: CardProps) {
    const CardWrapper = hover ? motion.div : 'div';
    const hoverProps = hover ? {
        whileHover: { y: -4, transition: { duration: 0.2 } }
    } : {};

    return (
        // @ts-ignore - Dynamic component type
        <CardWrapper
            className={cn(
                'relative rounded-[20px] overflow-hidden transition-shadow duration-300',
                variants[variant],
                sizes[size],
                glow && 'hover:shadow-glow-blue',
                className
            )}
            {...hoverProps}
            {...props}
        >
            {gradientBorder && (
                <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-br from-white/20 via-white/10 to-transparent pointer-events-none" />
            )}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </CardWrapper>
    );
}

export function CardHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardBody({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex-grow", className)}>{children}</div>;
}

export function CardFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mt-6 pt-4 border-t border-gray-100 dark:border-white/10", className)}>{children}</div>;
}
