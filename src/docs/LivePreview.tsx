import { useEffect, useState } from 'react'
import { Leva, useControls } from 'leva'
import { Stage, CameraRig, DEFAULT_VIEW } from 'easy-3dkit'
import type { GalleryEntry } from '../gallery/registry'
import { levaTheme } from '../gallery/levaTheme'

/**
 * LivePreview — the editable example embedded in every docs component page.
 *
 * Reuses the gallery's own machinery so the docs and the gallery can never
 * drift: the entry's leva `controls` schema drives a live `<Stage>` scene via
 * `entry.render(values)`, exactly as the gallery does. The leva panel is
 * rendered inline (not leva's fixed corner) so it sits beside the canvas.
 *
 * `onValues` lifts the live values up so the surrounding doc page can feed them
 * into the same `generateCode` the gallery's "Copy code" uses — one snippet,
 * always matching what's on screen.
 */
export function LivePreview({
  entry,
  onValues,
}: {
  entry: GalleryEntry
  onValues?: (values: Record<string, unknown>) => void
}) {
  // Keyed by entry id (the parent remounts on route change) so the schema is
  // always the active effect's. leva's useControls returns a live values object.
  const [values] = useControls(entry.name, () => entry.controls as never)

  // Lift the live values to the surrounding page in an effect (never during
  // render). leva mutates `values` in place, so depend on its JSON shape.
  const serialized = JSON.stringify(values)
  useEffect(() => {
    onValues?.(values as Record<string, unknown>)
    // values is stable-by-reference from leva; serialized captures real changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized])

  return (
    <div className="docs-live">
      <div className="docs-live-stage">
        <Stage background={null}>
          {entry.render(values as Record<string, unknown>)}
          <CameraRig view={DEFAULT_VIEW} />
        </Stage>
      </div>
      <div className="docs-live-controls">
        <Leva theme={levaTheme} titleBar={{ title: 'Controls' }} fill />
      </div>
    </div>
  )
}

/**
 * Client-only guard so a docs page embedding a `<Stage>` doesn't try to mount
 * the canvas during a non-browser render. Mirrors the SSR pattern the library
 * documents for consumers (see the Next.js / SSR guide).
 */
export function useIsClient() {
  const [client, setClient] = useState(false)
  useEffect(() => setClient(true), [])
  return client
}
