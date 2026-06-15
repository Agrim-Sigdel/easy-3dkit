import { Link } from 'react-router-dom'
import { Code } from './Code'

export function FirstHeroGuide() {
  return (
    <article className="docs-prose">
      <h1>Your first hero</h1>
      <p>
        A 3D hero is a full-bleed <code>&lt;Stage&gt;</code> in the background with your real
        page content layered on top as ordinary DOM. Keeping headlines and buttons{' '}
        <strong>outside</strong> the canvas means they stay visible and accessible even if WebGL
        fails — see <Link to="/docs/guides/webgl-fallback">WebGL fallback</Link>.
      </p>

      <h2>1. The scene</h2>
      <p>
        <code>Stage</code> sets up the canvas, renderer, lights, and frame loop.{' '}
        <code>background={'{null}'}</code> makes it transparent so the page shows through.
      </p>

      <Code>{`import { Stage, InteractiveSurface, iridescent } from 'easy-3dkit'

function HeroScene() {
  return (
    <Stage background={null}>
      <InteractiveSurface material={iridescent} />
    </Stage>
  )
}`}</Code>

      <h2>2. The layout</h2>
      <p>
        Position the scene absolutely behind the content. The text is a normal{' '}
        <code>&lt;h1&gt;</code> — it renders regardless of the 3D layer.
      </p>

      <Code>{`export function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HeroScene />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '8rem 2rem' }}>
        <h1>Build in three dimensions</h1>
        <p>A reusable library of interactive 3D components for React.</p>
        <a href="/get-started">Get started</a>
      </div>
    </section>
  )
}`}</Code>

      <h2>3. Add motion</h2>
      <p>
        Wrap the scene in <code>&lt;ScrollAnimator&gt;</code> to make it react to scroll, play an
        entrance, or idle gently. See{' '}
        <Link to="/docs/guides/scroll-and-state">driving from scroll or state</Link>.
      </p>

      <Code>{`<Stage background={null}>
  <ScrollAnimator rotate={1} entrance="rise" idle="bob">
    <InteractiveSurface material={iridescent} />
  </ScrollAnimator>
</Stage>`}</Code>

      <p>
        Browse every component, tweak it live, and copy the exact code from the{' '}
        <Link to="/docs">component reference</Link>.
      </p>
    </article>
  )
}
