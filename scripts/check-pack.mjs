// npm-pack contents gate.
//
// AGENTS.md requires the published tarball to contain ONLY dist/**,
// package.json, Readme.md, and LICENSE. This makes that a CI-enforceable check:
// it asks npm exactly what it would publish and fails if anything else slips in
// (a stray source file, a test, a config) — which would bloat the package or
// leak dev tooling to consumers.
//
// Usage: node scripts/check-pack.mjs   (exit 0 = clean, 1 = unexpected files)
import { execFileSync } from 'node:child_process'

// Anything matching these is allowed in the tarball.
const ALLOW = [
  /^dist\//, // the built library + types
  /^package\.json$/,
  /^Readme\.md$/i,
  /^LICENSE$/i,
]

// `npm pack --dry-run --json` lists the files without writing a tarball.
const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
})

const parsed = JSON.parse(raw)
const files = (parsed[0]?.files ?? []).map((f) => f.path)

if (files.length === 0) {
  console.error('check-pack: npm pack reported no files — build the package first (pnpm build:pkg).')
  process.exit(1)
}

const unexpected = files.filter((path) => !ALLOW.some((re) => re.test(path)))

if (unexpected.length > 0) {
  console.error('check-pack: FAIL — tarball contains unexpected files:')
  for (const f of unexpected) console.error('  -', f)
  console.error('\nOnly dist/**, package.json, Readme.md, LICENSE may be published.')
  console.error('Fix the "files" field or add the path to .npmignore.')
  process.exit(1)
}

console.log(`check-pack: PASS — ${files.length} files, all within the allowlist.`)
for (const f of files) console.log('  ', f)
