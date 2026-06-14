import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// The showcase site imports the library through the `@o3s/lib` alias.
//
// By default that alias resolves to the library SOURCE (src/lib) for instant
// HMR during local dev. When O3S_USE_DIST=1, it resolves to the BUILT package
// (dist/) instead — so CI can verify the site against exactly what `npm install
// easy-3dkit` ships, catching packaging bugs the source alias would hide
// (missing exports, broken types, files left out of the tarball).
const useDist = process.env.O3S_USE_DIST === '1'

const libAlias = useDist
  ? {
      '@o3s/lib': fileURLToPath(new URL('./dist/easy-3dkit.js', import.meta.url)),
    }
  : {
      '@o3s/lib': fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
      '@o3s/lib/': fileURLToPath(new URL('./src/lib/', import.meta.url)),
    }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: libAlias,
  },
  build: {
    // The showcase site builds to dist-site/, NOT dist/. dist/ is reserved for
    // the published library (vite.lib.config.ts), so building the site can never
    // clobber the package tarball — they have separate, unambiguous outputs.
    outDir: 'dist-site',
  },
})
