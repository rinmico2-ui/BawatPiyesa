import { motion } from 'framer-motion'
import { PixelCanvas } from './PixelCanvas'
import { PixelIcon } from './PixelIcon'
import { drawField } from '../lib/scenes/field'

export function Opening({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="opening" aria-label="Somewhere Between Us — an interactive little world">
      <div className="absolute inset-0" aria-hidden="true">
        <PixelCanvas
          draw={(ctx, { w, h, t, reduced }) => drawField(ctx, { w, h, t, reduced })}
          ariaLabel="A pixel-art person stands in a quiet field at sunset, watching a distant city. Clouds drift slowly and grass moves in the wind."
        />
      </div>

      <div className="sun-bloom" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true">
        <div className="scanlines" />
        <div className="grain" />
        <div className="vignette" />
      </div>

      <header className="opening-top">
        <div className="brand">
          <span className="brand-mark">
            <PixelIcon name="heart" size={15} />
          </span>
          <div>
            <span className="brand-name">somewhere between us</span>
            <span className="brand-sub">a little world</span>
          </div>
        </div>
        <div className="opening-credit">
          for the song by
          <b>munimuni · 2019</b>
        </div>
      </header>

      <motion.div
        className="opening-content"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
        }}
      >
        <motion.span
          className="eyebrow"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
        >
          <PixelIcon name="sparkle" size={11} className="text-blush/80" />
          an interactive little world
        </motion.span>

        <motion.h1
          className="opening-title"
          variants={{
            hidden: { opacity: 0, y: 22 },
            show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          Somewhere Between Us
        </motion.h1>

        <motion.div
          className="opening-rule"
          aria-hidden="true"
          variants={{ hidden: { opacity: 0, scaleX: 0.4 }, show: { opacity: 1, scaleX: 1, transition: { duration: 0.8 } } }}
        >
          <span className="line" />
          <PixelIcon name="heart" size={12} />
          <span className="line" />
        </motion.div>

        <motion.p
          className="opening-sub"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
        >
          Somewhere, in another province... there's someone I wish was a little closer.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
        >
          <button type="button" className="pixel-btn enter-btn" onClick={onEnter}>
            <PixelIcon name="heart" size={15} className="enter-heart" />
            Enter this little world
            <PixelIcon name="arrow" size={13} />
          </button>
        </motion.div>

        <motion.p
          className="opening-foot-hint"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 0.4 } } }}
        >
          a quiet game · headphones recommended
        </motion.p>
      </motion.div>

      <footer className="opening-footer">
        <div>
          an unofficial fan-made love letter
          <br />
          no album audio · no lyrics
        </div>
        <div className="right">
          the song lives at
          <br />
          <a href="https://www.youtube.com/watch?v=0E8B6yl4I5I" target="_blank" rel="noreferrer noopener">
            youtube ↗
          </a>{' '}
          &nbsp;
          <a href="https://open.spotify.com/album/0BDVa2cVDEhfy3telrAIux" target="_blank" rel="noreferrer noopener">
            spotify ↗
          </a>
        </div>
      </footer>
    </main>
  )
}
