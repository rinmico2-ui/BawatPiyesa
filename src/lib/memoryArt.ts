import {
  type Ctx,
  PAL,
  rect,
  vgrad,
  disc,
  glow,
  mix,
  mulberry32,
  drawSprite,
  stars,
  city,
  heart,
  sparkle,
  bird,
} from './pixel'
import { A_FRONT, B_FRONT, A_SEATED_BACK, B_SEATED_BACK, CAT_SLEEP, MAP_A, MAP_B } from './sprites'
import type { MemoryArtKey } from './content'

function streetlamp(ctx: Ctx, x: number, baseY: number, h: number) {
  const top = baseY - h
  glow(ctx, x + 4, top + 6, 34, '#ffd39a', 0.35)
  rect(ctx, x, top + 4, 2, h - 4, '#2b2136')
  rect(ctx, x - 6, baseY - 2, 14, 2, '#2b2136')
  rect(ctx, x, top, 9, 2, '#2b2136')
  rect(ctx, x + 7, top + 2, 2, 6, '#2b2136')
  rect(ctx, x + 4, top + 4, 8, 6, '#3f2d44')
  rect(ctx, x + 5, top + 5, 6, 4, '#ffe3ae')
  rect(ctx, x + 4, top + 10, 8, 1, '#2b2136')
}

function umbrella(ctx: Ctx, x: number, y: number, r: number, t = 0) {
  // canopy, built from pixel rows
  for (let dy = -r; dy <= 0; dy++) {
    const half = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy)))
    const color = dy < -r * 0.45 ? '#d99aa2' : '#efd4b2'
    rect(ctx, x - half, y + dy, half * 2, 1, color)
  }
  // ribs
  for (let i = -3; i <= 3; i++) {
    rect(ctx, x + i * r * 0.3, y - r * 0.98, 1, r * 0.96, 'rgba(90,55,60,0.25)')
  }
  rect(ctx, x - r, y, r * 2, 1, '#7a4e56')
  // handle
  rect(ctx, x, y, 1, r * 1.25, '#5d4452')
  rect(ctx, x, y + r * 1.2, 3, 1, '#5d4452')
  // rain beads on the canopy
  const rnd = mulberry32(4)
  for (let i = 0; i < 5; i++) {
    const bx = x + (rnd() - 0.5) * r * 1.6
    const by = y - rnd() * r * 0.6
    rect(ctx, bx, by, 1, 1, '#f6dfc6')
    if (rnd() > 0.5) rect(ctx, bx, by + 1, 1, 2, 'rgba(220,190,190,0.5)')
  }
  // little tassel
  rect(ctx, x + Math.sin(t) * 0.4, y - r - 2, 1, 3, '#c67e8f')
}

function rain(ctx: Ctx, w: number, h: number, seed: number) {
  const rnd = mulberry32(seed)
  for (let i = 0; i < 70; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const len = 3 + rnd() * 5
    ctx.globalAlpha = 0.12 + rnd() * 0.2
    ctx.fillStyle = '#d9cbd7'
    ctx.fillRect(Math.round(x), Math.round(y), 1, Math.round(len))
    ctx.fillRect(Math.round(x) - 1, Math.round(y + len), 1, 2)
  }
  ctx.globalAlpha = 1
}

function drawHello(ctx: Ctx, w: number, h: number) {
  vgrad(ctx, 0, 0, w, h * 0.66, [
    [0, '#241c3c'],
    [0.35, '#4a3054'],
    [0.62, '#8a5569'],
    [0.82, '#c57c79'],
    [1, '#eaa983'],
  ], 26)
  stars(ctx, w, h * 0.36, 21, 22, PAL.cream, h * 0.4)
  glow(ctx, w * 0.7, h * 0.63, w * 0.5, '#ffb987', 0.24)
  city(ctx, 0, h * 0.64, w, h * 0.2, 12, '#4a3148', '#f4c68d')
  // road
  vgrad(ctx, 0, h * 0.66, w, h * 0.34, [
    [0, '#4a3349'],
    [1, '#241a30'],
  ], 10)
  rect(ctx, 0, h * 0.655, w, 1, '#d09184')
  streetlamp(ctx, w * 0.62, h * 0.84, h * 0.48)
  // puddle reflection
  ctx.globalAlpha = 0.18
  for (let i = 0; i < 4; i++) rect(ctx, w * 0.6 - i * 12, h * 0.86 + i * 3, 28 + i * 8, 1, '#ffdaa3')
  ctx.globalAlpha = 1
  // warm window behind
  glow(ctx, w * 0.24, h * 0.52, 32, '#ffcf94', 0.24)
  rect(ctx, w * 0.16, h * 0.42, w * 0.14, h * 0.22, '#31243a')
  rect(ctx, w * 0.163, h * 0.425, w * 0.134, h * 0.21, '#ffd39a')
  rect(ctx, w * 0.163, h * 0.53, w * 0.134, h * 0.105, '#e0a779')
  // figures
  const s = 2.6
  drawSprite(ctx, A_FRONT, w * 0.38, h * 0.86 - 24 * s, { map: MAP_A, scale: s })
  drawSprite(ctx, B_FRONT, w * 0.52, h * 0.865 - 24 * s, { map: MAP_B, scale: s })
  // A lifts a hand
  rect(ctx, w * 0.38 + 12 * s, h * 0.86 - 14 * s, 2 * s, 5 * s, '#f2c6a4')
  rect(ctx, w * 0.38 + 13 * s, h * 0.86 - 15 * s, 2 * s, 2 * s, '#f2c6a4')
  // little heart
  glow(ctx, w * 0.455, h * 0.38, 10, '#ffb7bd', 0.3)
  heart(ctx, w * 0.455 - 3, h * 0.38, 1, '#f0b3b8')
  // birds in the last light
  bird(ctx, w * 0.72, h * 0.28, '#4c3152', 0)
  bird(ctx, w * 0.8, h * 0.22, '#4c3152', 1)
  // falling leaves
  const rnd = mulberry32(8)
  for (let i = 0; i < 7; i++) {
    ctx.globalAlpha = 0.55
    rect(ctx, rnd() * w, h * (0.35 + rnd() * 0.45), 2, 1, '#d58a6d')
    ctx.globalAlpha = 1
  }
}

function drawAfternoon(ctx: Ctx, w: number, h: number) {
  // warm interior
  vgrad(ctx, 0, 0, w, h, [
    [0, '#e6c5a2'],
    [0.55, '#d8ab8c'],
    [1, '#96606a'],
  ], 22)
  // window
  const wx = w * 0.11
  const wy = h * 0.1
  const ww = w * 0.6
  const wh = h * 0.62
  vgrad(ctx, wx, wy, ww, wh, [
    [0, '#7d7faf'],
    [0.36, '#c08d9c'],
    [0.66, '#edb083'],
    [1, '#ffd6a0'],
  ], 16)
  glow(ctx, wx + ww * 0.72, wy + wh * 0.58, 36, '#ffe4ae', 0.55)
  disc(ctx, wx + ww * 0.72, wy + wh * 0.58, 11, '#fff0c4', '#ffdda4')
  // soft clouds
  ctx.globalAlpha = 0.85
  for (let i = 0; i < 3; i++) {
    disc(ctx, wx + 24 + i * 14, wy + 22 + (i % 2) * 4, 6 + i, '#d8a5a4')
    disc(ctx, wx + 34 + i * 14, wy + 20 + (i % 2) * 4, 5, '#e3b3aa')
  }
  ctx.globalAlpha = 1
  // city far below
  city(ctx, wx, wy + wh * 0.8, ww, wh * 0.2, 8, '#a87e86', '#f6cf98')
  rect(ctx, wx, wy + wh * 0.79, ww, wh * 0.21, '#966e7b')
  // window frame
  rect(ctx, wx - 3, wy - 3, ww + 6, 3, '#7a4f4d')
  rect(ctx, wx - 3, wy + wh, ww + 6, 4, '#7a4f4d')
  rect(ctx, wx - 3, wy, 3, wh, '#7a4f4d')
  rect(ctx, wx + ww, wy, 3, wh, '#7a4f4d')
  rect(ctx, wx + ww / 2 - 1, wy, 2, wh, '#7a4f4d')
  rect(ctx, wx, wy + wh * 0.55, ww, 2, '#7a4f4d')
  // sill
  rect(ctx, wx - 8, wy + wh + 3, ww + 16, 5, '#c89b7e')
  rect(ctx, wx - 8, wy + wh + 3, ww + 16, 1, '#f0cfaa')
  // curtains
  rect(ctx, 0, 0, w * 0.13, h * 0.82, '#9c5f6f')
  rect(ctx, w * 0.73, 0, w * 0.27, h * 0.82, '#9c5f6f')
  for (let i = 0; i < 4; i++) {
    rect(ctx, w * 0.03 + i * w * 0.028, 0, 1, h * 0.8, '#7b485c')
    rect(ctx, w * 0.76 + i * w * 0.04, 0, 1, h * 0.8, '#7b485c')
  }
  // two cups on the sill
  const cup = (x: number, y: number, c: string) => {
    rect(ctx, x - 5, y - 6, 10, 6, c)
    rect(ctx, x - 4, y - 7, 8, 1, mix(c, '#fff6e9', 0.5))
    rect(ctx, x + 5, y - 5, 2, 3, c)
    rect(ctx, x - 3, y - 8, 1, 2, 'rgba(255,246,233,0.28)')
    rect(ctx, x + 1, y - 9, 1, 3, 'rgba(255,246,233,0.2)')
  }
  cup(wx + 32, wy + wh + 3, '#d9a18e')
  cup(wx + ww - 38, wy + wh + 3, '#b7a4d8')
  // plant on the sill
  rect(ctx, wx + ww * 0.18, wy + wh - 10, 8, 8, '#a86c5f')
  disc(ctx, wx + ww * 0.18 + 4, wy + wh - 14, 5, '#6f9273')
  disc(ctx, wx + ww * 0.18 + 1, wy + wh - 16, 3, '#88a87d')
  // cat curled in the sun
  drawSprite(ctx, CAT_SLEEP, wx + ww * 0.56, wy + wh - 10, {
    map: { c: '#e2c3a4', C: '#c5a182', k: '#5a4148' },
    scale: 1.5,
  })
  // warm light beams
  ctx.globalAlpha = 0.08
  ctx.fillStyle = '#fff1cf'
  ctx.beginPath()
  ctx.moveTo(wx + ww * 0.55, wy)
  ctx.lineTo(wx + ww, wy)
  ctx.lineTo(w * 0.9, h)
  ctx.lineTo(w * 0.35, h)
  ctx.fill()
  ctx.globalAlpha = 1
  // table edge
  rect(ctx, 0, h * 0.83, w, h * 0.17, '#7a4e4b')
  rect(ctx, 0, h * 0.83, w, 2, '#b07c67')
  // book and pencil
  rect(ctx, w * 0.1, h * 0.86, w * 0.2, h * 0.06, '#e6d1b0')
  rect(ctx, w * 0.1, h * 0.86, w * 0.2, 1, '#f8ead2')
  rect(ctx, w * 0.335, h * 0.88, w * 0.14, 2, '#d9a17b')
}

function drawLittle(ctx: Ctx, w: number, h: number) {
  vgrad(ctx, 0, 0, w, h, [
    [0, '#8c5b57'],
    [0.55, '#704748'],
    [1, '#4c2f3a'],
  ], 18)
  // table top
  rect(ctx, 0, h * 0.34, w, h * 0.66, '#a37159')
  rect(ctx, 0, h * 0.34, w, 3, '#d19c78')
  for (let y = h * 0.38; y < h; y += 9) rect(ctx, 0, y, w, 1, 'rgba(70,40,40,0.25)')
  // window light stripes
  ctx.globalAlpha = 0.09
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#ffe6b5'
    ctx.beginPath()
    ctx.moveTo(w * 0.1 + i * 14, h * 0.34)
    ctx.lineTo(w * 0.15 + i * 14, h * 0.34)
    ctx.lineTo(w * 0.27 + i * 14, h)
    ctx.lineTo(w * 0.22 + i * 14, h)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  glow(ctx, w * 0.32, h * 0.4, 50, '#ffd7a0', 0.2)
  // keys
  const kx = w * 0.18
  const ky = h * 0.62
  disc(ctx, kx, ky, 5, '#3d3342')
  disc(ctx, kx, ky, 3, '#8d7f89')
  for (let i = 0; i < 3; i++) {
    const a = -0.5 + i * 0.55
    const len = 18 + i * 5
    for (let j = 0; j < len; j++) {
      rect(ctx, kx + Math.cos(a) * j, ky + Math.sin(a) * j, 2, 2, '#d8c6a4')
    }
    rect(ctx, kx + Math.cos(a) * len, ky + Math.sin(a) * len, 3, 3, '#b5a181')
    if (i === 1) {
      rect(ctx, kx + Math.cos(a) * len * 0.7, ky + Math.sin(a) * len * 0.7 + 2, 2, 3, '#d8c6a4')
    }
  }
  // two mugs
  const mug = (x: number, y: number, c: string, steam: boolean) => {
    glow(ctx, x, y - 4, 18, '#ffd7a0', 0.14)
    rect(ctx, x - 8, y - 12, 16, 13, c)
    rect(ctx, x - 7, y - 13, 14, 1, mix(c, '#fff6e9', 0.55))
    rect(ctx, x + 8, y - 9, 3, 6, c)
    rect(ctx, x - 5, y - 14, 10, 2, '#5e3e3b')
    if (steam) {
      rect(ctx, x - 2, y - 20, 1, 5, 'rgba(255,240,215,0.35)')
      rect(ctx, x + 1, y - 24, 1, 4, 'rgba(255,240,215,0.25)')
      rect(ctx, x + 3, y - 18, 1, 3, 'rgba(255,240,215,0.2)')
    }
  }
  mug(w * 0.4, h * 0.7, '#c68a80', true)
  mug(w * 0.58, h * 0.74, '#a9a0c2', true)
  // plate with the last piece of bread
  disc(ctx, w * 0.48, h * 0.85, 24, '#e4d0b1')
  disc(ctx, w * 0.48, h * 0.85, 19, '#f1e2c6')
  rect(ctx, w * 0.43, h * 0.8, 14, 8, '#d6a76c')
  rect(ctx, w * 0.43, h * 0.8, 14, 2, '#efc88f')
  rect(ctx, w * 0.44, h * 0.82, 3, 2, '#b98855')
  for (let i = 0; i < 7; i++) {
    const rnd = mulberry32(i + 3)
    rect(ctx, w * 0.35 + rnd() * w * 0.25, h * 0.89 + rnd() * 6, 1, 1, '#c49a6d')
  }
  // cassette beside the plate
  rect(ctx, w * 0.7, h * 0.77, 40, 26, '#2c2135')
  rect(ctx, w * 0.7 + 1, h * 0.77 + 1, 38, 24, '#efdcbd')
  rect(ctx, w * 0.7 + 2, h * 0.77 + 2, 36, 9, '#c9aede')
  rect(ctx, w * 0.7 + 9, h * 0.77 + 9, 22, 10, '#33283f')
  disc(ctx, w * 0.7 + 15, h * 0.77 + 14, 3, '#ead4b8')
  disc(ctx, w * 0.7 + 25, h * 0.77 + 14, 3, '#ead4b8')
  // a polaroid of the two of them
  rect(ctx, w * 0.8, h * 0.42, 34, 40, '#f4e5cd')
  rect(ctx, w * 0.8 + 2, h * 0.42 + 2, 30, 26, '#5b4c62')
  disc(ctx, w * 0.8 + 17, h * 0.42 + 10, 5, '#f0cb9b')
  rect(ctx, w * 0.8 + 8, h * 0.42 + 18, 8, 8, '#a87787')
  rect(ctx, w * 0.8 + 17, h * 0.42 + 17, 8, 9, '#c9b08e')
  // cat tail curling in from the edge
  for (let i = 0; i < 8; i++) {
    rect(ctx, w - 2 + Math.sin(i * 0.7) * 8, h * 0.9 - i * 2, 3, 2, '#b5937d')
  }
}

function drawMoment(ctx: Ctx, w: number, h: number) {
  vgrad(ctx, 0, 0, w, h, [
    [0, '#0f0d25'],
    [0.36, '#211a3e'],
    [0.64, '#3f2d54'],
    [0.85, '#6e4b64'],
    [1, '#9a6470'],
  ], 26)
  stars(ctx, w, h * 0.7, 33, 62, PAL.cream, h * 0.7)
  glow(ctx, w * 0.72, h * 0.34, 30, '#ffe9c0', 0.4)
  disc(ctx, w * 0.72, h * 0.34, 16, '#f5e1b9', '#e6cda2')
  disc(ctx, w * 0.69, h * 0.31, 11, '#fff1d1')
  // craters
  for (let i = 0; i < 4; i++) {
    const rnd = mulberry32(9 + i)
    disc(ctx, w * 0.72 + (rnd() - 0.5) * 18, h * 0.34 + (rnd() - 0.5) * 18, 1 + i * 0.4, '#d9c198')
  }
  // shooting star
  for (let i = 0; i < 14; i++) {
    ctx.globalAlpha = 1 - i / 14
    rect(ctx, w * 0.16 + i * 2, h * 0.2 + i * 1.1, 2, 1, '#fff2d4')
  }
  ctx.globalAlpha = 1
  sparkle(ctx, w * 0.16, h * 0.2, '#fff8e6', 1)
  // city lights
  glow(ctx, w * 0.5, h * 0.78, w * 0.5, '#ff9d74', 0.2)
  city(ctx, 0, h * 0.86, w, h * 0.18, 22, '#191326', '#ffc98a')
  // roof wall
  rect(ctx, 0, h * 0.82, w, h * 0.18, '#241a2f')
  rect(ctx, 0, h * 0.82, w, 2, '#4e374b')
  // two figures, small
  const s = 2.1
  drawSprite(ctx, A_SEATED_BACK, w * 0.42, h * 0.82 - 17 * s, { map: MAP_A, scale: s, rim: '#c3add8' })
  drawSprite(ctx, B_SEATED_BACK, w * 0.54, h * 0.825 - 17 * s, { map: MAP_B, scale: s, rim: '#d6a689' })
  // blanket
  rect(ctx, w * 0.4, h * 0.78, w * 0.24, 5, '#a06a7d')
  rect(ctx, w * 0.4, h * 0.78, w * 0.24, 1, '#c78e96')
  // heart
  heart(ctx, w * 0.49, h * 0.68, 1, '#f0aeb6')
  // lantern glow at the edge
  glow(ctx, w * 0.2, h * 0.86, 18, '#ffcb8c', 0.3)
  rect(ctx, w * 0.2 - 3, h * 0.84, 6, 6, '#ffd392')
  // foreground roof edge
  rect(ctx, 0, h - 3, w, 3, '#140f1f')
}

function drawHome(ctx: Ctx, w: number, h: number) {
  vgrad(ctx, 0, 0, w, h, [
    [0, '#1c1830'],
    [0.38, '#332a48'],
    [0.66, '#5b455f'],
    [1, '#33243c'],
  ], 24)
  // warm shop windows blurred by rain
  glow(ctx, w * 0.16, h * 0.5, 58, '#ffcf94', 0.26)
  rect(ctx, w * 0.1, h * 0.32, w * 0.2, h * 0.32, '#4c354d')
  rect(ctx, w * 0.11, h * 0.34, w * 0.18, h * 0.28, '#f6ce95')
  rect(ctx, w * 0.11, h * 0.5, w * 0.18, h * 0.12, '#dda77b')
  rect(ctx, w * 0.2, h * 0.34, 2, h * 0.28, '#7a4f4d')
  // street
  rect(ctx, 0, h * 0.74, w, h * 0.26, '#241a31')
  rect(ctx, 0, h * 0.74, w, 1, '#7b5a68')
  // lamp
  rect(ctx, w * 0.82, h * 0.18, 2, h * 0.6, '#252033')
  glow(ctx, w * 0.82, h * 0.18, 26, '#ffd39a', 0.3)
  rect(ctx, w * 0.82 - 4, h * 0.16, 10, 5, '#3b2c44')
  rect(ctx, w * 0.82 - 2, h * 0.165, 6, 3, '#ffe3ae')
  // puddle
  ctx.globalAlpha = 0.25
  rect(ctx, w * 0.11, h * 0.79, w * 0.28, 2, '#d8a98f')
  rect(ctx, w * 0.18, h * 0.82, w * 0.34, 1, '#b68987')
  ctx.globalAlpha = 1
  // rain
  rain(ctx, w, h, 17)
  // umbrella with two of them beneath
  const ux = w * 0.48
  const uy = h * 0.34
  umbrella(ctx, ux, uy, 28, 1)
  const s = 2.3
  drawSprite(ctx, A_FRONT, ux - 18, h * 0.83 - 24 * s, { map: MAP_A, scale: s })
  drawSprite(ctx, B_FRONT, ux + 3, h * 0.835 - 24 * s, { map: MAP_B, scale: s })
  // the one on the left keeps the umbrella
  rect(ctx, ux - 18 + 12 * s, h * 0.83 - 14 * s, 2 * s, 5 * s, '#f2c6a4')
  rect(ctx, ux - 18 + 11 * s, h * 0.83 - 16 * s, 2 * s, 3 * s, '#f2c6a4')
  // umbrella ribs / raindrops running off the edge
  const rnd = mulberry32(27)
  for (let i = 0; i < 12; i++) {
    const rx = rnd() * w
    const ry = rnd() * h * 0.75
    ctx.globalAlpha = 0.18 + rnd() * 0.25
    rect(ctx, rx, ry, 1, 3 + rnd() * 4, '#d9c8d5')
  }
  ctx.globalAlpha = 1
  // reflection of the two
  ctx.globalAlpha = 0.16
  rect(ctx, ux - 14, h * 0.85, 8, 12, '#f2c6a4')
  rect(ctx, ux + 8, h * 0.85, 8, 14, '#b7a4d8')
  ctx.globalAlpha = 1
  // little heart in the rain
  heart(ctx, ux + 22, h * 0.6, 1, '#e8a7b1')
}

function drawMoon(ctx: Ctx, w: number, h: number) {
  vgrad(ctx, 0, 0, w, h, [
    [0, '#0b0a1e'],
    [0.4, '#1a1735'],
    [0.7, '#37284d'],
    [1, '#6a4762'],
  ], 24)
  const rnd = mulberry32(301)
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.15 + rnd() * 0.65
    rect(ctx, rnd() * w, rnd() * h * 0.75, rnd() > 0.88 ? 2 : 1, 1, rnd() > 0.4 ? '#f3e4c8' : '#cabde3')
  }
  ctx.globalAlpha = 1
  // giant moon
  glow(ctx, w * 0.5, h * 0.38, 68, '#ffeac2', 0.25)
  disc(ctx, w * 0.5, h * 0.38, 34, '#f4e2bb', '#e4cda6')
  disc(ctx, w * 0.46, h * 0.34, 25, '#fff1cf')
  for (let i = 0; i < 7; i++) {
    const a = rnd() * 6.28
    const d = rnd() * 24
    ctx.globalAlpha = 0.18 + rnd() * 0.16
    disc(ctx, w * 0.5 + Math.cos(a) * d, h * 0.38 + Math.sin(a) * d, 1 + rnd() * 3, '#c9ad8a')
    ctx.globalAlpha = 1
  }
  // tiny rooftop silhouette with two figures
  rect(ctx, 0, h * 0.82, w, h * 0.18, '#1a1427')
  rect(ctx, 0, h * 0.82, w, 2, '#423044')
  const s = 1.7
  ctx.globalAlpha = 0.95
  drawSprite(ctx, A_SEATED_BACK, w * 0.42, h * 0.86 - 17 * s, { map: MAP_A, scale: s, silhouette: '#0e0b18' })
  drawSprite(ctx, B_SEATED_BACK, w * 0.53, h * 0.865 - 17 * s, { map: MAP_B, scale: s, silhouette: '#0e0b18' })
  ctx.globalAlpha = 1
  heart(ctx, w * 0.487, h * 0.72, 1, '#e3a0ad')
  // a paper letter on the roof, weighted with a stone
  rect(ctx, w * 0.18, h * 0.87, w * 0.19, h * 0.1, '#f1e2c6')
  rect(ctx, w * 0.18, h * 0.87, w * 0.19, 1, '#fff6e2')
  rect(ctx, w * 0.22, h * 0.9, w * 0.11, 1, '#b49a84')
  rect(ctx, w * 0.22, h * 0.925, w * 0.08, 1, '#b49a84')
  rect(ctx, w * 0.215, h * 0.93, 3, 2, '#8e7d73')
  heart(ctx, w * 0.3, h * 0.94, 1, '#b97c85')
  // shooting star
  for (let i = 0; i < 12; i++) {
    ctx.globalAlpha = 1 - i / 12
    rect(ctx, w * 0.76 + i * 2, h * 0.16 + i * 1.2, 2, 1, '#fff4dc')
  }
  ctx.globalAlpha = 1
  sparkle(ctx, w * 0.76, h * 0.16, '#fff8e8', 1)
}

export function drawMemoryArt(ctx: Ctx, key: MemoryArtKey, w: number, h: number) {
  switch (key) {
    case 'hello':
      drawHello(ctx, w, h)
      break
    case 'afternoon':
      drawAfternoon(ctx, w, h)
      break
    case 'little':
      drawLittle(ctx, w, h)
      break
    case 'moment':
      drawMoment(ctx, w, h)
      break
    case 'home':
      drawHome(ctx, w, h)
      break
    case 'moon':
      drawMoon(ctx, w, h)
      break
  }
}
