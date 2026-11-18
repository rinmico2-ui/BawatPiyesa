import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { DialogueData } from '../lib/content'
import { PixelIcon } from './PixelIcon'

type Props = {
  data: DialogueData
  /** changes every time the same character is clicked again */
  sessionId: number
  onClose: () => void
}

export function DialogueBox({ data, sessionId, onClose }: Props) {
  const [index, setIndex] = useState(0)
  const last = index === data.lines.length - 1
  const line = data.lines[index]
  const { shown, done, skip } = useTypewriter(line, true, 16)
  const advanceRef = useRef<() => void>(() => undefined)

  useEffect(() => {
    setIndex(0)
  }, [sessionId, data])

  const advance = () => {
    if (!done) {
      skip()
      return
    }
    if (!last) setIndex((i) => i + 1)
    else onClose()
  }
  advanceRef.current = advance

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowRight') return
      const target = event.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, select')) return
      event.preventDefault()
      advanceRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.div
        className="dialogue-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="dialogue-wrap">
        <motion.div
          className="dialogue-box"
          role="dialog"
          aria-modal="true"
          aria-label={`${data.speaker} — click to continue`}
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.2, 0.9, 0.25, 1] }}
          onClick={advance}
        >
          <span className="speaker-tab">
            <PixelIcon name="sparkle" size={9} />
            {data.speaker}
          </span>
          <button
            type="button"
            className="dialogue-close"
            onClick={(event) => {
              event.stopPropagation()
              onClose()
            }}
            aria-label="close this little thought"
            data-autofocus
          >
            <PixelIcon name="close" size={13} />
          </button>

          <p className="sr-only" aria-live="polite">
            {line}
          </p>
          <p className="dialogue-text" aria-hidden="true">
            {shown}
            {!done ? <span className="caret" /> : null}
          </p>

          <div className="dialogue-foot">
            <span className="tiny text-cream/35" aria-hidden="true">
              {index + 1} / {data.lines.length}
            </span>
            <button
              type="button"
              className="dialogue-next"
              onClick={(event) => {
                event.stopPropagation()
                advance()
              }}
            >
              {done ? (last ? 'close' : 'next') : 'skip'}
              <PixelIcon name="arrow" size={10} className="pulse" />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
