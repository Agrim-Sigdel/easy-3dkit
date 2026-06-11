import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2 } from 'three'

/**
 * useMouse — normalized pointer position, smoothed.
 *
 * Returns a ref to a Vector2 in [-1, 1] range (x right, y up), lerped toward
 * the live pointer each frame so consumers get buttery motion for free.
 * Reading from a ref (not state) avoids re-rendering the React tree 60x/sec.
 */
export function useMouse(smoothing = 0.1) {
  const target = useThree((s) => s.pointer) // R3F's live, already-normalized pointer
  const smoothed = useRef(new Vector2(0, 0))

  useFrame(() => {
    smoothed.current.lerp(target, smoothing)
  })

  return smoothed
}
