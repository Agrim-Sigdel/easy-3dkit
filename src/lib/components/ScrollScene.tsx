import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { type Group } from 'three'
import { useScrollProgress } from '../hooks/useScrollProgress'

export interface ScrollSceneProps {
  children: ReactNode
  /** Full rotations across the whole scroll range. */
  rotations?: number
  /** How far the group dollies on the Z axis across the scroll range. */
  zTravel?: number
}

/**
 * ScrollScene — binds page scroll to a 3D group's transform.
 *
 * This is the canonical "website driver": it reads useScrollProgress (a DOM
 * concern) and pushes it into the 3D world (transforms on its children).
 * The children stay ignorant of scroll — swap this wrapper for a game-state
 * driver and the same children work in a game.
 *
 * Note: needs the page to actually be taller than the viewport to scroll.
 */
export function ScrollScene({ children, rotations = 1, zTravel = 4 }: ScrollSceneProps) {
  const ref = useRef<Group>(null)
  const progress = useScrollProgress()

  useFrame(() => {
    if (!ref.current) return
    const p = progress.current
    ref.current.rotation.y = p * Math.PI * 2 * rotations
    ref.current.position.z = p * zTravel
  })

  return <group ref={ref}>{children}</group>
}
