/**
 * check-nextjs.mjs — verify the Next.js App Router example builds clean.
 *
 * Builds + packs the library, points the example's easy-3dkit dep at the local
 * tarball, installs, and runs `next build`. A green build proves the package is
 * importable in an App Router project and produces no SSR/hydration errors at
 * build time. The example is copied to a temp dir so its install never touches
 * the repo.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, existsSync, readFileSync, writeFileSync, readdirSync, rmSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const example = resolve(root, 'examples/nextjs-app')
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })

const work = mkdtempSync(join(tmpdir(), 'e3dk-next-'))
let tarball
try {
  console.log('[check-nextjs] building + packing the library…')
  run('npm', ['run', 'build:pkg'], root)
  for (const f of readdirSync(root).filter((f) => /^easy-3dkit-.*\.tgz$/.test(f))) {
    rmSync(resolve(root, f))
  }
  run('npm', ['pack'], root)
  tarball = readdirSync(root).find((f) => /^easy-3dkit-.*\.tgz$/.test(f))
  if (!tarball) throw new Error('npm pack produced no tarball')
  const tarballPath = resolve(root, tarball)

  // Copy the example into the temp dir (exclude node_modules/.next).
  const appDir = join(work, 'nextjs-app')
  cpSync(example, appDir, {
    recursive: true,
    filter: (p) => {
      const b = basename(p)
      return b !== 'node_modules' && b !== '.next'
    },
  })

  // Point easy-3dkit at the local tarball.
  const pkgPath = join(appDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.dependencies['easy-3dkit'] = `file:${tarballPath}`
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  console.log('[check-nextjs] installing + building the example…')
  run('npm', ['install', '--no-audit', '--no-fund'], appDir)
  run('npm', ['run', 'build'], appDir)

  if (!existsSync(join(appDir, '.next'))) {
    throw new Error('next build produced no .next directory')
  }
  console.log('\n[check-nextjs] PASS — Next.js App Router example builds clean.')
} finally {
  rmSync(work, { recursive: true, force: true })
  if (tarball && existsSync(resolve(root, tarball))) rmSync(resolve(root, tarball))
}
