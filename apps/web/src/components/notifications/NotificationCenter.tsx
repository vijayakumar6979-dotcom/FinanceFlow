import { useEffect, useState } from 'react'
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell,
    IMessage,
} from '@novu/notification-center'
import { useAuth } from '@financeflow/shared'

export function NotificationCenter() {
    const { user } = useAuth()
    const [unseenCount, setUnseenCount] = useState(0)

    const applicationIdentifier = import.meta.env.VITE_NOVU_APP_ID || ''

    // Debug logging
    console.log('🔔 NotificationCenter - User ID:', user?.id)
    console.log('🔔 NotificationCenter - Novu App ID:', applicationIdentifier)

    if (!user || !applicationIdentifier) {
        return null
    }

    function onNotificationClick(message: IMessage) {
        // Handle notification click - navigate to relevant page
        console.log('Notification clicked:', message)

        // Example: Navigate based on notification type
        if (message.cta?.data?.url) {
            window.location.href = message.cta.data.url
        }
    }

    return (
        <NovuProvider
            subscriberId={user.id}
            applicationIdentifier={applicationIdentifier}
            initialFetchingStrategy={{
                fetchNotifications: true,
                fetchUserPreferences: true,
            }}
        >
            <PopoverNotificationCenter
                colorScheme="dark"
                onNotificationClick={onNotificationClick}
                onUnseenCountChanged={(count) => setUnseenCount(count)}
            >
                {({ unseenCount }) => (
                    <NotificationBellButton unseenCount={unseenCount!!} />
                )}
            </PopoverNotificationCenter>
        </NovuProvider>
    )
}

interface NotificationBellButtonProps {
    unseenCount: number
}

function NotificationBellButton({ unseenCount }: NotificationBellButtonProps) {
    return (
        <button
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Notifications"
        >
            {/* Bell Icon */}
            <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>

            {/* Unseen Count Badge */}
            {unseenCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unseenCount > 9 ? '9+' : unseenCount}
                </span>
            )}
        </button>
    )
}
