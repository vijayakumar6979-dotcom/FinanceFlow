import React, { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
    count?: number
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ count = 50 }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const particles: HTMLDivElement[] = []

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div')
            particle.className = 'particle'

            // Random positioning and delay
            const top = Math.random() * 100
            const left = Math.random() * 100
            const duration = 10 + Math.random() * 20
            const delay = Math.random() * -20

            particle.style.top = `${top}%`
            particle.style.left = `${left}%`
            particle.style.animationDuration = `${duration}s`
            particle.style.animationDelay = `${delay}s`

            container.appendChild(particle)
            particles.push(particle)
        }

        return () => {
            particles.forEach(p => p.remove())
        }
    }, [count])

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
}
