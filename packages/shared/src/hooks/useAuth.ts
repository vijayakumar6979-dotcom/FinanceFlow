import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (email: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: { id: 'mock-user-1', email: 'demo@financeflow.app', name: 'Demo User' }, // Mock user for dev
    isAuthenticated: true, // Mock authenticated
    loading: false,
    signIn: async (email) => {
        set({ loading: true });
        // Simulate API call
        setTimeout(() => {
            set({
                user: { id: 'mock-user-1', email, name: 'Demo User' },
                isAuthenticated: true,
                loading: false
            });
        }, 1000);
    },
    signOut: async () => {
        set({ loading: true });
        setTimeout(() => {
            set({ user: null, isAuthenticated: false, loading: false });
        }, 500);
    },
    signUp: async (email) => {
        set({ loading: true });
        setTimeout(() => {
            set({
                user: { id: 'mock-user-1', email, name: 'New User' },
                isAuthenticated: true,
                loading: false
            });
        }, 1000);
    }
}));
