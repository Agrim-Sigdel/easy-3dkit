import Hero3D from './_components/Hero3D'

/**
 * Server Component (no 'use client'). The headline and CTA are server-rendered
 * DOM, so they appear in the initial HTML and survive a WebGL failure. The 3D
 * scene is a client island layered behind them.
 */
export default function Page() {
  return (
    <main className="hero">
      <div className="hero-scene">
        <Hero3D />
      </div>
      <div className="hero-content">
        <p className="eyebrow">easy-3dkit + Next.js App Router</p>
        <h1>Server-rendered text, client-rendered 3D.</h1>
        <p className="lede">
          This headline is server-rendered. The scene behind it is a{' '}
          <code>&apos;use client&apos;</code> island that only mounts in the browser.
        </p>
        <a className="cta" href="https://agrimsigdel.com.np/">
          Read the docs
        </a>
      </div>
    </main>
  )
}
