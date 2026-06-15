# easy-3dkit + Next.js (App Router) example

A verified Next.js 14 App Router app using easy-3dkit. Demonstrates the
`'use client'` boundary: server-rendered text with a client-rendered 3D scene
behind it.

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
```

## Build it

```bash
npm run build
```

This is the build exercised in CI to guarantee a clean server build with no
hydration errors.

## How it works

- `app/page.tsx` is a **Server Component** — the headline and CTA are
  server-rendered DOM.
- `app/_components/Hero3D.tsx` is marked `'use client'` — it owns the `<Stage>`
  and only mounts in the browser, where WebGL exists.
- `next.config.mjs` lists `easy-3dkit` (and the R3F stack) in
  `transpilePackages` so Next transpiles their modern ESM for both bundles.

See the [Next.js & SSR guide](https://agrimsigdel.com.np/docs/guides/nextjs-ssr)
for the full pattern.
