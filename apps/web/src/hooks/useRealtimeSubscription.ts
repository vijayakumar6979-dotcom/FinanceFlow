import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeSubscriptionOptions {
    table: string
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    filter?: string
    onInsert?: (payload: any) => void
    onUpdate?: (payload: any) => void
    onDelete?: (payload: any) => void
    onChange?: (payload: any) => void
}

export function useRealtimeSubscription({
    table,
    event = '*' as any,
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onChange
}: UseRealtimeSubscriptionOptions) {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    useEffect(() => {
        const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`

        const realtimeChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes' as any,
                {
                    event,
                    schema: 'public',
                    table,
                    filter
                },
                (payload: any) => {
                    onChange?.(payload)

                    if (payload.eventType === 'INSERT') {
                        onInsert?.(payload)
                    } else if (payload.eventType === 'UPDATE') {
                        onUpdate?.(payload)
                    } else if (payload.eventType === 'DELETE') {
                        onDelete?.(payload)
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setStatus('connected')
                } else if (status === 'CLOSED') {
                    setStatus('disconnected')
                } else {
                    setStatus('connecting')
                }
            })

        setChannel(realtimeChannel)

        return () => {
            realtimeChannel.unsubscribe()
        }
    }, [table, event, filter, onInsert, onUpdate, onDelete, onChange])

    return { status, channel }
}
