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
  city,
  mix,
  bird,
} from '../pixel'
import { A_BACK, MAP_A } from '../sprites'
import { cloudLayer, steppedHill, foregroundGrass } from './kit'

type Args = { w: number; h: number; t: number; reduced: boolean }

const DUSK_A = {
  ...MAP_A,
  a: '#241c30',
  A: '#3d2d47',
  s: '#e9b18f',
  S: '#c98d75',
  c: '#ecc8a0',
  C: '#c79b7b',
  v: '#d18997',
  p: '#3b334f',
  b: '#221b2c',
}

function headphones(ctx: Ctx, x: number, y: number, s: number) {
  // band
  rect(ctx, x + 3 * s, y - 1.1 * s, 8 * s, 1 * s, '#221a2c')
  rect(ctx, x + 2.2 * s, y - 0.6 * s, 9.6 * s, 0.7 * s, '#efd9b4')
  rect(ctx, x + 3 * s, y - 1.1 * s, 8 * s, 0.5 * s, '#f5e5c8')
  // ears
  rect(ctx, x + 1.2 * s, y + 3.4 * s, 2 * s, 4 * s, '#221a2c')
  rect(ctx, x + 11.2 * s, y + 3.4 * s, 2 * s, 4 * s, '#221a2c')
  rect(ctx, x + 1.5 * s, y + 3.8 * s, 1.5 * s, 3.2 * s, '#efd9b4')
  rect(ctx, x + 11.4 * s, y + 3.8 * s, 1.5 * s, 3.2 * s, '#efd9b4')
  // a little wire falling down the back
  rect(ctx, x + 12.4 * s, y + 7.4 * s, 0.6 * s, 3.5 * s, '#cbb08e')
}

function littleHut(ctx: Ctx, x: number, baseY: number, s: number, t: number) {
  const wall = '#5b3c4f'
  const roof = '#402b43'
  // hillock
  const r = 27 * s
  for (let dx = -r; dx <= r; dx++) {
    const k = 1 - Math.abs(dx) / r
    const hh = Math.round(Math.pow(k, 0.6) * 10 * s)
    rect(ctx, x + dx, baseY - hh, 1, hh + 2, '#493052')
    if ((dx + Math.round(r)) % 3 === 0) rect(ctx, x + dx, baseY - hh, 1, 1, '#6d4760')
  }
  // stilts + body
  rect(ctx, x - 8 * s, baseY - 6 * s, 2 * s, 6 * s, '#3a273f')
  rect(ctx, x + 6 * s, baseY - 6 * s, 2 * s, 6 * s, '#3a273f')
  rect(ctx, x - 10 * s, baseY - 15 * s, 20 * s, 9 * s, wall)
  rect(ctx, x - 10 * s, baseY - 11 * s, 20 * s, 1, '#4c3046')
  // thatched roof
  rect(ctx, x - 14 * s, baseY - 17 * s, 28 * s, 3 * s, roof)
  rect(ctx, x - 11 * s, baseY - 20 * s, 22 * s, 3 * s, roof)
  rect(ctx, x - 7 * s, baseY - 22 * s, 14 * s, 2 * s, roof)
  for (let i = -12; i <= 12; i += 3) {
    rect(ctx, x + i * s, baseY - 17 * s, 1, 2 * s, '#573a50')
  }
  // warm window and a little ladder
  glow(ctx, x - 3 * s, baseY - 11 * s, 15 * s, '#ffd39a', 0.3)
  rect(ctx, x - 5 * s, baseY - 14 * s, 6 * s, 5 * s, '#ffd9a2')
  rect(ctx, x - 5 * s, baseY - 10 * s, 6 * s, 1, '#a96e5f')
  rect(ctx, x - 2 * s, baseY - 14 * s, 1, 5 * s, '#6d4a4d')
  rect(ctx, x - 5 * s, baseY - 3 * s, 1, 3 * s, '#583c44')
  rect(ctx, x - 3 * s, baseY - 3 * s, 1, 3 * s, '#583c44')
  rect(ctx, x - 6 * s, baseY - 2 * s, 4, 1, '#583c44')
  // plant beside it
  rect(ctx, x + 11 * s, baseY - 8 * s, 1, 8 * s, '#3d5a4b')
  for (let i = 0; i < 3; i++) {
    rect(ctx, x + (9 - i) * s + Math.sin(t * 0.7 + i) * 0.6, baseY - (8 + i * 2) * s, 3 * s, 1, '#557a60')
    rect(ctx, x + (12 + i) * s, baseY - (7 + i * 2) * s, 2 * s, 1, '#486b55')
  }
}

function fence(ctx: Ctx, x: number, baseY: number, w: number, hgt: number) {
  const wood = '#241a2f'
  const rim = '#4f3748'
  rect(ctx, x, baseY - hgt * 0.75, w, Math.max(1, hgt * 0.09), wood)
  rect(ctx, x, baseY - hgt * 0.42, w, Math.max(1, hgt * 0.08), wood)
  const posts = Math.max(3, Math.round(w / 16))
  for (let i = 0; i <= posts; i++) {
    const px = x + (w / posts) * i
    rect(ctx, px, baseY - hgt, 2, hgt, wood)
    rect(ctx, px, baseY - hgt, 2, 1, rim)
  }
  ctx.globalAlpha = 0.4
  rect(ctx, x, baseY - hgt * 0.75, w, 1, rim)
  ctx.globalAlpha = 1
}

function tuftClump(
  ctx: Ctx,
  x: number,
  y: number,
  baseH: number,
  spread: number,
  t: number,
  col: string,
  tip: string,
) {
  const blades = 3 + Math.round((x * 7 + y * 3) % 2)
  const tallest = 1 + Math.round((x + y) % (blades - 1))
  for (let b = 0; b < blades; b++) {
    const dir = b - (blades - 1) / 2
    const hgt = Math.max(2, Math.round(baseH * (0.7 + ((b * 37 + x * 13) % 10) / 26) + Math.abs(dir) * 0.45))
    const sway = Math.sin(t * (0.85 + baseH * 0.08) + x * 0.09 + b) * (0.35 + spread * 0.4)
    // fan of blades that meet at the root, then lean out and sway together
    for (let yy = 1; yy <= hgt; yy++) {
      const u = yy / hgt
      const px = Math.round(x + dir * spread * (1 - u) + (sway + dir * 0.22) * u * u)
      ctx.fillStyle = col
      ctx.fillRect(px, Math.round(y - yy), 1, 1)
      if (b === tallest && yy === hgt) {
        ctx.globalAlpha = 0.55
        ctx.fillStyle = tip
        ctx.fillRect(px, Math.round(y - yy), 1, 1)
        ctx.globalAlpha = 1
      }
    }
    ctx.fillStyle = col
    ctx.fillRect(Math.round(x + dir * spread), Math.round(y) - 1, 1, 1)
  }
}

function tuftField(
  ctx: Ctx,
  w: number,
  h: number,
  topY: number,
  t: number,
  opts: {
    seed: number
    count: number
    minH: number
    maxH: number
    colors: string[]
    tip: string
    tuftEvery?: number
  },
) {
  const rnd = mulberry32(opts.seed)
  const clumpEvery = opts.tuftEvery ?? 5
  for (let i = 0; i < opts.count; i++) {
    const cx = rnd() * w
    const depth = rnd()
    const cy = topY + Math.pow(depth, 0.8) * (h - topY)
    const baseH = opts.minH + depth * (opts.maxH - opts.minH)
    const col = opts.colors[Math.floor(rnd() * opts.colors.length)]
    const spread = 0.8 + depth * 1.5
    const tufts = 2 + (rnd() > 0.6 ? 1 : 0)
    for (let n = 0; n < tufts; n++) {
      tuftClump(
        ctx,
        cx + (rnd() - 0.5) * clumpEvery,
        cy + (rnd() - 0.5) * 2,
        baseH * (0.8 + rnd() * 0.35),
        spread,
        t,
        col,
        opts.tip,
      )
    }
  }
}

/** Broad, low grass ridges — the meadow reads as ground, not as scattered specks. */
function meadowLayer(
  ctx: Ctx,
  w: number,
  y: number,
  amp: number,
  seed: number,
  body: string,
  rim: string,
  rimAlpha: number,
) {
  const rnd = mulberry32(seed)
  const p1 = rnd() * 6.28
  const p2 = rnd() * 6.28
  const heights: number[] = []
  for (let x = 0; x < w; x++) {
    const u = x / w
    const hh = Math.round(
      1.5 + (Math.sin(u * 6.2 + p1) * 0.5 + 0.5) * amp + (Math.sin(u * 17 + p2) * 0.5 + 0.5) * amp * 0.35,
    )
    heights.push(hh)
    rect(ctx, x, y - hh, 1, hh + 2, body)
  }
  ctx.globalAlpha = rimAlpha
  for (let x = 0; x < w; x++) {
    if ((x + seed) % 3 === 0) continue
    rect(ctx, x, y - heights[x], 1, 1, rim)
  }
  ctx.globalAlpha = 1
}



export function drawField(ctx: Ctx, { w, h, t, reduced }: Args) {
  const tt = reduced ? 0 : t
  const horizon = h * 0.625
  const portrait = w / h < 0.8
  const sunX = w * (portrait ? 0.72 : 0.715)
  const sunY = horizon - h * (portrait ? 0.115 : 0.062)
  const sunR = Math.max(6, h * (portrait ? 0.062 : 0.07))

  // sky
  vgrad(
    ctx,
    0,
    0,
    w,
    horizon,
    [
      [0, '#382650'],
      [0.24, '#5b3c60'],
      [0.48, '#92596f'],
      [0.68, '#c57c7e'],
      [0.84, '#e9a17f'],
      [1, '#f8c993'],
    ],
    30,
  )

  // early stars
  const starRnd = mulberry32(17)
  for (let i = 0; i < 24; i++) {
    const sx = starRnd() * w
    const sy = starRnd() * horizon * 0.4
    ctx.globalAlpha = 0.15 + starRnd() * 0.4
    rect(ctx, sx, sy, 1, 1, PAL.cream)
  }
  ctx.globalAlpha = 1

  // haze & sun bloom
  glow(ctx, sunX, horizon - h * 0.01, w * 0.36, '#ffb987', 0.24)
  glow(ctx, sunX, sunY, sunR * 6, '#ffd39b', 0.32)
  glow(ctx, sunX, sunY, sunR * 2.3, '#ffe4b4', 0.5)

  // clouds — big soft shapes, warm beneath
  cloudLayer(ctx, w, tt, {
    seed: 12,
    count: portrait ? 3 : 4,
    yFrom: h * 0.07,
    yTo: h * 0.3,
    scale: Math.max(0.9, h / 115),
    speed: 1.65,
    body: '#9d6a82',
    shade: '#7c5271',
    light: '#eab18d',
  })
  cloudLayer(ctx, w, tt, {
    seed: 44,
    count: 2,
    yFrom: h * 0.34,
    yTo: h * 0.44,
    scale: Math.max(0.6, h / 230),
    speed: 1.05,
    body: '#b97a8a',
    shade: '#9a6279',
    light: '#f4c4a0',
  })

  // sun
  disc(ctx, sunX, sunY, sunR, '#ffe3ae', '#ffcf95')
  disc(ctx, sunX - sunR * 0.18, sunY - sunR * 0.2, sunR * 0.68, '#fff0cb')
  ctx.globalAlpha = 0.32
  rect(ctx, sunX - sunR * 1.4, sunY + sunR * 0.2, sunR * 2.4, 2, '#c97b84')
  rect(ctx, sunX - sunR * 0.7, sunY - sunR * 0.42, sunR * 1.9, 1, '#f7c8a0')
  ctx.globalAlpha = 1

  // birds
  const birdRnd = mulberry32(9)
  for (let i = 0; i < 4; i++) {
    const bx = ((birdRnd() * w + tt * (5 + i * 1.4)) % (w + 60)) - 30
    const by = h * (0.2 + i * 0.038) + Math.sin(tt * 0.5 + i) * 2
    bird(ctx, bx, by, '#4a3150', Math.floor(tt * 3.4 + i) % 2)
  }

  // far hills
  steppedHill(ctx, w, horizon + h * 0.008, h * 0.085, '#6f4a69', 3, '#a4697c')

  // distant city
  glow(ctx, w * 0.7, horizon - h * 0.005, w * 0.34, '#ffb987', 0.14)
  city(ctx, w * 0.42, horizon + 2, w * 0.5, h * 0.095, 21, '#563a52', '#f8d192')
  // radio tower
  rect(ctx, w * 0.89, horizon - h * 0.125, 1, h * 0.125, '#432e4a')
  rect(ctx, w * 0.885, horizon - h * 0.1, 8, 1, '#432e4a')
  rect(ctx, w * 0.887, horizon - h * 0.075, 5, 1, '#432e4a')
  ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(tt * 1.3))
  rect(ctx, w * 0.89, horizon - h * 0.127, 1, 1, '#ff9a7a')
  ctx.globalAlpha = 1

  // middle hill and a small hut with a warm window
  steppedHill(ctx, w, horizon + h * 0.052, h * 0.04, '#513751', 7, '#734c60')
  littleHut(ctx, w * 0.58, horizon + h * 0.049, Math.max(0.7, h / 250), tt)

  // field
  vgrad(
    ctx,
    0,
    horizon + h * 0.028,
    w,
    h - horizon,
    [
      [0, '#7b5064'],
      [0.14, '#68465c'],
      [0.42, '#4e3550'],
      [0.72, '#372843'],
      [1, '#281f35'],
    ],
    24,
  )
  ctx.globalAlpha = 0.5
  rect(ctx, 0, horizon + h * 0.028, w, 1, '#d19487')
  ctx.globalAlpha = 1

  // mid ground glow on the grass
  glow(ctx, sunX, horizon + h * 0.06, w * 0.22, '#f0a77f', 0.12)

  // gentle meadow ridges, back to front — soft ground texture
  meadowLayer(ctx, w, horizon + h * 0.085, 2.2, 3, '#734e5f', '#a9786c', 0.22)
  meadowLayer(ctx, w, horizon + h * 0.15, 3.6, 7, '#5b3e53', '#8c5f64', 0.2)
  meadowLayer(ctx, w, horizon + h * 0.235, 5.2, 11, '#46324b', '#6a4856', 0.16)

  // grass, clustered so it reads as clumps rather than confetti
  tuftField(ctx, w, h, horizon + h * 0.08, tt, {
    seed: 31,
    count: Math.max(7, Math.round(w / 30)),
    minH: 2,
    maxH: 4,
    colors: ['#7b565f', '#6f4e5b'],
    tip: '#a4736c',
    tuftEvery: 4,
  })
  tuftField(ctx, w, h, horizon + h * 0.17, tt, {
    seed: 55,
    count: Math.max(6, Math.round(w / 34)),
    minH: 3,
    maxH: 5,
    colors: ['#5b3f52', '#634556'],
    tip: '#8c5f63',
    tuftEvery: 5,
  })
  tuftField(ctx, w, h, horizon + h * 0.26, tt, {
    seed: 78,
    count: Math.max(5, Math.round(w / 40)),
    minH: 4,
    maxH: 7,
    colors: ['#3f2e47', '#48344a'],
    tip: '#684855',
    tuftEvery: 6,
  })

  // wildflowers, kept few and quiet
  const flowerRnd = mulberry32(88)
  for (let i = 0; i < Math.max(3, Math.floor(w / 90)); i++) {
    const fx = flowerRnd() * w
    const fy = horizon + h * 0.13 + flowerRnd() * (h - horizon - h * 0.17)
    const sway = Math.sin(tt * 1.2 + fx * 0.1) * 0.6
    rect(ctx, fx, fy, 1, 2, '#4b384e')
    ctx.globalAlpha = 0.5
    rect(ctx, fx + sway, fy - 1, 1, 1, flowerRnd() > 0.5 ? '#c9938f' : '#d8b794')
    ctx.globalAlpha = 1
  }

  // the small person, headphones on, watching the sky
  const charH = h * 0.14
  const s = charH / 24
  const cx = w * 0.205
  const feet = h * 0.94
  const breath = reduced ? 0 : Math.sin(tt * 1.35) * 0.6
  const bob = reduced ? 0 : Math.sin(tt * 0.55) * 0.3
  groundShadow(ctx, cx + 7 * s, feet, charH * 0.7, 0.3)
  drawSprite(ctx, A_BACK, cx + bob, feet - charH + breath, {
    map: DUSK_A,
    scale: s,
    rim: '#d79a85',
  })
  headphones(ctx, cx + bob, feet - charH + breath, s)
  // scarf tails
  const flutter = Math.round(Math.sin(tt * 2.3) * 1.4)
  rect(ctx, cx - 4 * s + flutter, feet - charH + 10.4 * s, 3 * s, 1 * s, '#b97283')
  rect(ctx, cx - 5.4 * s + flutter, feet - charH + 11.1 * s, 2 * s, 1 * s, '#d18997')

  // a little fence at the edge of the field
  fence(ctx, w * 0.74, h * 0.965, w * 0.29, h * 0.13)

  // a bush by the fence
  const bushSway = Math.sin(tt * 0.7) * 0.8
  disc(ctx, w * 0.9 + bushSway, h * 0.94, h * 0.045, '#2a1f36')
  disc(ctx, w * 0.96, h * 0.96, h * 0.042, '#231a2f')
  disc(ctx, w * 0.85, h * 0.965, h * 0.03, '#31243d')
  ctx.globalAlpha = 0.3
  disc(ctx, w * 0.9 + bushSway - 2, h * 0.928, h * 0.025, '#65445b')
  ctx.globalAlpha = 1

  // drifting petals & seeds of light, kept above the grass line
  const p = mulberry32(120)
  for (let i = 0; i < 9; i++) {
    const speed = 4 + p() * 8
    const bx = p() * w
    const by = h * 0.33 + p() * h * 0.3
    const x = (bx - tt * speed * 0.35 + w * 2) % w
    const y = by + Math.sin(tt * 0.8 + i) * 4 - ((tt * speed * 0.2) % 18)
    const pulse = 0.1 + 0.22 * Math.abs(Math.sin(tt * 0.9 + i * 1.7))
    ctx.globalAlpha = pulse
    if (i % 4 === 0) {
      glow(ctx, x, y, 2.6, '#ffd6a0', 0.16)
      rect(ctx, x, y, 1, 1, '#ffe0b0')
    } else {
      rect(ctx, x, y, 1, 1, mix('#e3a3a5', '#ffdfb0', 0.4))
    }
    ctx.globalAlpha = 1
  }

  // foreground silhouettes
  foregroundGrass(ctx, w, h, tt, '#1d1628')
  ctx.globalAlpha = 0.25
  foregroundGrass(ctx, w, h, tt + 2, '#372741')
  ctx.globalAlpha = 1

  // a few seeds of light close to camera
  const fg = mulberry32(300)
  for (let i = 0; i < 4; i++) {
    const x = fg() * w
    const y = h * (0.8 + fg() * 0.16)
    ctx.globalAlpha = 0.18 + 0.3 * Math.abs(Math.sin(tt * 4 + i))
    rect(ctx, x, y, 1, 1, '#e8c79e')
    ctx.globalAlpha = 1
  }
}
