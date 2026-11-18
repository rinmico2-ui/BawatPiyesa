import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Memory } from '../lib/content'
import { MemoryArt } from './MemoryArt'
import { PixelIcon } from './PixelIcon'

type Props = {
  memory: Memory
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function MemoryModal({ memory, index, total, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPrev, onNext])

  return (
    <motion.div
      className="memory-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`memory: ${memory.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      onClick={onClose}
    >
      <button
        type="button"
        className="memory-close"
        onClick={onClose}
        aria-label="close this memory"
        data-autofocus
      >
        <PixelIcon name="close" size={15} />
      </button>

      {total > 1 ? (
        <button
          type="button"
          className="memory-nav memory-nav--prev"
          onClick={(event) => {
            event.stopPropagation()
            onPrev()
          }}
          aria-label="previous memory"
        >
          <PixelIcon name="arrow" size={15} />
        </button>
      ) : null}
      {total > 1 ? (
        <button
          type="button"
          className="memory-nav memory-nav--next"
          onClick={(event) => {
            event.stopPropagation()
            onNext()
          }}
          aria-label="next memory"
        >
          <PixelIcon name="arrow" size={15} />
        </button>
      ) : null}

      <motion.article
        className="memory-sheet"
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: [0.2, 0.9, 0.25, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="memory-art-large">
          <div className="art-frame">
            <MemoryArt art={memory.art} width={560} height={350} />
          </div>
          <span className="sticky-note">{memory.sign}</span>
        </div>

        <div className="memory-copy">
          <span className="date">{memory.date}</span>
          <h2>{memory.title}</h2>
          <div className="divider" aria-hidden="true" />
          {memory.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="memory-sign">{memory.sign}</p>
          <div className="memory-nickname">
            <PixelIcon name="heart" size={10} />
            <span>
              a scrapbook page · {index + 1} / {total}
            </span>
          </div>

          <div className="memory-mobile-nav">
            <button type="button" onClick={onPrev} aria-label="previous memory">
              <PixelIcon name="arrow" size={10} className="flip" />
              previous
            </button>
            <button type="button" onClick={onNext} aria-label="next memory">
              next
              <PixelIcon name="arrow" size={10} />
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
