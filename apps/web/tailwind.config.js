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
        extend: {},
    },
    // Trigger HMR
    plugins: [],
}
