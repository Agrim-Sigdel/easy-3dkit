/**
 * Shape — render any built-in primitive geometry by name.
 *
 * A small reusable piece so every component that draws a primitive (FloatingObject,
 * InstancedGrid, …) offers the SAME shape vocabulary. Geometry only — pair it with
 * your own material as a child, or use the default standard material.
 */
export type ShapeName =
  | 'box'
  | 'sphere'
  | 'torus'
  | 'torusKnot'
  | 'cone'
  | 'cylinder'
  | 'icosahedron'
  | 'dodecahedron'
  | 'octahedron'
  | 'tetrahedron'

export interface ShapeGeometryProps {
  shape?: ShapeName
  /** Higher = smoother/more subdivided. Maps differently per shape. */
  detail?: number
}

/**
 * Just the geometry element (no mesh/material) so callers control material.
 * `detail` scales subdivisions: spheres get more segments, polyhedra get a
 * higher detail level, the torus knot gets denser tubes, etc.
 */
export function ShapeGeometry({ shape = 'box', detail = 1 }: ShapeGeometryProps) {
  const seg = 16 + detail * 16 // 16..80 segments for round shapes
  switch (shape) {
    case 'sphere':
      return <sphereGeometry args={[0.9, seg, seg]} />
    case 'torus':
      return <torusGeometry args={[0.7, 0.28, seg, seg * 2]} />
    case 'torusKnot':
      return <torusKnotGeometry args={[0.7, 0.26, 80 + detail * 60, 12 + detail * 8]} />
    case 'cone':
      return <coneGeometry args={[0.9, 1.6, seg]} />
    case 'cylinder':
      return <cylinderGeometry args={[0.7, 0.7, 1.6, seg]} />
    case 'icosahedron':
      return <icosahedronGeometry args={[1, detail]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1, detail]} />
    case 'octahedron':
      return <octahedronGeometry args={[1, detail]} />
    case 'tetrahedron':
      return <tetrahedronGeometry args={[1, detail]} />
    case 'box':
    default:
      return <boxGeometry args={[1.3, 1.3, 1.3, detail + 1, detail + 1, detail + 1]} />
  }
}
