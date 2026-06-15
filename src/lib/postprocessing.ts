/**
 * easy-3dkit/postprocessing — opt-in postprocessing entry.
 *
 * Lives on a SEPARATE subpath from the main package so the main entry never
 * references `@react-three/postprocessing` (an optional peer). Consumers who use
 * post effects import from here and install that peer:
 *
 *   import { PostFX } from 'easy-3dkit/postprocessing'
 *
 * Everyone else imports from 'easy-3dkit' and pays nothing for postprocessing.
 */
export { PostFX } from './components/PostFX'
export type { PostFXProps } from './components/PostFX'
