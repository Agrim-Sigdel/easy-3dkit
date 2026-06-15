# easy-3dkit starter

A minimal Vite + React + TypeScript app with a working 3D hero, built on
[easy-3dkit](https://agrim-sigdel.github.io/easy-3dkit/).

## Run it

```bash
npm install
npm run dev
```

Open the printed URL. Edit `src/App.tsx` to change the scene.

## What's here

- `src/App.tsx` — a transparent `<Stage>` behind DOM content, with an
  `<InteractiveSurface>` and a `<ScrollAnimator>` entrance/idle animation. The
  headline lives outside the canvas so it survives a WebGL failure.
- The 3D stack (`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`) is
  installed as real dependencies alongside `easy-3dkit`.

## Next steps

- Browse every component and copy code from the
  [docs](https://agrim-sigdel.github.io/easy-3dkit/).
- Swap `iridescent` for another material, or add a `<ParticleField>`.
- Drive the scene from scroll with `useScrollProgress`.
