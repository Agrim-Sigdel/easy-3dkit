import { useSyncExternalStore } from 'react'

/**
 * Input mode — the single source of truth for "who owns the pointer".
 *
 *  - 'interact': the cursor drives effects (ripple follows mouse, thermal hot
 *    spot, etc.). Camera controls are OFF.
 *  - 'view': the cursor drives the CAMERA (orbit/zoom). Effects freeze their
 *    cursor input so they don't jump around while you reframe the shot.
 *
 * This lives in the engine layer as a tiny external store so BOTH the R3F
 * world (CameraRig, useMouse) and plain DOM UI (the toggle button) can read
 * and write it without prop-drilling or a Canvas-only context.
 */
export type InputMode = 'interact' | 'view'

let mode: InputMode = 'interact'
const listeners = new Set<() => void>()

export function getInputMode() {
  return mode
}

export function setInputMode(next: InputMode) {
  if (next === mode) return
  mode = next
  listeners.forEach((l) => l())
}

export function toggleInputMode() {
  setInputMode(mode === 'interact' ? 'view' : 'interact')
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** React hook — re-renders on mode change. Safe inside and outside the Canvas. */
export function useInputMode(): InputMode {
  return useSyncExternalStore(subscribe, getInputMode, getInputMode)
}
