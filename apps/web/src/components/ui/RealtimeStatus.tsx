import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

interface RealtimeStatusProps {
    status: 'connecting' | 'connected' | 'disconnected'
    className?: string
}

import { useState, useEffect } from 'react'

export function RealtimeStatus({ status, className = '' }: RealtimeStatusProps) {
    const [lastSync, setLastSync] = useState<Date>(new Date())

    useEffect(() => {
        if (status === 'connected') {
            setLastSync(new Date())
        }
    }, [status])

    const statusConfig = {
        connecting: {
            icon: RefreshCw,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            text: 'Connecting...',
            animate: true
        },
        connected: {
            icon: Wifi,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            text: 'Live',
            animate: false
        },
        disconnected: {
            icon: WifiOff,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'Disconnected',
            animate: false
        }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    // Auto-hide when connected after 5 seconds, but show if hovered
    const [isHovered, setIsHovered] = useState(false)
    const [forceShow, setForceShow] = useState(true)

    useEffect(() => {
        if (status === 'connected') {
            const timer = setTimeout(() => setForceShow(false), 5000)
            return () => clearTimeout(timer)
        } else {
            setForceShow(true)
        }
    }, [status])

    const shouldShow = forceShow || isHovered || status !== 'connected'

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`fixed top-4 right-4 z-50 cursor-help ${className}`}
                >
                    <div className={`flex flex-col items-end gap-1`}>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.border} border backdrop-blur-xl shadow-lg`}>
                            <Icon
                                className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`}
                            />
                            <span className={`text-sm font-medium ${config.color}`}>
                                {config.text}
                            </span>
                        </div>
                        {status === 'connected' && isHovered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-dark-surface/90 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-400"
                            >
                                Last sync: {lastSync.toLocaleTimeString()}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
