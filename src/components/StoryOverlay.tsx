import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { STORY_LINES } from '../lib/content'
import { PixelIcon } from './PixelIcon'

type Props = {
  onClose: () => void
  onOpenGallery: () => void
}

export function StoryOverlay({ onClose, onOpenGallery }: Props) {
  const [index, setIndex] = useState(0)
  const line = STORY_LINES[index]
  const { shown, done, skip } = useTypewriter(line, true, 22)
  const last = index === STORY_LINES.length - 1
  const actionRef = useRef<() => void>(() => undefined)

  const advance = () => {
    if (!done) {
      skip()
      return
    }
    if (!last) setIndex((i) => i + 1)
    else onClose()
  }
  actionRef.current = advance

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, select')) return
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
        event.preventDefault()
        actionRef.current()
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault()
        setIndex((i) => Math.max(0, i - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  return (
    <motion.section
      className="story-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="a short story in six small pieces"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="story-bg" aria-hidden="true" onClick={onClose} />
      <div className="story-stars" aria-hidden="true" />

      <div className="story-top">
        <span className="label">an original little story</span>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="close the story"
          data-autofocus
        >
          <PixelIcon name="close" size={14} />
        </button>
      </div>

      <div className="story-heading">
        <h2>every little piece</h2>
        <p>six small truths, in no particular order</p>
      </div>

      <div className="story-dialogue">
        <span className="speaker-tab">
          <PixelIcon name="heart" size={9} />
          the quiet voice
        </span>

        <p className="sr-only" aria-live="polite">
          {line}
        </p>
        <p className="story-quote" aria-hidden="true">
          {shown}
          {!done ? <span className="caret" /> : null}
        </p>

        <div className="dialogue-foot">
          <div className="story-progress" aria-label={`piece ${index + 1} of ${STORY_LINES.length}`}>
            {STORY_LINES.map((_, i) => (
              <span key={i} className={`pip ${i <= index ? 'pip--on' : ''}`} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {index > 0 ? (
              <button type="button" className="dialogue-next" onClick={() => setIndex((i) => i - 1)}>
                back
              </button>
            ) : null}
            <button type="button" className="dialogue-next" onClick={advance}>
              {done ? (last ? 'close' : 'next') : 'skip'}
              <PixelIcon name="arrow" size={10} className="pulse" />
            </button>
          </div>
        </div>

        {last && done ? (
          <motion.div
            className="story-end-actions"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button type="button" className="pixel-btn pixel-btn--rose" onClick={onOpenGallery}>
              <PixelIcon name="gallery" size={14} />
              open the scrapbook
            </button>
            <button type="button" className="pixel-btn pixel-btn--ghost" onClick={onClose}>
              keep wandering
            </button>
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  )
}
