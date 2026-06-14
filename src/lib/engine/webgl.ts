/**
 * WebGL availability detection.
 *
 * A non-trivial slice of real visitors cannot get a WebGL context: locked-down
 * enterprise browsers, some Linux/VM setups, browsers that have exhausted their
 * per-page context budget after many canvases, users who disabled WebGL, and
 * older mobile GPUs. For them, mounting a <Canvas> throws and — without an error
 * boundary — unmounts the whole React tree, blanking the page.
 *
 * `isWebGLAvailable()` lets callers detect this BEFORE mounting the Canvas, so a
 * fallback can render instead of the page going blank. It is cheap, synchronous,
 * SSR-safe (returns false when `document` is absent), and creates a throwaway
 * canvas it immediately discards.
 */

let cached: boolean | null = null

/**
 * Returns true if the current environment can create a WebGL rendering context.
 *
 * The result is memoized after the first call: a browser's WebGL support does
 * not change within a session, and probing repeatedly would itself consume
 * context budget. Pass `{ force: true }` to re-probe (used only by tests).
 */
export function isWebGLAvailable(options?: { force?: boolean }): boolean {
  if (!options?.force && cached !== null) return cached

  // SSR / non-DOM environments: no canvas, so treat as unavailable. Consumers
  // render the fallback on the server and the real Canvas after hydration.
  if (typeof document === 'undefined') {
    cached = false
    return cached
  }

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    cached = Boolean(gl && typeof (gl as WebGLRenderingContext).getParameter === 'function')
  } catch {
    // Some browsers throw rather than returning null when WebGL is blocked.
    cached = false
  }

  return cached
}

/** Reset the memoized result. Test-only; not part of the public contract. */
export function resetWebGLAvailabilityCache(): void {
  cached = null
}
