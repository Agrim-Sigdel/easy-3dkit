/**
 * leva theme tuned to match the glassmorphism shell.
 *
 * leva renders its own DOM (not inside our panels), so we can't backdrop-blur
 * the scene through it the same way — but we match colors, radii, and the
 * translucent surface so it reads as part of the same glass system.
 *
 * (leva doesn't re-export its theme type from the package root, so we let the
 * <Leva theme={...}> prop type-check this object structurally at the use site.)
 */
export const levaTheme = {
  colors: {
    elevation1: 'rgba(20, 22, 34, 0.6)', // panel background
    elevation2: 'rgba(255, 255, 255, 0.06)', // input/row background
    elevation3: 'rgba(255, 255, 255, 0.10)', // hovered / track
    accent1: '#3a6ea5',
    accent2: '#5fa8ff',
    accent3: '#8cc6ff',
    highlight1: '#8b8b9c',
    highlight2: '#e6e6ef',
    highlight3: '#ffffff',
    vivid1: '#5fa8ff',
  },
  radii: {
    xs: '4px',
    sm: '8px',
    lg: '12px',
  },
  space: {
    sm: '8px',
    md: '12px',
    rowGap: '8px',
    colGap: '8px',
  },
  fontSizes: {
    root: '12px',
  },
  sizes: {
    rootWidth: '300px',
    controlWidth: '150px',
  },
  fonts: {
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  },
}
