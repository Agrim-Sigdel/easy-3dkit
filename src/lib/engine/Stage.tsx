import { Canvas, type CanvasProps } from '@react-three/fiber'
import { type ReactNode } from 'react'

export interface StageProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  /** Show a subtle ambient + key light setup. Default true. */
  defaultLights?: boolean
  /** Background color. Pass null for transparent (good for websites). */
  background?: string | null
}

/**
 * Stage — the engine layer (Layer 1).
 *
 * Wraps R3F's <Canvas> with sensible defaults: color-managed renderer,
 * a clamped device-pixel-ratio for perf, and optional default lighting.
 * Every O3S demo and consuming app mounts components inside a <Stage>.
 *
 * It deliberately knows NOTHING about which components go inside it —
 * that separation is what keeps the library reusable across websites,
 * games, and art toys.
 */
export function Stage({
  children,
  defaultLights = true,
  background = '#0a0a0f',
  camera,
  ...rest
}: StageProps) {
  return (
    <Canvas
      // Clamp DPR: crisp on retina, but never render 4x pixels on a 4k display.
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: background === null }}
      camera={{ position: [0, 0, 6], fov: 50, ...(camera as object) }}
      {...rest}
    >
      {background !== null && <color attach="background" args={[background]} />}
      {defaultLights && (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, -2, -5]} intensity={0.3} color="#88aaff" />
        </>
      )}
      {children}
    </Canvas>
  )
}
