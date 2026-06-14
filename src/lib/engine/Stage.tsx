import { Canvas, type CanvasProps } from '@react-three/fiber'
import { type ReactNode } from 'react'
import { isWebGLAvailable } from './webgl'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'
import { WebGLFallback } from './WebGLFallback'

export interface StageProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  /** Show a subtle ambient + key light setup. Default true. */
  defaultLights?: boolean
  /** Background color. Pass null for transparent (good for websites). */
  background?: string | null
  /**
   * Rendered instead of the 3D canvas when WebGL is unavailable or the scene
   * throws. Defaults to a styled "3D preview unavailable" placeholder. Pass your
   * own node to match your brand, or `null` to render nothing in its place.
   *
   * Critical page content (headlines, CTAs, nav) should live OUTSIDE <Stage> as
   * DOM, not inside the canvas — that way it survives a WebGL failure regardless
   * of this fallback.
   */
  fallback?: ReactNode
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
 *
 * Resilience: if WebGL can't initialize (locked-down browser, exhausted context
 * budget, disabled WebGL, SSR) or the scene throws, Stage renders `fallback`
 * instead of crashing. Without this, a Canvas failure unmounts the whole React
 * tree and blanks the page — for the demo site AND for any consumer embedding
 * <Stage>. The fallback is positioned to fill the Stage's container, so the
 * parent should establish a size as it would for the canvas.
 */
export function Stage({
  children,
  defaultLights = true,
  background = '#0a0a0f',
  fallback,
  camera,
  ...rest
}: StageProps) {
  const resolvedFallback =
    fallback !== undefined ? fallback : <WebGLFallback background={background} />

  // Pre-check: render the fallback without ever mounting the Canvas when there
  // is no context to be had. This avoids the throw-then-catch path (and its
  // console noise) for the common "WebGL simply isn't available" case.
  if (!isWebGLAvailable()) {
    return <>{resolvedFallback}</>
  }

  return (
    <WebGLErrorBoundary fallback={resolvedFallback}>
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
    </WebGLErrorBoundary>
  )
}
