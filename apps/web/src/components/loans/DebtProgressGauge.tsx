import { motion } from 'framer-motion';

interface DebtProgressGaugeProps {
    percentage: number;
    totalPaid: number;
    totalDebt: number;
    size?: 'sm' | 'md' | 'lg';
}

export function DebtProgressGauge({ percentage, totalPaid, totalDebt, size = 'md' }: DebtProgressGaugeProps) {
    const sizes = {
        sm: { width: 120, stroke: 8, fontSize: 'text-xl' },
        md: { width: 160, stroke: 10, fontSize: 'text-3xl' },
        lg: { width: 200, stroke: 12, fontSize: 'text-4xl' }
    };

    const { width, stroke, fontSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Color based on progress
    const getColor = () => {
        if (percentage < 25) return '#EF4444'; // Red
        if (percentage < 50) return '#F59E0B'; // Orange
        if (percentage < 75) return '#3B82F6'; // Blue
        return '#10B981'; // Green
    };

    const color = getColor();

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width, height: width }}>
                {/* Background Circle */}
                <svg width={width} height={width} className="transform -rotate-90">
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        className="text-gray-200 dark:text-white/10"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                        }}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`${fontSize} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        {Math.round(percentage)}%
                    </motion.span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-1">paid off</span>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 text-center">
                <p className="text-sm text-slate-600 dark:text-gray-300 font-medium">
                    RM {totalPaid.toLocaleString()} of RM {totalDebt.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
