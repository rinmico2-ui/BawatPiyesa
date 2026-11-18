import {
  type Ctx,
  PAL,
  rect,
  vgrad,
  disc,
  glow,
  mulberry32,
  drawSprite,
  groundShadow,
  heart,
  heartBurst,
  sparkle,
  stars,
  bird,
  city,
} from '../pixel'
import { A_SEATED_BACK, B_SEATED_BACK } from '../sprites'
import { type Hotspot, type Rect, type SceneDef, type SceneFx, toHotspot } from './types'
import { stringLights, shootingStar, pottedPlant, fireflies } from './kit'

type RooftopLayout = {
  portrait: boolean
  roofLine: number
  floorY: number
  moon: { cx: number; cy: number; r: number }
  aX: number
  aFeet: number
  aScale: number
  bX: number
  bFeet: number
  bScale: number
  heartX: number
  heartY: number
  wishX: number
  wishY: number
  aRect: Rect
  bRect: Rect
  moonRect: Rect
  heartRect: Rect
  wishRect: Rect
}

export function rooftopLayout(w: number, h: number): RooftopLayout {
  const portrait = w / h < 0.8
  if (portrait) {
    const feet = h * 0.742
    const s = (h * 0.112) / 17
    const aX = w * 0.355
    const bX = w * 0.49
    const charW = 14 * s
    const charH = 17 * s
    const moon = { cx: w * 0.68, cy: h * 0.15, r: Math.max(12, h * 0.058) }
    const heartX = w * 0.43
    const heartY = feet - charH - h * 0.012
    return {
      portrait,
      roofLine: h * 0.705,
      floorY: feet,
      moon,
      aX,
      aFeet: feet,
      aScale: s,
      bX,
      bFeet: feet + 1,
      bScale: s,
      heartX,
      heartY,
      wishX: w * 0.18,
      wishY: h * 0.29,
      aRect: { x: aX - charW * 0.3, y: feet - charH, w: charW * 0.9, h: charH },
      bRect: { x: bX - charW * 0.3, y: feet - charH, w: charW * 0.9, h: charH },
      moonRect: {
        x: moon.cx - moon.r - 6,
        y: moon.cy - moon.r - 6,
        w: moon.r * 2 + 12,
        h: moon.r * 2 + 12,
      },
      heartRect: { x: heartX - 10, y: heartY - 8, w: 24, h: 22 },
      wishRect: { x: w * 0.12, y: h * 0.22, w: w * 0.17, h: h * 0.1 },
    }
  }

  const feet = h * 0.716
  const s = (h * 0.195) / 17
  const aX = w * 0.43
  const bX = w * 0.522
  const charW = 14 * s
  const charH = 17 * s
  const moon = { cx: w * 0.79, cy: h * 0.175, r: Math.max(10, h * 0.088) }
  const heartX = w * 0.476
  const heartY = feet - charH - h * 0.01
  return {
    portrait,
    roofLine: h * 0.678,
    floorY: feet,
    moon,
    aX,
    aFeet: feet,
    aScale: s,
    bX,
    bFeet: feet + 1,
    bScale: s,
    heartX,
    heartY,
    wishX: w * 0.155,
    wishY: h * 0.235,
    aRect: { x: aX - charW * 0.3, y: feet - charH, w: charW * 0.9, h: charH },
    bRect: { x: bX - charW * 0.3, y: feet - charH, w: charW * 0.9, h: charH },
    moonRect: {
      x: moon.cx - moon.r - 6,
      y: moon.cy - moon.r - 6,
      w: moon.r * 2 + 12,
      h: moon.r * 2 + 12,
    },
    heartRect: { x: heartX - 10, y: heartY - 8, w: 24, h: 22 },
    wishRect: { x: w * 0.1, y: h * 0.17, w: w * 0.15, h: h * 0.11 },
  }
}

function nightSky(ctx: Ctx, w: number, h: number, horizon: number, t: number) {
  vgrad(ctx, 0, 0, w, horizon + 6, [
    [0, '#0e0c22'],
    [0.24, '#17132f'],
    [0.46, '#261d40'],
    [0.66, '#3b2a4f'],
    [0.82, '#5b3b58'],
    [0.94, '#7c5060'],
    [1, '#9d6368'],
  ], 32)

  // milky wash
  const rnd = mulberry32(211)
  for (let i = 0; i < 140; i++) {
    const u = rnd()
    const spread = (rnd() - 0.5) * h * 0.18
    const x = w * (0.04 + u * 0.82) + spread * 0.4
    const y = h * (0.04 + u * 0.55) + spread
    ctx.globalAlpha = 0.05 + rnd() * 0.16
    rect(ctx, x, y, rnd() > 0.8 ? 2 : 1, 1, rnd() > 0.5 ? '#d8c8ea' : '#f4d6c4')
  }
  ctx.globalAlpha = 1

  // stars
  stars(ctx, w, horizon * 0.86, 41, Math.floor(w * 0.42), PAL.cream, horizon * 0.8)
  const tw = mulberry32(52)
  for (let i = 0; i < 18; i++) {
    const x = tw() * w
    const y = tw() * horizon * 0.7
    const a = 0.25 + 0.7 * Math.abs(Math.sin(t * 0.9 + i * 1.9))
    ctx.globalAlpha = a
    if (i % 4 === 0) {
      sparkle(ctx, x, y, '#fff1d0', 1)
    } else {
      rect(ctx, x, y, 1, 1, i % 3 ? '#f4e0c8' : '#d9c8ef')
    }
  }
  ctx.globalAlpha = 1

  // a low, soft cloud drifting near the horizon
  const cloudX = ((t * 1.1) % (w + 100)) - 50
  ctx.globalAlpha = 0.18
  for (let i = 0; i < 4; i++) {
    disc(ctx, cloudX + i * 16, horizon - h * 0.06 + Math.sin(i) * 2, 5 + i, '#b57d8d')
  }
  ctx.globalAlpha = 1
}

function moon(ctx: Ctx, x: number, y: number, r: number, t: number) {
  glow(ctx, x, y, r * 7, '#ffeac2', 0.18)
  glow(ctx, x, y, r * 2.6, '#ffdfae', 0.35)
  disc(ctx, x, y, r, '#f6e4bd', '#e6cfa7')
  disc(ctx, x - r * 0.24, y - r * 0.26, r * 0.66, '#fff2d4')
  // craters
  const rnd = mulberry32(99)
  for (let i = 0; i < 7; i++) {
    const a = rnd() * 6.28
    const d = rnd() * r * 0.62
    const cr = Math.max(1, r * (0.06 + rnd() * 0.09))
    ctx.globalAlpha = 0.18 + rnd() * 0.16
    disc(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, cr, '#b79d85')
    ctx.globalAlpha = 1
  }
  // slow passing strength
  ctx.globalAlpha = 0.5 + 0.2 * Math.sin(t * 0.5)
  disc(ctx, x - r * 0.38, y - r * 0.42, r * 0.16, '#dfc8a5')
  ctx.globalAlpha = 1
}

function moonRings(ctx: Ctx, x: number, y: number, r: number, count: number, t: number) {
  if (!count) return
  for (let ring = 0; ring < Math.min(5, count); ring++) {
    const rr = r * (1.45 + ring * 0.33)
    const alpha = 0.13 + 0.04 * ring
    ctx.globalAlpha = alpha * (0.75 + 0.25 * Math.sin(t * 1.5 + ring))
    const dots = 26 + ring * 6
    for (let i = 0; i < dots; i++) {
      if ((i + ring) % 3 === 0) continue
      const a = (i / dots) * Math.PI * 2 + ring * 0.3
      rect(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr, 1, 1, '#ffe8bc')
    }
    ctx.globalAlpha = 1
  }
}

function skyline(ctx: Ctx, w: number, h: number, roofLine: number, t: number) {
  // warm city haze
  glow(ctx, w * 0.52, roofLine, w * 0.5, '#ff9e72', 0.14)
  city(ctx, w * 0.02, roofLine + 2, w * 0.98, h * 0.26, 31, '#1c152c', '#f3b87f')
  city(ctx, w * 0.0, roofLine + 4, w * 1.0, h * 0.16, 83, '#151024', '#ffd29a')
  // a couple of tiny signals
  rect(ctx, w * 0.91, roofLine - h * 0.22, 1, h * 0.22, '#171126')
  rect(ctx, w * 0.905, roofLine - h * 0.19, 6, 1, '#171126')
  ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.4))
  rect(ctx, w * 0.91, roofLine - h * 0.225, 1, 1, '#ff9278')
  ctx.globalAlpha = 1
  // distant birds, still awake
  bird(ctx, w * 0.68, h * 0.36, '#2a2040', Math.floor(t * 2) % 2)
  bird(ctx, w * 0.72, h * 0.34, '#2a2040', Math.floor(t * 2 + 1) % 2)
}

function parapet(ctx: Ctx, w: number, h: number, roofLine: number) {
  // the low roof wall the two of them sit on
  rect(ctx, 0, roofLine, w, h - roofLine, '#21182d')
  rect(ctx, 0, roofLine, w, 2, '#4e384e')
  rect(ctx, 0, roofLine + 2, w, 1, '#33233c')
  // brick courses
  const rnd = mulberry32(38)
  for (let y = roofLine + 5; y < roofLine + h * 0.035; y += 5) {
    rect(ctx, 0, y, w, 1, 'rgba(14,10,24,0.4)')
    for (let x = (rnd() > 0.5 ? 3 : 9); x < w; x += 13) {
      ctx.globalAlpha = 0.28
      rect(ctx, x, y - 4, 1, 4, '#120d20')
      ctx.globalAlpha = 1
    }
  }
  // cap stones
  rect(ctx, 0, roofLine - 2, w, 2, '#5d4351')
}

function rooftopFloor(ctx: Ctx, w: number, h: number, floorY: number, t: number) {
  vgrad(ctx, 0, floorY, w, h - floorY, [
    [0, '#31243a'],
    [0.4, '#281d32'],
    [1, '#1b1426'],
  ], 16)
  // roof tiles
  for (let y = floorY + 4; y < h; y += 7) {
    rect(ctx, 0, y, w, 1, 'rgba(12,9,20,0.5)')
    for (let x = ((y / 7) % 2) * 8; x < w; x += 16) {
      rect(ctx, x, y - 3, 1, 3, 'rgba(12,9,20,0.35)')
    }
  }
  // a warm puddle of lantern light
  glow(ctx, w * 0.33, floorY + h * 0.06, w * 0.3, '#ffc98c', 0.13)
  // stray leaves
  const rnd = mulberry32(74)
  for (let i = 0; i < 6; i++) {
    const x = rnd() * w
    const y = floorY + 6 + rnd() * (h - floorY - 10)
    ctx.globalAlpha = 0.35
    rect(ctx, x, y, 2, 1, '#8a5c5c')
    ctx.globalAlpha = 1
  }
  void t
}

function blanket(ctx: Ctx, w: number, h: number, floorY: number) {
  const x = w * 0.325
  const y = floorY + h * 0.012
  const bw = w * 0.33
  const bh = h * 0.105
  rect(ctx, x, y, bw, bh, '#6f4a63')
  rect(ctx, x + 1, y + 1, bw - 2, bh - 2, '#8b6073')
  // checks
  ctx.globalAlpha = 0.4
  for (let cx = 0; cx < bw; cx += 9) rect(ctx, x + cx, y, 1, bh, '#53384f')
  for (let cy = 0; cy < bh; cy += 8) rect(ctx, x, y + cy, bw, 1, '#53384f')
  ctx.globalAlpha = 1
  // fringe
  for (let cx = 0; cx < bw; cx += 4) rect(ctx, x + cx, y + bh, 1, 2, '#5c3d54')
}

function lantern(ctx: Ctx, x: number, y: number, t: number) {
  glow(ctx, x, y - 2, 24, '#ffcb8c', 0.4)
  rect(ctx, x - 5, y - 9, 10, 10, '#3b293e')
  rect(ctx, x - 4, y - 8, 8, 8, '#ffd392')
  rect(ctx, x - 3, y - 6, 6, 5, '#fff0c3')
  rect(ctx, x - 5, y - 10, 10, 1, '#241a2e')
  rect(ctx, x - 5, y, 10, 1, '#241a2e')
  rect(ctx, x - 5, y - 8, 1, 8, '#241a2e')
  rect(ctx, x + 4, y - 8, 1, 8, '#241a2e')
  rect(ctx, x - 1, y - 12, 2, 2, '#5b3c48')
  const flicker = 0.85 + 0.15 * Math.sin(t * 3.1)
  ctx.globalAlpha = 0.15 * flicker
  glow(ctx, x, y - 3, 12, '#ffe4b0', 0.7)
  ctx.globalAlpha = 1
}

function boombox(ctx: Ctx, x: number, y: number, s: number, t: number) {
  rect(ctx, x - 9 * s, y - 7 * s, 18 * s, 8 * s, '#2a2038')
  rect(ctx, x - 8 * s, y - 6 * s, 16 * s, 5 * s, '#c58e72')
  rect(ctx, x - 8 * s, y - 3.4 * s, 16 * s, 1, '#7b4f58')
  disc(ctx, x - 4.5 * s, y - 3.4 * s, 1.4 * s, '#33283f')
  disc(ctx, x + 4.5 * s, y - 3.4 * s, 1.4 * s, '#33283f')
  rect(ctx, x - 1 * s, y - 5 * s, 2 * s, 1, '#3a2a4d')
  ctx.globalAlpha = 0.4 + 0.3 * Math.sin(t * 1.7)
  rect(ctx, x - 1.5 * s, y - 2.8 * s, 3 * s, 1, '#ffcf94')
  ctx.globalAlpha = 1
}

function seatedPair(
  ctx: Ctx,
  l: RooftopLayout,
  t: number,
  reduced: boolean,
  fx: SceneFx,
) {
  const as = l.aScale
  const bs = l.bScale
  const breathA = reduced ? 0 : Math.sin(t * 1.05) * 0.5
  const breathB = reduced ? 0 : Math.sin(t * 1.05 + 1.3) * 0.5
  const blinkB = !reduced && (t + 2.4) % 6.3 > 6.13

  groundShadow(ctx, l.aX + 7 * as, l.aFeet + 1, 18 * as, 0.28)
  drawSprite(ctx, A_SEATED_BACK, l.aX, l.aFeet - 17 * as + breathA, {
    map: { ...A_MAP },
    scale: as,
    rim: '#b9a5d6',
    flip: false,
  })
  drawSprite(ctx, B_SEATED_BACK, l.bX, l.bFeet - 17 * bs + breathB, {
    map: { ...B_MAP },
    scale: bs,
    blink: blinkB,
    rim: '#d7a98a',
  })

  // a plaid blanket across both laps
  const by = l.aFeet - 5 * as
  rect(ctx, l.aX - 1, by, l.bX - l.aX + 16 * bs, 5 * as, '#a06a7d')
  rect(ctx, l.aX - 1, by, l.bX - l.aX + 16 * bs, 1, '#c78e96')
  ctx.globalAlpha = 0.35
  for (let x = l.aX + 3; x < l.bX + 15 * bs; x += 7) rect(ctx, x, by + 1, 1, 4 * as, '#6f4661')
  ctx.globalAlpha = 1

  // waving arms on click
  if (fx.now - fx.waveAAt < 1700 && fx.waveAAt > 0) {
    waveArmSeated(ctx, l.aX, l.aFeet - 17 * as, as, 'left', '#f3d7b3', '#f2c6a4', t)
  }
  if (fx.now - fx.waveBAt < 1700 && fx.waveBAt > 0) {
    waveArmSeated(ctx, l.bX, l.bFeet - 17 * bs, bs, 'right', '#cdb9e6', '#f2c6a4', t)
  }

  // held hands
  rect(ctx, l.aX + 12 * as, l.aFeet - 7.5 * as, l.bX - l.aX - 8 * as, 1, '#f2c6a4')
  rect(ctx, l.aX + 12 * as, l.aFeet - 7 * as, l.bX - l.aX - 8 * as, 1, '#d79a7e')
}

const A_MAP = {
  a: '#241c31',
  A: '#3c2c4a',
  s: '#e8b995',
  S: '#c58e75',
  e: '#241b30',
  r: '#e79aa6',
  v: '#b96f83',
  c: '#d9bf9f',
  C: '#b89a7e',
  p: '#433c58',
  b: '#241d30',
}

const B_MAP = {
  h: '#51333d',
  H: '#774d50',
  s: '#e8b995',
  S: '#c58e75',
  e: '#241b30',
  r: '#e79aa6',
  d: '#9c86c4',
  D: '#c0a9dc',
  x: '#2a2338',
}

function waveArmSeated(
  ctx: Ctx,
  x: number,
  y: number,
  s: number,
  side: 'left' | 'right',
  sleeve: string,
  skin: string,
  t: number,
) {
  const dir = side === 'right' ? 1 : -1
  const bx = x + (dir === 1 ? 11 * s : 1.5 * s)
  const wob = Math.round(Math.sin(t * 9) * 0.7 * s)
  rect(ctx, bx, y + 5 * s, 2 * s, 4 * s, sleeve)
  rect(ctx, bx + wob, y + 2.5 * s, 2 * s, 3 * s, skin)
  rect(ctx, bx + wob + dir * s, y + 2 * s, s, s, skin)
}

function drawRooftop(ctx: Ctx, { w, h, t, reduced, fx }: { w: number; h: number; t: number; reduced: boolean; fx: SceneFx }) {
  const l = rooftopLayout(w, h)
  const tt = reduced ? 0 : t
  nightSky(ctx, w, h, l.roofLine + (l.floorY - l.roofLine) * 0.4, tt)

  moon(ctx, l.moon.cx, l.moon.cy, l.moon.r, tt)
  moonRings(ctx, l.moon.cx, l.moon.cy, l.moon.r, fx.moonClicks, tt)

  // the city, and the roof wall
  skyline(ctx, w, h, l.roofLine, tt)
  parapet(ctx, w, h, l.roofLine)
  rooftopFloor(ctx, w, h, l.floorY, tt)

  // string lights
  stringLights(ctx, w * 0.02, w * 0.98, h * 0.065, h * (l.portrait ? 0.035 : 0.055), tt, {
    spacing: Math.max(14, w * 0.045),
    glowSize: Math.max(9, h * 0.045),
    bulb: '#ffd7a0',
  })

  // props
  pottedPlant(ctx, w * 0.065, l.floorY + h * 0.115, Math.max(0.7, h / 240), tt, {
    pot: '#945f59',
    leaf: '#566f5d',
    leaf2: '#748a70',
  })
  pottedPlant(ctx, w * 0.94, l.floorY + h * 0.1, Math.max(0.65, h / 280), tt, {
    pot: '#8e5c60',
    leaf: '#5b6a66',
    leaf2: '#7c8d80',
    type: 'tall',
  })
  blanket(ctx, w, h, l.floorY)
  lantern(ctx, w * 0.345, l.floorY + h * 0.098, tt)
  boombox(ctx, w * 0.655, l.floorY + h * 0.1, Math.max(0.8, h / 180), tt)

  // the two of them
  seatedPair(ctx, l, tt, reduced, fx)

  // a little pulsing heart between them
  const hp = 0.75 + 0.25 * Math.sin(tt * 1.6)
  ctx.globalAlpha = 0.55 + 0.4 * hp
  glow(ctx, l.heartX, l.heartY, 10, '#ffb7bd', 0.25)
  heart(ctx, l.heartX - 3.5, l.heartY - 3, 1, '#f0aeb6')
  ctx.globalAlpha = 1

  // wish star
  const ws = 0.5 + 0.5 * Math.abs(Math.sin(tt * 0.9))
  ctx.globalAlpha = 0.35 + 0.5 * ws
  sparkle(ctx, l.wishX, l.wishY, '#ffe9c4', 1)
  ctx.globalAlpha = 1

  // automatic shooting star, every little while
  if (!reduced) {
    const cycle = 11
    const phase = tt % cycle
    if (phase < 0.8) {
      const u = phase / 0.8
      const sx = w * (0.18 + u * 0.3)
      const sy = h * (0.14 + u * 0.16)
      shootingStar(ctx, sx, sy, 2.4, 1.4, 12, '#fff3d6')
    }
  }

  // clicked shooting stars
  for (const s of fx.shoots) {
    const age = fx.now - s.at
    if (age < 0 || age > 1050) continue
    const u = age / 1050
    const sx = s.x * w - u * w * 0.16
    const sy = s.y * h + u * h * 0.12
    shootingStar(ctx, sx, sy, 2.2, -1.5, 14 + Math.round(u * 8), '#ffe9c4')
    ctx.globalAlpha = 1 - u
    sparkle(ctx, sx, sy, '#fff6e2', 1)
    ctx.globalAlpha = 1
  }

  // low fireflies near the potted plants
  fireflies(ctx, w, h, tt, 7, 171, l.floorY, h * 0.96, '#ffd7a0')

  // foreground roof silhouette
  ctx.globalAlpha = 0.5
  rect(ctx, 0, h - 3, w, 3, '#130e1d')
  ctx.globalAlpha = 1

  for (const burst of fx.heartBursts) {
    heartBurst(ctx, fx.now - burst.at, burst.x * w, burst.y * h, burst.seed, 1.15)
  }
}

export const rooftopScene: SceneDef = {
  id: 'rooftop',
  index: 'iii',
  name: 'the rooftop',
  tagline: 'where you whisper things to the sky',
  aria: 'A pixel-art rooftop at night. Two people sit side by side under a huge, gentle moon and a sky of stars, with a glowing city, string lights, and a little lantern below.',
  draw: drawRooftop,
  hotspots(w: number, h: number): Hotspot[] {
    const l = rooftopLayout(w, h)
    return [
      toHotspot('rooftop-a', 'them', l.aRect, w, h, 6),
      toHotspot('rooftop-b', 'them, too', l.bRect, w, h, 6),
      toHotspot('rooftop-heart', 'a little heart', l.heartRect, w, h, 4),
      toHotspot('rooftop-wish', 'make a wish', l.wishRect, w, h, 4),
      toHotspot('rooftop-moon', 'the moon', l.moonRect, w, h, 4),
    ]
  },
}
