/**
 * StackBlitz links.
 *
 * The canonical zero-install example is the starter template shipped in the
 * repo (templates/starter). StackBlitz can open any public GitHub project
 * directly via stackblitz.com/github/<owner>/<repo>/tree/<branch>/<path>.
 *
 * We pass the chosen effect id as a query param so a future starter can preselect
 * it; today it harmlessly opens the canonical hero. Keeping the URL in one place
 * means the README, the docs home, and every component page stay in sync.
 */
const GH = 'Agrim-Sigdel/easy-3dkit'
const BRANCH = 'main'
const STARTER_PATH = 'templates/starter'

export function stackblitzUrl(effectId?: string): string {
  const base = `https://stackblitz.com/github/${GH}/tree/${BRANCH}/${STARTER_PATH}`
  return effectId ? `${base}?effect=${encodeURIComponent(effectId)}` : base
}
