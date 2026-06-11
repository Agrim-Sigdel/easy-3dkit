// One-off visual check of the /studio site: light (default) desktop pass over
// every section band, a dark-theme pass on key bands, and a mobile pass.
// Screenshots land in /tmp/studio-shots; console/page errors are reported.
import puppeteer from "puppeteer-core"
import { mkdirSync } from "node:fs"

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const URL = "http://localhost:5173/studio"
const OUT = "/tmp/studio-shots"
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader", "--no-sandbox"],
})
const page = await browser.newPage()

const errors = []
page.on("console", (m) => {
  const t = m.text()
  if (/error|fail|cannot read|undefined is not|WebGLProgram|compile|shader|glsl/i.test(t) && m.type() !== "warning") {
    errors.push(t)
  }
})
page.on("pageerror", (e) => errors.push(String(e)))

const bands = ["hero", "games", "universe", "tech", "careers", "footer"]

async function scrollToBand(band) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 10, behavior: "instant" })
  }, band)
  await new Promise((r) => setTimeout(r, 1800))
}

// Pass 1: desktop, light (default)
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 })
await new Promise((r) => setTimeout(r, 3000))
for (const band of bands) {
  await scrollToBand(band)
  await page.screenshot({ path: `${OUT}/light-${band}.png` })
  console.log(`shot: light-${band}`)
}

// Pass 2: desktop, dark (toggle), key bands
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
await page.click(".theme-toggle")
await new Promise((r) => setTimeout(r, 1500))
for (const band of ["hero", "games", "universe", "tech", "footer"]) {
  await scrollToBand(band)
  await page.screenshot({ path: `${OUT}/dark-${band}.png` })
  console.log(`shot: dark-${band}`)
}

// Pass 3: mobile (iPhone-ish), light
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 })
await new Promise((r) => setTimeout(r, 3000))
for (const band of ["hero", "games", "tech", "careers", "footer"]) {
  await scrollToBand(band)
  await page.screenshot({ path: `${OUT}/mobile-${band}.png` })
  console.log(`shot: mobile-${band}`)
}

console.log(errors.length ? `ERRORS (${errors.length}):` : "no console errors")
for (const e of [...new Set(errors)].slice(0, 10)) console.log("  -", e.slice(0, 200))

await browser.close()
