export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    avatar_url: string | null;

    // Preferences
    currency: string;
    timezone: string;
    language: string;
    theme: 'dark' | 'light' | 'auto';

    // Notification Preferences
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;

    // Privacy
    profile_visibility: 'public' | 'private';
    data_sharing: boolean;

    // Financial
    budget_start_day: number;

    // Biometrics
    biometric_enabled: boolean;

    created_at: string;
    updated_at: string;
    last_login: string | null;
}

export type AuthProvider = 'google' | 'apple' | 'email';
