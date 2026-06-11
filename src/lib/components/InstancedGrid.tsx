import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Matrix4, type InstancedMesh } from 'three'
import { ShapeGeometry, type ShapeName } from './Shape'

/**
 * InstanceLayout — the variant contract for InstancedGrid effects.
 *
 * Thousands of instances in ONE draw call. A variant decides where each
 * instance sits each frame by writing into the shared Matrix4 `m` (and
 * optionally a color). The family owns the instanced mesh, the per-frame
 * matrix flush, and disposal.
 */
export interface InstanceLayout {
  id: string
  name: string
  /** How many instances. */
  count: number
  /**
   * Position instance `i` at time `t`. Write transform into `m` (already
   * identity-reset) and return; optionally set `color`. `mouse` is [-1,1].
   */
  place: (
    i: number,
    t: number,
    m: Matrix4,
    ctx: { count: number; mouse: [number, number]; color: Color },
  ) => void
}

export interface InstancedGridProps {
  layout: InstanceLayout
  /** Custom geometry+material per instance. If given, appearance props are ignored. */
  children?: React.ReactNode

  // ── Default-instance appearance (when no children) ──
  shape?: ShapeName
  /** Base size of each instance. */
  instanceSize?: number
  color?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
  wireframe?: boolean
}

/**
 * InstancedGrid — the FAMILY component for instanced-geometry effects
 * (orbit layouts, tunnels, voxel grids, voronoi shatter, gear systems…).
 *
 * Swap the `layout` variant to change the arrangement/animation; the GPU-side
 * single-draw-call optimization and matrix bookkeeping stay identical.
 */
export function InstancedGrid({
  layout,
  children,
  shape = 'box',
  instanceSize = 0.12,
  color = '#5fa8ff',
  roughness = 0.3,
  metalness = 0.5,
  emissive = '#000000',
  emissiveIntensity = 0,
  wireframe = false,
}: InstancedGridProps) {
  const ref = useRef<InstancedMesh>(null)
  const scratch = useMemo(() => new Matrix4(), [])
  const scratchColor = useMemo(() => new Color('#ffffff'), [])
  const mouse = useRef<[number, number]>([0, 0])

  // Seed an initial layout so it's not a blank frame before the loop starts.
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < layout.count; i++) {
      scratch.identity()
      layout.place(i, 0, scratch, { count: layout.count, mouse: [0, 0], color: scratchColor })
      mesh.setMatrixAt(i, scratch)
    }
    mesh.instanceMatrix.needsUpdate = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.id, layout.count])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    mouse.current[0] = state.pointer.x
    mouse.current[1] = state.pointer.y
    for (let i = 0; i < layout.count; i++) {
      scratch.identity()
      layout.place(i, t, scratch, {
        count: layout.count,
        mouse: mouse.current,
        color: scratchColor,
      })
      mesh.setMatrixAt(i, scratch)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, layout.count]}
      scale={instanceSize}
    >
      {children ?? (
        <>
          <ShapeGeometry shape={shape} detail={0} />
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            wireframe={wireframe}
          />
        </>
      )}
    </instancedMesh>
  )
}

export { Matrix4 }
