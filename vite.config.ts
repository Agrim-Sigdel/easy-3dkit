import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// The showcase site imports the library by its real package name, `easy-3dkit`,
// resolved here by alias (the app doesn't depend on the published package).
//
// By default the alias resolves to the library SOURCE (src/lib) for instant
// HMR during local dev. When E3DK_USE_DIST=1, it resolves to the BUILT package
// (dist/) instead — so CI can verify the site against exactly what `npm install
// easy-3dkit` ships, catching packaging bugs the source alias would hide
// (missing exports, broken types, files left out of the tarball).
const useDist = process.env.E3DK_USE_DIST === '1'

const libAlias = useDist
  ? {
      // Order matters: the more specific subpath alias must precede the bare one.
      'easy-3dkit/postprocessing': fileURLToPath(new URL('./dist/postprocessing.js', import.meta.url)),
      'easy-3dkit': fileURLToPath(new URL('./dist/index.js', import.meta.url)),
    }
  : {
      'easy-3dkit/': fileURLToPath(new URL('./src/lib/', import.meta.url)),
      'easy-3dkit': fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
    }

// Base public path. '/' for local dev and the CI dogfood build; set
// DOCS_BASE (e.g. '/easy-3dkit/') for a GitHub Pages project-site deploy so all
// asset URLs and the router basename resolve under the repo subpath.
const base = process.env.DOCS_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
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
