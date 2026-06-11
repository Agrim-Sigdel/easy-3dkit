# O3S — 100-Effects Implementation Plan

Goal: a reusable kit where the 100 effects collapse into **6 family components**, each
driven by swappable **variant modules**. Curated to a strong, achievable core (~40)
rather than 100 at uneven quality; research-grade effects are explicitly deferred.

## The core idea: Family + Variant

Each "Master Component" is a **family** that owns the shared plumbing. Each effect is a
**variant** — a small plug-in module the family consumes. You never edit a family to add
an effect; you add a variant file + one gallery line.

```
<InteractiveSurface material={glassmorphism} />   // family + variant
<InteractiveSurface material={thermalVision} />   // swap variant, same plumbing
```

- **Shader families** (PostFX, InteractiveSurface, ParticleField, InstancedGrid) take a
  *material/shader variant*: `{ uniforms, vertexShader, fragmentShader, update? }`.
- **Behavior families** (FloatingObject, ScrollScene) take a *behavior variant*: a hook or
  config describing motion (spring config, tilt response, scroll mapping).

Hard rule (already bit us once): **uniforms object is created ONCE; per-frame code only
mutates `.value`.** Every variant follows this.

## Difficulty tiers

- **Easy** — a shader or transform with no simulation state. (most of InteractiveSurface)
- **Medium** — needs FBO/ping-pong, instancing math, or postprocessing chains.
- **Hard** — multi-pass simulation (smoke, sparks) but still real-time feasible.
- **Research (DEFERRED)** — RTGI, SSR, real fluid/cloth/hair, photogrammetry, ray tracing.
  Marked in the gallery as "uses library wrapper" or "out of scope" — not hand-built.

## Curated core by family (✅ build, ⏸ defer)

### PostFX (postprocessing chain — wraps @react-three/postprocessing)
✅ Bloom, Vignette, Film Grain, Chromatic Aberration, DoF, Glitch, Color Grading (LUT),
   Tilt-Shift, Volumetric Fog, Outline, Noise/Night-vision, Fisheye/Lens distortion
⏸ SSAO (drei wrapper, optional), SSR, RTGI, Ray-traced GI, Light baking (offline)

### InteractiveSurface (shader mesh — the biggest, easiest family)
✅ Glassmorphism, Frosted glass, Iridescent, Holographic foil, Toon/cel + outline,
   Wireframe↔solid morph, Moiré, Fractal zoom, Liquid blob (raymarch-lite), Brushed metal
   (anisotropic), Neon emissive line-art, Thermal heatmap, Bioluminescent glow, X-ray fresnel,
   Rain streaks, Scanlines, Dither (8-bit), Kinetic type distortion
⏸ Full PBR authoring, photogrammetry, carbon-fiber/jade as separate (fold into iridescent/anisotropic)

### ParticleField (GPU point cloud — extend the existing component)
✅ Floating background (done), Disintegration/dissolve, Vortex swarm, God rays (additive),
   Boids flocking, Magic trail splines, Rain/snowfall, Plasma beams, Shockwave ripple,
   Sound-reactive frequency
⏸ True volumetric smoke/fire/liquid (FBO sim) — pick 1 "Hard" showpiece (fire), defer rest

### InstancedGrid (instanced mesh — new family)
✅ Orbit layout, Infinite tunnel, Isometric stack, Voxelization, Kinetic text rotation,
   Voronoi shatter, Origami fold, Gear interlocking, Micro-displacement, Sound-reactive bars
⏸ Rigid-body destruction, granular sand (need physics engine — optional Rapier add-on)

### FloatingObject (spring/behavior wrapper — extend existing)
✅ Cursor-tracking tilt, 3D card flip, Magnetic attraction, Squash & stretch, Elastic jiggle,
   Path-following spline, Morph shape keys, Claymorphic shading
⏸ Cloth, hair/fur, rigged skeleton, stop-motion (each is its own subsystem)

### ScrollScene (scroll→3D driver — upgrade existing to GSAP ScrollTrigger)
✅ Parallax depth, Inertial deformation, Text-slice reveal, Exploded view, Camera fly-through,
   Pop-up book fold, Ocean tessellation, Portal transition
⏸ 3D page flip as full book (fold subset is enough)

## Build order (architecture-first)

1. **Foundation (this commit):** shader chunk library, `materials/` + `behaviors/` variant
   contract, upgrade `InteractiveSurface` (rename/extend RippleShader) and `ParticleField`
   to accept variants, add `InstancedGrid` family skeleton, registry supports grouped/tagged
   entries + difficulty badges. Prove the pattern with 1 NEW variant per family.
2. **Mass-produce InteractiveSurface variants** (easiest, highest count).
3. **ParticleField variants** (GPU sims).
4. **InstancedGrid variants.**
5. **FloatingObject behaviors.**
6. **ScrollScene (GSAP ScrollTrigger upgrade) + scroll effects** — last, needs scrollable pages.

## Per-effect = one variant file + one registry line. That's the whole point.
