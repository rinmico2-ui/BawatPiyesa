import { chromium } from 'playwright'
import fs from 'node:fs'

fs.mkdirSync('shots', { recursive: true })
const BASE = process.env.BASE_URL ?? 'http://localhost:5174'
const browser = await chromium.launch({ channel: 'msedge' })

const errors = []
function watch(page, label) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${label} console] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[${label} pageerror] ${err.message}`))
}

async function enterWorld(page) {
  await page.getByRole('button', { name: /enter this little world/i }).click()
  await page.waitForTimeout(1700)
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
watch(page, 'desktop')
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(2600)
await page.screenshot({ path: 'shots/opening-desktop.png' })

await enterWorld(page)
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/world-bedroom.png' })

// dialogue
await page.locator('button[aria-label="look at the window"]').click()
await page.waitForTimeout(800)
await page.screenshot({ path: 'shots/dialogue.png' })
await page.keyboard.press('Escape')

// street
await page.keyboard.press('2')
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/world-street.png' })

// rooftop
await page.keyboard.press('3')
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/world-rooftop.png' })

// player
await page.keyboard.press('m')
await page.waitForFunction(() => !document.querySelector('.player-note')?.textContent?.includes('winding'), null, { timeout: 30000 }).catch(() => {})
await page.waitForTimeout(400)
await page.screenshot({ path: 'shots/player.png' })
await page.keyboard.press('Escape')

// gallery
await page.keyboard.press('4')
await page.waitForTimeout(700)
await page.screenshot({ path: 'shots/gallery.png' })

// memory modal
await page.locator('button[aria-label="open memory: An Ordinary Afternoon"]').click()
await page.waitForTimeout(600)
await page.screenshot({ path: 'shots/memory.png' })
await page.keyboard.press('Escape')
await page.keyboard.press('Escape')

// story
await page.keyboard.press('5')
await page.waitForTimeout(650)
await page.screenshot({ path: 'shots/story.png' })
await page.keyboard.press('Escape')

// secret: five moon clicks
await page.keyboard.press('3')
await page.waitForTimeout(650)
for (let i = 0; i < 5; i += 1) {
  await page.locator('button[aria-label="look at the moon"]').click()
  await page.waitForTimeout(360)
  if (i < 4) await page.keyboard.press('Escape')
  await page.waitForTimeout(180)
}
await page.waitForTimeout(700)
await page.screenshot({ path: 'shots/secret.png' })

// sixth memory
await page.locator('.secret-actions').getByRole('button', { name: 'open the scrapbook', exact: true }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: 'shots/gallery-unlocked.png' })
await page.locator('button[aria-label="open memory: What the Moon Knows"]').click()
await page.waitForTimeout(650)
await page.screenshot({ path: 'shots/memory-moon.png' })
await page.keyboard.press('Escape')
await page.keyboard.press('Escape')

// mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
watch(mobile, 'mobile')
await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(2600)
await mobile.screenshot({ path: 'shots/opening-mobile.png' })
await enterWorld(mobile)
await mobile.waitForTimeout(900)
await mobile.screenshot({ path: 'shots/world-bedroom-mobile.png' })
await mobile.locator('button[aria-label="open the cassette player"]').click()
await mobile.waitForFunction(() => !document.querySelector('.player-note')?.textContent?.includes('winding'), null, { timeout: 30000 }).catch(() => {})
await mobile.waitForTimeout(400)
await mobile.screenshot({ path: 'shots/player-mobile.png' })
await mobile.keyboard.press('Escape')
await mobile.waitForTimeout(300)
await mobile.locator('button[aria-label="open the scrapbook (press 4)"]').click()
await mobile.waitForTimeout(700)
await mobile.screenshot({ path: 'shots/gallery-mobile.png' })
await mobile.keyboard.press('Escape')
await mobile.waitForTimeout(300)
await mobile.locator('button[aria-label="go to the rooftop (press 3)"]').click()
await mobile.waitForTimeout(900)
await mobile.screenshot({ path: 'shots/world-rooftop-mobile.png' })

await browser.close()
if (errors.length) {
  console.log('ERRORS:')
  for (const error of errors) console.log(error)
} else {
  console.log('no console/page errors')
}
console.log('done')
