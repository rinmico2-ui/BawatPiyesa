import { useEffect, useRef } from 'react'
import { drawMemoryArt } from '../lib/memoryArt'
import type { MemoryArtKey } from '../lib/content'

type Props = {
  art: MemoryArtKey
  /** logical canvas size; CSS scales it down with crisp pixels */
  width?: number
  height?: number
  className?: string
}

/** A static pixel-art illustration rendered once, then scaled by CSS. */
export function MemoryArt({ art, width = 480, height = 300, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    drawMemoryArt(ctx, art, width, height)
  }, [art, width, height])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
