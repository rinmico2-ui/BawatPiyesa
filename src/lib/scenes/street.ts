import {
  type Ctx,
  PAL,
  rect,
  vgrad,
  glow,
  mulberry32,
  drawSprite,
  groundShadow,
  heartBurst,
  leaf,
  city,
  stars,
  waveArm,
} from '../pixel'
import { B_FRONT, B_WALK, CAT_SLEEP, MAP_B } from '../sprites'
import { type Hotspot, type Rect, type SceneDef, type SceneFx, toHotspot } from './types'
import { cloudLayer, fireflies, pottedPlant, stringLights, tree } from './kit'

type StreetLayout = {
  portrait: boolean
  horizon: number
  sidewalkTop: number
  walkY: number
  roadTop: number
  shop: Rect
  house: Rect
  window: Rect
  bench: Rect
  cat: Rect
  pass: Rect
  charX: number
  charFeet: number
  charScale: number
  catX: number
  catY: number
  catScale: number
}

const houseWindow = (r: Rect): Rect => ({
  x: r.x + r.w * 0.54,
  y: r.y + r.h * 0.24,
  w: r.w * 0.25,
  h: r.h * 0.24,
})

export function streetLayout(w: number, h: number): StreetLayout {
  const portrait = w / h < 0.8
  if (portrait) {
    const house = { x: w * 0.6, y: h * 0.15, w: w * 0.39, h: h * 0.415 }
    const bench = { x: w * 0.045, y: h * 0.668, w: w * 0.345, h: h * 0.06 }
    const charScale = (h * 0.086) / 24
    const charX = w * 0.6
    const charFeet = h * 0.725
    return {
      portrait,
      horizon: h * 0.42,
      sidewalkTop: h * 0.565,
      walkY: h * 0.725,
      roadTop: h * 0.79,
      shop: { x: w * 0.015, y: h * 0.2, w: w * 0.555, h: h * 0.365 },
      house,
      window: houseWindow(house),
      bench,
      cat: { x: w * 0.17, y: h * 0.6, w: w * 0.29, h: h * 0.11 },
      pass: {
        x: charX - w * 0.07,
        y: charFeet - h * 0.105,
        w: w * 0.14,
        h: h * 0.11,
      },
      charX,
      charFeet,
      charScale,
      catX: w * 0.295,
      catY: bench.y + bench.h * 0.72,
      catScale: Math.max(1.4, h / 170),
    }
  }

  const house = { x: w * 0.705, y: h * 0.3, w: w * 0.285, h: h * 0.365 }
  const bench = { x: w * 0.425, y: h * 0.685, w: w * 0.17, h: h * 0.082 }
  const charScale = (h * 0.185) / 24
  const charX = w * 0.655
  const charFeet = h * 0.765
  return {
    portrait,
    horizon: h * 0.5,
    sidewalkTop: h * 0.655,
    walkY: h * 0.765,
    roadTop: h * 0.795,
    shop: { x: w * 0.018, y: h * 0.33, w: w * 0.255, h: h * 0.335 },
    house,
    window: houseWindow(house),
    bench,
    cat: { x: w * 0.465, y: h * 0.625, w: w * 0.14, h: h * 0.11 },
    pass: {
      x: charX - w * 0.05,
      y: charFeet - h * 0.2,
      w: w * 0.1,
      h: h * 0.205,
    },
    charX,
    charFeet,
    charScale,
    catX: w * 0.535,
    catY: bench.y + bench.h * 0.45,
    catScale: Math.max(1.6, h / 105),
  }
}

function pitchedRoof(ctx: Ctx, r: Rect, roofH: number, color: string, rim: string, shingle: string) {
  const rows = Math.max(4, Math.round(roofH / 2))
  for (let i = 0; i < rows; i++) {
    const u = i / (rows - 1)
    const rw = r.w * (0.12 + u * 0.9)
    const x = r.x + (r.w - rw) / 2
    rect(ctx, x, r.y - roofH + (i * roofH) / rows, rw, roofH / rows + 1, color)
    // shingles
    for (let sx = 0; sx < rw; sx += 6) {
      ctx.globalAlpha = 0.25
      rect(ctx, x + sx + (i % 2) * 3, r.y - roofH + (i * roofH) / rows + 1, 3, 1, shingle)
      ctx.globalAlpha = 1
    }
    if (i === rows - 1) rect(ctx, x, r.y - roofH + (i * roofH) / rows, rw, 2, rim)
  }
}

function littleHouse(
  ctx: Ctx,
  r: Rect,
  t: number,
  opts: { wall: string; wall2: string; roof: string; roofRim: string; lit: boolean; seed: number },
) {
  const { wall, wall2, roof, roofRim, lit, seed } = opts
  const roofH = r.h * 0.27
  pitchedRoof(ctx, r, roofH, roof, roofRim, '#7a4c5e')
  // chimney
  rect(ctx, r.x + r.w * 0.72, r.y - roofH * 1.1, r.w * 0.075, roofH * 0.65, '#5b3b4b')
  rect(ctx, r.x + r.w * 0.72, r.y - roofH * 1.1, r.w * 0.075, 1, '#9a6872')
  // body
  rect(ctx, r.x, r.y, r.w, r.h, wall)
  rect(ctx, r.x, r.y, r.w, 2, wall2)
  rect(ctx, r.x, r.y + r.h - 3, r.w, 3, '#37263d')
  // brick courses
  const rnd = mulberry32(seed)
  ctx.globalAlpha = 0.2
  for (let y = r.y + 7; y < r.y + r.h - 4; y += 6) {
    rect(ctx, r.x, y, r.w, 1, '#1b1226')
    for (let x = r.x + (rnd() > 0.5 ? 2 : 6); x < r.x + r.w; x += 9) {
      rect(ctx, x, y, 1, 6, '#1b1226')
    }
  }
  ctx.globalAlpha = 1
  // lit window
  const win = houseWindow(r)
  glow(ctx, win.x + win.w / 2, win.y + win.h / 2, win.w * 1.55, '#ffd39a', lit ? 0.33 : 0.12)
  rect(ctx, win.x - 2, win.y - 2, win.w + 4, win.h + 4, '#3e2b40')
  rect(ctx, win.x - 1, win.y - 1, win.w + 2, win.h + 2, '#a57a6b')
  rect(ctx, win.x, win.y, win.w, win.h, lit ? '#ffd9a2' : '#4f425f')
  if (lit) {
    rect(ctx, win.x, win.y + win.h * 0.55, win.w, win.h * 0.45, '#eab887')
    // little silhouettes: a mug, a plant, a person at a table
    rect(ctx, win.x + win.w * 0.2, win.y + win.h * 0.4, win.w * 0.12, win.h * 0.22, '#a96e5f')
    rect(ctx, win.x + win.w * 0.62, win.y + win.h * 0.3, win.w * 0.16, win.h * 0.36, '#8d5960')
    rect(ctx, win.x + win.w * 0.64, win.y + win.h * 0.23, win.w * 0.11, win.h * 0.11, '#6f4353')
  }
  // curtain edges
  rect(ctx, win.x, win.y, 2, win.h, '#c08a8b')
  rect(ctx, win.x + win.w - 2, win.y, 2, win.h, '#c08a8b')
  rect(ctx, win.x + win.w / 2 - 1, win.y, 1, win.h, '#6d4a4d')
  rect(ctx, win.x, win.y + win.h * 0.6, win.w, 1, '#6d4a4d')
  // flower box
  rect(ctx, win.x - 2, win.y + win.h + 2, win.w + 4, 3, '#5a3a44')
  for (let i = 0; i < 5; i++) {
    const sway = Math.sin(t * 0.7 + i) * 0.6
    rect(ctx, win.x + i * (win.w / 5) + 2 + sway, win.y + win.h - 1, 1, 4, '#557a60')
    rect(ctx, win.x + i * (win.w / 5) + 2 + sway, win.y + win.h - 2, 2, 2, i % 2 ? '#d79ba2' : '#f0c1a2')
  }
  // door
  const dx = r.x + r.w * 0.14
  const dy = r.y + r.h * 0.58
  const dw = r.w * 0.19
  const dh = r.h * 0.42
  rect(ctx, dx - 1, dy - 1, dw + 2, dh + 1, '#3b293d')
  rect(ctx, dx, dy, dw, dh, '#5f3d4b')
  rect(ctx, dx + 2, dy + 2, dw - 4, dh * 0.44, '#473044')
  rect(ctx, dx + 2, dy + dh * 0.53, dw - 4, dh * 0.37, '#513745')
  rect(ctx, dx + dw * 0.64, dy + dh * 0.58, 2, 2, '#f2c98f')
  rect(ctx, dx, dy + dh - 2, dw, 2, '#3a283b')
  // doorstep
  rect(ctx, dx - 2, r.y + r.h - 2, dw + 4, 3, '#7a5960')
  // downpipe
  rect(ctx, r.x + r.w - 4, r.y + 2, 2, r.h - 4, '#443043')
}

function shopFront(ctx: Ctx, r: Rect, t: number) {
  const roofH = r.h * 0.2
  pitchedRoof(ctx, r, roofH, '#4c3148', '#a06270', '#6d4254')
  // body
  rect(ctx, r.x, r.y, r.w, r.h, '#7b4f58')
  rect(ctx, r.x, r.y, r.w, 2, '#b57876')
  rect(ctx, r.x, r.y + 3, r.w, r.h - 3, '#714752')
  // timber frame
  const beam = '#4b3245'
  rect(ctx, r.x + 2, r.y + 2, 2, r.h - 4, beam)
  rect(ctx, r.x + r.w - 4, r.y + 2, 2, r.h - 4, beam)
  rect(ctx, r.x, r.y + r.h * 0.47, r.w, 2, beam)
  // big warm window
  const wx = r.x + r.w * 0.07
  const wy = r.y + r.h * 0.53
  const ww = r.w * 0.52
  const wh = r.h * 0.38
  glow(ctx, wx + ww / 2, wy + wh / 2, ww * 1.5, '#ffd095', 0.34)
  rect(ctx, wx - 2, wy - 2, ww + 4, wh + 4, '#3d2a3f')
  rect(ctx, wx, wy, ww, wh, '#ffd39a')
  rect(ctx, wx, wy + wh * 0.57, ww, wh * 0.43, '#e7ab7f')
  // shelves & jars inside
  rect(ctx, wx + 2, wy + wh * 0.3, ww - 4, 1, '#a76d61')
  for (let i = 0; i < 4; i++) {
    const jw = 3 + (i % 2)
    rect(ctx, wx + 4 + i * (ww / 5), wy + wh * 0.18, jw, wh * 0.12, ['#b47468', '#9b7fa5', '#c69b6d', '#8c9b83'][i])
  }
  rect(ctx, wx + ww * 0.18, wy + wh * 0.58, ww * 0.16, wh * 0.2, '#9a6660')
  rect(ctx, wx + ww * 0.58, wy + wh * 0.52, ww * 0.2, wh * 0.3, '#8d5960')
  // reflection
  ctx.globalAlpha = 0.12
  rect(ctx, wx + ww * 0.1, wy, 2, wh, '#fff1d0')
  rect(ctx, wx + ww * 0.16, wy, 1, wh, '#fff1d0')
  ctx.globalAlpha = 1
  rect(ctx, wx + ww / 2 - 1, wy, 1, wh, '#7a4e4d')
  rect(ctx, wx, wy + wh * 0.55, ww, 1, '#7a4e4d')
  // door
  const dx = r.x + r.w * 0.68
  const dy = r.y + r.h * 0.56
  rect(ctx, dx - 1, dy - 1, r.w * 0.23 + 2, r.h * 0.44 + 1, '#3a293c')
  rect(ctx, dx, dy, r.w * 0.23, r.h * 0.44, '#5b3b49')
  rect(ctx, dx + 2, dy + 2, r.w * 0.23 - 4, r.h * 0.3, '#ffd6a1')
  rect(ctx, dx + 2, dy + r.h * 0.34, r.w * 0.23 - 4, r.h * 0.06, '#473044')
  rect(ctx, dx + r.w * 0.17, dy + r.h * 0.24, 2, 2, '#f2c98f')
  // awning over the window
  const ay = wy - wh * 0.35
  const aw = r.w * 0.62
  const ax = r.x + r.w * 0.04
  const stripes = 7
  for (let i = 0; i < stripes; i++) {
    rect(ctx, ax + (aw / stripes) * i, ay, aw / stripes + 1, r.h * 0.1, i % 2 ? '#efd7b3' : '#c07b84')
  }
  for (let i = 0; i < stripes; i++) {
    const sx = ax + (aw / stripes) * i
    for (let k = 0; k < 3; k++) rect(ctx, sx + k, ay + r.h * 0.1 + k, aw / stripes - k * 2, 1, i % 2 ? '#e0c9a8' : '#b46f7b')
  }
  rect(ctx, ax, ay, aw, 1, '#f7e3c4')
  // little sign
  const sign = { x: r.x + r.w * 0.14, y: r.y + r.h * 0.05, w: r.w * 0.35, h: r.h * 0.15 }
  rect(ctx, sign.x, sign.y, sign.w, sign.h, '#3d2a3f')
  rect(ctx, sign.x + 1, sign.y + 1, sign.w - 2, sign.h - 2, '#efd8b6')
  rect(ctx, sign.x + 4, sign.y + sign.h * 0.42, sign.w * 0.16, 2, '#7b4f58')
  rect(ctx, sign.x + sign.w * 0.28, sign.y + sign.h * 0.3, 3, 2, '#7b4f58')
  rect(ctx, sign.x + sign.w * 0.36, sign.y + sign.h * 0.3, 3, 2, '#7b4f58')
  rect(ctx, sign.x + sign.w * 0.44, sign.y + sign.h * 0.3, 2, 4, '#7b4f58')
  // hanging plant by the door
  const sway = Math.sin(t * 0.6) * 0.8
  rect(ctx, r.x + r.w * 0.6, r.y + r.h * 0.52, 1, 8, '#866a5e')
  rect(ctx, r.x + r.w * 0.6 - 3 + sway, r.y + r.h * 0.58, 7, 3, '#6f9273')
  rect(ctx, r.x + r.w * 0.6 - 1 + sway, r.y + r.h * 0.61, 4, 4, '#5c7d61')
}

function streetLamp(ctx: Ctx, x: number, baseY: number, scale: number, t: number) {
  const s = scale
  const topY = baseY - 58 * s
  // pool of light below
  ctx.globalAlpha = 0.12
  for (let i = 0; i < 4; i++) {
    rect(ctx, x - (16 - i * 3) * s, baseY - i * 1.5, (32 - i * 6) * s, 1, '#ffd39a')
  }
  ctx.globalAlpha = 1
  glow(ctx, x, topY + 5 * s, 32 * s, '#ffcf94', 0.32)
  rect(ctx, x - 1.2 * s, topY + 4 * s, 2.4 * s, 54 * s, '#2b2136')
  rect(ctx, x - 1.2 * s, topY + 4 * s, 1, 54 * s, '#4b3a52')
  rect(ctx, x - 5 * s, baseY - 2 * s, 10 * s, 2.5 * s, '#2b2136')
  rect(ctx, x - 4 * s, baseY - 4 * s, 8 * s, 2 * s, '#3b2c44')
  // arm & lantern
  rect(ctx, x - 3 * s, topY + 3 * s, 8 * s, 1.6 * s, '#2b2136')
  rect(ctx, x + 3.5 * s, topY + 1 * s, 1.6 * s, 4 * s, '#2b2136')
  rect(ctx, x + 1.6 * s, topY + 4 * s, 5.6 * s, 5 * s, '#3b2c44')
  rect(ctx, x + 2 * s, topY + 4.6 * s, 4.8 * s, 3.8 * s, '#ffd79f')
  rect(ctx, x + 1.4 * s, topY + 9 * s, 6 * s, 1.4 * s, '#2b2136')
  const flicker = 0.75 + 0.25 * Math.sin(t * 1.8 + x)
  ctx.globalAlpha = 0.2 * flicker
  glow(ctx, x + 4.5 * s, topY + 6.5 * s, 16 * s, '#ffe0ac', 0.6)
  ctx.globalAlpha = 1
}

function bench(ctx: Ctx, r: Rect, t: number) {
  const seatY = r.y + r.h * 0.4
  // legs
  rect(ctx, r.x + 3, seatY, 2, r.h * 0.6 + 3, '#30223a')
  rect(ctx, r.x + r.w - 5, seatY, 2, r.h * 0.6 + 3, '#30223a')
  rect(ctx, r.x + 2, r.y + r.h * 0.86, r.w - 4, 1, '#241a2f')
  // back
  rect(ctx, r.x + 2, r.y, 1, r.h * 0.5, '#30223a')
  rect(ctx, r.x + 2, r.y, r.w * 0.18, 1, '#30223a')
  for (let i = 0; i < 3; i++) {
    rect(ctx, r.x + 3, r.y + r.h * (0.06 + i * 0.1), r.w - 6, Math.max(1, r.h * 0.07), '#6f4a51')
    rect(ctx, r.x + 3, r.y + r.h * (0.06 + i * 0.1), r.w - 6, 1, '#9a6d69')
  }
  // seat slats
  for (let i = 0; i < 3; i++) {
    rect(ctx, r.x, seatY + i * r.h * 0.075, r.w, Math.max(1, r.h * 0.06), '#795356')
    rect(ctx, r.x, seatY + i * r.h * 0.075, r.w, 1, '#a5786e')
  }
  // arm rests
  rect(ctx, r.x, seatY - r.h * 0.04, 2, r.h * 0.3, '#3b2a3b')
  rect(ctx, r.x + r.w - 2, seatY - r.h * 0.04, 2, r.h * 0.3, '#3b2a3b')
  // fallen leaf on the bench
  leaf(ctx, r.x + r.w * 0.74, seatY + 1, Math.floor(t * 0.4) % 4, '#d58a6d')
}

function paving(ctx: Ctx, l: StreetLayout, w: number, h: number, t: number) {
  const top = l.sidewalkTop
  vgrad(ctx, 0, top, w, l.roadTop - top, [
    [0, '#5a4357'],
    [0.55, '#4a354c'],
    [1, '#3d2b42'],
  ], 14)
  rect(ctx, 0, top, w, 2, '#a1737c')
  // tiles
  const tileH = Math.max(4, (l.roadTop - top) / 5)
  for (let row = 0; row < 5; row++) {
    const y = top + row * tileH
    rect(ctx, 0, y + tileH - 1, w, 1, 'rgba(25,16,33,0.35)')
    const offset = row % 2 ? 18 : 0
    for (let x = offset; x < w; x += 34) {
      rect(ctx, x, y, 1, tileH - 1, 'rgba(25,16,33,0.22)')
    }
  }
  // curb
  rect(ctx, 0, l.roadTop - 3, w, 3, '#2b2037')
  rect(ctx, 0, l.roadTop - 3, w, 1, '#755463')
  // road
  vgrad(ctx, 0, l.roadTop, w, h - l.roadTop, [
    [0, '#31263b'],
    [0.4, '#261c31'],
    [1, '#1b1426'],
  ], 12)
  // centre dashes / wet sheen
  ctx.globalAlpha = 0.4
  for (let x = 8; x < w; x += 40) rect(ctx, x, l.roadTop + (h - l.roadTop) * 0.46, 16, 1, '#b28a7b')
  ctx.globalAlpha = 1
  const rnd = mulberry32(17)
  for (let i = 0; i < Math.floor(w / 40); i++) {
    const x = rnd() * w
    const y = l.roadTop + 4 + rnd() * (h - l.roadTop - 6)
    ctx.globalAlpha = 0.08 + rnd() * 0.08
    rect(ctx, x, y, 8 + rnd() * 16, 1, '#e0a9a0')
    ctx.globalAlpha = 1
  }
  // puddles reflecting the lamps
  const puddles = [
    [w * 0.26, l.roadTop + h * 0.06, w * 0.1],
    [w * 0.7, l.roadTop + h * 0.09, w * 0.13],
  ]
  for (const [x, y, pw] of puddles) {
    ctx.globalAlpha = 0.18
    rect(ctx, x, y, pw, 2, '#8a6f8c')
    rect(ctx, x + 4, y + 2, pw * 0.6, 1, '#f0b489')
    ctx.globalAlpha = 1
  }
  // drifting leaf shadows on the road
  for (let i = 0; i < 4; i++) {
    const x = ((i * 73 + t * 2) % w) + Math.sin(t * 0.5 + i) * 4
    leaf(ctx, x, l.roadTop + h * 0.05 + i * 4, Math.floor(t + i) % 4, 'rgba(30,20,35,0.5)')
  }
}

function drawStreet(ctx: Ctx, { w, h, t, reduced, fx }: { w: number; h: number; t: number; reduced: boolean; fx: SceneFx }) {
  const l = streetLayout(w, h)
  const tt = reduced ? 0 : t

  vgrad(ctx, 0, 0, w, l.horizon + 4, [
    [0, '#231a3d'],
    [0.26, '#3d2b52'],
    [0.52, '#734a62'],
    [0.72, '#ad6b73'],
    [0.88, '#dc967d'],
    [1, '#f2b793'],
  ], 28)
  stars(ctx, w, l.horizon * 0.5, 12, 22, PAL.cream, l.horizon * 0.5)
  glow(ctx, w * 0.5, l.horizon, w * 0.5, '#ffb987', 0.2)
  cloudLayer(ctx, w, tt, {
    seed: 8,
    count: 2,
    yFrom: h * 0.08,
    yTo: h * 0.2,
    scale: Math.max(0.6, h / 220),
    speed: 1,
    body: '#a27086',
    shade: '#80566f',
    light: '#e4ad97',
  })
  // city behind everything
  city(ctx, w * 0.28, l.horizon + 3, w * 0.68, h * 0.09, 42, '#4b3350', '#f0bd83')

  // trees peeking behind the houses
  tree(ctx, w * 0.64, l.sidewalkTop + 4, h * 0.5, tt, {
    trunk: '#3d2a3d',
    leaf: '#6a4757',
    leaf2: '#845967',
    rim: '#d08b75',
  })
  tree(ctx, w * 0.33, l.sidewalkTop + 4, h * 0.3, tt, {
    trunk: '#3a283b',
    leaf: '#5d3f51',
    leaf2: '#75505d',
  })

  // houses
  shopFront(ctx, l.shop, tt)
  if (!l.portrait) {
    littleHouse(
      ctx,
      { x: w * 0.295, y: h * 0.365, w: w * 0.18, h: h * 0.3 },
      tt,
      { wall: '#5d3d51', wall2: '#8e5c66', roof: '#3f2a42', roofRim: '#7e5360', lit: false, seed: 7 },
    )
  }
  littleHouse(ctx, l.house, tt, {
    wall: '#684453',
    wall2: '#a26d6f',
    roof: '#402b43',
    roofRim: '#8f5a65',
    lit: true,
    seed: 13,
  })

  // bunting strung across the sky
  stringLights(ctx, w * (l.portrait ? 0.02 : 0.08), w * (l.portrait ? 0.98 : 0.94), h * (l.portrait ? 0.13 : 0.12), h * 0.035, tt, {
    spacing: Math.max(14, w * 0.04),
    glowSize: Math.max(6, h * 0.03),
    bulb: '#ffd08e',
  })

  // sidewalk & road
  paving(ctx, l, w, h, tt)

  // street lamps
  const lampXs = l.portrait ? [w * 0.88] : [w * 0.33, w * 0.895]
  for (const x of lampXs) {
    streetLamp(ctx, x, l.walkY, Math.max(0.8, h / 220), tt)
  }

  // bench
  bench(ctx, l.bench, tt)

  // sleeping street cat
  const cs = l.catScale
  drawSprite(ctx, CAT_SLEEP, l.catX - 8 * cs, l.catY - 9 * cs, {
    map: { c: '#b59a86', C: '#987d6d', k: '#3f2e3d' },
    scale: cs,
  })
  if (!reduced) {
    for (let i = 0; i < 2; i++) {
      const a = (tt * 0.32 + i * 0.5) % 1
      ctx.globalAlpha = (1 - a) * 0.5
      rect(ctx, l.catX + 8 * cs + Math.sin(tt + i) * 1.5, l.catY - 10 * cs - a * 9, 1, 1, '#f3d7b3')
      ctx.globalAlpha = 1
    }
  }

  // walking little person
  const s = l.charScale
  const bob = reduced ? 0 : Math.sin(tt * 3.1) * 0.4
  const swayX = reduced ? 0 : Math.sin(tt * 0.32) * w * 0.008
  const walking = !reduced
  const frame = walking && Math.floor(tt * 3.6) % 2 === 0 ? B_WALK : B_FRONT
  const blink = !reduced && tt % 5.6 > 5.42
  groundShadow(ctx, l.charX + swayX + 7 * s, l.charFeet, 15 * s, 0.3)
  drawSprite(ctx, frame, l.charX + swayX, l.charFeet - 24 * s + bob, {
    map: MAP_B,
    scale: s,
    blink,
    rim: '#d9a07f',
  })
  // scarf tail
  const flutter = Math.round(Math.sin(tt * 2.1) * 1.2)
  rect(ctx, l.charX + swayX - 1 + flutter, l.charFeet - 15.5 * s, 2 * s, 1 * s, '#cdb9e6')
  // wave
  if (fx.now - fx.waveBAt < 1700 && fx.waveBAt > 0) {
    waveArm(ctx, l.charX + swayX, l.charFeet - 24 * s + bob, s, 'right', '#ab94cf', '#f2c6a4', tt)
  }

  // falling leaves
  const rnd = mulberry32(29)
  const leafColors = ['#d58a6d', '#c67e8f', '#e0a37f', '#a56a76', '#eac091']
  for (let i = 0; i < 18; i++) {
    const baseX = rnd() * w
    const speed = 8 + rnd() * 14
    const startY = rnd() * h * 0.7
    const x = baseX + Math.sin(tt * (0.4 + rnd() * 0.5) + i) * w * 0.03 - ((tt * speed * 0.12) % w)
    const y = (startY + tt * speed * 0.12) % (h * 0.82)
    const spin = Math.floor(tt * (2 + rnd() * 2) + i) % 4
    leaf(ctx, ((x % (w + 20)) + w + 20) % (w + 20) - 10, y, spin, leafColors[i % leafColors.length])
  }

  // foreground details
  pottedPlant(ctx, w * 0.055, l.walkY + h * 0.075, Math.max(0.7, h / 200), tt, {
    pot: '#8d5d59',
    leaf: '#5c7661',
    leaf2: '#7d9375',
  })
  // mailbox near the shop
  rect(ctx, w * 0.235, l.sidewalkTop + h * 0.05, w * 0.026, h * 0.06, '#3f3047')
  rect(ctx, w * 0.231, l.sidewalkTop + h * 0.04, w * 0.034, h * 0.022, '#8f5f66')
  rect(ctx, w * 0.233, l.sidewalkTop + h * 0.043, w * 0.03, 1, '#c98782')
  rect(ctx, w * 0.24, l.sidewalkTop + h * 0.064, w * 0.014, 1, '#2b2036')

  // fireflies & warm haze
  fireflies(ctx, w, h, tt, 8, 67, h * 0.45, h * 0.8, '#ffd7a0')
  glow(ctx, w * 0.5, l.roadTop, w * 0.4, '#ffb987', 0.05)
  ctx.globalAlpha = 0.4
  for (let i = 0; i < 4; i++) {
    rect(ctx, ((i * 97 + tt * 3) % w) + 2, h * (0.86 + i * 0.02), 1, 1, '#f6d8ad')
  }
  ctx.globalAlpha = 1

  for (const burst of fx.heartBursts) {
    heartBurst(ctx, fx.now - burst.at, burst.x * w, burst.y * h, burst.seed)
  }
}

export const streetScene: SceneDef = {
  id: 'street',
  index: 'ii',
  name: 'the street',
  tagline: 'where the lights come on, one by one',
  aria: 'A pixel-art street at dusk. A little shop with a striped awning glows beside warm brick houses, a cat sleeps on a bench, leaves fall past a street lamp, and a small person walks home.',
  draw: drawStreet,
  hotspots(w: number, h: number): Hotspot[] {
    const l = streetLayout(w, h)
    return [
      toHotspot('street-pass', 'a passerby', l.pass, w, h, 6),
      toHotspot('street-window', 'a warm window', l.window, w, h, 6),
      toHotspot('street-shop', 'the little shop', l.shop, w, h, 2),
      toHotspot('street-bench', 'the bench', l.bench, w, h, 7),
      toHotspot('street-cat', 'the street cat', l.cat, w, h, 6),
    ]
  },
}
