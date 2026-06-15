import { Link } from 'react-router-dom'
import { Code } from './Code'

export function InstallGuide() {
  return (
    <article className="docs-prose">
      <h1>Install</h1>
      <p>
        Install easy-3dkit and its 3D stack. The stack is declared as{' '}
        <strong>peer dependencies</strong> so your app keeps a single copy of each — this
        avoids the classic <em>"multiple instances of three"</em> error.
      </p>

      <Code>{`npm install easy-3dkit
npm install three @react-three/fiber @react-three/drei gsap
# optional, only if you use <PostFX>:
npm install @react-three/postprocessing`}</Code>

      <p>Requires React 18+.</p>

      <h2>Verify it works</h2>
      <p>Drop a transparent hero anywhere and you should see a glass surface render:</p>

      <Code>{`import { Stage, InteractiveSurface, glassmorphism } from 'easy-3dkit'

export function Hero() {
  return (
    <Stage background={null}>
      <InteractiveSurface material={glassmorphism} />
    </Stage>
  )
}`}</Code>

      <p>
        Next: <Link to="/docs/guides/first-hero">build your first hero</Link>.
      </p>
    </article>
  )
}
