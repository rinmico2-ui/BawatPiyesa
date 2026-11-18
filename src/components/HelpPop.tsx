import { motion } from 'framer-motion'
import { HELP_ITEMS } from '../lib/content'
import { PixelIcon } from './PixelIcon'

type Props = {
  onClose: () => void
}

export function HelpPop({ onClose }: Props) {
  return (
    <motion.aside
      className="help-pop panel"
      role="dialog"
      aria-label="how this little world works"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.99 }}
      transition={{ duration: 0.24 }}
    >
      <button
        type="button"
        className="dialogue-close"
        onClick={onClose}
        aria-label="close the help card"
        data-autofocus
      >
        <PixelIcon name="close" size={12} />
      </button>

      <h3>how to wander</h3>
      <ul className="help-list">
        {HELP_ITEMS.map((item, index) => (
          <li key={item}>
            <span className="num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="help-foot">
        esc closes anything · m for the tape
        <br />
        headphones make it softer
      </p>
    </motion.aside>
  )
}
