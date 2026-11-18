import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export type PixelFrame = {
  w: number
  h: number
  t: number
  reduced: boolean
}

type Props = {
  draw: (ctx: CanvasRenderingContext2D, frame: PixelFrame) => void
  className?: string
  ariaLabel: string
  paused?: boolean
  onSize?: (w: number, h: number) => void
  /** target logic height in landscape / width in portrait */
  maxFps?: number
}

export function PixelCanvas({ draw, className = '', ariaLabel, paused = false, onSize, maxFps = 30 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  const pausedRef = useRef(paused)
  const onSizeRef = useRef(onSize)
  const reduced = useReducedMotion()
  const reducedRef = useRef(!!reduced)
  drawRef.current = draw
  pausedRef.current = paused
  onSizeRef.current = onSize
  reducedRef.current = !!reduced

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const parent = canvas.parentElement ?? canvas
    let raf = 0
    let start = performance.now()
    let last = 0
    let w = 0
    let h = 0
    let visible = true

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const aspect = rect.width / rect.height
      let nw: number
      let nh: number
      if (aspect >= 1) {
        nh = 220
        nw = Math.round(nh * aspect)
      } else {
        nw = 210
        nh = Math.round(nw / aspect)
      }
      nw = Math.max(120, Math.min(900, nw))
      nh = Math.max(120, Math.min(720, nh))
      if (nw === w && nh === h) return
      w = nw
      h = nh
      canvas.width = w
      canvas.height = h
      ctx.imageSmoothingEnabled = false
      onSizeRef.current?.(w, h)
      render(performance.now())
    }

    const render = (now: number) => {
      if (!w || !h) return
      const t = reducedRef.current ? 0 : (now - start) / 1000
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, w, h)
      drawRef.current(ctx, { w, h, t, reduced: reducedRef.current })
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden || !visible) return
      if (now - last < 1000 / maxFps) return
      last = now
      if (!pausedRef.current) render(now)
    }

    const ro = new ResizeObserver(() => {
      resize()
    })
    ro.observe(parent)
    resize()
    start = performance.now()
    raf = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (!document.hidden) start = performance.now() - last
    }
    document.addEventListener('visibilitychange', onVisibility)
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxFps])

  return (
    <canvas
      ref={canvasRef}
      className={`scene-canvas ${className}`}
      role="img"
      aria-label={ariaLabel}
    />
  )
}
