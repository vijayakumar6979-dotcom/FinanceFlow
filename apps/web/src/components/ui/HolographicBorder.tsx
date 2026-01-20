import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface HolographicBorderProps {
    children: ReactNode
    className?: string
    borderWidth?: number
    animationDuration?: number
    colors?: string[]
    blur?: number
}

export function HolographicBorder({
    children,
    className = '',
    borderWidth = 2,
    animationDuration = 4,
    colors = ['#0066FF', '#8B5CF6', '#EC4899'],
    blur = 20
}: HolographicBorderProps) {
    return (
        <div className={`relative ${className}`}>
            {/* Rotating holographic border */}
            <div
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                style={{
                    padding: `${borderWidth}px`
                }}
            >
                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `conic-gradient(
              from 0deg,
              ${colors[0]},
              ${colors[1]},
              ${colors[2]},
              ${colors[0]}
            )`,
                        filter: `blur(${blur}px)`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: animationDuration,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
