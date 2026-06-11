import { Vector3 } from 'three'
import { type InstanceLayout } from '../components/InstancedGrid'

// Reused across all place() calls — never allocate inside the per-instance loop.
const scratchScale = new Vector3()

export interface OrbitLayoutOptions {
  count?: number
  /** Number of nested shells the instances spread across. */
  shells?: number
  /** Base shell radius. */
  radius?: number
  /** Spacing between shells. */
  spacing?: number
  /** Orbit speed. */
  speed?: number
  /** How strongly the cursor pushes the cloud. */
  cursorPush?: number
  /** Per-instance scale. */
  scale?: number
}

/**
 * Orbit — instances arranged on nested spherical shells, each rotating at its
 * own rate, reacting to the cursor. Variant module for <InstancedGrid>.
 */
export function orbitLayout(opts: OrbitLayoutOptions = {}): InstanceLayout {
  const {
    count = 600,
    shells = 5,
    radius = 1.5,
    spacing = 0.6,
    speed = 1,
    cursorPush = 0.5,
    scale = 1,
  } = opts
  return {
    id: 'orbit',
    name: 'Orbit Layout',
    count,
    place(i, t, m, ctx) {
      const golden = 2.399963 // golden angle
      const shellIndex = i % shells
      const shell = radius + shellIndex * spacing
      const a = i * golden + t * speed * (0.1 + shellIndex * 0.05)
      const yPhase = Math.sin(i * 12.9898) // pseudo-random latitude
      const y = yPhase * shell * 0.6

      const r = Math.sqrt(Math.max(shell * shell - y * y, 0.001))
      const x = Math.cos(a) * r + ctx.mouse[0] * cursorPush
      const z = Math.sin(a) * r + ctx.mouse[1] * cursorPush

      m.makeTranslation(x, y, z)
      const s = scale * (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2 + i)))
      m.scale(scratchScale.set(s, s, s))
    },
  }
}
