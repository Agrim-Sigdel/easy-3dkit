#!/usr/bin/env node
/**
 * create-easy-3dkit — scaffold a Vite + React app with a working easy-3dkit hero.
 *
 *   npm create easy-3dkit@latest my-app
 *   npx create-easy-3dkit my-app
 *
 * Copies the starter template into the target directory, rewrites the project
 * name, renames `gitignore` -> `.gitignore`, and prints the next steps. No third
 * party dependencies — just Node's fs.
 */
import { cpSync, existsSync, readFileSync, writeFileSync, renameSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

// Published layout: ./template. In-repo dev layout: ../../templates/starter.
function resolveTemplate() {
  const published = resolve(here, 'template')
  if (existsSync(published)) return published
  const repo = resolve(here, '../../templates/starter')
  if (existsSync(repo)) return repo
  console.error('create-easy-3dkit: template directory not found.')
  process.exit(1)
}

function main() {
  const arg = process.argv[2]
  const targetName = arg && !arg.startsWith('-') ? arg : 'my-3dkit-app'
  const target = resolve(process.cwd(), targetName)

  if (existsSync(target) && readdirSync(target).length > 0) {
    console.error(`create-easy-3dkit: target "${targetName}" already exists and is not empty.`)
    process.exit(1)
  }

  const template = resolveTemplate()
  mkdirSync(target, { recursive: true })
  // node_modules / dist may exist in a dev checkout — never copy them.
  cpSync(template, target, {
    recursive: true,
    filter: (src) => {
      const b = basename(src)
      return b !== 'node_modules' && b !== 'dist'
    },
  })

  // gitignore -> .gitignore (npm would otherwise strip a real .gitignore on publish).
  const gi = join(target, 'gitignore')
  if (existsSync(gi)) renameSync(gi, join(target, '.gitignore'))

  // Rewrite the package name to the chosen project name.
  const pkgPath = join(target, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    pkg.name = basename(target).replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'my-3dkit-app'
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }

  console.log(`\nScaffolded easy-3dkit app in ${targetName}\n`)
  console.log('Next steps:')
  console.log(`  cd ${targetName}`)
  console.log('  npm install')
  console.log('  npm run dev\n')
}

main()
