import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    allowedHosts: ['handnote.localhost']
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [
  '**/*.{js,css,html,ico,png,svg,webp,woff2,wasm,task}'
    ],
        globIgnores: [],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
      },
      manifest: {
        name: 'HandNote',
        short_name: 'HandNote',
        description: 'Learn and practice music using hand gestures.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/'
      }
    })
  ],
})