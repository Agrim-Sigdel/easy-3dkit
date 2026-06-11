import { folder } from 'leva'

/**
 * Shared control presets (gallery layer).
 *
 * Reusable leva schema fragments so "speed", "color", "shape" etc. look and
 * behave identically across every component. Compose them into a component's
 * registry schema instead of re-declaring ranges each time.
 *
 * These live in the gallery (not lib/) on purpose: leva is a UI dependency, and
 * keeping it out of lib/ leaves the components portable. Components expose plain
 * props; these schemas just drive those props.
 *
 * leva flattens `folder({...})` keys to their inner names, so a component's
 * render() reads `v.color`, `v.speed`, … regardless of the folder nesting.
 */

/** The set of swappable primitive shapes the shape picker offers. */
export const SHAPES = [
  'box',
  'sphere',
  'torus',
  'torusKnot',
  'cone',
  'cylinder',
  'icosahedron',
  'dodecahedron',
  'octahedron',
  'tetrahedron',
] as const
export type ShapeName = (typeof SHAPES)[number]

/** Geometry folder — shape picker + detail. */
export const geometryGroup = (defaultShape: ShapeName = 'torusKnot') => ({
  Geometry: folder({
    shape: { value: defaultShape, options: SHAPES as unknown as string[] },
    detail: { value: 1, min: 0, max: 4, step: 1, label: 'detail/segments' },
  }),
})

/** Material folder — the standard meshStandardMaterial-ish surface knobs. */
export const materialGroup = (defaultColor = '#ff7a59') => ({
  Material: folder({
    color: defaultColor,
    roughness: { value: 0.3, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.4, min: 0, max: 1, step: 0.01 },
    emissive: '#000000',
    emissiveIntensity: { value: 0, min: 0, max: 5, step: 0.05 },
    wireframe: false,
    opacity: { value: 1, min: 0, max: 1, step: 0.01 },
    flatShading: false,
  }),
})

/** Motion folder — speed/amplitude style animation knobs. */
export const motionGroup = (opts?: { speed?: number; amplitude?: number }) => ({
  Motion: folder({
    speed: { value: opts?.speed ?? 1, min: 0, max: 5, step: 0.05 },
    amplitude: { value: opts?.amplitude ?? 0.3, min: 0, max: 2, step: 0.05 },
  }),
})

/** Transform folder — position / rotation / uniform scale on an object. */
export const transformGroup = () => ({
  Transform: folder(
    {
      position: { value: [0, 0, 0] as [number, number, number], step: 0.1 },
      rotation: { value: [0, 0, 0] as [number, number, number], step: 0.05 },
      scale: { value: 1, min: 0.1, max: 4, step: 0.05 },
    },
    { collapsed: true },
  ),
})
