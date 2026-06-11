import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, type Points as ThreePoints } from 'three'

export interface ParticleFieldProps {
  /** Number of particles. */
  count?: number
  /** Radius of the spherical cloud. */
  radius?: number
  /** Base particle color. */
  color?: string
  /** Particle point size. */
  size?: number
  /** Rotation speed (radians/sec). */
  speed?: number
}

/**
 * ParticleField — a slowly swirling cloud of GPU-rendered points.
 *
 * Layer-3 component. Pure props in, visuals out. Works as ambient game
 * atmosphere, a website hero backdrop, or a standalone art toy.
 */
export function ParticleField({
  count = 4000,
  radius = 4,
  color = '#5fa8ff',
  size = 0.04,
  speed = 0.05,
}: ParticleFieldProps) {
  const ref = useRef<ThreePoints>(null)

  // Generate positions once (and only when count/radius change).
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Uniform-ish distribution inside a sphere.
      const r = radius * Math.cbrt(rand(i * 3))
      const theta = rand(i * 3 + 1) * Math.PI * 2
      const phi = Math.acos(2 * rand(i * 3 + 2) - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count, radius])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
      ref.current.rotation.x += delta * speed * 0.4
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={new Color(color)}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

// Deterministic pseudo-random so the cloud is stable across re-renders.
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
