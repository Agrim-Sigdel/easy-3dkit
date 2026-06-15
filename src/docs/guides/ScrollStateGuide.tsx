import { Code } from './Code'

export function ScrollStateGuide() {
  return (
    <article className="docs-prose">
      <h1>Driving from scroll or state</h1>
      <p>
        Every component is a pure <em>"props in, visuals out"</em> unit — it doesn't care whether
        a website's scroll, a game loop, or React state drives it. There are three ways to drive
        them, from highest-level to lowest.
      </p>

      <h2>1. ScrollAnimator (declarative scroll)</h2>
      <p>
        Wrap any effect (or plain meshes) and bind page scroll to its transform. Channels compose;{' '}
        <code>0</code> means a channel is off.
      </p>
      <Code>{`<Stage background={null}>
  <ScrollAnimator rotate={1} zoom={3} lift={2} ease="easeInOut" entrance="rise" idle="bob">
    <InteractiveSurface material={heatHaze} />
  </ScrollAnimator>
</Stage>`}</Code>
      <p>
        Scroll channels need the page to be taller than the viewport for progress to move. The
        time-based layers (<code>entrance</code>, <code>idle</code>) are automatically paused when
        the visitor has <code>prefers-reduced-motion</code> set.
      </p>

      <h2>2. useScrollProgress (read scroll yourself)</h2>
      <p>
        For custom mappings, read a <code>0 → 1</code> scroll ref and feed it into props. Reading
        the ref inside <code>useFrame</code> is free.
      </p>
      <Code>{`import { Stage, ParticleField, PostFX, useScrollProgress } from 'easy-3dkit'

function Scene() {
  const progress = useScrollProgress() // ref: 0 at top, 1 at bottom
  return (
    <>
      <ParticleField count={6000} color="#5fa8ff" />
      <PostFX bloom={1.4 * progress.current} />
    </>
  )
}`}</Code>

      <h2>3. From app state</h2>
      <p>
        Because components take plain props, any state source works — a slider, a route change, a
        game tick. Pass the value straight in:
      </p>
      <Code>{`function Scene({ intensity }: { intensity: number }) {
  return <ParticleField count={2000 + intensity * 8000} speed={intensity} />
}`}</Code>

      <h2>Driving from your own scroll container</h2>
      <p>
        If your page scrolls inside an element rather than the window, set a scroll override and the
        components read it instead of <code>window.scrollY</code>:
      </p>
      <Code>{`import { setScrollOverride } from 'easy-3dkit'

el.addEventListener('scroll', () => {
  const p = el.scrollTop / (el.scrollHeight - el.clientHeight)
  setScrollOverride(p) // pass null to release back to window scroll
})`}</Code>
    </article>
  )
}
