# easy-3dkit

A library of **interactive 3D components** for React, built on
[three.js](https://threejs.org), [React Three Fiber](https://r3f.docs.pmnd.rs),
and [GSAP](https://gsap.com). Drop scroll-reactive surfaces, particle fields,
instanced layouts, and post-processing into any React site or app.

## Install

```bash
npm install easy-3dkit
```

easy-3dkit declares its 3D stack as **peer dependencies** — install them alongside it
so your app has a single copy of each (this avoids the classic
"multiple instances of three" error):

```bash
npm install three @react-three/fiber @react-three/drei gsap
# optional, only if you use <PostFX>:
npm install @react-three/postprocessing
```

Requires React 18+.

## 30-second example

```tsx
import { Stage, InteractiveSurface, glassmorphism } from 'easy-3dkit'

export function Hero() {
  return (
    <Stage background={null}>
      <InteractiveSurface material={glassmorphism} />
    </Stage>
  )
}
```

`Stage` sets up the Canvas, renderer, lights, and frame loop. Everything else is
a component you place inside it. `background={null}` makes it transparent so you
can overlay it on page content.

## What's in the box

**Engine & primitives**
`Stage` · `CameraRig` · `useMouse` · `useScrollProgress` · input-mode and
scroll-override stores for driving effects from your own state.

**Components** (place inside `<Stage>`)
`InteractiveSurface` · `ParticleField` · `RippleShader` · `FloatingObject` ·
`ScrollScene` · `PostFX` · `InstancedGrid` · `ShapeGeometry` · `CardFlip` ·
`MagneticGroup` · `SquashStretch` · `ElasticJiggle` · `PathSpline` · `MorphShape` ·
`ExplodedView` · `ParallaxLayers` · `OceanPlane` · `PortalRing` ·
`CameraFlythrough` · `PopupFold`

**Surface materials** (pass to `<InteractiveSurface material={...} />`)
`glassmorphism` · `frostedGlass` · `holographicFoil` · `iridescent` ·
`thermalVision` · `xrayGhost` · `toonCel` · `wireframeMorph` · `moire` ·
`fractalZoom` · `liquidBlob` · `brushedMetal` · `neonLineArt` · `bioluminescent` ·
`rainStreaks` · `scanlines` · `dither8bit` · `kineticType` · `plasma` ·
`voronoiCells` · `heatHaze`

**Instance layouts** (pass to `<InstancedGrid layout={...} />`)
`orbitLayout` · `tunnelLayout` · `isometricStack` · `voxelSphere` ·
`voronoiShatter` · `gearField` · `kineticRing` · `origamiFold` · `waveGrid` ·
`galaxySpiral` · `cubeSwarm`

See [EFFECTS.md](./EFFECTS.md) for a description of every effect.

## Driving effects from scroll or state

Components are pure "props in, visuals out" — they don't care whether a website
or a game drives them. Bind page scroll to a 3D transform with `ScrollScene`, or
read scroll progress yourself:

```tsx
import { Stage, ParticleField, PostFX, useScrollProgress } from 'easy-3dkit'

function Scene() {
  const progress = useScrollProgress() // 0 → 1 down the page
  return (
    <>
      <ParticleField count={6000} color="#5fa8ff" />
      <PostFX bloom={1.4 * progress} />
    </>
  )
}

export function Hero() {
  return <Stage background={null}><Scene /></Stage>
}
```

## TypeScript

Ships with full type declarations. Every component exports its props type
(`StageProps`, `InteractiveSurfaceProps`, `InstancedGridProps`, …) and layouts
export their options types.

## Bundle size & tree-shaking

The package is marked `sideEffects: false`, so a bundler keeps only the effects
you import. The 3D stack (`three`, `@react-three/*`, `gsap`) is peer-installed,
so it is **not** part of these numbers — they are the library's own footprint.

| Import | Minified | Gzipped |
| --- | --- | --- |
| `ParticleField` only | 57.7 KB | 17.3 KB |
| `InteractiveSurface` + `glassmorphism` | 58.2 KB | 17.4 KB |
| Whole library (`import *`) | 92.1 KB | 30.4 KB |

A single-component import is roughly half the whole-library cost. Reproduce the
numbers yourself with `pnpm build:pkg && pnpm measure:size`.

## License

MIT © Agrim Sigdel
