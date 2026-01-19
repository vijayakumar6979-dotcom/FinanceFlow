import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
    label: string
    value: number
    change?: string
    trend?: 'up' | 'down'
    icon: React.ReactNode
    gradient: string
    prefix?: string
    suffix?: string
}

export function StatCard({
    label,
    value,
    change,
    trend,
    icon,
    gradient,
    prefix = 'RM ',
    suffix = ''
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="
                relative p-6 rounded-2xl
                bg-white/5 backdrop-blur-xl
                border border-white/10
                transform-gpu transition-all duration-500
                hover:scale-105 hover:bg-white/10
                cursor-pointer group
            "
            style={{
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Gradient glow on hover */}
            <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                bg-gradient-to-br ${gradient}
                blur-2xl transition-opacity duration-500
                -z-10
            `} />

            {/* Icon with gradient */}
            <div
                className={`
                    w-16 h-16 rounded-2xl mb-4
                    bg-gradient-to-br ${gradient}
                    flex items-center justify-center
                    shadow-lg
                `}
                style={{ transform: 'translateZ(10px)' }}
            >
                <div className="text-white">
                    {icon}
                </div>
            </div>

            {/* Label */}
            <p className="text-gray-400 text-sm mb-2">{label}</p>

            {/* Value with counting animation */}
            <h3 className="text-3xl font-bold text-white mb-2 font-mono">
                <CountUp
                    end={value}
                    duration={2}
                    prefix={prefix}
                    suffix={suffix}
                    separator=","
                    decimals={value % 1 !== 0 ? 2 : 0}
                />
            </h3>

            {/* Trend */}
            {change && trend && (
                <div className={`
                    flex items-center gap-1
                    ${trend === 'up' ? 'text-green-400' : 'text-red-400'}
                `}>
                    {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span className="text-sm font-semibold">{change}</span>
                    <span className="text-gray-500 text-xs ml-1">vs last month</span>
                </div>
            )}
        </motion.div>
    )
}
