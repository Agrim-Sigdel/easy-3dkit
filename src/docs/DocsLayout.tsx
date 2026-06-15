import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { registry, type Family } from '../gallery/registry'
import { guides } from './guides/registry'
import './docs.css'

/** Canonical family order, shared with the gallery's grouping. */
const FAMILY_ORDER: Family[] = [
  'InteractiveSurface',
  'ParticleField',
  'InstancedGrid',
  'FloatingObject',
  'ScrollScene',
  'PostFX',
]

/**
 * DocsLayout — the docs shell: top nav (shared across routes), a left sidebar
 * (guides + components grouped by family), and the routed page in the outlet.
 */
export function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const families = FAMILY_ORDER.filter((f) => registry.some((e) => e.family === f))
  const close = () => setNavOpen(false)

  return (
    <div className={'docs-shell' + (navOpen ? ' nav-open' : '')}>
      <header className="docs-topnav">
        <Link className="docs-brand" to="/" onClick={close}>
          <span className="logo">easy</span>
          <span className="tagline">-3dkit</span>
        </Link>
        <nav className="docs-topnav-links">
          <NavLink to="/docs" end>
            Docs
          </NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/showcase">Showcase</NavLink>
          <a
            href="https://github.com/Agrim-Sigdel/easy-3dkit"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <button
          className="docs-nav-toggle"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className={navOpen ? 'burger open' : 'burger'} />
        </button>
      </header>

      <div className="docs-body">
        {navOpen && <div className="docs-scrim" onClick={close} aria-hidden />}
        <aside className={navOpen ? 'docs-sidebar open' : 'docs-sidebar'}>
          <div className="docs-sidebar-section">
            <h3>Guides</h3>
            {guides.map((g) => (
              <NavLink
                key={g.slug}
                className="docs-link"
                to={`/docs/guides/${g.slug}`}
                onClick={close}
              >
                {g.title}
              </NavLink>
            ))}
          </div>

          <div className="docs-sidebar-section">
            <h3>Components</h3>
            {families.map((fam) => (
              <div key={fam} className="docs-fam">
                <h4>{fam}</h4>
                {registry
                  .filter((e) => e.family === fam)
                  .map((e) => (
                    <NavLink
                      key={e.id}
                      className="docs-link"
                      to={`/docs/${e.id}`}
                      onClick={close}
                    >
                      {e.name}
                    </NavLink>
                  ))}
              </div>
            ))}
          </div>
        </aside>

        <main className="docs-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
