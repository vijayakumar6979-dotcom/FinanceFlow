import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from './utils/cn';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

interface StatCardProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
    loading?: boolean;
    className?: string;
}

export function StatCard({
    title,
    value,
    prefix = '',
    suffix = '',
    change,
    trend,
    icon,
    loading = false,
    className
}: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Simple count up animation
        const duration = 1000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        if (loading) return;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, loading]);

    const formattedValue = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
    }).format(Math.round(displayValue));

    if (loading) {
        return (
            <Card className={className}>
                <div className="flex items-start justify-between mb-4">
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="circular" width={40} height={40} />
                </div>
                <Skeleton variant="text" width="80%" height={48} className="mb-2" />
                <Skeleton variant="text" width="30%" height={24} />
            </Card>
        );
    }

    return (
        <Card hover glow className={cn("relative overflow-hidden", className)}>
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                {icon && (
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-4xl font-bold font-mono text-gray-900 dark:text-white mb-2">
                    {prefix}{formattedValue}{suffix}
                </span>

                {change !== undefined && (
                    <div className="flex items-center text-sm font-medium">
                        {trend === 'up' && <ArrowUpRight size={16} className="text-green-500 mr-1" />}
                        {trend === 'down' && <ArrowDownRight size={16} className="text-red-500 mr-1" />}
                        {trend === 'neutral' && <Minus size={16} className="text-gray-500 mr-1" />}

                        <span className={cn(
                            trend === 'up' ? "text-green-500" :
                                trend === 'down' ? "text-red-500" :
                                    "text-gray-500"
                        )}>
                            {change > 0 && '+'}{change}%
                        </span>
                        <span className="ml-2 text-gray-400">vs last month</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
