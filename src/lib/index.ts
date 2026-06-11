/**
 * O3S / 3d-kit — public library surface.
 *
 * This file is the package boundary. Everything a consuming app (the gallery,
 * a website, a game) is allowed to import lives here. Keep internals private.
 */

// Engine (Layer 1)
export { Stage } from './engine/Stage'
export type { StageProps } from './engine/Stage'
export { CameraRig } from './engine/CameraRig'
export type { CameraRigProps } from './engine/CameraRig'
export {
  useInputMode,
  setInputMode,
  toggleInputMode,
  getInputMode,
  type InputMode,
} from './engine/inputMode'

// Hooks / primitives (Layer 2)
export { useMouse } from './hooks/useMouse'
export { useScrollProgress } from './hooks/useScrollProgress'

// Components (Layer 3) — the 6 master families
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
export { InteractiveSurface } from './components/InteractiveSurface'
export type { InteractiveSurfaceProps } from './components/InteractiveSurface'
export { InstancedGrid } from './components/InstancedGrid'
export type { InstancedGridProps, InstanceLayout } from './components/InstancedGrid'
export { ShapeGeometry } from './components/Shape'
export type { ShapeName } from './components/Shape'
export type { ParticleDistribution } from './components/ParticleField'

// Variant contracts + shader chunks (for authoring custom effects)
export type { SurfaceMaterial } from './materials/types'
export { STANDARD_SURFACE_UNIFORMS } from './materials/types'
export * as shaderChunks from './shaders/chunks'

// Surface material variants (InteractiveSurface effects)
export { glassmorphism } from './materials/glassmorphism'
export { thermalVision } from './materials/thermalVision'
export { iridescent } from './materials/iridescent'

// Instance layout variants (InstancedGrid effects)
export { orbitLayout } from './layouts/orbit'
export type { OrbitLayoutOptions } from './layouts/orbit'
