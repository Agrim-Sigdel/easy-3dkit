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
      // Two entries: the main barrel and the opt-in postprocessing subpath.
      // preserveModules keeps the rest of the graph split for tree-shaking.
      entry: {
        index: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
        postprocessing: fileURLToPath(new URL('./src/lib/postprocessing.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        // Preserve the source module graph instead of one mega-bundle. This is
        // what makes the package genuinely tree-shakeable AND keeps the optional
        // @react-three/postprocessing import isolated to PostFX's own chunk — so
        // a consumer who never imports PostFX (and hasn't installed that optional
        // peer) builds cleanly. A single-file bundle hoisted that import to the
        // top of the entry, breaking such consumers.
        preserveModules: true,
        preserveModulesRoot: 'src/lib',
        entryFileNames: '[name].js',
      },
    },
    // Don't wipe dist before the tsc types pass writes into it (and vice-versa);
    // build:lib runs first so emptying here is fine, but keep it explicit.
    emptyOutDir: true,
    sourcemap: true,
  },
})
