// WebGL-OFF smoke test (M0 acceptance gate).
//
// Launches Chrome with WebGL forced unavailable and visits every route. Asserts
// that each route still renders DOM — visible heading text and navigation — and
// the page is NOT blank. Before the Stage error-boundary/fallback work, every
// route rendered zero DOM nodes under #root when WebGL failed; this test locks
// in that it can never regress.
//
// Run against a running dev/preview server: `node scripts/smoke-nogl.mjs`
// (defaults to http://localhost:5173).
import puppeteer from "puppeteer-core"

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const BASE = process.env.SMOKE_URL || "http://localhost:5173"

// Routes and the selector that must show visible text on each. The gallery
// renders its UI (sidebar, dock) outside the canvas, so it has no <h1> — assert
// its brand mark and effect rail instead.
const ROUTES = [
  { path: "/", text: "h1" },
  { path: "/showcase", text: "h1" },
  { path: "/studio", text: "h1" },
  { path: "/gallery", text: ".brand" },
]

// Force WebGL off: no GPU, no swiftshader fallback, blocklist honored. This is
// the closest headless approximation of a visitor whose browser cannot create a
// WebGL context.
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis", "--no-sandbox"],
})

let failures = 0

function fail(msg) {
  failures++
  console.log("  FAIL:", msg)
}

for (const route of ROUTES) {
  const url = BASE + route.path
  console.log(`\n${route.path}`)
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 })
    await new Promise((r) => setTimeout(r, 1200))

    // 1. The page is not blank: #root has rendered children.
    const rootChildren = await page.$eval("#root", (el) => el.childElementCount).catch(() => 0)
    if (rootChildren > 0) console.log(`  ok: #root has ${rootChildren} children`)
    else fail(`#root rendered ${rootChildren} children (blank page)`)

    // 2. Heading / brand text is present and visible.
    const headingVisible = await page
      .$eval(route.text, (el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && (el.textContent || "").trim().length > 0
      })
      .catch(() => false)
    if (headingVisible) console.log(`  ok: ${route.text} visible with text`)
    else fail(`${route.text} missing or not visible`)

    // 3. Navigation is present (links to other routes).
    const navLinks = await page.$$eval("a[href]", (els) => els.length).catch(() => 0)
    if (navLinks > 0) console.log(`  ok: ${navLinks} nav links`)
    else fail("no navigation links rendered")
  } catch (e) {
    fail(`navigation/render error: ${String(e).slice(0, 160)}`)
  } finally {
    await page.close()
  }
}

await browser.close()

console.log(failures === 0 ? "\nPASS: no blank pages with WebGL off" : `\nFAILED: ${failures} assertion(s)`)
process.exit(failures === 0 ? 0 : 1)
