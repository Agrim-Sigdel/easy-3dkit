'use client'

import { Stage, ScrollAnimator, InteractiveSurface, iridescent } from 'easy-3dkit'

/**
 * Client component that owns the WebGL scene. WebGL only exists in the browser,
 * so the canvas must render client-side — hence the 'use client' boundary. The
 * server component (app/page.tsx) renders this behind real, server-rendered text.
 *
 * <Stage> detects WebGL availability before mounting the canvas and renders an
 * accessible fallback otherwise, so this import hydrates cleanly with no mismatch.
 */
export default function Hero3D() {
  return (
    <Stage background={null}>
      <ScrollAnimator entrance="rise" idle="sway">
        <InteractiveSurface material={iridescent} />
      </ScrollAnimator>
    </Stage>
  )
}
