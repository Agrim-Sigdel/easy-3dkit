# O3S — 3d-kit

A reusable library of **interactive 3D components** built on three.js + React Three Fiber, with a live **gallery** for developing and previewing them. Build effects once, then drop them into any website, game, or art toy.

```bash
pnpm install
pnpm dev        # gallery at http://localhost:5173
pnpm build      # production build
pnpm typecheck  # type-only check
```

## How it's organized (the layered design)

The whole point is reusability: a component must not care whether it lives in a website or a game. So the code is split into four layers, and lower layers never depend on higher ones.

```
src/
├── lib/                  ← THE LIBRARY (extraction-ready — could become an npm package)
│   ├── index.ts          ← public surface: the only things apps may import (@o3s/lib)
│   ├── engine/           ← Layer 1: Canvas, renderer, lights, loop  (Stage.tsx)
│   ├── hooks/            ← Layer 2: reusable primitives (useMouse, useScrollProgress)
│   └── components/       ← Layer 3: the 3D elements you assemble
└── gallery/              ← Layer 4: the gallery app that *consumes* lib/
    └── registry.tsx      ← one entry per component → sidebar + preview + controls
```

**The rule:** components (Layer 3) take props and render visuals — nothing else.
A *website* drives them with scroll; a *game* drives them with game state. Same
component, different driver. `ScrollScene` is the reference "website driver."

## Components so far

| Component        | Category        | What it is |
|------------------|-----------------|------------|
| `ParticleField`  | effects         | Swirling GPU point cloud |
| `RippleShader`   | effects         | Cursor-reactive GLSL plane (custom shader) |
| `FloatingObject` | objects         | Idle float + spin + hover; wraps any mesh/model |
| `ScrollScene`    | website         | Binds page scroll to a 3D transform |
| `PostFX`         | postprocessing  | Composable bloom / vignette / grain |

## Adding a new component

1. Create `src/lib/components/MyThing.tsx` — a function component, **props in, visuals out**. Use the existing ones as templates.
2. Export it from `src/lib/index.ts`.
3. Add one entry to `src/gallery/registry.tsx` (name, category, a `leva` controls schema, a `render`). It appears in the sidebar automatically.

## Using a component in another project

Because `src/lib/` is self-contained and exported through `@o3s/lib`, you can
later lift it into its own package. For now, in this repo:

```tsx
import { Stage, ParticleField, PostFX } from '@o3s/lib'

export function Hero() {
  return (
    <Stage background={null}>      {/* transparent for website overlay */}
      <ParticleField count={6000} color="#5fa8ff" />
      <PostFX bloom={1.4} />
    </Stage>
  )
}
```

## Stack

three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing · gsap · leva · Vite · TypeScript
