// ─────────────────────────────────────────────────────────────
//  scenes/kit.ts — little scene ingredients shared around town
// ─────────────────────────────────────────────────────────────
import {
  type Ctx,
  PAL,
  rect,
  vgrad,
  disc,
  glow,
  rgba,
  mix,
  mulberry32,
  cloud,
  city,
  heart,
  sparkle,
} from '../pixel'

export function sunsetSky(ctx: Ctx, w: number, horizon: number, t: number, night = 0) {
  vgrad(
    ctx,
    0,
    0,
    w,
    horizon,
    [
      [0, mix('#2a1e45', '#141126', night)],
      [0.34, mix('#563a5e', '#22203f', night)],
      [0.66, mix('#9a5d70', '#3a2c54', night)],
      [0.86, mix('#d08684', '#5c4068', night)],
      [1, mix('#f2b080', '#7c5572', night)],
    ],
    32,
  )
  // a couple of early stars high up
  const rnd = mulberry32(7)
  for (let i = 0; i < 14; i++) {
    const x = rnd() * w
    const y = rnd() * horizon * 0.32
    const a = 0.15 + rnd() * 0.3
    ctx.globalAlpha = a * (0.6 + 0.4 * Math.sin(t * 0.6 + i))
    rect(ctx, x, y, 1, 1, PAL.cream)
  }
  ctx.globalAlpha = 1
}

export function cloudLayer(
  ctx: Ctx,
  w: number,
  t: number,
  opts: {
    seed: number
    count?: number
    yFrom?: number
    yTo?: number
    scale?: number
    speed?: number
    body?: string
    shade?: string
    light?: string
  },
) {
  const {
    seed,
    count = 4,
    yFrom = 10,
    yTo = 80,
    scale = 1,
    speed = 3,
    body = '#a96f87',
    shade = '#83566f',
    light = '#e8a891',
  } = opts
  const rnd = mulberry32(seed)
  for (let i = 0; i < count; i++) {
    const baseX = rnd() * (w + 120)
    const y = yFrom + rnd() * (yTo - yFrom)
    const s = scale * (0.7 + rnd() * 0.8)
    const v = speed * (0.4 + rnd() * 0.8)
    const x = ((baseX + t * v) % (w + 140)) - 70
    ctx.globalAlpha = 0.55 + rnd() * 0.35
    cloud(ctx, x, y, s, body, shade, light)
    ctx.globalAlpha = 1
  }
}

export function steppedHill(
  ctx: Ctx,
  w: number,
  baseY: number,
  height: number,
  color: string,
  seed: number,
  rim?: string,
) {
  const rnd = mulberry32(seed)
  const phase = rnd() * 6.28
  const phase2 = rnd() * 6.28
  const fn = (x: number) =>
    Math.sin((x / w) * 3.1 + phase) * 0.45 + Math.sin((x / w) * 7.7 + phase2) * 0.18 + 0.55
  for (let x = 0; x < w; x++) {
    const hgt = Math.round(fn(x) * height)
    ctx.fillStyle = color
    ctx.fillRect(x, Math.round(baseY - hgt), 1, Math.round(hgt) + 2)
    if (rim) {
      ctx.fillStyle = rim
      ctx.fillRect(x, Math.round(baseY - hgt), 1, 1)
    }
  }
}

export function grass(
  ctx: Ctx,
  w: number,
  h: number,
  topY: number,
  t: number,
  opts: {
    seed: number
    count?: number
    colors?: string[]
    topColors?: string[]
    minH?: number
    maxH?: number
  } = { seed: 1 },
) {
  const { seed, count = 220, colors = ['#513b58', '#66475f'], topColors = ['#8a5c69', '#a56d70'], minH = 2, maxH = 6 } = opts
  const rnd = mulberry32(seed)
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rnd() * w)
    const depth = rnd()
    const y = Math.floor(topY + Math.pow(depth, 0.7) * (h - topY))
    const hgt = Math.round(minH + depth * (maxH - minH) + rnd() * 2)
    const sway = Math.round(Math.sin(t * (1.1 + depth * 0.7) + x * 0.11 + i) * (0.5 + depth * 1.2))
    const col = colors[Math.floor(rnd() * colors.length)]
    const top = topColors[Math.floor(rnd() * topColors.length)]
    ctx.fillStyle = col
    ctx.fillRect(x, y - hgt, 1, hgt)
    ctx.fillStyle = top
    ctx.fillRect(x + sway, y - hgt, 1, Math.max(1, Math.round(hgt * 0.4)))
    ctx.fillStyle = col
    if (hgt > 4 && rnd() > 0.7) ctx.fillRect(x + sway + 1, y - hgt + 1, 1, 1)
  }
}

export function foregroundGrass(ctx: Ctx, w: number, h: number, t: number, color: string) {
  const rnd = mulberry32(91)
  for (let i = 0; i < Math.max(14, Math.floor(w / 24)); i++) {
    const x = rnd() * w
    const hgt = 8 + rnd() * 18
    const sway = Math.sin(t * 0.9 + x * 0.05) * 2
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), h - hgt, 2, hgt)
    ctx.fillRect(Math.round(x + sway), h - hgt - 3, 1, 4)
    ctx.fillRect(Math.round(x + sway * 0.6 + 2), h - hgt + 4, 1, 5)
  }
}

export function tree(
  ctx: Ctx,
  x: number,
  groundY: number,
  height: number,
  t: number,
  colors: { trunk: string; leaf: string; leaf2: string; rim?: string },
) {
  const trunkW = Math.max(2, Math.round(height * 0.045))
  const sway = Math.sin(t * 0.35) * 1
  const crownY = groundY - height * 0.66
  // trunk
  rect(ctx, x - trunkW / 2, groundY - height * 0.62, trunkW, height * 0.62, colors.trunk)
  // branches
  rect(ctx, x - height * 0.09, groundY - height * 0.46, height * 0.09, 2, colors.trunk)
  rect(ctx, x + trunkW / 2, groundY - height * 0.5, height * 0.11, 2, colors.trunk)
  rect(ctx, x - trunkW / 2 - 2, groundY - height * 0.38, 4, 2, colors.trunk)
  // crown built from overlapping leaf clumps so the silhouette stays ragged
  const cy = crownY + sway
  const rnd = mulberry32(Math.round(x * 7 + height * 3))
  const rx = height * 0.2
  const ry = height * 0.15
  const shade = mix(colors.leaf, '#171126', 0.36)

  // a dim understory, offset down-left
  for (let i = 0; i < 9; i++) {
    const angle = rnd() * Math.PI * 2
    const reach = Math.sqrt(rnd())
    disc(
      ctx,
      x - rx * 0.16 + Math.cos(angle) * rx * reach * 0.85,
      cy + height * 0.055 + Math.sin(angle) * ry * reach * 0.8,
      height * (0.055 + rnd() * 0.04),
      shade,
    )
  }

  // the main body: many small clumps inside an ellipse
  for (let i = 0; i < 20; i++) {
    const angle = rnd() * Math.PI * 2
    const reach = Math.sqrt(rnd())
    disc(
      ctx,
      x + Math.cos(angle) * rx * reach,
      cy + Math.sin(angle) * ry * reach,
      height * (0.065 + rnd() * 0.05),
      colors.leaf,
    )
  }

  // sunlit clumps on the upper-right shoulder
  for (let i = 0; i < 9; i++) {
    const angle = -0.45 + rnd() * 2.2
    const reach = 0.35 + rnd() * 0.55
    disc(
      ctx,
      x + Math.cos(angle) * rx * reach,
      cy + Math.sin(angle) * ry * reach,
      height * (0.042 + rnd() * 0.035),
      colors.leaf2,
    )
  }

  // ragged hem: little leaf blocks catch the last light
  for (let i = 0; i < 14; i++) {
    const angle = rnd() * Math.PI
    const reach = 0.72 + rnd() * 0.35
    const lx = x + Math.cos(angle) * rx * reach
    const ly = cy + Math.sin(angle) * ry * reach * 1.05
    const size = Math.max(1, Math.round(height * (0.012 + rnd() * 0.018)))
    rect(ctx, lx, ly, size, 1, rnd() > 0.55 ? colors.leaf2 : colors.leaf)
    if (rnd() > 0.55) rect(ctx, lx + 1, ly + 1, 1, 1, shade)
  }

  // a few loose leaves drifting below the crown
  for (let i = 0; i < 5; i++) {
    const lx = x + (rnd() - 0.5) * height * 0.4
    const ly = cy + height * (0.22 + rnd() * 0.05)
    rect(ctx, lx, ly, Math.max(1, height * 0.022), 1, i % 2 ? colors.leaf2 : colors.leaf)
  }

  if (colors.rim) {
    ctx.globalAlpha = 0.32
    disc(ctx, x + height * 0.11, cy - height * 0.07, height * 0.09, colors.rim)
    disc(ctx, x + height * 0.2, cy + height * 0.03, height * 0.055, colors.rim)
    ctx.globalAlpha = 1
  }
}

export function windowSunset(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  vgrad(
    ctx,
    x,
    y,
    w,
    h,
    [
      [0, '#3a2b55'],
      [0.34, '#6c4a68'],
      [0.62, '#b8747e'],
      [0.82, '#e39a7d'],
      [1, '#f6c690'],
    ],
    18,
  )
  // sun
  const sr = Math.max(3, h * 0.1)
  const sx = x + w * 0.66
  const sy = y + h * 0.72
  glow(ctx, sx, sy, sr * 4, '#ffd7a0', 0.28)
  disc(ctx, sx, sy, sr, '#ffe2ae', '#f8c78f')
  // clouds
  const c1 = ((t * 1.3) % (w + 30)) - 15
  cloud(ctx, x + c1, y + h * 0.2, Math.max(0.5, w / 120), '#b77f8d', '#94647d', '#edb59c')
  const c2 = ((t * 0.7 + w * 0.6) % (w + 40)) - 20
  cloud(ctx, x + c2, y + h * 0.42, Math.max(0.5, w / 150), '#c68a8c', '#a06d7c', '#f4c5a0')
  // distant city
  city(ctx, x + w * 0.18, y + h * 0.9, w * 0.8, h * 0.16, 5, '#5a3d58', '#f6c98f')
  ctx.fillStyle = '#4b3350'
  ctx.fillRect(x, y + h * 0.89, w, h * 0.11)
  // birds
  ctx.globalAlpha = 0.55
  ctx.fillStyle = '#4e3350'
  ctx.fillRect(x + w * 0.28, y + h * 0.3, 2, 1)
  ctx.fillRect(x + w * 0.3, y + h * 0.29, 1, 1)
  ctx.fillRect(x + w * 0.32, y + h * 0.3, 2, 1)
  ctx.globalAlpha = 1
  // glass shine
  ctx.globalAlpha = 0.06
  ctx.fillStyle = '#fff6e9'
  ctx.fillRect(x + w * 0.62, y, w * 0.1, h)
  ctx.fillRect(x + w * 0.76, y, w * 0.04, h)
  ctx.globalAlpha = 1
  ctx.restore()
}

export function stringLights(
  ctx: Ctx,
  x0: number,
  x1: number,
  y: number,
  sag: number,
  t: number,
  opts: { spacing?: number; bulb?: string; wire?: string; glowSize?: number } = {},
) {
  const { spacing = 16, bulb = '#ffd392', wire = '#2a2038', glowSize = 10 } = opts
  ctx.fillStyle = wire
  for (let x = x0; x < x1; x++) {
    const u = (x - x0) / (x1 - x0)
    const yy = y + Math.sin(u * Math.PI) * sag
    ctx.fillRect(x, Math.round(yy), 1, 1)
  }
  const count = Math.max(2, Math.floor((x1 - x0) / spacing))
  for (let i = 0; i <= count; i++) {
    const x = x0 + ((x1 - x0) / count) * i
    const u = (x - x0) / (x1 - x0)
    const yy = y + Math.sin(u * Math.PI) * sag
    const flick = 0.75 + 0.25 * Math.sin(t * 2 + i * 1.7)
    glow(ctx, x, yy + 3, glowSize, '#ffcf94', 0.2 * flick)
    ctx.fillStyle = bulb
    ctx.globalAlpha = 0.65 + 0.35 * flick
    ctx.fillRect(Math.round(x) - 1, Math.round(yy), 2, 3)
    ctx.fillStyle = '#c58a5e'
    ctx.fillRect(Math.round(x) - 1, Math.round(yy) + 3, 2, 1)
    ctx.globalAlpha = 1
  }
}

export function fireflies(
  ctx: Ctx,
  w: number,
  _h: number,
  t: number,
  count: number,
  seed: number,
  yFrom: number,
  yTo: number,
  color = '#ffd79a',
) {
  const rnd = mulberry32(seed)
  for (let i = 0; i < count; i++) {
    const bx = rnd() * w
    const by = yFrom + rnd() * (yTo - yFrom)
    const speed = 0.3 + rnd() * 0.5
    const x = bx + Math.sin(t * speed + i * 2.1) * (6 + rnd() * 14)
    const y = by + Math.cos(t * speed * 0.8 + i) * (3 + rnd() * 6)
    const a = 0.18 + 0.8 * Math.abs(Math.sin(t * (0.6 + rnd()) + i * 1.3))
    ctx.globalAlpha = a
    glow(ctx, x, y, 4 + rnd() * 3, color, 0.35)
    rect(ctx, x, y, 1, 1, color)
    ctx.globalAlpha = 1
  }
}

export function pottedPlant(
  ctx: Ctx,
  x: number,
  baseY: number,
  s: number,
  t: number,
  opts: { pot?: string; leaf?: string; leaf2?: string; type?: 'bush' | 'tall' } = {},
) {
  const { pot = '#b0695d', leaf = '#688a6a', leaf2 = '#88a87d' } = opts
  const sway = Math.sin(t * 0.6) * 0.6 * s
  rect(ctx, x - 5 * s, baseY - 6 * s, 10 * s, 6 * s, pot)
  rect(ctx, x - 4 * s, baseY - 6 * s, 8 * s, 1 * s, mix(pot, '#ffffff', 0.18))
  rect(ctx, x - 3 * s, baseY - 1 * s, 6 * s, 1 * s, '#7b4a45')
  if (opts.type === 'tall') {
    rect(ctx, x, baseY - 18 * s, 1 * s, 13 * s, '#4c6b52')
    for (let i = 0; i < 3; i++) {
      const dy = baseY - (9 + i * 4) * s
      rect(ctx, x - (4 - i) * s + sway, dy, (4 - i) * s, 1.5 * s, i % 2 ? leaf2 : leaf)
      rect(ctx, x + 1 * s + sway, dy + 1 * s, (3 + i) * s, 1.5 * s, i % 2 ? leaf : leaf2)
    }
  } else {
    disc(ctx, x + sway, baseY - 12 * s, 5 * s, leaf)
    disc(ctx, x - 4 * s + sway, baseY - 9 * s, 3.5 * s, leaf2)
    disc(ctx, x + 4 * s, baseY - 9 * s, 3.5 * s, leaf)
    disc(ctx, x + 2 * s, baseY - 16 * s, 3 * s, leaf2)
    rect(ctx, x + sway, baseY - 10 * s, 1, 4 * s, '#4c6b52')
  }
}

export function hangingPlant(ctx: Ctx, x: number, y: number, s: number, t: number) {
  const sway = Math.sin(t * 0.5) * s
  ctx.fillStyle = '#886577'
  ctx.fillRect(Math.round(x), Math.round(y), 1, Math.round(16 * s))
  rect(ctx, x - 5 * s, y + 16 * s, 10 * s, 6 * s, '#ae7468')
  rect(ctx, x - 4 * s, y + 16 * s, 8 * s, 1 * s, '#c8907d')
  const leaves = [
    [-6, 24],
    [4, 27],
    [-2, 32],
    [7, 34],
    [-7, 39],
    [2, 43],
  ]
  for (let i = 0; i < leaves.length; i++) {
    const [lx, ly] = leaves[i]
    rect(ctx, x + lx * s + sway, y + ly * s, 4 * s, 2 * s, i % 2 ? '#6f9273' : '#88a87d')
    rect(ctx, x + (lx + 1) * s + sway, y + (ly + 1) * s, 1 * s, 3 * s, '#567a5e')
  }
}

export function heartDrift(ctx: Ctx, x: number, y: number, scale: number, alpha: number) {
  ctx.globalAlpha = alpha
  heart(ctx, x, y, scale, PAL.rose2)
  ctx.globalAlpha = 1
}

export function shootingStar(ctx: Ctx, x: number, y: number, angleX: number, angleY: number, len: number, color = '#fff2d4') {
  for (let i = 0; i < len; i++) {
    const u = i / len
    ctx.globalAlpha = (1 - u) * 0.9
    rect(ctx, x - angleX * i, y - angleY * i, Math.max(1, Math.round(1 - u)), 1, color)
  }
  ctx.globalAlpha = 1
  sparkle(ctx, x, y, color, 1)
}

export function kicker(ctx: Ctx, x: number, y: number, w: number, color: string) {
  rect(ctx, x, y, w, 1, color)
  rect(ctx, x + 2, y + 1, w - 4, 1, rgba(color, 0.4))
}

export function tinySign(ctx: Ctx, x: number, y: number, w: number, h: number, bg: string, border: string, marks: number[]) {
  rect(ctx, x, y, w, h, border)
  rect(ctx, x + 1, y + 1, w - 2, h - 2, bg)
  for (let i = 0; i < marks.length; i++) {
    rect(ctx, x + 3 + i * 3, y + Math.floor(h / 2), 2, 1, border)
  }
}
