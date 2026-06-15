# easy-3dkit

A library of **interactive 3D components** for React, built on
[three.js](https://threejs.org), [React Three Fiber](https://r3f.docs.pmnd.rs),
and [GSAP](https://gsap.com). Drop scroll-reactive surfaces, particle fields,
instanced layouts, and post-processing into any React site or app.

[**Docs**](https://agrimsigdel.com.np/) ·
[**Live gallery**](https://agrimsigdel.com.np/gallery) ·
[**Open in StackBlitz**](https://stackblitz.com/github/Agrim-Sigdel/easy-3dkit/tree/main/templates/starter)

<!-- TODO: add a looping showcase GIF/MP4 here once recorded. The live gallery
     above is the interactive substitute until then. -->

50+ effects across six families — every one has a live, editable preview and a
copy-paste snippet in the [docs](https://agrimsigdel.com.np/).

## Quick start

Scaffold a working app in one command:

```bash
npm create easy-3dkit@latest my-app
cd my-app && npm install && npm run dev
```

Or add it to an existing project (see [Install](#install) below).

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
`ScrollScene` · `InstancedGrid` · `ShapeGeometry` · `CardFlip` ·
`MagneticGroup` · `SquashStretch` · `ElasticJiggle` · `PathSpline` · `MorphShape` ·
`ExplodedView` · `ParallaxLayers` · `OceanPlane` · `PortalRing` ·
`CameraFlythrough` · `PopupFold`

`PostFX` (full-frame post-processing) ships from the opt-in subpath
`easy-3dkit/postprocessing` — `import { PostFX } from 'easy-3dkit/postprocessing'`
— because it needs the optional `@react-three/postprocessing` peer. The main
entry never references that peer, so non-PostFX consumers build without it.

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
import { Stage, ParticleField, useScrollProgress } from 'easy-3dkit'
import { PostFX } from 'easy-3dkit/postprocessing'

function Scene() {
  const progress = useScrollProgress() // ref: 0 → 1 down the page
  return (
    <>
      <ParticleField count={6000} color="#5fa8ff" />
      <PostFX bloom={1.4 * progress.current} />
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
| `ParticleField` only | 1.4 KB | 0.8 KB |
| `InteractiveSurface` + `glassmorphism` | 4.5 KB | 2.1 KB |
| `Stage` only | 2.8 KB | 1.5 KB |
| Whole library (`import *`) | 97.2 KB | 31.7 KB |

The package ships as preserved ES modules, so a single-component import costs a
tiny fraction of the whole-library footprint — the bundler keeps only what you
use. Reproduce the numbers yourself with `pnpm build:pkg && pnpm measure:size`.

## Examples & guides

- [Docs site](https://agrimsigdel.com.np/) — a live, editable page
  per component plus guides (install, your first hero, driving from scroll/state,
  Next.js/SSR, WebGL fallback & accessibility, performance & mobile).
- [`templates/starter`](./templates/starter) — minimal Vite + React app with a
  working hero (what `npm create easy-3dkit` emits, also on StackBlitz).
- [`examples/nextjs-app`](./examples/nextjs-app) — verified Next.js 14 App Router
  example using the `'use client'` boundary; its `next build` runs in CI.

## Accessibility

- `<Stage>` detects WebGL availability and renders an accessible fallback instead
  of blanking the page; keep critical text/CTAs outside the canvas as DOM.
- `<ScrollAnimator>` honors `prefers-reduced-motion` by default (pauses
  time-based entrance/idle motion). Read the preference yourself with the
  exported `usePrefersReducedMotion()` hook.

## Releases

Versioning and the changelog are managed with
[Changesets](https://github.com/changesets/changesets). Contributors run
`pnpm changeset` to describe a change; releases bump versions and update
[CHANGELOG.md](./CHANGELOG.md) from the accumulated changesets.

## License

MIT © Agrim Sigdel
