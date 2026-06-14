// Tree-shaking / bundle-budget measurement.
//
// Proves the package's `sideEffects:false` claim: importing one component must
// pull in only that component's code, not the whole library. For a few
// representative single-component entry points (and the whole-library import as
// an upper bound), it bundles against the BUILT dist/ with the 3D peer stack
// marked external (a consumer already has three/fiber/drei/gsap), then reports
// minified + gzipped bytes.
//
// Run after `pnpm build:pkg`:  node scripts/measure-size.mjs
// Add --json for machine-readable output (used to refresh the README table).
import { build } from 'esbuild'
import { gzipSync } from 'node:zlib'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entryPkg = resolve(root, 'dist/easy-3dkit.js')

if (!existsSync(entryPkg)) {
  console.error('measure-size: dist/ not found — run `pnpm build:pkg` first.')
  process.exit(1)
}

// The 3D stack is peer-installed by the consumer, so it is not part of the
// library's own footprint — exclude it from the measurement.
const EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
  'gsap',
]

// Each case is a synthetic entry that imports a slice of the public API and
// uses it (so nothing is dropped as unused before we measure the real cost).
const CASES = [
  { name: 'ParticleField only', imports: ['ParticleField'] },
  { name: 'InteractiveSurface + glassmorphism', imports: ['InteractiveSurface', 'glassmorphism'] },
  { name: 'Stage only', imports: ['Stage'] },
  { name: 'isWebGLAvailable only', imports: ['isWebGLAvailable'] },
  { name: 'Whole library (import *)', star: true },
]

async function measure(testCase) {
  const ref = testCase.star
    ? 'export { lib }\nimport * as lib from "easy-3dkit"'
    : `import { ${testCase.imports.join(', ')} } from "easy-3dkit"\n` +
      `export const used = [${testCase.imports.join(', ')}]`

  const result = await build({
    stdin: { contents: ref, resolveDir: root, loader: 'js' },
    bundle: true,
    write: false,
    minify: true,
    format: 'esm',
    platform: 'browser',
    external: EXTERNAL,
    alias: { 'easy-3dkit': entryPkg },
    logLevel: 'silent',
  })

  const code = result.outputFiles[0].contents
  const min = code.length
  const gz = gzipSync(code).length
  return { name: testCase.name, min, gz }
}

const rows = []
for (const c of CASES) rows.push(await measure(c))

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2))
} else {
  const kb = (n) => (n / 1024).toFixed(1) + ' KB'
  const pad = (s, n) => s.padEnd(n)
  console.log('Tree-shaking measurement (3D peer stack external):\n')
  console.log(pad('Import', 38), pad('Minified', 12), 'Gzipped')
  console.log('-'.repeat(62))
  for (const r of rows) console.log(pad(r.name, 38), pad(kb(r.min), 12), kb(r.gz))
  console.log(
    '\nA single-component import staying far below the whole-library number is the proof that sideEffects:false works.',
  )
}
