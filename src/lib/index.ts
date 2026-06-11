/**
 * O3S / 3d-kit — public library surface.
 *
 * This file is the package boundary. Everything a consuming app (the gallery,
 * a website, a game) is allowed to import lives here. Keep internals private.
 */

// Engine (Layer 1)
export { Stage } from './engine/Stage'
export type { StageProps } from './engine/Stage'

// Hooks / primitives (Layer 2)
export { useMouse } from './hooks/useMouse'
export { useScrollProgress } from './hooks/useScrollProgress'

// Components (Layer 3)
export { ParticleField } from './components/ParticleField'
export type { ParticleFieldProps } from './components/ParticleField'
export { RippleShader } from './components/RippleShader'
export type { RippleShaderProps } from './components/RippleShader'
export { FloatingObject } from './components/FloatingObject'
export type { FloatingObjectProps } from './components/FloatingObject'
export { ScrollScene } from './components/ScrollScene'
export type { ScrollSceneProps } from './components/ScrollScene'
export { PostFX } from './components/PostFX'
export type { PostFXProps } from './components/PostFX'
