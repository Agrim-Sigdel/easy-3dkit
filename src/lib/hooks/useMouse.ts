import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2 } from 'three'
import { getInputMode } from '../engine/inputMode'

/**
 * useMouse — normalized pointer position, smoothed and mode-aware.
 *
 * Returns a ref to a Vector2 in [-1, 1] range (x right, y up), lerped toward
 * the live pointer each frame so consumers get buttery motion for free.
 * Reading from a ref (not state) avoids re-rendering the React tree 60x/sec.
 *
 * In 'view' input mode the value FREEZES (holds its last position): the pointer
 * is driving the camera then, so cursor-bound effects shouldn't jump around as
 * you reframe. It resumes tracking the moment you return to 'interact'. This is
 * what keeps the camera a separate concern from the effects.
 */
export function useMouse(smoothing = 0.1) {
  const target = useThree((s) => s.pointer) // R3F's live, already-normalized pointer
  const smoothed = useRef(new Vector2(0, 0))

  useFrame(() => {
    // Read the store directly (not the hook) — we're already in a per-frame
    // loop, so we want the current value without triggering React re-renders.
    if (getInputMode() === 'view') return // frozen: hold last value
    smoothed.current.lerp(target, smoothing)
  })

  return smoothed
}
