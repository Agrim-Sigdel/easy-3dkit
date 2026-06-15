import { describe, it, expect } from 'vitest'
import * as lib from 'easy-3dkit'
import * as postLib from 'easy-3dkit/postprocessing'

/**
 * The package boundary contract: everything index.ts claims to export must
 * actually resolve to a defined value. A typo or a deleted-but-still-exported
 * symbol would blank-import as undefined for a consumer; this catches it.
 *
 * The list is the public surface a consumer relies on. Keep it in sync with
 * src/lib/index.ts — a missing entry here is a coverage gap, an extra one is a
 * test failure that flags a removed export.
 */
const EXPECTED_EXPORTS = [
  // Engine
  'Stage',
  'CameraRig',
  'DEFAULT_VIEW',
  'viewAngleToPosition',
  'positionToViewAngle',
  'EASINGS',
  'useInputMode',
  'setInputMode',
  'toggleInputMode',
  'getInputMode',
  'useScrollOverride',
  'setScrollOverride',
  'getScrollOverride',
  'isWebGLAvailable',
  'WebGLErrorBoundary',
  'WebGLFallback',
  // Hooks
  'useMouse',
  'useScrollProgress',
  'usePrefersReducedMotion',
  // Components (PostFX ships from the 'easy-3dkit/postprocessing' subpath; see
  // the separate suite below)
  'ParticleField',
  'RippleShader',
  'FloatingObject',
  'ScrollScene',
  'ScrollAnimator',
  'InteractiveSurface',
  'InstancedGrid',
  'ShapeGeometry',
  'CardFlip',
  'MagneticGroup',
  'SquashStretch',
  'ElasticJiggle',
  'PathSpline',
  'MorphShape',
  'ExplodedView',
  'ParallaxLayers',
  'OceanPlane',
  'PortalRing',
  'CameraFlythrough',
  'PopupFold',
  // Material contract + chunks
  'STANDARD_SURFACE_UNIFORMS',
  'shaderChunks',
  // Surface materials
  'glassmorphism',
  'thermalVision',
  'iridescent',
  'frostedGlass',
  'holographicFoil',
  'toonCel',
  'wireframeMorph',
  'moire',
  'fractalZoom',
  'liquidBlob',
  'brushedMetal',
  'neonLineArt',
  'bioluminescent',
  'xrayGhost',
  'rainStreaks',
  'scanlines',
  'dither8bit',
  'kineticType',
  'plasma',
  'voronoiCells',
  'heatHaze',
  // Layout factories
  'orbitLayout',
  'tunnelLayout',
  'isometricStack',
  'voxelSphere',
  'voronoiShatter',
  'gearField',
  'kineticRing',
  'origamiFold',
  'waveGrid',
  'galaxySpiral',
  'cubeSwarm',
] as const

describe('public exports', () => {
  it.each(EXPECTED_EXPORTS)('exports a defined %s', (name) => {
    expect((lib as Record<string, unknown>)[name]).toBeDefined()
  })

  it('does not export undefined values', () => {
    const undefinedKeys = Object.keys(lib).filter(
      (k) => (lib as Record<string, unknown>)[k] === undefined,
    )
    expect(undefinedKeys).toEqual([])
  })

  it('does not leak PostFX onto the main entry', () => {
    expect((lib as Record<string, unknown>).PostFX).toBeUndefined()
  })
})

describe('postprocessing subpath exports', () => {
  it('exports PostFX from easy-3dkit/postprocessing', () => {
    expect(postLib.PostFX).toBeDefined()
  })
})
