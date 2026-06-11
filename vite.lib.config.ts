import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Library build config. The app build stays in vite.config.ts.
//
// Every peer dependency (and any of its subpaths) must be externalized so the
// consumer's single copy of react/three/etc. is used — bundling them causes the
// classic "multiple instances of three" / "invalid hook call" crashes.
const peerDeps = [
  'react',
  'react-dom',
  'three',
  'gsap',
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
]

const isExternal = (id: string) =>
  peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'easy-3dkit.js',
    },
    rollupOptions: {
      external: isExternal,
    },
    // Don't wipe dist before the tsc types pass writes into it (and vice-versa);
    // build:lib runs first so emptying here is fine, but keep it explicit.
    emptyOutDir: true,
    sourcemap: true,
  },
})
