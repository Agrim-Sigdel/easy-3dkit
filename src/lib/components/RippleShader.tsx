import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, Vector2 } from 'three'
import { useMouse } from '../hooks/useMouse'

export interface RippleShaderProps {
  /** Primary color of the ripple. */
  colorA?: string
  /** Secondary color of the ripple. */
  colorB?: string
  /** Ripple frequency (ring density). */
  frequency?: number
  /** Animation speed. */
  speed?: number
  /** Spotlight falloff radius (0..1.5). Larger = rings reach further. */
  falloff?: number
  /** Overall brightness multiplier. */
  intensity?: number
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
  uniform float uFalloff;
  uniform float uIntensity;
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
    col *= smoothstep(uFalloff, 0.0, d) * uIntensity;
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
  falloff = 0.9,
  intensity = 1,
}: RippleShaderProps) {
  const mouse = useMouse(0.08)

  // Create the uniforms object EXACTLY ONCE. Recreating it when props change
  // (e.g. via a useMemo on [frequency, colors]) hands the material a new object
  // mid-flight — three.js keeps the old one, useFrame mutates the new one, and
  // the shader either freezes or reads an undefined uniform and throws. So we
  // build it once and only ever mutate `.value` fields below.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: frequency },
      uFalloff: { value: falloff },
      uIntensity: { value: intensity },
      uMouse: { value: new Vector2(0, 0) },
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Push the live props into the stable uniform objects every frame. This is
  // what actually makes the leva controls update the shader without rebuilds.
  useFrame((_, delta) => {
    uniforms.uTime.value += delta * speed
    uniforms.uFrequency.value = frequency
    uniforms.uFalloff.value = falloff
    uniforms.uIntensity.value = intensity
    uniforms.uMouse.value.copy(mouse.current)
    uniforms.uColorA.value.set(colorA)
    uniforms.uColorB.value.set(colorB)
  })

  return (
    <mesh>
      <planeGeometry args={[10, 10, 1, 1]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={DoubleSide}
      />
    </mesh>
  )
}
