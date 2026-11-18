import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5174'
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (err) => errors.push(err.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

const label = () =>
  page.evaluate(() => {
    const el = document.activeElement
    if (!el) return 'none'
    return el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 40) || el.tagName
  })

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('button', { name: /enter this little world/i }).click()
await page.waitForTimeout(1700)

// audio should start from a gesture, advance, then pause
await page.keyboard.press('m')
await page.waitForTimeout(450)
await page.getByRole('button', { name: 'play the lullaby' }).click()
await page.waitForTimeout(1300)
const timeAfterPlay = await page.locator('.progress-times span').first().textContent()
await page.getByRole('button', { name: 'pause the lullaby' }).click()
console.log('audio position after 1.3s play:', timeAfterPlay)

// focus lands in the player
console.log('focus on open:', await label())
const tabs = []
for (let i = 0; i < 12; i += 1) {
  await page.keyboard.press('Tab')
  tabs.push(await label())
}
console.log('tab loop:', tabs.join(' > '))

// reverse wrap
await page.locator('.player-close').focus()
await page.keyboard.press('Shift+Tab')
console.log('shift-tab from close:', await label())

// Escape closes even while a range input owns focus
await page.locator('input[aria-label="volume"]').focus()
await page.keyboard.press('Escape')
await page.waitForTimeout(700)
console.log('escape from range closes player:', (await page.locator('.player').count()) === 0)
console.log('focus after player closes:', await label())

// keyboard activation of a hotspot opens its dialogue
await page.locator('button[aria-label="look at the window"]').focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(500)
console.log('dialogue open from keyboard:', (await page.locator('.dialogue-box').count()) === 1)
console.log('focus in dialogue:', await label())
await page.keyboard.press('Escape')
await page.waitForTimeout(700)
console.log('dialogue closed by escape:', (await page.locator('.dialogue-box').count()) === 0)
console.log('focus returned to hotspot:', await label())

// gallery trap
await page.keyboard.press('4')
await page.waitForTimeout(500)
console.log('gallery focus:', await label())
for (let i = 0; i < 8; i += 1) await page.keyboard.press('Tab')
console.log('focus after 8 tabs in gallery:', await label())
await page.keyboard.press('Escape')
await page.waitForTimeout(300)

// layout audit: mobile memory sheet + player + no horizontal overflow
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
mobile.on('pageerror', (err) => errors.push(`mobile: ${err.message}`))
await mobile.goto(BASE, { waitUntil: 'networkidle' })
await mobile.evaluate(() => localStorage.clear())
await mobile.reload({ waitUntil: 'networkidle' })
await mobile.getByRole('button', { name: /enter this little world/i }).click()
await mobile.waitForTimeout(1500)
await mobile.locator('button[aria-label="open the scrapbook (press 4)"]').click()
await mobile.waitForTimeout(650)
await mobile.locator('button[aria-label="open memory: The First Hello"]').click()
await mobile.waitForTimeout(600)
await mobile.screenshot({ path: 'shots/memory-mobile.png' })
console.log(
  'mobile memory overflow:',
  await mobile.evaluate(() => {
    const close = document.querySelector('.memory-close')?.getBoundingClientRect()
    return {
      scrollW: document.documentElement.scrollWidth,
      viewportW: window.innerWidth,
      sheetVisible: !!document.querySelector('.memory-sheet'),
      closeRect: close ? { x: Math.round(close.x), y: Math.round(close.y), w: Math.round(close.width) } : null,
      mobileNav: !!document.querySelector('.memory-mobile-nav'),
    }
  }),
)
await mobile.getByRole('button', { name: 'next memory', exact: true }).last().click()
await mobile.waitForTimeout(500)
await mobile.screenshot({ path: 'shots/memory-mobile-next.png' })
await mobile.keyboard.press('Escape')
await mobile.keyboard.press('Escape')
await mobile.waitForTimeout(400)
await mobile.keyboard.press('m')
await mobile.waitForTimeout(2000)
console.log(
  'mobile player overflow:',
  await mobile.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    viewportW: window.innerWidth,
  })),
)
await mobile.screenshot({ path: 'shots/player-mobile-qa.png' })

// narrow phone
await mobile.setViewportSize({ width: 320, height: 568 })
await mobile.waitForTimeout(500)
await mobile.screenshot({ path: 'shots/player-mobile-small.png' })
console.log(
  'small phone overflow:',
  await mobile.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    viewportW: window.innerWidth,
  })),
)

await browser.close()
if (errors.length) {
  console.log('ERRORS:')
  errors.forEach((error) => console.log(error))
} else {
  console.log('no console/page errors')
}
