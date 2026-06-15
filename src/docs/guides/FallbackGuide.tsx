import { Code } from './Code'

export function FallbackGuide() {
  return (
    <article className="docs-prose">
      <h1>WebGL fallback &amp; accessibility</h1>
      <p>
        WebGL can fail: a locked-down browser, an exhausted GPU context budget, a disabled flag, or
        a server render. easy-3dkit is built so this never blanks your page.
      </p>

      <h2>Stage degrades gracefully</h2>
      <p>
        <code>&lt;Stage&gt;</code> detects WebGL availability before mounting the canvas and wraps
        it in an error boundary. If WebGL is unavailable or the scene throws, it renders a{' '}
        <code>fallback</code> instead of unmounting the React tree.
      </p>
      <Code>{`<Stage
  background={null}
  fallback={<div className="hero-poster">Interactive preview unavailable</div>}
>
  <InteractiveSurface material={glassmorphism} />
</Stage>`}</Code>
      <p>
        The default fallback is a styled, accessible "3D preview unavailable" placeholder. Pass your
        own node to match your brand, or <code>null</code> to render nothing in its place.
      </p>

      <h2>The golden rule: critical content lives outside the canvas</h2>
      <p>
        Headlines, calls-to-action, and navigation must be ordinary DOM <em>outside</em>{' '}
        <code>&lt;Stage&gt;</code> — not drei <code>&lt;Html&gt;</code> inside the canvas. That way
        they survive a WebGL failure regardless of the fallback, and they remain selectable,
        crawlable, and screen-reader accessible.
      </p>

      <h2>Detecting support yourself</h2>
      <Code>{`import { isWebGLAvailable } from 'easy-3dkit'

if (isWebGLAvailable()) {
  // mount the rich 3D experience
}`}</Code>

      <h2>Respecting reduced motion</h2>
      <p>
        <code>&lt;ScrollAnimator&gt;</code> honors <code>prefers-reduced-motion</code> automatically:
        the time-based entrance and idle animations are paused for visitors who request reduced
        motion, while scroll-position channels (driven by the user's own scrolling) continue. You
        can opt out per-instance:
      </p>
      <Code>{`// Force motion even when the OS requests reduced motion (rarely a good idea):
<ScrollAnimator idle="bob" entrance="rise" respectReducedMotion={false}>
  <FloatingObject />
</ScrollAnimator>`}</Code>
      <p>
        Read the preference yourself with the exported hook to gate your own motion:
      </p>
      <Code>{`import { usePrefersReducedMotion } from 'easy-3dkit'

const reduced = usePrefersReducedMotion()
return <ParticleField speed={reduced ? 0 : 0.1} />`}</Code>
    </article>
  )
}
