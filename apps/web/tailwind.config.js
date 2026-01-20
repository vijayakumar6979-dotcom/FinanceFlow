/** @type {import('tailwindcss').Config} */
import sharedConfig from '@financeflow/ui/tailwind.config';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // Include shared UI components
    ],
    presets: [sharedConfig],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"IBM Plex Sans"', 'sans-serif'],
            },
            colors: {
                purple: {
                    DEFAULT: '#7C3AED',
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#7C3AED',
                    600: '#6D28D9',
                    700: '#5B21B6',
                    800: '#4C1D95',
                    900: '#3B0764',
                },
                background: {
                    light: '#F7F8FA',
                    dark: '#0A0E27',
                },
                card: {
                    light: '#FFFFFF',
                    dark: '#121629',
                }
            },
            animation: {
                'holographic-rotate': 'holographic-rotate 4s linear infinite',
                'holographic-rotate-slow': 'holographic-rotate 6s linear infinite',
                'holographic-rotate-fast': 'holographic-rotate 2s linear infinite',
            },
            keyframes: {
                'holographic-rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                }
            }
        },
    },
    // Trigger HMR
    plugins: [],
}
