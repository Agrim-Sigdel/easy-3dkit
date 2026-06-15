import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Vitest config for the library's unit/render tests. Mirrors vite.config.ts's
// easy-3dkit alias so tests import the library exactly as the app does, and runs
// in jsdom so React render tests have a DOM.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Order matters: subpath alias before the bare one.
      'easy-3dkit/': fileURLToPath(new URL('./src/lib/', import.meta.url)),
      'easy-3dkit': fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/lib/__tests__/setup.ts'],
    globals: true,
  },
})
