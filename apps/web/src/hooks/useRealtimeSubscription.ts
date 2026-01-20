import { useState, useEffect, useRef } from 'react'
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

    // Store callbacks in refs to avoid re-subscribing on every render
    const onInsertRef = useRef(onInsert)
    const onUpdateRef = useRef(onUpdate)
    const onDeleteRef = useRef(onDelete)
    const onChangeRef = useRef(onChange)

    // Update refs when callbacks change
    useEffect(() => {
        onInsertRef.current = onInsert
        onUpdateRef.current = onUpdate
        onDeleteRef.current = onDelete
        onChangeRef.current = onChange
    }, [onInsert, onUpdate, onDelete, onChange])

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
                    onChangeRef.current?.(payload)

                    if (payload.eventType === 'INSERT') {
                        onInsertRef.current?.(payload)
                    } else if (payload.eventType === 'UPDATE') {
                        onUpdateRef.current?.(payload)
                    } else if (payload.eventType === 'DELETE') {
                        onDeleteRef.current?.(payload)
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
    }, [table, event, filter]) // Removed callbacks from dependencies

    return { status, channel }
}
