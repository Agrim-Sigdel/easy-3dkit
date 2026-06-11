import { useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { type Group } from 'three'

export interface FloatingObjectProps {
  /** The 3D content to float — a mesh, a loaded model, anything. */
  children?: ReactNode
  /** Vertical bob amplitude. */
  amplitude?: number
  /** Bob/rotation speed. */
  speed?: number
  /** Scale multiplier applied on hover. */
  hoverScale?: number
  /** Fallback color if no children are provided (renders a demo knot). */
  color?: string
}

/**
 * FloatingObject — idle floating + gentle spin, with a hover pop.
 *
 * Wrap any 3D content (a GLTF model, a primitive) to give it life. With no
 * children it renders a torus knot so it's useful as a standalone demo too.
 */
export function FloatingObject({
  children,
  amplitude = 0.3,
  speed = 1,
  hoverScale = 1.15,
  color = '#ff7a59',
}: FloatingObjectProps) {
  const ref = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta * speed
    ref.current.position.y = Math.sin(t.current) * amplitude
    ref.current.rotation.y += delta * speed * 0.5
    const target = hovered ? hoverScale : 1
    ref.current.scale.lerp({ x: target, y: target, z: target } as never, 0.1)
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
          <torusKnotGeometry args={[0.8, 0.28, 160, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
        </mesh>
      )}
    </group>
  )
}
