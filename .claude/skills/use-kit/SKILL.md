---
name: use-kit
description: Compose easy-3dkit components into a page or demo site - Stage, CameraRig viewing angles, ScrollAnimator scroll modes and entrance/idle animation, KitElement configs, and the gallery copy-code workflow. Use when building a website, demo, hero section, or scene WITH the kit (as opposed to adding effects TO the kit).
---

# Build with easy-3dkit

Import from `easy-3dkit` (the app aliases this to the local `src/lib` source for
HMR; external projects resolve the published package). `PostFX` is on the opt-in
subpath `easy-3dkit/postprocessing`.

## The skeleton every scene shares

```tsx
<Stage background={null}>          // Canvas + renderer + default lights
  {/* effects here */}
  <CameraRig />                    // camera as a separate entity
</Stage>
```

Effects per family: `<InteractiveSurface material={plasma} params={{...}} />`,
`<ParticleField {...props} />`, `<InstancedGrid layout={orbitLayout({...})} {...appearance} />`,
standalone components as plain JSX, `<PostFX {...props} />` LAST child
(needs optional peer @react-three/postprocessing).

## Viewing angle

```tsx
<CameraRig view={{ azimuth: 30, elevation: 15, distance: 8 }} />
```

Degrees; 0/0/6 is the default front view. `onViewChange` reports hand-orbits
back in the same shape for two-way binding. Pure math helpers:
`viewAngleToPosition`, `positionToViewAngle`, `DEFAULT_VIEW`.

## Scroll modes + animation

Wrap anything in `ScrollAnimator`; channels are simultaneous and compose:

```tsx
<ScrollAnimator rotate={1} zoom={3} ease="easeInOut" entrance="rise" idle="bob">
  <InteractiveSurface material={heatHaze} />
</ScrollAnimator>
```

Channels: rotate (turns), zoom (+Z), lift (+Y), parallax, reveal (0..1),
drift. Entrances (rise/scaleIn/spinIn/dropIn) play once on mount - remount
via a React key to replay. Idle: bob/sway/pulse. Eases: EASINGS/EaseName.
Scroll progress is PAGE-WIDE (useScrollProgress, 0..1 over the whole
document); the page must scroll, or set `setScrollOverride(0..1)` to drive it
programmatically (that is how the gallery slider works).

## Configs instead of code

`<KitElement config={...} />` (gallery layer, `src/gallery/KitElement.tsx`)
renders a Copy JSON blob `{ id, params, view?, animation? }` inside a Stage.
It applies `animation` itself; pass `config.view` to your own CameraRig.

## Getting exact code

Fastest path to correct values: open the gallery (`pnpm dev`), tweak the leva
panel, then the Copy code button (or the Docs panel) emits the full pasteable
file for the current effect + camera + animation. Generated snippets in
EFFECTS.md show defaults.

## Site conventions (see src/studio, src/showcase)

Routes are dev-only pages registered in `src/main.tsx`. The gallery locks
page scroll, so scrolling routes must add a class to re-enable it (see
StudioPage's `studio-scroll` effect). A fixed full-viewport Stage behind a
normal scrolling document is the house pattern for backdrop scenes; small
inline Stages work for cards. Keep page CSS in a route-local stylesheet.
