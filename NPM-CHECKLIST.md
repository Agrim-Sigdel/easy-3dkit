# O3S — npm Publishing Checklist

Goal: ship `o3s` as an installable npm library so a consumer can do
`npm install o3s` and `import { Stage, InteractiveSurface, glassmorphism } from 'o3s'`.

Scope: **npm package only.** The shadcn-style registry is deliberately out of scope
for this pass (see DISTRIBUTION.md if you revisit it later).

Status legend: `[ ]` todo · `[~]` partial/exists · `[x]` done

---

## 0. Decisions to lock first (5 min)

These change the work below, so settle them before starting.

- [ ] **Package name.** `o3s` is unscoped and may be taken — check `npm view o3s`.
      If taken, use a scope: `@<yourname>/o3s`. (Scoped packages need
      `publishConfig.access = "public"` to publish for free.)
- [ ] **Module format.** Recommendation: **ESM-only**. R3F/three are ESM-first and
      your whole codebase is ESM. Skip the CJS build unless someone asks.
- [ ] **License.** Recommendation: **MIT** (most permissive, expected for a UI kit).

---

## 1. Blockers — package cannot be installed/used without these

### 1a. Fix `package.json` metadata
File: `package.json`

- [ ] Remove `"private": true` (this alone prevents publishing).
- [ ] Bump version to `0.1.0` (signal "real but pre-1.0").
- [ ] Add the package-entry fields pointing at the build output:
  ```jsonc
  "main": "./dist/o3s.js",          // ESM entry
  "module": "./dist/o3s.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/o3s.js"
    }
  },
  "files": ["dist"],                // only ship dist/, not src/gallery/studio
  "sideEffects": false,            // enables tree-shaking for consumers
  "license": "MIT",
  "repository": { "type": "git", "url": "..." },
  "keywords": ["react", "three", "r3f", "react-three-fiber", "3d", "ui-kit", "shaders"]
  ```
- [ ] If scoped name: add `"publishConfig": { "access": "public" }`.

### 1b. Split dependencies correctly
File: `package.json` — **this is the #1 cause of consumer crashes** ("multiple
instances of three", "invalid hook call").

- [ ] Move to **`peerDependencies`** (consumer provides these, you don't bundle them):
  - `react`, `react-dom`
  - `three`
  - `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
  - `gsap`
- [ ] Mirror those in **`devDependencies`** so your own gallery/build still works.
- [ ] Move to `peerDependenciesMeta` as `optional: true` ONLY the ones not every
      consumer needs (e.g. `@react-three/postprocessing` if only `PostFX` uses it).
- [ ] **Drop from the library entirely** (gallery-only, must NOT be deps of the package):
  - `leva`
  - `react-router-dom`
  - These stay in `devDependencies` for the gallery app.
- [ ] Confirm `src/lib/**` never imports `leva` or `react-router-dom`
      (grep: `grep -rn "leva\|react-router" src/lib`). The earlier analysis says
      it's clean — verify before publishing.

### 1c. Add a library build
New file: `vite.lib.config.ts` (keep the app `vite.config.ts` as-is).

- [ ] Configure Vite **library mode**:
  - entry: `src/lib/index.ts`
  - formats: `["es"]`
  - output filename: `o3s.js`
  - `rollupOptions.external`: every peer dep above (react, react-dom, three,
    `@react-three/*`, gsap) — including subpaths like `react/jsx-runtime`,
    `three/examples/jsm/...` if used. Use a regex/function so subpaths match.
- [ ] Add npm scripts:
  ```jsonc
  "build:lib": "vite build --config vite.lib.config.ts",
  "build:types": "tsc -p tsconfig.lib.json",
  "build:pkg": "npm run build:lib && npm run build:types",
  "prepublishOnly": "npm run build:pkg"
  ```

### 1d. Emit TypeScript declarations (.d.ts)
Vite library mode does NOT emit types. Pick one:

- [ ] **Option A (simplest): a dedicated tsc pass.** New file `tsconfig.lib.json`:
  ```jsonc
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "noEmit": false,
      "declaration": true,
      "emitDeclarationOnly": true,
      "outDir": "dist",
      "allowImportingTsExtensions": false,  // required when emitting
      "rootDir": "src/lib"
    },
    "include": ["src/lib"]
  }
  ```
  Result: `dist/index.d.ts`. Verify it matches the `types` field above.
- [ ] **Option B:** add `vite-plugin-dts` to `vite.lib.config.ts`
      (one plugin, no extra tsconfig). Either is fine; A has no new deps.

> Note: your current `tsconfig.json` has `allowImportingTsExtensions: true` and
> `noEmit: true`. The lib config above overrides both. Also confirm no
> `import ... from './foo.ts'` (explicit `.ts` extension) exists in `src/lib`,
> or declaration emit will choke.

### 1e. Add a LICENSE file
- [ ] Create `LICENSE` (MIT text, your name + 2026). No license = legally unusable.

---

## 2. Verify it actually works (do NOT skip — catches 90% of broken publishes)

- [ ] `npm run build:pkg` → confirm `dist/o3s.js` + `dist/index.d.ts` exist.
- [ ] `npm pack` → inspect the generated `o3s-0.1.0.tgz`:
      `tar -tf o3s-*.tgz` should contain ONLY `dist/**` + `package.json` +
      `README` + `LICENSE`. No `src/`, no gallery, no studio.
- [ ] **Install into a throwaway app** to prove it works end-to-end:
  ```
  npm create vite@latest probe -- --template react-ts
  cd probe && npm i ../o3s-0.1.0.tgz three @react-three/fiber @react-three/drei gsap
  ```
  Then render `<Stage><InteractiveSurface material={glassmorphism} /></Stage>`,
  `npm run dev`, and confirm: it renders, no "multiple instances of three"
  warning, and TS autocomplete/types resolve.
- [ ] Confirm the bundle didn't inline react/three (open `dist/o3s.js`, search for
      a known three symbol — it should be `import`ed, not present inline).

---

## 3. Should-have before announcing (not strictly blocking)

- [ ] **README rewrite.** Current one claims "5 components" — you have ~45.
  - Install line, peer-deps line, 30-second copy-paste example, link to EFFECTS.md,
    a screenshot/gif of the gallery, list of all material/layout/behavior names.
- [ ] **`engines` field** in package.json (e.g. `"node": ">=18"`) — informational.
- [ ] **CHANGELOG.md** — even just a `## 0.1.0 — initial release` entry.
- [ ] **Sanity-check exports vs files.** `index.ts` exports 22 materials, 11 layouts,
      12 behaviors. After build, grep `dist/index.d.ts` for a few names
      (`glassmorphism`, `cubeSwarm`, `PopupFold`) to confirm they survived.
- [ ] **`.npmignore` not needed** if you use the `files` allowlist (preferred).

---

## 4. Nice-to-have / later

- [ ] Real unit tests (currently smoke-only via `scripts/smoke.mjs`).
- [ ] CI: GitHub Action running `build:pkg` + `npm pack` on PRs, publish on tag.
- [ ] `provenance` / npm publish via CI for supply-chain trust.
- [ ] Demo site deploy (the gallery) + link in README — your best marketing.
- [ ] Per-effect tree-shaking check (your `sideEffects: false` should handle it).
- [ ] Revisit the shadcn registry (DISTRIBUTION.md) for copy-in source variants.

---

## 5. Publish (when 1–3 are green)

- [ ] `npm login`
- [ ] `npm publish --dry-run` (final inspection — prints exactly what ships)
- [ ] `npm publish` (add `--access public` if scoped)
- [ ] Tag the release in git: `git tag v0.1.0 && git push --tags`
- [ ] Verify: `npm view o3s` shows your package; install it fresh once more.

---

## Effort estimate

Sections 1–2 (the real work): **~1 day.** Section 3: a few hours.
The architecture is already done; this is pure packaging plumbing.

## Risk hotspots (where this usually breaks)

1. **Peer-dep externalization** — if `three`/`react` get bundled, consumers crash.
   The throwaway-app test in §2 is the only reliable way to catch it.
2. **`.ts` extension imports** + `allowImportingTsExtensions` — fine for the app,
   fatal for declaration emit. Grep `src/lib` for `from '.*\.ts'`.
3. **three.js subpath imports** (`three/examples/jsm/...`, drei internals) not
   matching your `external` rule — use a function matcher, not an exact array.
