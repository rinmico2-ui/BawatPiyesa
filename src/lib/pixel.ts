// ─────────────────────────────────────────────────────────────
//  pixel.ts — tiny toolkit for drawing a low-res world on canvas
// ─────────────────────────────────────────────────────────────

export type Ctx = CanvasRenderingContext2D

export const PAL = {
  ink: '#171126',
  ink2: '#211936',
  ink3: '#2c2142',
  plum: '#3a2a4d',
  plum2: '#4a3559',
  plum3: '#5a4064',
  mauve: '#6c4d68',
  mauve2: '#805a74',
  rose: '#c67e8f',
  rose2: '#e3a0ad',
  blush: '#f5c8cf',
  cream: '#f8ecd9',
  cream2: '#ead4b8',
  sand: '#dfb98f',
  amber: '#f0b072',
  orange: '#e68a63',
  sun: '#f7d9a0',
  lilac: '#b7a4d8',
  lilac2: '#d5c8ea',
  mint: '#9dbfae',
  green: '#6d8b74',
  green2: '#496352',
  white: '#fff6e9',
  black: '#0d0a16',
} as const

// ── colour helpers ────────────────────────────────────────────
type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export function sampleStops(stops: [number, string][], t: number): string {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    const [s1, c1] = stops[i]
    const [s0, c0] = stops[i - 1]
    if (t <= s1) return mix(c0, c1, (t - s0) / (s1 - s0))
  }
  return stops[stops.length - 1][1]
}

// ── primitives ────────────────────────────────────────────────
export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(0, Math.round(w)), Math.max(0, Math.round(h)))
}

/** Vertical gradient made of flat pixel bands. */
export function vgrad(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  stops: [number, string][],
  bands = 26,
) {
  const bh = h / bands
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = sampleStops(stops, (i + 0.5) / bands)
    ctx.fillRect(Math.round(x), Math.round(y + i * bh), Math.ceil(w), Math.ceil(bh) + 1)
  }
}

export function disc(ctx: Ctx, cx: number, cy: number, r: number, color: string, ditherColor?: string) {
  ctx.fillStyle = color
  const R = Math.round(r)
  for (let dy = -R; dy <= R; dy++) {
    const half = Math.round(Math.sqrt(Math.max(0, R * R - dy * dy)))
    ctx.fillRect(Math.round(cx - half), Math.round(cy + dy), half * 2 + 1, 1)
  }
  if (ditherColor) {
    ctx.fillStyle = ditherColor
    for (let dy = -R; dy <= R; dy += 2) {
      for (let dx = -R; dx <= R; dx += 2) {
        if (dx * dx + dy * dy < (R - 1) * (R - 1)) {
          if (((dx + dy) & 3) === 0) ctx.fillRect(Math.round(cx + dx), Math.round(cy + dy), 1, 1)
        }
      }
    }
  }
}

export function glow(ctx: Ctx, x: number, y: number, radius: number, color: string, alpha = 0.3) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
  g.addColorStop(0, rgba(color, alpha))
  g.addColorStop(0.55, rgba(color, alpha * 0.45))
  g.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = g
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

export function stars(ctx: Ctx, w: number, h: number, seed: number, count: number, color = PAL.cream, maxY = h) {
  const rnd = mulberry32(seed)
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rnd() * w)
    const y = Math.floor(rnd() * maxY)
    const a = 0.25 + rnd() * 0.6
    ctx.globalAlpha = a
    ctx.fillStyle = color
    ctx.fillRect(x, y, rnd() > 0.9 ? 2 : 1, 1)
  }
  ctx.globalAlpha = 1
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── pixel motifs ──────────────────────────────────────────────
export const HEART = ['.##.##.', '#######', '.#####.', '..###..', '...#...']

export function heart(ctx: Ctx, x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color
  const s = Math.max(1, Math.round(scale))
  HEART.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      if (row[rx] === '#') ctx.fillRect(Math.round(x + rx * s), Math.round(y + ry * s), s, s)
    }
  })
}

export function heartOutline(ctx: Ctx, x: number, y: number, scale: number, color: string) {
  const s = Math.max(1, Math.round(scale))
  const dark = PAL.ink2
  HEART.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      if (row[rx] !== '#') continue
      ctx.fillStyle = color
      ctx.fillRect(Math.round(x + rx * s), Math.round(y + ry * s), s, s)
      // cheap inner shadow
      if (rx === 1 && ry === 0) {
        ctx.fillStyle = dark
        ctx.fillRect(Math.round(x + rx * s), Math.round(y + ry * s), s, 1)
      }
    }
  })
}

export function sparkle(ctx: Ctx, x: number, y: number, color: string, size = 1) {
  rect(ctx, x, y - size, 1, size * 2 + 1, color)
  rect(ctx, x - size, y, size * 2 + 1, 1, color)
}

export function cloud(
  ctx: Ctx,
  x: number,
  y: number,
  s: number,
  body: string,
  shade: string,
  light: string,
) {
  const u = Math.max(0.55, s)
  const lobes: [number, number, number][] = [
    [4.8, 4.3, 3.5],
    [9.8, 2.7, 4.9],
    [15.2, 4.1, 3.3],
    [10.2, 5.1, 5.3],
    [6.6, 5.2, 3.2],
  ]
  // soft under-shadow
  for (const [cx, cy, r] of lobes) {
    disc(ctx, x + cx * u, y + cy * u + u * 0.8, r * u, shade)
  }
  // sunlit body
  for (const [cx, cy, r] of lobes) {
    disc(ctx, x + cx * u, y + cy * u, r * u, body)
  }
  // a lighter crown, kissed by the last light
  disc(ctx, x + 9.6 * u, y + 1.5 * u, 3.1 * u, mix(body, light, 0.2))
  disc(ctx, x + 4.6 * u, y + 3.2 * u, 1.7 * u, mix(body, light, 0.16))
  ctx.globalAlpha = 0.4
  ctx.fillStyle = mix(body, light, 0.1)
  for (let dx = 2; dx < 19; dx += 3) {
    ctx.fillRect(Math.round(x + (dx + 1) * u), Math.round(y + 2.2 * u + Math.sin(dx) * u), Math.ceil(u), Math.ceil(u))
  }
  ctx.globalAlpha = 1
  // warm rim where the sunset catches the belly of the cloud
  ctx.fillStyle = light
  const rims: [number, number, number][] = [
    [10.2, 5.1, 5.3],
    [4.8, 4.3, 3.5],
    [15.2, 4.1, 3.3],
  ]
  for (const [cx, cy, r] of rims) {
    for (let dx = -r; dx <= r; dx++) {
      if ((dx + Math.round(r)) % 3 !== 0) continue
      const yy = Math.sqrt(Math.max(0, r * r - dx * dx))
      ctx.fillRect(Math.round(x + (cx + dx) * u), Math.round(y + (cy + yy) * u), Math.ceil(u * 0.8), Math.ceil(u * 0.8))
    }
  }
}

export function city(
  ctx: Ctx,
  x: number,
  baseY: number,
  w: number,
  maxH: number,
  seed: number,
  body = '#3f2e4d',
  lit = '#f0b072',
) {
  const rnd = mulberry32(seed)
  let cx = x
  while (cx < x + w) {
    const bw = 4 + Math.floor(rnd() * 9)
    const bh = 4 + Math.floor(rnd() * maxH)
    rect(ctx, cx, baseY - bh, bw, bh, body)
    // roof details
    if (rnd() > 0.6) rect(ctx, cx + 1, baseY - bh - 2, 1, 2, body)
    if (rnd() > 0.75) rect(ctx, cx + 2, baseY - bh - 1, 2, 1, body)
    // windows
    for (let wy = baseY - bh + 3; wy < baseY - 1; wy += 3) {
      for (let wx = cx + 1; wx < cx + bw - 1; wx += 2) {
        if (rnd() > 0.55) {
          ctx.globalAlpha = 0.5 + rnd() * 0.5
          rect(ctx, wx, wy, 1, 1, lit)
          ctx.globalAlpha = 1
        }
      }
    }
    cx += bw + 1
  }
}

export function bird(ctx: Ctx, x: number, y: number, color: string, frame = 0) {
  ctx.fillStyle = color
  if (frame === 0) {
    ctx.fillRect(x, y + 1, 2, 1)
    ctx.fillRect(x + 2, y, 1, 1)
    ctx.fillRect(x + 3, y, 1, 1)
    ctx.fillRect(x + 4, y + 1, 2, 1)
  } else {
    ctx.fillRect(x, y, 2, 1)
    ctx.fillRect(x + 2, y + 1, 1, 1)
    ctx.fillRect(x + 3, y + 1, 1, 1)
    ctx.fillRect(x + 4, y, 2, 1)
  }
}

// ── sprites ───────────────────────────────────────────────────
export type SpriteOpts = {
  map: Record<string, string>
  scale?: number
  flip?: boolean
  blink?: boolean
  alpha?: number
  silhouette?: string
  rim?: string
}

export function drawSprite(ctx: Ctx, art: string[], x: number, y: number, opts: SpriteOpts) {
  const s = opts.scale ?? 1
  const map = opts.map
  const eye = map.e ?? PAL.ink2
  const skin = map.s ?? PAL.cream
  const eyes: [number, number][] = []

  if (opts.alpha != null) ctx.globalAlpha = opts.alpha

  const paint = (offsetX = 0, offsetY = 0, override?: string) => {
    for (let row = 0; row < art.length; row++) {
      const line = art[row]
      for (let col = 0; col < line.length; col++) {
        const ch = line[col]
        if (ch === '.') continue
        const c = override ?? map[ch]
        if (!c) continue
        ctx.fillStyle = c
        const px = opts.flip ? x + (line.length - 1 - col) * s : x + col * s
        ctx.fillRect(Math.round(px + offsetX), Math.round(y + row * s + offsetY), Math.ceil(s), Math.ceil(s))
      }
    }
  }

  if (opts.rim) {
    paint(s * 0.8, -s * 0.4, opts.rim)
    paint(-s * 0.3, 0, opts.rim)
  }

  if (opts.silhouette) {
    paint(0, 0, opts.silhouette)
    if (opts.alpha != null) ctx.globalAlpha = 1
    return
  }

  const mapped = opts.blink ? { ...map, e: skin } : map
  for (let row = 0; row < art.length; row++) {
    const line = art[row]
    for (let col = 0; col < line.length; col++) {
      const ch = line[col]
      if (ch === '.') continue
      if (ch === 'e' && opts.blink) eyes.push([col, row])
      const c = mapped[ch]
      if (!c) continue
      ctx.fillStyle = c
      const px = opts.flip ? x + (line.length - 1 - col) * s : x + col * s
      ctx.fillRect(Math.round(px), Math.round(y + row * s), Math.ceil(s), Math.ceil(s))
    }
  }

  // closed eyes: a soft lash beneath each eye pixel
  if (opts.blink) {
    ctx.fillStyle = eye
    for (const [col, row] of eyes) {
      const px = opts.flip ? x + (art[row].length - 1 - col) * s : x + col * s
      ctx.fillRect(Math.round(px), Math.round(y + (row + 1) * s - Math.max(1, Math.round(s * 0.35))), Math.ceil(s), Math.max(1, Math.round(s * 0.35)))
    }
  }

  if (opts.alpha != null) ctx.globalAlpha = 1
}

/** Draws a raised waving arm next to a character sprite. */
export function waveArm(
  ctx: Ctx,
  x: number,
  y: number,
  scale: number,
  side: 'left' | 'right',
  sleeve: string,
  skin: string,
  phase = 0,
) {
  const s = scale
  const dir = side === 'right' ? 1 : -1
  const baseX = x + (dir === 1 ? 10.5 * s : 1.5 * s)
  const wob = Math.round(Math.sin(phase * 9) * 0.6 * s)
  rect(ctx, baseX, y + 9 * s, 2 * s, 4 * s, sleeve)
  rect(ctx, baseX + wob, y + 6.5 * s, 2 * s, 3 * s, skin)
  rect(ctx, baseX + wob + dir * s, y + 6 * s, s, s, skin)
}

/** A soft pixel shadow beneath a character. */
export function groundShadow(ctx: Ctx, cx: number, y: number, width: number, alpha = 0.25) {
  ctx.globalAlpha = alpha
  rect(ctx, cx - width / 2, y, width, Math.max(1, width * 0.12), PAL.black)
  ctx.globalAlpha = 1
}

/** Falling leaf, spinning. */
export function leaf(ctx: Ctx, x: number, y: number, spin: number, color: string) {
  if (spin % 4 < 2) {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), 2, 1)
    ctx.fillRect(Math.round(x + 1), Math.round(y + 1), 1, 1)
  } else {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), 1, 2)
  }
}

/** Handful of drifting hearts, driven by time since a click. */
export function heartBurst(ctx: Ctx, age: number, cx: number, cy: number, seed = 0, spread = 1) {
  if (age < 0 || age > 2600) return
  const p = age / 2600
  const rnd = mulberry32(seed + 11)
  for (let i = 0; i < 7; i++) {
    const dx = (rnd() - 0.5) * 26 * spread
    const rise = 30 * spread + rnd() * 26
    const x = cx + dx + Math.sin(age / 340 + i * 2) * 3
    const y = cy - p * rise - rnd() * 6
    const a = p < 0.75 ? 1 : 1 - (p - 0.75) / 0.25
    ctx.globalAlpha = a
    heart(ctx, x - 3, y - 3, 1, i % 3 === 0 ? PAL.blush : PAL.rose2)
    ctx.globalAlpha = 1
  }
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
