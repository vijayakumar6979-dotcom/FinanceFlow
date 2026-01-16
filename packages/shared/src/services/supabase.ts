import { createClient } from '@supabase/supabase-js'

// Handle both Vite (Web) and Expo (Mobile) environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
