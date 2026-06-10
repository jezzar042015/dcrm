import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import viteQRCode from 'vite-qr'

// https://vite.dev/config/
export default defineConfig({
  base: '/dcrm/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
     viteQRCode(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
