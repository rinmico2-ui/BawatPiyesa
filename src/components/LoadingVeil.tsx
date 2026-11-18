import { motion } from 'framer-motion'
import { PixelIcon } from './PixelIcon'

export function LoadingVeil() {
  return (
    <motion.div
      className="veil"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <span className="veil-heart">
        <PixelIcon name="heart" size={34} />
      </span>
      <div className="veil-text">winding the tape</div>
      <div className="load-bar" aria-hidden="true">
        <i />
      </div>
    </motion.div>
  )
}

export function EnterVeil() {
  return (
    <motion.div
      className="enter-veil"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.span
        className="veil-heart"
        initial={{ scale: 0.9 }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PixelIcon name="heart" size={30} />
      </motion.span>
      <div className="veil-text">entering this little world</div>
    </motion.div>
  )
}
