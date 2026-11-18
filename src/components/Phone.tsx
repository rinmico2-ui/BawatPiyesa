import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MESSAGES } from '../lib/content'
import { PixelIcon } from './PixelIcon'

type Props = {
  open: boolean
  onClose: () => void
}

export function Phone({ open, onClose }: Props) {
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!open) {
      setShown(0)
      setTyping(false)
      return
    }
    setShown(0)
    setTyping(true)
    const t = window.setTimeout(() => {
      setShown(1)
      setTyping(false)
    }, 900)
    return () => window.clearTimeout(t)
  }, [open])

  const advance = () => {
    if (typing) return
    if (shown >= MESSAGES.length) {
      onClose()
      return
    }
    setTyping(true)
    window.setTimeout(() => {
      setShown((s) => s + 1)
      setTyping(false)
    }, 700)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="phone-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      {open ? (
        <motion.aside
          className="phone"
          role="dialog"
          aria-modal="true"
          aria-label="a little phone"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
        >
          <div className="phone-top">
            <span className="label">a little phone</span>
            <button
              type="button"
              className="player-close"
              onClick={onClose}
              aria-label="close the phone"
              data-autofocus
            >
              <PixelIcon name="close" size={13} />
            </button>
          </div>
          <div className="phone-screen" onClick={advance}>
            <div className="phone-chat">
              {MESSAGES.slice(0, shown).map((msg, i) => (
                <motion.div
                  key={`${i}-${msg.text}`}
                  className={`phone-bubble phone-bubble--${msg.from}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.text}
                </motion.div>
              ))}
              {typing ? (
                <div className="phone-typing" aria-live="polite">
                  <span />
                  <span />
                  <span />
                </div>
              ) : null}
            </div>
            <div className="phone-hint">
              {shown >= MESSAGES.length
                ? 'tap anywhere to close'
                : typing
                  ? 'typing…'
                  : 'tap to read the next message'}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
