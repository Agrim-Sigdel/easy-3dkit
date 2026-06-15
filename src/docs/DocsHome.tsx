import { Link } from 'react-router-dom'
import { registry } from '../gallery/registry'
import { guides } from './guides/registry'
import { stackblitzUrl } from './stackblitz'

export function DocsHome() {
  return (
    <article className="docs-prose">
      <h1>easy-3dkit documentation</h1>
      <p>
        A reusable library of interactive 3D components for React, built on three.js, React Three
        Fiber, and GSAP. Drop scroll-reactive surfaces, particle fields, instanced layouts, and
        post-processing into any React site or app.
      </p>

      <div className="docs-cta-row">
        <Link className="docs-cta primary" to="/docs/guides/install">
          Install
        </Link>
        <Link className="docs-cta" to="/gallery">
          Live gallery
        </Link>
        <a className="docs-cta" href={stackblitzUrl()} target="_blank" rel="noreferrer">
          Open in StackBlitz
        </a>
      </div>

      <h2>Guides</h2>
      <ul className="docs-guide-list">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link to={`/docs/guides/${g.slug}`}>{g.title}</Link>
            <span className="docs-guide-summary"> — {g.summary}</span>
          </li>
        ))}
      </ul>

      <h2>Components</h2>
      <p>
        {registry.length} effects across six families. Every page has a live, editable preview and
        a copy-paste snippet that matches what's on screen.
      </p>
      <p>
        Browse them from the sidebar, or jump into the{' '}
        <Link to={`/docs/${registry[0].id}`}>first component</Link>.
      </p>
    </article>
  )
}
