/**
 * spa-fallback.mjs — copy dist-site/index.html to dist-site/404.html.
 *
 * GitHub Pages serves 404.html for any path it can't find as a file. The app
 * uses BrowserRouter, so a deep link like /easy-3dkit/docs/iridescent is not a
 * real file — Pages would 404. Serving the same SPA shell from 404.html lets the
 * client router take over and render the right route.
 */
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const index = resolve(root, 'dist-site/index.html')
const fallback = resolve(root, 'dist-site/404.html')

if (!existsSync(index)) {
  console.error('[spa-fallback] dist-site/index.html not found — run the site build first.')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('[spa-fallback] wrote dist-site/404.html')
