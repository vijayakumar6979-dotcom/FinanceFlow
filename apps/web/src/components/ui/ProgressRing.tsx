import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number; // diameter in pixels
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showPercentage?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export function ProgressRing({
    progress,
    size = 150,
    strokeWidth = 12,
    color = '#0066FF',
    backgroundColor = 'rgba(255, 255, 255, 0.1)',
    showPercentage = true,
    children,
    className = '',
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

    const isComplete = progress >= 100;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color}40)`,
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {children || (
                    <>
                        {isComplete ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500"
                            >
                                <Check className="w-8 h-8 text-white" />
                            </motion.div>
                        ) : showPercentage ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold text-white">
                                    {Math.round(progress)}%
                                </div>
                            </motion.div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
