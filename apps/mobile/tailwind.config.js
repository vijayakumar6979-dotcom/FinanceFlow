/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0066FF',
                    50: '#E6F0FF',
                    100: '#CCE0FF',
                    200: '#99C2FF',
                    300: '#66A3FF',
                    400: '#3385FF',
                    500: '#0066FF',
                    600: '#0052CC',
                    700: '#003D99',
                    800: '#002966',
                    900: '#001433',
                },
                dark: {
                    base: '#0A0E27',
                    surface: '#121629',
                    elevated: '#1A1F3A',
                }
            },
            fontFamily: {
                // NativeWind handles fonts differently, usually via linking
                // We'll trust system fonts or handle loading later
            }
        },
    },
    plugins: [],
}
