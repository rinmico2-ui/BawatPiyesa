import {
  type Ctx,
  rect,
  vgrad,
  disc,
  glow,
  mix,
  mulberry32,
  drawSprite,
  groundShadow,
  heartBurst,
} from '../pixel'
import { A_FRONT, CAT_SLEEP, MAP_A } from '../sprites'
import {
  type Hotspot,
  type Rect,
  type SceneDef,
  type SceneFx,
  toHotspot,
} from './types'
import {
  windowSunset,
  stringLights,
  pottedPlant,
  hangingPlant,
} from './kit'

type BedroomLayout = {
  portrait: boolean
  floorY: number
  window: Rect
  shelf: Rect
  desk: Rect
  deskTop: number
  bed: Rect
  rug: Rect
  cassette: Rect
  books: Rect
  screen: Rect
  self: Rect
  cat: Rect
  plantX: number
  plantBase: number
  plantScale: number
  charX: number
  charFeet: number
  charScale: number
  catX: number
  catY: number
  catScale: number
}

export function bedroomLayout(w: number, h: number): BedroomLayout {
  const portrait = w / h < 0.8
  if (portrait) {
    const floorY = h * 0.735
    const desk = { x: w * 0.035, y: h * 0.37, w: w * 0.46, h: h * 0.075 }
    const bed = { x: w * 0.22, y: h * 0.5, w: w * 0.77, h: h * 0.15 }
    const charScale = (h * 0.135) / 24
    const charX = w * 0.47
    const charFeet = bed.y + bed.h * 0.42
    return {
      portrait,
      floorY,
      window: { x: w * 0.05, y: h * 0.105, w: w * 0.42, h: h * 0.19 },
      shelf: { x: w * 0.56, y: h * 0.1, w: w * 0.4, h: h * 0.115 },
      desk,
      deskTop: desk.y,
      bed,
      rug: { x: w * 0.18, y: h * 0.79, w: w * 0.64, h: h * 0.1 },
      cassette: { x: desk.x + desk.w * 0.44, y: desk.y - h * 0.033, w: desk.w * 0.21, h: h * 0.035 },
      books: { x: desk.x + desk.w * 0.03, y: desk.y - h * 0.042, w: desk.w * 0.24, h: h * 0.045 },
      screen: { x: desk.x + desk.w * 0.73, y: desk.y - h * 0.07, w: desk.w * 0.24, h: h * 0.072 },
      self: {
        x: charX - w * 0.045,
        y: charFeet - h * 0.14,
        w: w * 0.1,
        h: h * 0.148,
      },
      cat: { x: w * 0.68, y: bed.y - bed.h * 0.08, w: w * 0.27, h: bed.h * 0.62 },
      plantX: w * 0.9,
      plantBase: floorY - h * 0.005,
      plantScale: h / 240,
      charX,
      charFeet,
      charScale,
      catX: w * 0.76,
      catY: bed.y + bed.h * 0.45,
      catScale: Math.max(1.5, h / 175),
    }
  }

  const floorY = h * 0.77
  const desk = { x: w * 0.02, y: h * 0.59, w: w * 0.41, h: h * 0.155 }
  const bed = { x: w * 0.54, y: h * 0.545, w: w * 0.44, h: h * 0.205 }
  const charScale = (h * 0.195) / 24
  const charX = w * 0.645
  const charFeet = bed.y + bed.h * 0.42
  return {
    portrait,
    floorY,
    window: { x: w * 0.045, y: h * 0.16, w: w * 0.245, h: h * 0.33 },
    shelf: { x: w * 0.34, y: h * 0.185, w: w * 0.205, h: h * 0.17 },
    desk,
    deskTop: desk.y,
    bed,
    rug: { x: w * 0.32, y: h * 0.805, w: w * 0.42, h: h * 0.115 },
    cassette: { x: desk.x + desk.w * 0.41, y: desk.y - h * 0.072, w: desk.w * 0.22, h: h * 0.078 },
    books: { x: desk.x + desk.w * 0.035, y: desk.y - h * 0.083, w: desk.w * 0.23, h: h * 0.092 },
    screen: { x: desk.x + desk.w * 0.71, y: desk.y - h * 0.125, w: desk.w * 0.25, h: h * 0.125 },
    self: {
      x: charX - w * 0.033,
      y: charFeet - h * 0.198,
      w: w * 0.072,
      h: h * 0.205,
    },
    cat: { x: w * 0.73, y: bed.y - bed.h * 0.18, w: w * 0.23, h: bed.h * 0.7 },
    plantX: w * 0.955,
    plantBase: floorY + h * 0.11,
    plantScale: h / 210,
    charX,
    charFeet,
    charScale,
    catX: w * 0.835,
    catY: bed.y + bed.h * 0.42,
    catScale: Math.max(1.7, h / 88),
  }
}

function wallpaper(ctx: Ctx, w: number, h: number, top: number) {
  vgrad(ctx, 0, 0, w, h, [
    [0, '#251b35'],
    [0.4, '#2e213e'],
    [0.72, '#3a2a47'],
    [1, '#241b33'],
  ], 26)
  const rnd = mulberry32(51)
  for (let i = 0; i < Math.floor(w * 0.5); i++) {
    const x = rnd() * w
    const y = rnd() * top
    ctx.globalAlpha = 0.08 + rnd() * 0.1
    rect(ctx, x, y, 1, 1, '#f3d6b4')
    if (rnd() > 0.72) rect(ctx, x + 1, y, 1, 1, '#ca9aa0')
  }
  ctx.globalAlpha = 1
  // vertical seams in the paper
  ctx.globalAlpha = 0.06
  for (let x = 14; x < w; x += 42) rect(ctx, x, 0, 1, top, '#140e1f')
  ctx.globalAlpha = 1
}

function windowDressing(ctx: Ctx, r: Rect, t: number) {
  // beam of evening light onto the room
  ctx.globalAlpha = 0.055
  ctx.fillStyle = '#ffd7a2'
  ctx.beginPath()
  ctx.moveTo(r.x, r.y + r.h)
  ctx.lineTo(r.x + r.w, r.y + r.h)
  ctx.lineTo(r.x + r.w * 1.7, r.y + r.h * 2.3)
  ctx.lineTo(r.x - r.w * 0.2, r.y + r.h * 2.3)
  ctx.fill()
  ctx.globalAlpha = 1

  windowSunset(ctx, r.x, r.y, r.w, r.h, t)
  // frame
  const f = Math.max(2, r.w * 0.025)
  rect(ctx, r.x - f, r.y - f, r.w + f * 2, f, '#6e4d56')
  rect(ctx, r.x - f, r.y + r.h, r.w + f * 2, f, '#6e4d56')
  rect(ctx, r.x - f, r.y, f, r.h, '#6e4d56')
  rect(ctx, r.x + r.w, r.y, f, r.h, '#6e4d56')
  rect(ctx, r.x + r.w * 0.5 - 1, r.y, 2, r.h, '#82606a')
  rect(ctx, r.x, r.y + r.h * 0.54, r.w, 2, '#82606a')
  // sill
  rect(ctx, r.x - f * 2, r.y + r.h + f, r.w + f * 4, Math.max(2, f * 1.2), '#543c4a')
  rect(ctx, r.x - f * 2, r.y + r.h + f, r.w + f * 4, 1, '#966f74')
  // curtains
  const cw = Math.max(5, r.w * 0.16)
  for (const side of [0, 1]) {
    const cx = side === 0 ? r.x - cw - f : r.x + r.w + f
    rect(ctx, cx, r.y - f * 2, cw, r.h + f * 2.4, '#8f5569')
    rect(ctx, cx + (side === 0 ? cw - 2 : 0), r.y - f * 2, 2, r.h + f * 2.4, '#a96b7b')
    ctx.globalAlpha = 0.35
    for (let y = r.y; y < r.y + r.h; y += 8) {
      rect(ctx, cx + (side === 0 ? 2 : cw - 3), y, 1, 5, '#6f4058')
    }
    ctx.globalAlpha = 1
    const sway = Math.sin(t * 0.45 + side * 2) * 0.6
    rect(ctx, cx + sway, r.y + r.h + f, cw, 2, '#6f4058')
  }
  // valance
  rect(ctx, r.x - f * 2, r.y - f * 3.1, r.w + f * 4, f * 1.5, '#7c485e')
  rect(ctx, r.x - f * 2, r.y - f * 3.1, r.w + f * 4, 1, '#b07180')
  for (let x = r.x - f; x < r.x + r.w + f; x += 6) {
    rect(ctx, x, r.y - f * 1.7, 1, 2, '#6b3f54')
  }

  // dust in the light
  const rnd = mulberry32(22)
  for (let i = 0; i < 18; i++) {
    const px = r.x + rnd() * r.w * 1.2
    const py = r.y + r.h + rnd() * r.h * 1.2
    const drift = Math.sin(t * 0.5 + i) * 2
    ctx.globalAlpha = 0.16 + 0.3 * Math.abs(Math.sin(t * 0.7 + i * 1.6))
    rect(ctx, px + drift, py - ((t * 2 + i * 6) % 24), 1, 1, '#ffe0b5')
  }
  ctx.globalAlpha = 1
}

function shelf(ctx: Ctx, r: Rect, t: number) {
  // brackets
  rect(ctx, r.x + r.w * 0.08, r.y + r.h, 2, r.h * 0.2, '#3a2a3f')
  rect(ctx, r.x + r.w * 0.82, r.y + r.h, 2, r.h * 0.2, '#3a2a3f')
  rect(ctx, r.x - 2, r.y + r.h - 2, r.w + 4, 3, '#7a5654')
  rect(ctx, r.x - 2, r.y + r.h - 2, r.w + 4, 1, '#b48375')
  rect(ctx, r.x - 1, r.y + r.h - 5, r.w + 2, 3, '#4b3446')

  const bookColors = ['#a86a74', '#7d6a9f', '#c39172', '#698777', '#b98b9c', '#8a715c']
  let x = r.x + 2
  const rnd = mulberry32(63)
  while (x < r.x + r.w * 0.56) {
    const bw = 3 + Math.floor(rnd() * 4)
    const bh = r.h * (0.46 + rnd() * 0.4)
    const c = bookColors[Math.floor(rnd() * bookColors.length)]
    rect(ctx, x, r.y + r.h - bh, bw, bh, c)
    rect(ctx, x, r.y + r.h - bh, bw, 1, mix(c, '#ffe3c2', 0.25))
    if (rnd() > 0.5) rect(ctx, x + 1, r.y + r.h - bh * 0.5, bw - 2, 1, 'rgba(40,25,40,0.4)')
    x += bw + 1
  }
  // a leaning book
  rect(ctx, x + 1, r.y + r.h * 0.5, 3, r.h * 0.55, '#7c5b6b')
  // tiny plant
  rect(ctx, r.x + r.w * 0.66, r.y + r.h * 0.72, 6, 5, '#a86c5f')
  rect(ctx, r.x + r.w * 0.65, r.y + r.h * 0.72, 8, 1, '#c58a75')
  const sway = Math.sin(t * 0.6) * 0.7
  for (let i = 0; i < 4; i++) {
    rect(ctx, r.x + r.w * 0.65 + i * 2 + sway, r.y + r.h * (0.52 + i * 0.05), 2, 3, '#6f9273')
    rect(ctx, r.x + r.w * 0.68 + i * 2, r.y + r.h * (0.46 + i * 0.045), 2, 2, '#88a87d')
  }
  // framed photo
  rect(ctx, r.x + r.w * 0.78, r.y + r.h * 0.5, 15, 12, '#3f2f45')
  rect(ctx, r.x + r.w * 0.78 + 1, r.y + r.h * 0.5 + 1, 13, 10, '#d7bd9e')
  rect(ctx, r.x + r.w * 0.78 + 2, r.y + r.h * 0.5 + 2, 11, 8, '#7e6b92')
  rect(ctx, r.x + r.w * 0.78 + 4, r.y + r.h * 0.5 + 4, 3, 4, '#d99d9f')
  rect(ctx, r.x + r.w * 0.78 + 8, r.y + r.h * 0.5 + 5, 2, 3, '#a9c0b0')
}

function desk(ctx: Ctx, l: BedroomLayout, t: number) {
  const r = l.desk
  // back edge shadow
  rect(ctx, r.x + 4, r.y + 4, r.w, r.h, 'rgba(12,8,20,0.28)')
  // desktop
  rect(ctx, r.x, r.y, r.w, Math.max(3, r.h * 0.16), '#6c4a4d')
  rect(ctx, r.x, r.y, r.w, 1, '#b07c69')
  rect(ctx, r.x, r.y + Math.max(2, r.h * 0.12), r.w, 1, '#462f3e')
  // legs
  const legW = Math.max(2, r.w * 0.022)
  rect(ctx, r.x + r.w * 0.015, r.y + r.h * 0.15, legW, l.floorY - r.y, '#3b293b')
  rect(ctx, r.x + r.w * 0.965, r.y + r.h * 0.15, legW, l.floorY - r.y, '#3b293b')
  rect(ctx, r.x + legW, r.y + r.h * 0.55, r.w - legW * 2, 2, '#4c3443')
  // drawer
  rect(ctx, r.x + r.w * 0.04, r.y + r.h * 0.3, r.w * 0.3, r.h * 0.42, '#5b3d4a')
  rect(ctx, r.x + r.w * 0.04, r.y + r.h * 0.3, r.w * 0.3, 1, '#8d5f60')
  rect(ctx, r.x + r.w * 0.16, r.y + r.h * 0.47, r.w * 0.06, 1, '#c58e78')

  // books
  const b = l.books
  const bc = ['#b36f72', '#7a6b9b', '#cf9d76']
  let by = b.y + b.h
  for (let i = 0; i < 3; i++) {
    const bh = b.h * (0.25 + i * 0.02)
    by -= bh
    rect(ctx, b.x + i * 2, by, b.w - i * 4, bh - 1, bc[i])
    rect(ctx, b.x + i * 2, by, b.w - i * 4, 1, mix(bc[i], '#ffe6c3', 0.3))
    rect(ctx, b.x + i * 2, by + bh - 2, b.w - i * 4, 1, '#3b2a3c')
  }
  // tiny mug
  rect(ctx, b.x + b.w + 3, b.y + b.h * 0.62, 7, 6, '#d9c3a6')
  rect(ctx, b.x + b.w + 10, b.y + b.h * 0.68, 2, 3, '#b69a7f')
  rect(ctx, b.x + b.w + 4, b.y + b.h * 0.62, 5, 1, '#7a4e45')

  // cassette tape
  const c = l.cassette
  glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * 1.6, '#ffcf96', 0.25)
  rect(ctx, c.x, c.y, c.w, c.h, '#2b2134')
  rect(ctx, c.x + 1, c.y + 1, c.w - 2, c.h - 2, '#efdcbd')
  rect(ctx, c.x + 2, c.y + 2, c.w - 4, c.h * 0.4, '#c9aede')
  rect(ctx, c.x + 2, c.y + c.h * 0.42, c.w - 4, 1, '#e3a0ad')
  rect(ctx, c.x + c.w * 0.24, c.y + c.h * 0.4, c.w * 0.52, c.h * 0.36, '#33283f')
  disc(ctx, c.x + c.w * 0.37, c.y + c.h * 0.58, Math.max(1, c.h * 0.12), '#ead4b8')
  disc(ctx, c.x + c.w * 0.63, c.y + c.h * 0.58, Math.max(1, c.h * 0.12), '#ead4b8')
  rect(ctx, c.x + c.w * 0.37, c.y + c.h * 0.55, 1, Math.max(1, c.h * 0.1), '#3a2a4d')
  rect(ctx, c.x + c.w * 0.63, c.y + c.h * 0.55, 1, Math.max(1, c.h * 0.1), '#3a2a4d')
  // little wire
  rect(ctx, c.x + c.w * 0.5, c.y + c.h, 1, c.h * 0.7, '#b99c7d')
  rect(ctx, c.x + c.w * 0.5, c.y + c.h * 1.6, c.w * 0.2, 1, '#b99c7d')

  // laptop / screen
  const s = l.screen
  rect(ctx, s.x + s.w * 0.12, s.y + s.h * 0.78, s.w * 0.76, 2, '#2d2237')
  rect(ctx, s.x, s.y + s.h * 0.2, s.w, s.h * 0.62, '#3a2c47')
  rect(ctx, s.x + 1, s.y + s.h * 0.23, s.w - 2, s.h * 0.5, '#5d5178')
  rect(ctx, s.x + 2, s.y + s.h * 0.26, s.w - 4, s.h * 0.44, '#2a2440')
  // blinking cursor & half-written message
  const blink = Math.sin(t * 2.4) > 0
  rect(ctx, s.x + s.w * 0.18, s.y + s.h * 0.36, s.w * 0.42, 1, '#e9c4c7')
  rect(ctx, s.x + s.w * 0.18, s.y + s.h * 0.45, s.w * 0.55, 1, '#b7a4d8')
  rect(ctx, s.x + s.w * 0.18, s.y + s.h * 0.54, s.w * 0.33, 1, '#b7a4d8')
  if (blink) rect(ctx, s.x + s.w * 0.56, s.y + s.h * 0.53, 2, 3, '#f5cfae')
  // hinge
  rect(ctx, s.x + s.w * 0.2, s.y + s.h * 0.82, s.w * 0.6, 1, '#5a4152')
  glow(ctx, s.x + s.w * 0.5, s.y + s.h * 0.5, s.w * 0.8, '#a99ad0', 0.18)

  // desk lamp
  const lx = r.x + r.w * 0.985
  glow(ctx, lx, r.y - r.h * 0.55, h_(l) * 0.22, '#ffcd92', 0.42)
  rect(ctx, lx - 1, r.y - r.h * 0.28, 2, r.h * 0.3, '#8e6e63')
  rect(ctx, lx - 3, r.y - 1, 7, 2, '#5d444d')
  rect(ctx, lx - 6, r.y - r.h * 0.36, 12, 4, '#c58b72')
  rect(ctx, lx - 6, r.y - r.h * 0.36, 12, 1, '#edbd8e')
  rect(ctx, lx - 4, r.y - r.h * 0.31, 8, 2, '#ffe1a9')
}

function h_(l: BedroomLayout) {
  return l.floorY / 0.77
}

function bed(ctx: Ctx, l: BedroomLayout, t: number, reduced: boolean) {
  const b = l.bed
  const headW = Math.max(6, b.w * 0.09)
  // floor shadow
  groundShadow(ctx, b.x + b.w * 0.5, b.y + b.h + 3, b.w * 0.86, 0.28)
  // headboard
  rect(ctx, b.x + b.w - headW, b.y - b.h * 0.52, headW, b.h * 1.1, '#5a3b47')
  rect(ctx, b.x + b.w - headW, b.y - b.h * 0.52, headW, 1, '#9b6666')
  for (let i = 1; i < 4; i++) {
    rect(ctx, b.x + b.w - headW + 2, b.y - b.h * 0.52 + i * b.h * 0.2, headW - 4, 1, '#472f3e')
  }
  // base
  rect(ctx, b.x, b.y + b.h * 0.2, b.w, b.h * 0.9, '#433042')
  rect(ctx, b.x + 2, b.y + b.h * 0.98, 3, 4, '#332538')
  rect(ctx, b.x + b.w - 6, b.y + b.h * 0.98, 3, 4, '#332538')
  // mattress + bottom sheet
  rect(ctx, b.x, b.y, b.w, b.h * 0.36, '#d6b99a')
  rect(ctx, b.x, b.y, b.w, 2, '#f4dcc0')
  rect(ctx, b.x, b.y + b.h * 0.33, b.w, b.h * 0.06, '#a98372')
  // pillows near the head
  const px = b.x + b.w * 0.73
  rect(ctx, px, b.y - b.h * 0.12, b.w * 0.16, b.h * 0.3, '#efe0c8')
  rect(ctx, px, b.y - b.h * 0.12, b.w * 0.16, 2, '#fff3dd')
  rect(ctx, px + 3, b.y - b.h * 0.05, b.w * 0.09, b.h * 0.18, '#dcc9b3')
  rect(ctx, px - b.w * 0.02, b.y + b.h * 0.02, b.w * 0.15, b.h * 0.24, '#f2dfc2')

  // person, sitting up in bed
  const s = l.charScale
  const blink = !reduced && t % 5.2 > 5.03
  const breath = reduced ? 0 : Math.sin(t * 1.2) * 0.5
  drawSprite(ctx, A_FRONT, l.charX, l.charFeet - 24 * s + breath, {
    map: MAP_A,
    scale: s,
    blink,
    rim: '#d8a07e',
  })

  // blanket over the lap
  rect(ctx, b.x - 2, b.y + b.h * 0.34, b.w * 0.76, b.h * 0.62, '#b86f83')
  rect(ctx, b.x - 2, b.y + b.h * 0.34, b.w * 0.76, 2, '#d99aa2')
  rect(ctx, b.x - 2, b.y + b.h * 0.84, b.w * 0.76, b.h * 0.1, '#8e536b')
  // patchwork
  const patches: [number, number, number, number, string][] = [
    [0.06, 0.44, 0.13, 0.14, '#a96580'],
    [0.28, 0.55, 0.11, 0.14, '#d3a0a2'],
    [0.47, 0.42, 0.12, 0.12, '#96607b'],
    [0.16, 0.68, 0.14, 0.12, '#c68b95'],
    [0.54, 0.68, 0.13, 0.13, '#b27a90'],
  ]
  for (const [x, y, pw, ph, col] of patches) {
    rect(ctx, b.x - 2 + b.w * 0.76 * x, b.y + b.h * (0.34 + y), b.w * 0.76 * pw, b.h * ph, col)
    ctx.globalAlpha = 0.35
    rect(ctx, b.x - 2 + b.w * 0.76 * x, b.y + b.h * (0.34 + y), b.w * 0.76 * pw, 1, '#ffe3cd')
    ctx.globalAlpha = 1
  }
  // stitched edge
  ctx.globalAlpha = 0.5
  for (let x = 2; x < b.w * 0.76; x += 5) rect(ctx, b.x + x, b.y + b.h * 0.35, 2, 1, '#f0c8bf')
  ctx.globalAlpha = 1
  // fringe
  for (let x = 0; x < b.w * 0.76; x += 4) {
    rect(ctx, b.x + x, b.y + b.h * 0.94, 1, 2 + (x % 3), '#8e536b')
  }

  // sleeping cat
  const cs = l.catScale
  const catBob = reduced ? 0 : Math.round(Math.sin(t * 0.9) * 0.5)
  drawSprite(ctx, CAT_SLEEP, l.catX - 8 * cs, l.catY - 9 * cs + catBob, {
    map: { c: '#c8a88f', C: '#a98873', k: '#46313f' },
    scale: cs,
  })
  // little sleep z's drift now and then
  if (!reduced) {
    for (let i = 0; i < 2; i++) {
      const a = (t * 0.4 + i * 0.5) % 1
      ctx.globalAlpha = (1 - a) * 0.6
      rect(ctx, l.catX + 9 * cs + Math.sin(t + i) * 2, l.catY - 10 * cs - a * 12, 1, 1, '#f3d7b3')
      rect(ctx, l.catX + 10 * cs + Math.sin(t + i) * 2, l.catY - 11 * cs - a * 12, 1, 1, '#f3d7b3')
      ctx.globalAlpha = 1
    }
  }
}

function rug(ctx: Ctx, r: Rect) {
  rect(ctx, r.x, r.y, r.w, r.h, '#6d465f')
  rect(ctx, r.x + 2, r.y + 2, r.w - 4, r.h - 4, '#825a72')
  rect(ctx, r.x + 4, r.y + 4, r.w - 8, r.h - 8, '#6d465f')
  for (let x = r.x + 7; x < r.x + r.w - 6; x += 8) {
    rect(ctx, x, r.y + r.h * 0.36, 3, 3, '#b17a89')
    rect(ctx, x + 1, r.y + r.h * 0.58, 1, 1, '#d7a0a0')
  }
  // fringe
  for (let x = r.x; x < r.x + r.w; x += 3) {
    rect(ctx, x, r.y - 1, 1, 1, '#4e3249')
    rect(ctx, x, r.y + r.h, 1, 1, '#4e3249')
  }
}

function poster(ctx: Ctx, x: number, y: number, w: number, h: number) {
  rect(ctx, x, y, w, h, '#2a2038')
  rect(ctx, x + 1, y + 1, w - 2, h - 2, '#d8c7ae')
  rect(ctx, x + 3, y + 3, w - 6, h - 6, '#3b3153')
  disc(ctx, x + w * 0.5, y + h * 0.38, w * 0.19, '#f3d7a1')
  rect(ctx, x + w * 0.16, y + h * 0.68, w * 0.68, 2, '#9b8cba')
  rect(ctx, x + w * 0.26, y + h * 0.77, w * 0.48, 1, '#9b8cba')
  // tape corner
  rect(ctx, x + w - 9, y, 8, 4, 'rgba(234,212,184,0.7)')
}

function drawBedroom(ctx: Ctx, { w, h, t, reduced, fx }: { w: number; h: number; t: number; reduced: boolean; fx: SceneFx }) {
  const l = bedroomLayout(w, h)
  const tt = reduced ? 0 : t
  wallpaper(ctx, w, h, l.floorY)
  // trim
  rect(ctx, 0, l.floorY - 3, w, 3, '#1c1429')
  rect(ctx, 0, l.floorY - 3, w, 1, '#6e4c5a')
  // floor
  vgrad(ctx, 0, l.floorY, w, h - l.floorY, [
    [0, '#4b3248'],
    [0.3, '#3f2a3f'],
    [1, '#2c1e31'],
  ], 18)
  for (let y = l.floorY + 6; y < h; y += 11) {
    rect(ctx, 0, y, w, 1, 'rgba(22,14,31,0.45)')
  }
  const prnd = mulberry32(14)
  for (let i = 0; i < 12; i++) {
    const x = prnd() * w
    const y = l.floorY + 4 + prnd() * (h - l.floorY - 8)
    rect(ctx, x, y, 1, 1, 'rgba(214,171,151,0.15)')
  }

  // window, shelf, poster
  windowDressing(ctx, l.window, tt)
  shelf(ctx, l.shelf, tt)
  poster(ctx, w * 0.585, h * 0.135, w * 0.085, h * 0.135)
  poster(ctx, w * 0.69, h * 0.105, w * 0.07, h * 0.11)

  // hanging plant from ceiling
  hangingPlant(ctx, l.shelf.x + l.shelf.w + w * 0.045, h * 0.005, Math.max(0.7, h / 300), tt)

  // string lights across the top of the room
  stringLights(ctx, w * 0.34, w * 0.98, h * 0.055, h * 0.055, tt, {
    spacing: Math.max(12, w * 0.045),
    glowSize: Math.max(9, h * 0.05),
    bulb: '#ffd392',
  })

  // rug behind the bed / desk feet
  rug(ctx, l.rug)

  // desk & bed
  desk(ctx, l, tt)
  bed(ctx, l, tt, reduced)

  // plant in the corner
  pottedPlant(ctx, l.plantX, l.plantBase, l.plantScale, tt, {
    pot: '#a2665d',
    leaf: '#5f7d64',
    leaf2: '#7d9a78',
    type: 'tall',
  })

  // slippers by the rug
  const sl = w * 0.24
  const sy = h * 0.895
  rect(ctx, sl, sy, w * 0.035, h * 0.018, '#8d5f72')
  rect(ctx, sl + w * 0.045, sy + h * 0.005, w * 0.035, h * 0.018, '#8d5f72')
  rect(ctx, sl + 1, sy - 1, w * 0.025, 2, '#d6a7a5')
  rect(ctx, sl + w * 0.046, sy + h * 0.004, w * 0.025, 2, '#d6a7a5')

  // warm lamp wash across the room
  glow(ctx, l.desk.x + l.desk.w * 0.94, l.desk.y - h * 0.06, Math.min(w, h) * 0.5, '#ffb877', 0.1)
  glow(ctx, l.window.x + l.window.w * 0.5, l.window.y + l.window.h * 0.4, Math.min(w, h) * 0.24, '#e1a6a2', 0.05)

  // foreground warmth
  ctx.globalAlpha = 0.5
  const fgr = mulberry32(66)
  for (let i = 0; i < 8; i++) {
    const x = fgr() * w
    const y = h * (0.82 + fgr() * 0.16)
    ctx.globalAlpha = 0.12 + 0.2 * Math.abs(Math.sin(tt * 0.7 + i))
    rect(ctx, x, y, 1, 1, '#ffd9a8')
  }
  ctx.globalAlpha = 1

  for (const burst of fx.heartBursts) {
    heartBurst(ctx, fx.now - burst.at, burst.x * w, burst.y * h, burst.seed)
  }
}

export const bedroomScene: SceneDef = {
  id: 'bedroom',
  index: 'i',
  name: 'the bedroom',
  tagline: 'where the evening settles',
  aria: 'A cosy pixel-art bedroom at dusk. A window shows a sunset city, fairy lights hang above a desk with a cassette player and laptop, and someone sits up in bed beside a sleeping cat.',
  draw: drawBedroom,
  hotspots(w: number, h: number): Hotspot[] {
    const l = bedroomLayout(w, h)
    return [
      toHotspot('bedroom-cassette', 'the cassette', l.cassette, w, h, 8),
      toHotspot('bedroom-window', 'the window', l.window, w, h, 5),
      toHotspot('bedroom-books', 'the shelf', l.books, w, h, 5),
      toHotspot('bedroom-screen', 'the screen', l.screen, w, h, 5),
      toHotspot('bedroom-cat', 'Mochi', l.cat, w, h, 6),
      toHotspot('bedroom-self', 'you', l.self, w, h, 6),
    ]
  },
}
