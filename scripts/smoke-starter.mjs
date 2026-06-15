/**
 * smoke-starter.mjs — end-to-end check of create-easy-3dkit and the starter.
 *
 * 1. Build + pack the library into a local tarball.
 * 2. Run the scaffolder into a temp dir.
 * 3. Point the scaffolded app's `easy-3dkit` dep at the local tarball (so this
 *    works before the package is published to npm).
 * 4. `npm install` and `npm run build` the scaffolded app.
 *
 * Proves the CLI emits a project that actually installs and builds against the
 * real packaged library — the M6 acceptance bar. Skips the network for peers by
 * using the same registry npm would; pass --offline-peers to reuse the repo's
 * node_modules if you want a faster local run.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, existsSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })

function findTarball() {
  return readdirSync(root).find((f) => /^easy-3dkit-.*\.tgz$/.test(f))
}

const work = mkdtempSync(join(tmpdir(), 'e3dk-starter-'))
let tarball
try {
  console.log('[smoke-starter] building + packing the library…')
  run('npm', ['run', 'build:pkg'], root)
  // Remove any stale tarball, then pack a fresh one.
  for (const f of readdirSync(root).filter((f) => /^easy-3dkit-.*\.tgz$/.test(f))) {
    rmSync(resolve(root, f))
  }
  run('npm', ['pack'], root)
  tarball = findTarball()
  if (!tarball) throw new Error('npm pack produced no tarball')
  const tarballPath = resolve(root, tarball)

  console.log('[smoke-starter] scaffolding a new app…')
  const appName = 'app'
  run('node', [resolve(root, 'packages/create-easy-3dkit/index.mjs'), appName], work)
  const appDir = join(work, appName)

  // Basic structural assertions.
  for (const required of ['package.json', 'index.html', 'src/App.tsx', 'src/main.tsx', '.gitignore']) {
    if (!existsSync(join(appDir, required))) {
      throw new Error(`scaffolded app missing ${required}`)
    }
  }
  console.log('[smoke-starter] structure OK')

  // Point the easy-3dkit dependency at the freshly built tarball.
  const pkgPath = join(appDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.dependencies['easy-3dkit'] = `file:${tarballPath}`
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  console.log('[smoke-starter] installing + building the scaffolded app…')
  run('npm', ['install', '--no-audit', '--no-fund'], appDir)
  run('npm', ['run', 'build'], appDir)

  if (!existsSync(join(appDir, 'dist', 'index.html'))) {
    throw new Error('scaffolded app build produced no dist/index.html')
  }
  console.log('\n[smoke-starter] PASS — scaffolded app installs and builds.')
} finally {
  rmSync(work, { recursive: true, force: true })
  if (tarball && existsSync(resolve(root, tarball))) rmSync(resolve(root, tarball))
}
