import { AnimatePresence, motion } from 'framer-motion'
import { PixelIcon } from './PixelIcon'

export type ToastData = { id: number; text: string }

export function Toast({ toast }: { toast: ToastData | null }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          className="toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 10, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 8, x: '-50%' }}
          transition={{ duration: 0.28 }}
        >
          <PixelIcon name="sparkle" size={11} className="text-blush" />
          <span>{toast.text}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
