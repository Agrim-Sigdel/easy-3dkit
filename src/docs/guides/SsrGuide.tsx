import { Code } from './Code'

export function SsrGuide() {
  return (
    <article className="docs-prose">
      <h1>Next.js &amp; SSR</h1>
      <p>
        easy-3dkit is safe to <em>import</em> in a server context: no browser globals are touched
        at module load. WebGL itself only exists in the browser, so the actual canvas must render
        client-side. In Next.js App Router that means a <code>'use client'</code> boundary.
      </p>

      <h2>The rule</h2>
      <p>
        Put <code>&lt;Stage&gt;</code> and everything inside it in a client component. Your server
        components, metadata, and page shell stay on the server.
      </p>

      <h2>App Router example</h2>
      <p>A client component that owns the scene:</p>
      <Code>{`// app/_components/Hero3D.tsx
'use client'

import { Stage, InteractiveSurface, iridescent } from 'easy-3dkit'

export default function Hero3D() {
  return (
    <Stage background={null}>
      <InteractiveSurface material={iridescent} />
    </Stage>
  )
}`}</Code>

      <p>A server component page that renders it behind real, server-rendered text:</p>
      <Code>{`// app/page.tsx  (Server Component — no 'use client')
import Hero3D from './_components/Hero3D'

export default function Page() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Hero3D />
      </div>
      <div style={{ position: 'relative' }}>
        <h1>Server-rendered headline</h1>
      </div>
    </section>
  )
}`}</Code>

      <h2>Avoiding hydration mismatch</h2>
      <p>
        <code>&lt;Stage&gt;</code> already renders its WebGL-unavailable fallback during any render
        where WebGL isn't present (including the server), then mounts the canvas on the client — so
        a plain import hydrates cleanly. If you want to skip even the fallback markup on the server,
        gate the whole scene behind a client flag or a dynamic import:
      </p>
      <Code>{`import dynamic from 'next/dynamic'

const Hero3D = dynamic(() => import('./_components/Hero3D'), { ssr: false })`}</Code>

      <h2>Verified example</h2>
      <p>
        A complete, build-verified Next.js 14 app-router project lives in{' '}
        <code>examples/nextjs-app/</code> in the repository. It is exercised in CI with{' '}
        <code>next build</code> to guarantee a clean server build with no hydration errors.
      </p>
    </article>
  )
}
