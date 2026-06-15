// @vitest-environment node
//
// Runs in node, not jsdom: esbuild asserts `new TextEncoder().encode("")
// instanceof Uint8Array`, which jsdom's cross-realm TextEncoder breaks. This
// suite is pure string parsing and needs no DOM anyway.
import { describe, it, expect } from 'vitest'
import { transform } from 'esbuild'
import { generateCode } from '../../gallery/codegen'
import { registry } from '../../gallery/registry'
import { schemaDefaults } from '../../gallery/schema'

/**
 * "Copy code" must always emit syntactically valid TSX. The generator builds
 * source by string concatenation, so a malformed value expression or a broken
 * spec would produce code that looks right but won't compile in a consumer's
 * project. esbuild parses every entry's generated module as TSX; a syntax error
 * fails the test. (esbuild ships with vite, so no new dependency.)
 *
 * We also assert the generated imports only reference the package by its public
 * name and include the component being used — guarding the import line that
 * EFFECTS.md and the composer both depend on.
 */
async function parses(code: string): Promise<true> {
  // loader: 'tsx' parses JSX + TS without type-checking — exactly "does it
  // tokenize/parse" which is what we want to assert for generated source.
  await transform(code, { loader: 'tsx', sourcefile: 'Generated.tsx' })
  return true
}

describe('generateCode output', () => {
  it.each(registry.map((e) => [e.id, e] as const))(
    'emits parseable TSX for %s',
    async (_id, entry) => {
      const code = generateCode(entry, schemaDefaults(entry.controls))
      await expect(parses(code)).resolves.toBe(true)
    },
  )

  it('imports from the public package name (or its subpath)', () => {
    for (const entry of registry) {
      const code = generateCode(entry, schemaDefaults(entry.controls))
      // Every snippet imports from easy-3dkit; PostFX adds the postprocessing
      // subpath. No internal aliases should ever leak into generated code.
      expect(code).toContain("from 'easy-3dkit'")
      expect(code).not.toContain('@o3s')
      if (entry.family === 'PostFX') {
        expect(code).toContain("from 'easy-3dkit/postprocessing'")
      }
    }
  })

  it('imports the component each entry renders', () => {
    for (const entry of registry) {
      if (!entry.codegen) continue
      const code = generateCode(entry, schemaDefaults(entry.controls))
      expect(code).toContain(entry.codegen.component)
    }
  })

  it('parses with non-default view and animation applied', async () => {
    const entry = registry[0]
    const code = generateCode(entry, schemaDefaults(entry.controls), {
      view: { azimuth: 45, elevation: 20, distance: 8 },
      animation: { rotate: 0.5, reveal: 0.3 },
    })
    await expect(parses(code)).resolves.toBe(true)
    expect(code).toContain('ScrollAnimator')
    expect(code).toContain('view=')
  })
})
