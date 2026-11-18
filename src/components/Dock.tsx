import { motion } from 'framer-motion'
import type { LocationId } from '../lib/scenes/types'
import { LOCATIONS } from '../lib/content'
import { PixelIcon } from './PixelIcon'

const ORDER: LocationId[] = ['bedroom', 'street', 'rooftop']
const ICONS = { bedroom: 'room', street: 'street', rooftop: 'rooftop' } as const
const SHORT = { bedroom: 'bedroom', street: 'street', rooftop: 'rooftop' } as const

type Props = {
  location: LocationId
  galleryOpen: boolean
  storyOpen: boolean
  onLocation: (id: LocationId) => void
  onGallery: () => void
  onStory: () => void
}

export function Dock({ location, galleryOpen, storyOpen, onLocation, onGallery, onStory }: Props) {
  return (
    <nav className="dock-wrap" aria-label="wander the little world">
      {ORDER.map((id, i) => {
        const active = location === id && !galleryOpen && !storyOpen
        return (
          <button
            key={id}
            type="button"
            className={`dock-item ${active ? 'dock-item--active' : ''}`}
            onClick={() => onLocation(id)}
            aria-current={active ? 'page' : undefined}
            aria-label={`go to ${LOCATIONS[id].name} (press ${i + 1})`}
            title={`${LOCATIONS[id].name} · ${i + 1}`}
          >
            {active ? (
              <motion.span
                layoutId="dock-pill"
                className="dock-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            <PixelIcon name={ICONS[id]} size={18} />
            <span>{SHORT[id]}</span>
          </button>
        )
      })}

      <div className="dock-divider" aria-hidden="true" />

      <button
        type="button"
        className={`dock-item ${galleryOpen ? 'dock-item--active' : ''}`}
        onClick={onGallery}
        aria-current={galleryOpen ? 'page' : undefined}
        aria-label="open the scrapbook (press 4)"
        title="the scrapbook · 4"
      >
        {galleryOpen ? (
          <motion.span
            layoutId="dock-pill"
            className="dock-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        ) : null}
        <PixelIcon name="gallery" size={18} />
        <span>scrapbook</span>
      </button>

      <button
        type="button"
        className={`dock-item ${storyOpen ? 'dock-item--active' : ''}`}
        onClick={onStory}
        aria-current={storyOpen ? 'page' : undefined}
        aria-label="read the story (press 5)"
        title="the story · 5"
      >
        {storyOpen ? (
          <motion.span
            layoutId="dock-pill"
            className="dock-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        ) : null}
        <PixelIcon name="story" size={18} />
        <span>story</span>
      </button>
    </nav>
  )
}
