import React, { useEffect, useState } from 'react'

interface CountUpProps {
    end: number
    duration?: number
    prefix?: string
    separator?: string
    decimals?: number
}

export const CountUp: React.FC<CountUpProps> = ({
    end,
    duration = 2,
    prefix = '',
    separator = ',',
    decimals = 2
}) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percent = Math.min(progress / (duration * 1000), 1)

            // Easing function: easeOutQuart
            const ease = 1 - Math.pow(1 - percent, 4)

            setCount(ease * end)

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(updateCount)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(updateCount)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    const formattedCount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(count)

    return (
        <span>
            {prefix}{formattedCount}
        </span>
    )
}
