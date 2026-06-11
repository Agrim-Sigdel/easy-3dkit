# Contributing to easy-3dkit

Thanks for your interest. This repo is a published npm library (`src/lib/`) plus a
local gallery for developing and previewing effects.

## Setup

```bash
pnpm install
pnpm dev        # gallery at http://localhost:5173
```

## The layered design (please respect it)

Code is split into layers, and **lower layers never depend on higher ones**:

- **Layer 1 — engine** (`src/lib/engine/`): `Stage` (Canvas/renderer/lights/loop), `CameraRig`, stores.
- **Layer 2 — hooks** (`src/lib/hooks/`): reusable primitives like `useMouse`, `useScrollProgress`.
- **Layer 3 — components** (`src/lib/components/`): the 3D elements you assemble.
- **Materials & layouts** (`src/lib/materials/`, `src/lib/layouts/`): variant data for `InteractiveSurface` and `InstancedGrid`.

The rule that makes components reusable: **props in, visuals out.** A component
must not care whether it lives in a website or a game. A website drives it with
scroll; a game drives it with game state. Keep drivers separate from components.

Library code (`src/lib/`) must **not** import gallery-only dependencies (`leva`,
`react-router-dom`), and must only import declared peer dependencies (react,
three, `@react-three/*`, gsap). The gallery (`src/gallery/`) and studio
(`src/studio/`) are dev-only and may use anything.

## Adding a component

1. Create `src/lib/components/MyThing.tsx` — a function component, props in, visuals out. Copy an existing one as a template.
2. Export it and its props type from `src/lib/index.ts` (the package boundary).
3. Add an entry to `src/gallery/registry.tsx` (name, category, controls schema, render) — it appears in the sidebar automatically.
4. Document it in [EFFECTS.md](./EFFECTS.md).

## Before opening a PR

```bash
pnpm typecheck      # must pass clean
pnpm build:pkg      # the library must build
```

## Conventions

- No emojis in code, comments, docs, or commit messages.
- ESM only; TypeScript `strict`.
- No `.ts` extensions in imports inside `src/lib/` (breaks declaration emit).
