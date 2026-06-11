import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial, Vector2 } from 'three'
import { useMouse } from '../hooks/useMouse'

export interface RippleShaderProps {
  /** Primary color of the ripple. */
  colorA?: string
  /** Secondary color of the ripple. */
  colorB?: string
  /** Ripple frequency. */
  frequency?: number
  /** Animation speed. */
  speed?: number
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uFrequency;
  uniform vec2  uMouse;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec2  vUv;

  void main() {
    // Distance from the (normalized) mouse position drives concentric rings.
    vec2 m = uMouse * 0.5 + 0.5;
    float d = distance(vUv, m);
    float ring = sin(d * uFrequency - uTime) * 0.5 + 0.5;
    vec3 col = mix(uColorA, uColorB, ring);
    // Fade rings out with distance for a spotlight feel.
    col *= smoothstep(0.9, 0.0, d);
    gl_FragColor = vec4(col, 1.0);
  }
`

/**
 * RippleShader — a full-bleed plane that ripples outward from the cursor.
 *
 * Demonstrates the custom-shader-material primitive. Great as a website hero.
 */
export function RippleShader({
  colorA = '#0a0a2a',
  colorB = '#4fc3ff',
  frequency = 40,
  speed = 2,
}: RippleShaderProps) {
  const matRef = useRef<ShaderMaterial>(null)
  const mouse = useMouse(0.08)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: frequency },
      uMouse: { value: new Vector2(0, 0) },
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
    }),
    // Recreate only when colors/frequency change; uTime/uMouse mutate in-place.
    [colorA, colorB, frequency],
  )

  useFrame((state, delta) => {
    if (!matRef.current) return
    uniforms.uTime.value += delta * speed
    uniforms.uMouse.value.copy(mouse.current)
    void state
  })

  return (
    <mesh>
      <planeGeometry args={[10, 10, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}
