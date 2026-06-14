import { describe, it, expect, afterEach } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { registry } from '../../gallery/registry'
import { schemaDefaults } from '../../gallery/schema'

/**
 * Every gallery effect must mount inside a canvas at its default control values
 * without throwing. The registry renders real library components (each entry's
 * render() is just `<Component {...props} />`), so this is the library's
 * "does every component mount" coverage — driven through the same default-value
 * path the gallery and EFFECTS.md use, so it exercises valid prop combinations
 * rather than hand-maintained fixtures.
 *
 * @react-three/test-renderer provides a headless WebGL-less canvas, so we can
 * mount R3F trees in jsdom and assert the scene graph built.
 */

let renderers: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  // Tear down each mounted scene so GL/raf handles don't leak across cases.
  await Promise.all(renderers.map((r) => r.unmount().catch(() => {})))
  renderers = []
})

// PostFX wraps @react-three/postprocessing's EffectComposer, which constructs a
// real WebGLRenderer and reads getContextAttributes().alpha at mount. The
// headless test renderer has no GL context, so this is untestable here by
// construction (not a component fault). It is covered by the puppeteer smoke
// test, which runs in a real (swiftshader) GL context.
const MOUNTABLE = registry.filter((e) => e.family !== 'PostFX')

describe('component mount (every registry effect at defaults)', () => {
  it('has a non-empty registry', () => {
    expect(registry.length).toBeGreaterThan(0)
  })

  it.each(MOUNTABLE.map((e) => [e.id, e] as const))(
    'mounts %s at default props',
    async (_id, entry) => {
      const props = schemaDefaults(entry.controls)
      const renderer = await ReactThreeTestRenderer.create(<>{entry.render(props)}</>)
      renderers.push(renderer)
      // A successful mount produces a scene graph with at least the root.
      expect(renderer.scene).toBeDefined()
    },
  )
})
