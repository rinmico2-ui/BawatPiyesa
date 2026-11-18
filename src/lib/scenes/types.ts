// ─────────────────────────────────────────────────────────────
//  scenes/types.ts
// ─────────────────────────────────────────────────────────────

export type LocationId = 'bedroom' | 'street' | 'rooftop'

export type HeartBurst = {
  id: number
  at: number
  x: number // normalized
  y: number
  seed: number
}

export type SceneFx = {
  now: number
  waveAAt: number
  waveBAt: number
  shoots: { id: number; at: number; x: number; y: number }[]
  moonClicks: number
  secret: boolean
  heartBursts: HeartBurst[]
  catAt: number
}

export type DrawArgs = {
  w: number
  h: number
  t: number
  reduced: boolean
  fx: SceneFx
}

export type Hotspot = {
  id: string
  label: string
  /** normalized 0..1 */
  x: number
  y: number
  w: number
  h: number
}

export type Rect = { x: number; y: number; w: number; h: number }

export type SceneDef = {
  id: LocationId
  index: string
  name: string
  tagline: string
  aria: string
  draw: (ctx: CanvasRenderingContext2D, args: DrawArgs) => void
  hotspots: (w: number, h: number) => Hotspot[]
}

export function toHotspot(id: string, label: string, r: Rect, w: number, h: number, pad = 6): Hotspot {
  return {
    id,
    label,
    x: (r.x - pad) / w,
    y: (r.y - pad) / h,
    w: (r.w + pad * 2) / w,
    h: (r.h + pad * 2) / h,
  }
}
