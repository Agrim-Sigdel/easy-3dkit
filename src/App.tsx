import { useState } from 'react'
import { useControls } from 'leva'
import { OrbitControls } from '@react-three/drei'
import { Stage } from '@o3s/lib'
import { registry } from './gallery/registry'

/**
 * Gallery shell (Layer 4).
 *
 * Left: a categorized list of every registered component.
 * Right: a live <Stage> rendering the selected one, with a leva panel
 * (top-right) wired to that component's `controls` schema.
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
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">O3S</span>
          <span className="tagline">3d-kit</span>
        </div>
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
                  {e.name}
                </button>
              ))}
          </div>
        ))}
        <footer>{registry.length} components</footer>
      </aside>

      <main className="stage-wrap">
        <header className="preview-header">
          <h2>{active.name}</h2>
          <p>{active.description}</p>
        </header>
        <Stage>
          {active.render(values as Record<string, unknown>)}
          {!active.noOrbit && <OrbitControls makeDefault enableDamping />}
        </Stage>
      </main>
    </div>
  )
}
