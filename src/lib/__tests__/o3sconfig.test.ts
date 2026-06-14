import { describe, it, expect } from 'vitest'
import { toO3SConfig } from '../../gallery/O3SElement'
import { registry } from '../../gallery/registry'
import { schemaDefaults } from '../../gallery/schema'
import { DEFAULT_VIEW } from '@o3s/lib'

/**
 * The O3SConfig bridge is the serialization contract behind Copy JSON / Export /
 * Import and the planned page composer. These assert it stays stable:
 *  - building a config from a known id preserves the id and params,
 *  - non-default view/animation are captured, defaults are omitted (so old
 *    configs stay minimal and forward-compatible),
 *  - every registry id resolves (no config can reference a missing effect).
 */
describe('O3SConfig round-trip', () => {
  it('preserves id and params for every registry effect', () => {
    for (const entry of registry) {
      const params = schemaDefaults(entry.controls)
      const config = toO3SConfig(entry.id, params)
      expect(config.id).toBe(entry.id)
      expect(config.params).toEqual(params)
      // The id must resolve back to a real entry — no dangling configs.
      expect(registry.find((e) => e.id === config.id)).toBeDefined()
    }
  })

  it('omits a default view but captures a moved one', () => {
    const params = schemaDefaults(registry[0].controls)

    const atDefault = toO3SConfig(registry[0].id, params, { view: { ...DEFAULT_VIEW } })
    expect(atDefault.view).toBeUndefined()

    const moved = { ...DEFAULT_VIEW, azimuth: DEFAULT_VIEW.azimuth + 45 }
    const captured = toO3SConfig(registry[0].id, params, { view: moved })
    expect(captured.view).toEqual(moved)
  })

  it('captures only the animation channels that differ from default', () => {
    const params = schemaDefaults(registry[0].controls)
    const config = toO3SConfig(registry[0].id, params, { animation: { rotate: 0.5 } })
    expect(config.animation).toEqual({ rotate: 0.5 })
  })

  it('attaches the effect family for human-readable configs', () => {
    const entry = registry[0]
    const config = toO3SConfig(entry.id, schemaDefaults(entry.controls))
    expect(config.family).toBe(entry.family)
  })
})
