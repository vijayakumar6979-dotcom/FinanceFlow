import React, { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Widget3DProps {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    expanded?: boolean
    onToggle?: () => void
    gradient: string
}

export const Widget3D: React.FC<Widget3DProps> = ({
    title,
    icon,
    children,
    expanded,
    onToggle,
    gradient
}) => {
    const cardRef = useRef<HTMLDivElement>(null)

    // 3D tilt effect on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Subtle rotation
        const rotateX = (y - centerY) / 40
        const rotateY = (centerX - x) / 40

        card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
    `
    }

    const handleMouseLeave = () => {
        if (!cardRef.current) return
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="
        relative p-6 rounded-3xl
        bg-white/5
        backdrop-blur-2xl
        border border-white/10
        transform-gpu transition-all duration-500
        hover:shadow-2xl hover:shadow-blue-500/10
        mb-6 overflow-hidden
      "
            style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform'
            }}
        >
            {/* Gradient overlay */}
            <div className={`
        absolute inset-0 rounded-3xl
        bg-gradient-to-br ${gradient}
        opacity-10 group-hover:opacity-20
        transition-opacity duration-500
        pointer-events-none
      `}></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-center gap-3">
                    <div className="text-blue-400 p-2 rounded-xl bg-white/5">{icon}</div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>

                {onToggle && (
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </div>
    )
}
