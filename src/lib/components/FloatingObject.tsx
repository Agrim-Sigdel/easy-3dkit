import { useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Group } from 'three'
import { ShapeGeometry, type ShapeName } from './Shape'

export interface FloatingObjectProps {
  /** The 3D content to float — a mesh, a loaded model, anything. If given,
   *  the shape/material props are ignored (you supply your own). */
  children?: ReactNode

  // ── Motion ──
  /** Vertical bob amplitude. */
  amplitude?: number
  /** Bob/rotation speed. */
  speed?: number
  /** Scale multiplier applied on hover. */
  hoverScale?: number
  /** Continuous spin rate (multiplier on speed). 0 = no spin. */
  spin?: number

  // ── Transform (base, before float offset) ──
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number

  // ── Default-shape geometry (used only when no children) ──
  shape?: ShapeName
  detail?: number

  // ── Default-shape material ──
  color?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
  wireframe?: boolean
  opacity?: number
  flatShading?: boolean
}

const scratchScale = new Vector3()

/**
 * FloatingObject — idle floating + gentle spin, with a hover pop.
 *
 * Wrap any 3D content to give it life, OR omit children and configure the
 * built-in primitive entirely through props (shape, full material, transform,
 * motion) — every aspect is controllable.
 */
export function FloatingObject({
  children,
  amplitude = 0.3,
  speed = 1,
  hoverScale = 1.15,
  spin = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  shape = 'torusKnot',
  detail = 1,
  color = '#ff7a59',
  roughness = 0.3,
  metalness = 0.4,
  emissive = '#000000',
  emissiveIntensity = 0,
  wireframe = false,
  opacity = 1,
  flatShading = false,
}: FloatingObjectProps) {
  const ref = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta * speed
    ref.current.position.set(
      position[0],
      position[1] + Math.sin(t.current) * amplitude,
      position[2],
    )
    ref.current.rotation.set(rotation[0], rotation[1] + t.current * 0.5 * spin, rotation[2])
    const target = (hovered ? hoverScale : 1) * scale
    ref.current.scale.lerp(scratchScale.set(target, target, target), 0.1)
  })

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children ?? (
        <mesh castShadow>
          <ShapeGeometry shape={shape} detail={detail} />
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            wireframe={wireframe}
            transparent={opacity < 1}
            opacity={opacity}
            flatShading={flatShading}
          />
        </mesh>
      )}
    </group>
  )
}
