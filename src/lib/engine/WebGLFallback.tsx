import { type CSSProperties } from 'react'

export interface WebGLFallbackProps {
  /** Short headline shown to the visitor. */
  message?: string
  /** Quieter explanatory line under the headline. Pass null to hide it. */
  detail?: string | null
  /** Background color of the placeholder. Matches Stage's default dark bg. */
  background?: string | null
}

/**
 * Estimate whether a CSS color is light, so the fallback text can flip to a
 * legible contrast in both light and dark themes. Handles #rgb / #rrggbb hex and
 * rgb()/rgba(); anything it can't parse (named colors, hsl, transparent) is
 * treated as dark, which matches Stage's dark default and a transparent stage
 * over a typically-dark page. Best-effort by design — the fallback only needs to
 * stay readable, not color-match exactly.
 */
function isLightBackground(background: string | null): boolean {
  if (!background) return false
  let r: number, g: number, b: number

  const hex = background.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    r = parseInt(h.slice(0, 2), 16)
    g = parseInt(h.slice(2, 4), 16)
    b = parseInt(h.slice(4, 6), 16)
  } else {
    const rgb = background.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
    if (!rgb) return false
    r = +rgb[1]
    g = +rgb[2]
    b = +rgb[3]
  }

  // Perceived luminance (Rec. 601). >0.6 reads as a light surface.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6
}

/**
 * The default placeholder rendered by <Stage> when WebGL is unavailable or the
 * 3D subtree throws. It fills its container, is screen-reader announced, and
 * uses only inline styles so it needs no CSS from the consumer.
 *
 * Consumers who want something on-brand pass their own node to <Stage fallback>;
 * this exists so the out-of-the-box behavior is a graceful, legible panel rather
 * than a blank rectangle.
 */
export function WebGLFallback({
  message = '3D preview unavailable',
  detail = "This scene needs WebGL, which isn't available in your browser right now. The rest of the page works as usual.",
  background = '#0a0a0f',
}: WebGLFallbackProps) {
  // A transparent stage sits over the PAGE background, which we can't see and
  // which may itself be light or dark (the routes have theme toggles). So when
  // background is null, give the text a neutral self-contained chip that reads
  // on either, and keep its ink light (chip is dark-tinted). For a solid stage
  // background we know the surface, so adapt the ink to it and skip the chip.
  const transparent = background === null
  const light = isLightBackground(background)
  const headingColor = transparent || !light ? 'rgba(232, 235, 242, 0.92)' : 'rgba(20, 22, 28, 0.9)'
  const bodyColor = transparent || !light ? 'rgba(232, 235, 242, 0.74)' : 'rgba(20, 22, 28, 0.62)'

  const wrapper: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    textAlign: 'center',
    background: background ?? 'transparent',
    color: bodyColor,
    font: '500 0.95rem/1.4 system-ui, -apple-system, Segoe UI, sans-serif',
  }

  const panel: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    maxWidth: '26rem',
    padding: transparent ? '1rem 1.25rem' : 0,
    borderRadius: transparent ? '0.75rem' : 0,
    // The chip only shows for transparent stages, where it guarantees legibility
    // over an unknown page background in either theme.
    background: transparent ? 'rgba(10, 11, 16, 0.55)' : 'transparent',
    border: transparent ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    backdropFilter: transparent ? 'blur(6px)' : undefined,
  }

  // The headline labels the region for assistive tech; the detail line is
  // supplementary, so it's announced as description rather than repeated.
  return (
    <div role="img" aria-label={message} style={wrapper}>
      <div style={panel}>
        <span style={{ fontWeight: 600, color: headingColor }}>{message}</span>
        {detail && (
          <span style={{ fontSize: '0.85rem', color: bodyColor, opacity: 0.92 }}>{detail}</span>
        )}
      </div>
    </div>
  )
}
