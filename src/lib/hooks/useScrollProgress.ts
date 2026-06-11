import { useEffect, useRef } from 'react'

/**
 * useScrollProgress — page scroll as a 0..1 ref (DOM side, no R3F dependency).
 *
 * This is the "driver" a WEBSITE uses to push values into 3D components.
 * A GAME would instead drive the same components from game state. The
 * component itself doesn't care which — that's the layered design.
 *
 * Returns a ref (not state) so reading it in a useFrame loop is free.
 */
export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
