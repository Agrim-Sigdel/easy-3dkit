import { useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { registry } from '../gallery/registry'
import { buildEffectDoc } from '../gallery/docsModel'
import { generateCode } from '../gallery/codegen'
import { LivePreview, useIsClient } from './LivePreview'
import { stackblitzUrl } from './stackblitz'

/**
 * ComponentDocPage — per-effect reference (route /docs/:id).
 *
 * Built entirely from the shared sources of truth: `buildEffectDoc` (prop table
 * from the same flattenSchema EFFECTS.md uses), `LivePreview` (the gallery's own
 * leva-driven render), and `generateCode` (the gallery's "Copy code"). The
 * snippet shown always matches what's on the canvas.
 */
export function ComponentDocPage() {
  const { id } = useParams<{ id: string }>()
  const entry = registry.find((e) => e.id === id)

  // Live values lifted from the embedded preview so the snippet tracks the canvas.
  const [values, setValues] = useState<Record<string, unknown> | null>(null)
  const doc = useMemo(() => (entry ? buildEffectDoc(entry) : null), [entry])
  const client = useIsClient()

  const [copied, setCopied] = useState(false)
  if (!entry || !doc) return <Navigate to="/docs" replace />

  const code = generateCode(entry, values ?? {}, {})
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      console.log(code)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const fmt = (v: unknown) => (Array.isArray(v) ? `[${v.join(', ')}]` : String(v))

  return (
    <article className="docs-prose docs-component">
      <header className="docs-component-head">
        <span className="chip">{doc.family}</span>
        <h1>{doc.name}</h1>
        <p className="docs-desc">{doc.description}</p>
        {doc.notes && <p className="docs-notes">{doc.notes}</p>}
        <a
          className="docs-stackblitz"
          href={stackblitzUrl(entry.id)}
          target="_blank"
          rel="noreferrer"
        >
          Open in StackBlitz
        </a>
      </header>

      <h2>Live example</h2>
      {client ? (
        <LivePreview key={entry.id} entry={entry} onValues={setValues} />
      ) : (
        <div className="docs-live-placeholder">Loading interactive preview…</div>
      )}

      <div className="docs-usage-head">
        <h2>Usage</h2>
        <button className="copy-config" onClick={copy}>
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="docs-code">
        <code>{code}</code>
      </pre>

      <h2>Props</h2>
      <table className="docs-props">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Range</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {doc.props.map((p) => (
            <tr key={p.key}>
              <td>
                <code>{p.key}</code>
              </td>
              <td>{p.type}</td>
              <td>
                <code>{fmt(p.default)}</code>
              </td>
              <td>
                {p.type === 'select'
                  ? (p.options ?? []).map(String).join(' | ')
                  : p.min !== undefined
                    ? `${p.min} to ${p.max}`
                    : ''}
              </td>
              <td>{p.description ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}
