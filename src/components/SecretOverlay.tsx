import { motion } from 'framer-motion'
import { SECRET_MESSAGE, SECRET_TITLE } from '../lib/content'
import { MemoryArt } from './MemoryArt'
import { PixelIcon } from './PixelIcon'

type Props = {
  onClose: () => void
  onOpenGallery: () => void
}

export function SecretOverlay({ onClose, onOpenGallery }: Props) {
  return (
    <motion.div
      className="secret-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="a letter from the moon"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="secret-stars" aria-hidden="true" />

      <motion.article
        className="secret-letter"
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: [0.2, 0.9, 0.25, 1] }}
      >
        <div className="secret-art">
          <MemoryArt art="moon" width={600} height={375} />
        </div>

        <div className="secret-heading">
          <span className="label">a letter, left at the fifth look</span>
          <h2>{SECRET_TITLE}</h2>
        </div>

        <div className="secret-body">
          {SECRET_MESSAGE.map((paragraph) => (
            <p key={paragraph.slice(0, 26)}>{paragraph}</p>
          ))}
        </div>

        <p className="secret-sign">— the moon, and this little world</p>

        <div className="secret-seal" aria-hidden="true">
          <PixelIcon name="heart" size={17} />
        </div>

        <div className="secret-actions">
          <button
            type="button"
            className="pixel-btn pixel-btn--rose"
            onClick={onOpenGallery}
            data-autofocus
          >
            <PixelIcon name="gallery" size={13} />
            open the scrapbook
          </button>
          <button type="button" className="pixel-btn pixel-btn--ghost" onClick={onClose}>
            keep the letter
          </button>
        </div>
      </motion.article>
    </motion.div>
  )
}
