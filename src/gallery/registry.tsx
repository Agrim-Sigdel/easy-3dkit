import { type ReactNode } from 'react'
import { OrbitControls } from '@react-three/drei'
import {
  ParticleField,
  RippleShader,
  FloatingObject,
  ScrollScene,
  PostFX,
} from '@o3s/lib'

/**
 * The gallery registry (Layer 4).
 *
 * Each entry = one card in the sidebar + one live preview. To add a new
 * component to the gallery, append one object here. `controls` is a leva
 * schema object; the live values are passed back into `render(values)`.
 *
 * Keeping this as plain data (not scattered route files) is what makes the
 * gallery scale to dozens of components without ceremony.
 */
export interface GalleryEntry {
  id: string
  name: string
  category: 'effects' | 'objects' | 'website' | 'postprocessing'
  description: string
  /** leva schema — see https://github.com/pmndrs/leva */
  controls: Record<string, unknown>
  /** Render the component given the live control values. */
  render: (v: Record<string, unknown>) => ReactNode
  /** Optional: hide default OrbitControls (e.g. for flat shader planes). */
  noOrbit?: boolean
}

export const registry: GalleryEntry[] = [
  {
    id: 'particle-field',
    name: 'Particle Field',
    category: 'effects',
    description: 'A swirling GPU point cloud. Ambient atmosphere for any scene.',
    controls: {
      count: { value: 4000, min: 200, max: 20000, step: 200 },
      radius: { value: 4, min: 1, max: 10, step: 0.5 },
      color: '#5fa8ff',
      size: { value: 0.04, min: 0.01, max: 0.2, step: 0.01 },
      speed: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
    },
    render: (v) => <ParticleField {...(v as any)} />,
  },
  {
    id: 'ripple-shader',
    name: 'Ripple Shader',
    category: 'effects',
    description: 'A cursor-reactive GLSL plane. Great as a website hero backdrop.',
    noOrbit: true,
    controls: {
      colorA: '#0a0a2a',
      colorB: '#4fc3ff',
      frequency: { value: 40, min: 5, max: 100, step: 1 },
      speed: { value: 2, min: 0, max: 8, step: 0.1 },
    },
    render: (v) => <RippleShader {...(v as any)} />,
  },
  {
    id: 'floating-object',
    name: 'Floating Object',
    category: 'objects',
    description: 'Idle float + spin with a hover pop. Wrap any model or mesh.',
    controls: {
      amplitude: { value: 0.3, min: 0, max: 1, step: 0.05 },
      speed: { value: 1, min: 0, max: 4, step: 0.1 },
      hoverScale: { value: 1.15, min: 1, max: 2, step: 0.05 },
      color: '#ff7a59',
    },
    render: (v) => <FloatingObject {...(v as any)} />,
  },
  {
    id: 'scroll-scene',
    name: 'Scroll Scene',
    category: 'website',
    description:
      'Binds page scroll to a 3D transform. (Scroll the page to see it drive.)',
    controls: {
      rotations: { value: 1, min: 0, max: 4, step: 0.25 },
      zTravel: { value: 4, min: 0, max: 10, step: 0.5 },
    },
    render: (v) => (
      <ScrollScene {...(v as any)}>
        <FloatingObject />
      </ScrollScene>
    ),
  },
  {
    id: 'postfx',
    name: 'Post FX',
    category: 'postprocessing',
    description: 'Composable bloom / vignette / grain. Add as the last Stage child.',
    controls: {
      bloom: { value: 1.2, min: 0, max: 3, step: 0.1 },
      bloomThreshold: { value: 0.4, min: 0, max: 1, step: 0.05 },
      vignette: { value: 0.5, min: 0, max: 1.5, step: 0.05 },
      noise: { value: 0, min: 0, max: 0.5, step: 0.02 },
    },
    render: (v) => (
      <>
        <FloatingObject color="#88ddff" />
        <ParticleField count={1500} radius={5} />
        <PostFX {...(v as any)} />
      </>
    ),
  },
]

export { OrbitControls }
