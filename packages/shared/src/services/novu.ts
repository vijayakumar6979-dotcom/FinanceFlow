// NOTE: @novu/node is a Node.js-only package and cannot be used in browser
// These functions should be called from Supabase Edge Functions instead
// For now, we'll export placeholder functions

// import { Novu } from '@novu/node'

// Initialize Novu client
const novuApiKey = import.meta.env?.VITE_NOVU_API_KEY || ''

if (!novuApiKey) {
    console.warn('⚠️ Novu API Key is missing!')
    console.warn('Please add VITE_NOVU_API_KEY to your .env file')
}

// export const novu = new Novu(novuApiKey)

/**
 * Create or update a subscriber in Novu
 * NOTE: This should be called from a Supabase Edge Function
 */
export async function createSubscriber(
    userId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string
) {
    console.warn('createSubscriber should be called from Supabase Edge Function')
    return { success: false, message: 'Not implemented in client' }
}

/**
 * Update subscriber preferences
 */
export async function updateSubscriberPreferences(
    userId: string,
    preferences: {
        email?: boolean
        sms?: boolean
        in_app?: boolean
        push?: boolean
    }
) {
    console.warn('updateSubscriberPreferences should be called from Supabase Edge Function')
    return { success: false, message: 'Not implemented in client' }
}

/**
 * Trigger a notification
 * NOTE: This should be called from a Supabase Edge Function
 */
export async function triggerNotification(
    templateId: string,
    userId: string,
    payload: Record<string, any>
) {
    console.warn('triggerNotification should be called from Supabase Edge Function')
    return { success: false, message: 'Not implemented in client' }
}

/**
 * Delete a subscriber
 */
export async function deleteSubscriber(userId: string) {
    console.warn('deleteSubscriber should be called from Supabase Edge Function')
    return { success: false, message: 'Not implemented in client' }
}

/**
 * Get subscriber notifications
 */
export async function getSubscriberNotifications(userId: string, page = 0) {
    console.warn('getSubscriberNotifications should be called from Supabase Edge Function')
    return []
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
    userId: string,
    messageId: string
) {
    console.warn('markNotificationAsRead should be called from Supabase Edge Function')
    return { success: false, message: 'Not implemented in client' }
}
