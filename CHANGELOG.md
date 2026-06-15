# Changelog

## 0.3.0

### Minor Changes

- 34883bd: Docs site, onboarding, accessibility, and packaging.

  - Add `usePrefersReducedMotion` hook; `<ScrollAnimator>` now honors
    `prefers-reduced-motion` by default (pauses time-based entrance and idle
    motion; scroll-position channels still respond). Opt out with
    `respectReducedMotion={false}`.
  - **Packaging fix:** the library now ships as preserved ES modules (real
    tree-shaking — a single-component import dropped from ~58 KB to ~1.4 KB), and
    `PostFX` moved to the opt-in subpath `easy-3dkit/postprocessing`. The main
    entry no longer references the optional `@react-three/postprocessing` peer, so
    consumers who don't use post effects (incl. Vite and Next.js builds) compile
    cleanly without installing it. The package entry is now `dist/index.js`.
  - Ships a live docs site, a build-verified Next.js App Router example, and the
    `create-easy-3dkit` starter scaffolder.

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0 — initial release

First public release of `easy-3dkit`.

- Engine: `Stage`, `CameraRig`, input-mode and scroll-override stores.
- Primitives: `useMouse`, `useScrollProgress`.
- Components: `InteractiveSurface`, `ParticleField`, `RippleShader`, `FloatingObject`,
  `ScrollScene`, `PostFX`, `InstancedGrid`, `ShapeGeometry`, `CardFlip`, `MagneticGroup`,
  `SquashStretch`, `ElasticJiggle`, `PathSpline`, `MorphShape`, `ExplodedView`,
  `ParallaxLayers`, `OceanPlane`, `PortalRing`, `CameraFlythrough`, `PopupFold`.
- 21 surface materials and 11 instance layouts.
- ESM build with full TypeScript declarations; three/react/@react-three/gsap are
  peer dependencies.
