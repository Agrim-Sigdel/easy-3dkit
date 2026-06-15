import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'

export interface PostFXProps {
  /** Bloom glow strength. 0 disables bloom. */
  bloom?: number
  /** Bloom luminance threshold (lower = more things glow). */
  bloomThreshold?: number
  /** Vignette darkness at the edges. 0 disables. */
  vignette?: number
  /** Film-grain opacity. 0 disables. */
  noise?: number
}

/**
 * PostFX — a composable postprocessing stack.
 *
 * Drop it as the LAST child inside a <Stage> to grade the whole scene.
 * Each effect is conditionally mounted so a 0 prop removes it from the chain.
 *
 * Shipped from the `easy-3dkit/postprocessing` subpath, NOT the main entry,
 * because it depends on the optional `@react-three/postprocessing` peer. Keeping
 * it off the main barrel means consumers who never use post effects (and haven't
 * installed that peer) build cleanly — the peer is only pulled in when you import
 * this subpath.
 */
export function PostFX({ bloom = 1, bloomThreshold = 0.4, vignette = 0.5, noise = 0 }: PostFXProps) {
  return (
    <EffectComposer>
      <>
        {bloom > 0 ? (
          <Bloom intensity={bloom} luminanceThreshold={bloomThreshold} mipmapBlur />
        ) : (
          <></>
        )}
        {noise > 0 ? <Noise opacity={noise} /> : <></>}
        {vignette > 0 ? <Vignette darkness={vignette} eskil={false} /> : <></>}
      </>
    </EffectComposer>
  )
}
