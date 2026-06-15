import { Code } from './Code'

export function PerformanceGuide() {
  return (
    <article className="docs-prose">
      <h1>Performance &amp; mobile</h1>
      <p>
        3D is GPU-bound. A few <code>&lt;Stage&gt;</code> knobs and mounting strategies keep things
        smooth on phones and laptops alike. <code>&lt;Stage&gt;</code> forwards any{' '}
        <a href="https://r3f.docs.pmnd.rs/api/canvas" target="_blank" rel="noreferrer">
          Canvas prop
        </a>{' '}
        straight through.
      </p>

      <h2>1. Clamp device pixel ratio</h2>
      <p>
        Retina screens render 2–3× the pixels. Capping <code>dpr</code> is the single biggest mobile
        win. <code>&lt;Stage&gt;</code> already clamps it, but you can tighten it further:
      </p>
      <Code>{`<Stage dpr={[1, 1.5]}>{/* ... */}</Stage>`}</Code>

      <h2>2. Render on demand</h2>
      <p>
        If the scene only changes on interaction or scroll, switch off the continuous render loop so
        the GPU idles between frames:
      </p>
      <Code>{`<Stage frameloop="demand">{/* ... */}</Stage>`}</Code>
      <p>
        Note: continuously animated effects (idle motion, shader time) need the default{' '}
        <code>frameloop="always"</code>. Use <code>demand</code> for static or
        interaction-only scenes.
      </p>

      <h2>3. Right-size instance counts</h2>
      <p>
        <code>&lt;ParticleField&gt;</code> and <code>&lt;InstancedGrid&gt;</code> scale with their
        count. Drop counts on small screens:
      </p>
      <Code>{`const isMobile = window.matchMedia('(max-width: 720px)').matches
<ParticleField count={isMobile ? 2000 : 12000} />`}</Code>

      <h2>4. Lazy-mount when scrolled into view</h2>
      <p>
        Don't pay for a canvas that isn't on screen. Gate the <code>&lt;Stage&gt;</code> behind an{' '}
        <code>IntersectionObserver</code> so it mounts when it scrolls in and can be torn down when
        it leaves:
      </p>
      <Code>{`import { useEffect, useRef, useState } from 'react'
import { Stage, InteractiveSurface, glassmorphism } from 'easy-3dkit'

function LazyHero() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: '200px' },
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ minHeight: '60vh' }}>
      {inView && (
        <Stage background={null}>
          <InteractiveSurface material={glassmorphism} />
        </Stage>
      )}
    </div>
  )
}`}</Code>

      <h2>5. Reduced motion</h2>
      <p>
        Honor the visitor's motion preference — it lightens GPU load and respects accessibility
        needs. <code>&lt;ScrollAnimator&gt;</code> does this for you; for custom animation, read{' '}
        <code>usePrefersReducedMotion()</code>.
      </p>
    </article>
  )
}
