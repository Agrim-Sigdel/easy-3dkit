import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  Color,
  NormalBlending,
  type Blending,
  type Points as ThreePoints,
} from 'three'

export type ParticleDistribution = 'sphere' | 'cube' | 'disc' | 'shell'

export interface ParticleFieldProps {
  /** Number of particles. */
  count?: number
  /** Radius / half-extent of the cloud. */
  radius?: number
  /** How the points are distributed in space. */
  distribution?: ParticleDistribution
  /** Base particle color. */
  color?: string
  /** Particle point size. */
  size?: number
  /** Opacity per point. */
  opacity?: number
  /** Additive = glowing/energy; Normal = solid dots. */
  glow?: boolean
  /** Rotation speed on Y (radians/sec). */
  speed?: number
  /** Rotation speed on X relative to Y. */
  tumble?: number
  /** Scale points by distance to camera. */
  sizeAttenuation?: boolean
}

/**
 * ParticleField — a configurable cloud of GPU-rendered points.
 *
 * Every aspect is controllable: count, distribution shape, color, size,
 * opacity, blending (glow), and independent X/Y rotation rates.
 */
export function ParticleField({
  count = 4000,
  radius = 4,
  distribution = 'sphere',
  color = '#5fa8ff',
  size = 0.04,
  opacity = 1,
  glow = true,
  speed = 0.05,
  tumble = 0.4,
  sizeAttenuation = true,
}: ParticleFieldProps) {
  const ref = useRef<ThreePoints>(null)

  // Regenerate positions when count / radius / distribution change.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const [x, y, z] = sample(distribution, radius, i)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [count, radius, distribution])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
      ref.current.rotation.x += delta * speed * tumble
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={new Color(color)}
        sizeAttenuation={sizeAttenuation}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={(glow ? AdditiveBlending : NormalBlending) as Blending}
      />
    </points>
  )
}

// Position for point `i` under the chosen distribution.
function sample(dist: ParticleDistribution, radius: number, i: number): [number, number, number] {
  const a = rand(i * 3)
  const b = rand(i * 3 + 1)
  const c = rand(i * 3 + 2)
  switch (dist) {
    case 'cube':
      return [(a * 2 - 1) * radius, (b * 2 - 1) * radius, (c * 2 - 1) * radius]
    case 'disc': {
      const r = radius * Math.sqrt(a)
      const th = b * Math.PI * 2
      return [Math.cos(th) * r, (c * 2 - 1) * radius * 0.06, Math.sin(th) * r]
    }
    case 'shell': {
      const th = b * Math.PI * 2
      const phi = Math.acos(2 * c - 1)
      return [
        radius * Math.sin(phi) * Math.cos(th),
        radius * Math.sin(phi) * Math.sin(th),
        radius * Math.cos(phi),
      ]
    }
    case 'sphere':
    default: {
      const r = radius * Math.cbrt(a)
      const th = b * Math.PI * 2
      const phi = Math.acos(2 * c - 1)
      return [
        r * Math.sin(phi) * Math.cos(th),
        r * Math.sin(phi) * Math.sin(th),
        r * Math.cos(phi),
      ]
    }
  }
}

// Deterministic pseudo-random so the cloud is stable across re-renders.
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
