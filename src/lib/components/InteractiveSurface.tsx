import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { DoubleSide, FrontSide, Vector2, type Mesh } from 'three'
import { useMouse } from '../hooks/useMouse'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { STANDARD_SURFACE_UNIFORMS, type SurfaceMaterial } from '../materials/types'

export interface InteractiveSurfaceProps {
  /** The shader effect to render. One variant module = one effect. */
  material: SurfaceMaterial
  /** Plane size (world units). */
  size?: [number, number]
  /** Geometry subdivisions — raise for vertex-displacement variants. */
  segments?: number
  /** Variant-specific props (colors, intensities) forwarded to material.update. */
  params?: Record<string, unknown>
}

/**
 * InteractiveSurface — the FAMILY component for shader-driven surface effects.
 *
 * It owns everything every shader effect needs and nothing specific to any one:
 *  - a subdivided plane mesh
 *  - the standard uniforms (uTime, uMouse, uScroll, uResolution), injected so
 *    every variant can rely on them existing
 *  - the create-uniforms-ONCE / mutate-.value-in-loop discipline
 *  - per-frame wiring of cursor + scroll + time + the variant's own update()
 *
 * A variant (materials/*.ts) supplies only its shaders + extra uniforms. Swap
 * the `material` prop to swap effects with zero plumbing changes.
 */
export function InteractiveSurface({
  material,
  size = [10, 10],
  segments = 1,
  params = {},
}: InteractiveSurfaceProps) {
  const meshRef = useRef<Mesh>(null)
  const mouse = useMouse(0.08)
  const scroll = useScrollProgress()
  const { size: viewport } = useThree()

  // Build the merged uniform set ONCE per variant. Recreating it would detach
  // it from the compiled material and break updates (the bug we already hit).
  // Keyed on material.id so switching variants rebuilds correctly.
  const uniforms = useMemo(() => {
    const standard = {
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0, 0) },
      uScroll: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
    }
    // Variant uniforms win on key collision (lets a variant override defaults).
    return { ...standard, ...cloneUniforms(material.uniforms) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.id])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uMouse.value.copy(mouse.current)
    uniforms.uScroll.value = scroll.current
    uniforms.uResolution.value.set(viewport.width, viewport.height)
    material.update?.(uniforms, params)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size[0], size[1], segments, segments]} />
      <shaderMaterial
        key={material.id}
        vertexShader={withHeader(material.vertexShader)}
        fragmentShader={withHeader(material.fragmentShader)}
        uniforms={uniforms}
        transparent={material.transparent ?? false}
        // Default double-sided so the plane stays visible when you orbit behind it.
        side={material.doubleSide === false ? FrontSide : DoubleSide}
      />
    </mesh>
  )
}

// Prepend the standard-uniform declarations so every variant shader can use
// uTime/uMouse/uScroll/uResolution without redeclaring them.
function withHeader(src: string) {
  return src.includes('// O3S_NO_HEADER') ? src : STANDARD_SURFACE_UNIFORMS + '\n' + src
}

// Shallow-clone a uniform map so two surfaces using the same variant module
// don't share mutable uniform objects.
function cloneUniforms(u: SurfaceMaterial['uniforms']) {
  const out: Record<string, { value: unknown }> = {}
  for (const k in u) {
    const v = u[k].value
    out[k] = {
      value:
        v && typeof (v as { clone?: () => unknown }).clone === 'function'
          ? (v as { clone: () => unknown }).clone()
          : v,
    }
  }
  return out as SurfaceMaterial['uniforms']
}

// Re-export so consumers can build custom variants without a deep import.
export type { SurfaceMaterial }
