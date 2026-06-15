/**
 * sync-starter-template.mjs — copy templates/starter into the create-easy-3dkit
 * package as ./template, so the published CLI is self-contained.
 *
 * Single source of truth: templates/starter is the canonical starter (also used
 * by the docs StackBlitz button). The CLI ships a copy of it. Run before packing
 * create-easy-3dkit. Excludes node_modules/dist.
 */
import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'templates/starter')
const dest = resolve(root, 'packages/create-easy-3dkit/template')

if (!existsSync(src)) {
  console.error('[sync-starter] templates/starter not found.')
  process.exit(1)
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })
cpSync(src, dest, {
  recursive: true,
  filter: (p) => {
    const b = basename(p)
    return b !== 'node_modules' && b !== 'dist'
  },
})
console.log('[sync-starter] synced templates/starter -> packages/create-easy-3dkit/template')
