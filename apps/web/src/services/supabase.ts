
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- DEV MODE BYPASS ---
// Monkey-patch auth methods to return a mock user
// This allows the app to function without real authentication for development
const DEV_USER_ID = '11111111-1111-1111-1111-111111111111';
const DEV_USER = {
    id: DEV_USER_ID,
    email: 'dev@local.com',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Dev User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString()
};

const DEV_SESSION = {
    access_token: supabaseAnonKey, // Use valid JWT (Anon key) to pass backend validation
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: DEV_USER,
};

// Override methods
// @ts-ignore
supabase.auth.getUser = async () => {
    return { data: { user: DEV_USER }, error: null };
};

// @ts-ignore
supabase.auth.getSession = async () => {
    return { data: { session: DEV_SESSION }, error: null };
};

// @ts-ignore
supabase.auth.signInWithPassword = async () => {
    return { data: { user: DEV_USER, session: DEV_SESSION }, error: null };
};

// @ts-ignore
supabase.auth.onAuthStateChange = (callback) => {
    // Immediately trigger signed in state
    setTimeout(() => callback('SIGNED_IN', DEV_SESSION as any), 0);
    return { data: { subscription: { unsubscribe: () => { } } } };
};

// @ts-ignore
supabase.auth.signOut = async () => {
    return { error: null };
};
