import { OrbitControls } from '@react-three/drei'
import { useInputMode } from './inputMode'

export interface CameraRigProps {
  /** Allow zoom (wheel). Default true. */
  zoom?: boolean
  /** Allow pan (right-drag / two-finger). Default false for a tidy showcase. */
  pan?: boolean
  /** Damping factor for that smooth, weighty feel. */
  damping?: number
  /** Min/max zoom distance. */
  minDistance?: number
  maxDistance?: number
}

/**
 * CameraRig — the camera as a FIRST-CLASS, SEPARATE entity (engine layer).
 *
 * Components never touch the camera; this rig owns it. Crucially, its controls
 * are only enabled in 'view' input mode. In 'interact' mode they're disabled,
 * so dragging drives the EFFECTS (ripple, etc.) instead of fighting them for
 * the pointer. Flip the mode (the gallery has a toggle) to reframe the shot.
 *
 * Drop it inside <Stage> as a sibling to your components.
 */
export function CameraRig({
  zoom = true,
  pan = false,
  damping = 0.08,
  minDistance = 2,
  maxDistance = 20,
}: CameraRigProps) {
  const mode = useInputMode()
  const active = mode === 'view'

  return (
    <OrbitControls
      makeDefault
      enabled={active}
      enableDamping
      dampingFactor={damping}
      enableZoom={zoom}
      enablePan={pan}
      minDistance={minDistance}
      maxDistance={maxDistance}
    />
  )
}
