import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'FinanceFlow',
                short_name: 'FinanceFlow',
                description: 'Your Personal Finance AI Assistant',
                theme_color: '#0066FF',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            devOptions: {
                enabled: false,
                type: 'module',
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 5000000
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@financeflow/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
        },
    },
})
