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
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'financeflow-theme',
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') return localStorage;
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
        }
    )
);
