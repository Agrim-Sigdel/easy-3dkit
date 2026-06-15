# create-easy-3dkit

Scaffold a Vite + React + TypeScript app with [easy-3dkit](https://3d-kit.netlify.app/)
and a working 3D hero, ready to `npm install && npm run dev`.

```bash
npm create easy-3dkit@latest my-app
# or
npx create-easy-3dkit my-app
```

Then:

```bash
cd my-app
npm install
npm run dev
```

The generated app is the same starter showcased in the docs and on StackBlitz:
a transparent `<Stage>` hero with an `<InteractiveSurface>` and a scroll/idle
animation, with the headline kept outside the canvas so it survives a WebGL
failure.

## Publishing (maintainers)

The CLI ships a copy of the canonical starter at `./template`. Sync it from the
repo's `templates/starter` before packing:

```bash
pnpm sync:starter   # copies templates/starter -> packages/create-easy-3dkit/template
```
