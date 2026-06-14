import { Component, type ErrorInfo, type ReactNode } from 'react'

export interface WebGLErrorBoundaryProps {
  children: ReactNode
  /** Rendered in place of the children when the 3D subtree throws. */
  fallback: ReactNode
  /** Optional hook for logging — receives the error that was caught. */
  onError?: (error: Error, info: ErrorInfo) => void
}

interface WebGLErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches errors thrown while rendering the 3D subtree (the <Canvas> and
 * everything inside it) and renders `fallback` instead of letting the failure
 * propagate up and unmount the whole React tree.
 *
 * `isWebGLAvailable()` handles the common "no context at all" case before the
 * Canvas mounts; this boundary is the safety net for the rest: a context that
 * creates but then fails, context loss mid-render, or a throwing component
 * inside the scene. Together they guarantee a consumer's page never goes blank
 * because of the 3D layer.
 *
 * It is a class component because React error boundaries have no hooks-based
 * equivalent — `getDerivedStateFromError` / `componentDidCatch` are the only API.
 */
export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
