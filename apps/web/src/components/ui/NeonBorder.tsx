import { ReactNode } from 'react'

interface NeonBorderProps {
    children: ReactNode
    className?: string
    gradient?: string
    glowIntensity?: 'low' | 'medium' | 'high'
    animated?: boolean
}

export function NeonBorder({
    children,
    className = '',
    gradient = 'linear-gradient(90deg, #0066FF, #8B5CF6, #EC4899)',
    glowIntensity = 'medium',
    animated = false
}: NeonBorderProps) {
    const glowSizes = {
        low: '10px',
        medium: '20px',
        high: '30px'
    }

    const glowOpacities = {
        low: '0.2',
        medium: '0.3',
        high: '0.5'
    }

    return (
        <div
            className={`relative ${className}`}
            style={{
                background: `
          linear-gradient(var(--bg-color, #0A0E27), var(--bg-color, #0A0E27)) padding-box,
          ${gradient} border-box
        `,
                border: '2px solid transparent',
                borderRadius: '1.5rem'
            }}
        >
            {/* Neon glow effect */}
            <div
                className={`absolute inset-0 rounded-3xl pointer-events-none ${animated ? 'animate-pulse' : ''}`}
                style={{
                    boxShadow: `
            0 0 ${glowSizes[glowIntensity]} rgba(0, 102, 255, ${glowOpacities[glowIntensity]}),
            inset 0 0 ${glowSizes[glowIntensity]} rgba(0, 102, 255, ${parseFloat(glowOpacities[glowIntensity]) * 0.5})
          `,
                    zIndex: -1
                }}
            />

            {/* Content */}
            {children}
        </div>
    )
}
