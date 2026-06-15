import { Stage, ScrollAnimator, InteractiveSurface, iridescent } from 'easy-3dkit'

/**
 * A 3D hero: a full-bleed transparent <Stage> in the background, real page
 * content layered on top as ordinary DOM. The headline and button live OUTSIDE
 * the canvas, so they stay visible and accessible even if WebGL is unavailable.
 */
export function App() {
  return (
    <main className="hero">
      <div className="hero-scene">
        <Stage background={null}>
          <ScrollAnimator entrance="rise" idle="sway">
            <InteractiveSurface material={iridescent} />
          </ScrollAnimator>
        </Stage>
      </div>

      <div className="hero-content">
        <p className="eyebrow">Built with easy-3dkit</p>
        <h1>Your idea, in three dimensions.</h1>
        <p className="lede">
          Edit <code>src/App.tsx</code> to swap the material, add particles, or drive the scene
          from scroll. Everything is a plain React component.
        </p>
        <a className="cta" href="https://3d-kit.netlify.app/" target="_blank" rel="noreferrer">
          Read the docs
        </a>
      </div>
    </main>
  )
}
