import { createClient } from '@supabase/supabase-js'

// Handle both Vite (Web) and Expo (Mobile) environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials are not configured!')
    console.warn('Please update your .env file with:')
    console.warn('  VITE_SUPABASE_URL=https://your-project.supabase.co')
    console.warn('  VITE_SUPABASE_ANON_KEY=your-anon-key')
    console.warn('Find these at: https://app.supabase.com/project/_/settings/api')
}

// Use placeholder values if not configured to prevent crashes
// The app will render but backend features won't work
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseKey || 'placeholder-key'

export const supabase = createClient(url, key)
