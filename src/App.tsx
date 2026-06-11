import { useState } from 'react'
import { Leva, useControls } from 'leva'
import { OrbitControls } from '@react-three/drei'
import { Stage } from '@o3s/lib'
import { registry } from './gallery/registry'
import { levaTheme } from './gallery/levaTheme'

/**
 * Gallery shell (Layer 4) — glassmorphism.
 *
 * The <Stage> is full-bleed in the background; every panel (sidebar, header,
 * leva) floats on top as a frosted-glass surface that blurs the live 3D scene
 * behind it. That "blur what's behind" is what makes glassmorphism read as
 * glass rather than just a translucent box.
 */
export default function App() {
  const [activeId, setActiveId] = useState(registry[0].id)
  const active = registry.find((e) => e.id === activeId) ?? registry[0]

  // Drive the selected component's props from a live leva panel.
  // Keyed by id so switching components rebuilds the panel.
  const values = useControls(active.name, active.controls as never, [active.id])

  const categories = Array.from(new Set(registry.map((e) => e.category)))

  return (
    <div className="app">
      {/* Full-bleed live scene — the thing every glass panel blurs. */}
      <div className="stage-layer">
        <Stage background={null}>
          {active.render(values as Record<string, unknown>)}
          {!active.noOrbit && <OrbitControls makeDefault enableDamping />}
        </Stage>
      </div>

      {/* Ambient color wash behind the glass, for depth. */}
      <div className="ambient" aria-hidden />

      {/* Floating glass sidebar */}
      <aside className="sidebar glass">
        <div className="brand">
          <span className="logo">O3S</span>
          <span className="tagline">3d&#8202;kit</span>
        </div>

        <nav className="nav">
          {categories.map((cat) => (
            <div key={cat} className="cat">
              <h3>{cat}</h3>
              {registry
                .filter((e) => e.category === cat)
                .map((e) => (
                  <button
                    key={e.id}
                    className={e.id === activeId ? 'item active' : 'item'}
                    onClick={() => setActiveId(e.id)}
                  >
                    <span className="dot" />
                    {e.name}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        <footer>{registry.length} components</footer>
      </aside>

      {/* Floating glass header */}
      <header className="preview-header glass">
        <span className="chip">{active.category}</span>
        <h2>{active.name}</h2>
        <p>{active.description}</p>
      </header>

      {/* leva, themed to match the glass */}
      <Leva theme={levaTheme} titleBar={{ title: 'Controls' }} />
    </div>
  )
}
