import { useEffect, useState } from 'react'

/**
 * usePrefersReducedMotion — reactive `(prefers-reduced-motion: reduce)`.
 *
 * Returns true when the visitor has asked the OS to minimize non-essential
 * motion. Updates live if they change the setting. SSR-safe: returns false
 * during a non-browser render (no `window`), then corrects on the client.
 *
 * Use it to pause or damp animations you drive yourself:
 *
 *   const reduced = usePrefersReducedMotion()
 *   return <ParticleField speed={reduced ? 0 : 0.1} />
 *
 * `<ScrollAnimator>` consumes this internally to pause its time-based entrance
 * and idle layers by default (see its `respectReducedMotion` prop).
 */
const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
