import { motion } from 'framer-motion'
import { MEMORIES } from '../lib/content'
import { MemoryArt } from './MemoryArt'
import { PixelIcon } from './PixelIcon'

type Props = {
  unlocked: boolean
  onClose: () => void
  onSelect: (index: number) => void
  onLocked: () => void
  onOpenSecret?: () => void
}

export function Gallery({ unlocked, onClose, onSelect, onLocked, onOpenSecret }: Props) {
  const found = unlocked ? MEMORIES.length : MEMORIES.length - 1

  return (
    <motion.section
      className="gallery-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="the scrapbook of little memories"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.38, ease: [0.2, 0.9, 0.25, 1] }}
    >
      <div className="gallery-inner">
        <header className="gallery-head">
          <div>
            <span className="label">the scrapbook · {found} of 6 pieces</span>
            <h2>Little pieces</h2>
            <p className="sub">
              A pocketful of ordinary evenings. Taped in, one by one, because they turned out to matter.
            </p>
          </div>
          <div className="gallery-head-actions">
            {unlocked && onOpenSecret ? (
              <button
                type="button"
                className="pixel-btn pixel-btn--ghost gallery-secret-btn"
                onClick={onOpenSecret}
              >
                <PixelIcon name="heart" size={12} />
                read the moon letter
              </button>
            ) : null}
            <button
              type="button"
              className="icon-btn gallery-close"
              onClick={onClose}
              aria-label="close the scrapbook"
              data-autofocus
            >
              <PixelIcon name="close" size={16} />
            </button>
          </div>
        </header>

        <div className="gallery-scrapbook">
          {MEMORIES.map((memory, index) => {
            const locked = Boolean(memory.locked) && !unlocked
            if (locked) {
              return (
                <button
                  key={memory.id}
                  type="button"
                  className="memory-card memory-card--locked"
                  onClick={onLocked}
                  aria-label="a locked memory — the moon is still keeping it"
                >
                  <span className="memory-tape" aria-hidden="true" />
                  <div className="locked-art">
                    <PixelIcon name="lock" size={18} />
                    <span>the moon is still keeping this one</span>
                  </div>
                  <span className="memory-card-caption">
                    <span className="date">still hidden</span>
                    <span className="title">A memory the moon keeps</span>
                    <span className="excerpt">Look up. Look longer. Return to the rooftop after dark.</span>
                  </span>
                </button>
              )
            }
            return (
              <button
                key={memory.id}
                type="button"
                className="memory-card"
                onClick={() => onSelect(index)}
                aria-label={`open memory: ${memory.title}`}
              >
                <span className="memory-tape" aria-hidden="true" />
                <div className="memory-art-frame">
                  <MemoryArt art={memory.art} />
                </div>
                <span className="memory-card-caption">
                  <span className="date">{memory.date}</span>
                  <span className="title">{memory.title}</span>
                  <span className="excerpt">{memory.excerpt}</span>
                </span>
                <PixelIcon name="heart" size={14} className="card-heart" />
              </button>
            )
          })}
        </div>

        <span className="gallery-stamp" aria-hidden="true">
          {found} / 6 found · kept with care
        </span>
      </div>
    </motion.section>
  )
}
