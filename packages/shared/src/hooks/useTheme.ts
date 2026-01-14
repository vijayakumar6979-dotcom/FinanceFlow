import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark as per design system
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'financeflow-theme',
            storage: createJSONStorage(() => localStorage), // This might need adjustment for React Native (AsyncStorage)
            // We will handle storage backend injection or conditional logic if this breaks on mobile
            // For shared package, we might want to abstract the storage
        }
    )
);
