import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@o3s/lib': fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
      '@o3s/lib/': fileURLToPath(new URL('./src/lib/', import.meta.url)),
    },
  },
})
