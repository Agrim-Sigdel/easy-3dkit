import { describe, it, expect, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * prefers-reduced-motion (M7).
 *
 * jsdom has no matchMedia, so we stub it. The hook should reflect the media
 * query's initial state and update on a 'change' event. We render the hook in a
 * tiny component via react-dom/client (no testing-library dependency) and read
 * the value it reports.
 */

function stubMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    // legacy API, unused but present for completeness
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
    onchange: null,
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  )
  return {
    emit(next: boolean) {
      mql.matches = next
      listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent))
    },
  }
}

let root: Root | null = null
let container: HTMLDivElement | null = null

afterEach(() => {
  act(() => root?.unmount())
  root = null
  container?.remove()
  container = null
  vi.unstubAllGlobals()
})

function renderHookValue(): { read: () => boolean } {
  let value = false
  function Probe() {
    value = usePrefersReducedMotion()
    return null
  }
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(<Probe />))
  return { read: () => value }
}

describe('usePrefersReducedMotion', () => {
  it('returns false when reduced motion is not requested', () => {
    stubMatchMedia(false)
    const { read } = renderHookValue()
    expect(read()).toBe(false)
  })

  it('returns true when reduced motion is requested', () => {
    stubMatchMedia(true)
    const { read } = renderHookValue()
    expect(read()).toBe(true)
  })

  it('updates live when the preference changes', () => {
    const mq = stubMatchMedia(false)
    const { read } = renderHookValue()
    expect(read()).toBe(false)
    act(() => mq.emit(true))
    expect(read()).toBe(true)
  })
})
