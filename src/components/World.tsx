import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PixelCanvas, type PixelFrame } from './PixelCanvas'
import { TopBar } from './TopBar'
import { Dock } from './Dock'
import { DialogueBox } from './DialogueBox'
import { StoryOverlay } from './StoryOverlay'
import { MusicPlayer } from './MusicPlayer'
import { Gallery } from './Gallery'
import { MemoryModal } from './MemoryModal'
import { SecretOverlay } from './SecretOverlay'
import { HelpPop } from './HelpPop'
import { Toast, type ToastData } from './Toast'
import { useLullaby } from '../hooks/useLullaby'
import { usePersistentState } from '../hooks/usePersistentState'
import { bedroomScene } from '../lib/scenes/bedroom'
import { streetScene } from '../lib/scenes/street'
import { rooftopScene } from '../lib/scenes/rooftop'
import type { Hotspot, LocationId, SceneDef, SceneFx } from '../lib/scenes/types'
import { DIALOGUES, MEMORIES } from '../lib/content'

const SCENES: Record<LocationId, SceneDef> = {
  bedroom: bedroomScene,
  street: streetScene,
  rooftop: rooftopScene,
}

const ORDER: LocationId[] = ['bedroom', 'street', 'rooftop']

const HINTS: Record<LocationId, string> = {
  bedroom: 'the cassette · the window · the quiet cat',
  street: 'the shop · the bench · the passing stranger',
  rooftop: 'look up · some things take five looks',
}

const FIRST_VISIT: Record<LocationId, string> = {
  bedroom: '',
  street: 'the street · the lamps are just coming on',
  rooftop: 'the rooftop · the city looks smaller from up here',
}

type DialogueState = { id: string; session: number }

export function World() {
  const [location, setLocation] = useState<LocationId>('bedroom')
  const [visited, setVisited] = useState<Record<LocationId, boolean>>({
    bedroom: true,
    street: false,
    rooftop: false,
  })
  const [size, setSize] = useState({ w: 0, h: 0 })

  const [moonClicks, setMoonClicks] = usePersistentState('bp-moon', 0)
  const [secret, setSecret] = usePersistentState('bp-secret', false)
  const [unlocked, setUnlocked] = usePersistentState('bp-unlocked', false)
  const [welcomed, setWelcomed] = usePersistentState('bp-welcomed', false)
  const moonUnlocked = secret || unlocked

  const lullaby = useLullaby()

  const [overlay, setOverlay] = useState<null | 'story' | 'gallery' | 'help' | 'secret'>(null)
  const [dialogue, setDialogue] = useState<DialogueState | null>(null)
  const [memoryIndex, setMemoryIndex] = useState<number | null>(null)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const toastId = useRef(0)
  const dialogueSession = useRef(0)
  const shootId = useRef(0)
  const burstId = useRef(0)
  const lastFocus = useRef<HTMLElement | null>(null)
  const secretToast = useRef(false)

  const waveARef = useRef(0)
  const waveBRef = useRef(0)
  const catRef = useRef(0)
  const shootsRef = useRef<SceneFx['shoots']>([])
  const burstsRef = useRef<SceneFx['heartBursts']>([])
  const moonRef = useRef(moonClicks)
  const secretRef = useRef(secret)

  const notify = useCallback((text: string) => {
    toastId.current += 1
    setToast({ id: toastId.current, text })
  }, [])

  const scene = SCENES[location]

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    moonRef.current = moonClicks
  }, [moonClicks])

  useEffect(() => {
    secretRef.current = secret
  }, [secret])

  useEffect(() => {
    if (welcomed) return
    setWelcomed(true)
    notify('welcome in · click the little things')
  }, [welcomed, setWelcomed, notify])

  // warm the tape while the player is open, without autoplaying anything
  useEffect(() => {
    if (playerOpen) void lullaby.prepare()
  }, [playerOpen, lullaby.prepare])

  // quietly render the lullaby after entering, so the first play is warm
  useEffect(() => {
    const timer = window.setTimeout(() => void lullaby.prepare(), 900)
    return () => window.clearTimeout(timer)
  }, [lullaby.prepare])

  const handleSize = useCallback((w: number, h: number) => {
    setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
  }, [])

  const hotspots = useMemo(
    () => (size.w > 0 && size.h > 0 ? scene.hotspots(size.w, size.h) : []),
    [scene, size.w, size.h],
  )

  const spawnHearts = useCallback((x: number, y: number) => {
    const now = performance.now()
    burstId.current += 1
    burstsRef.current = [
      ...burstsRef.current.filter((burst) => now - burst.at < 2700),
      { id: burstId.current, at: now, x, y, seed: Math.floor(Math.random() * 90) + 3 },
    ]
  }, [])

  const spawnShoot = useCallback((x: number, y: number) => {
    const now = performance.now()
    shootId.current += 1
    shootsRef.current = [
      ...shootsRef.current.filter((shoot) => now - shoot.at < 1200),
      { id: shootId.current, at: now, x, y },
    ]
  }, [])

  const showDialogue = useCallback((id: string) => {
    if (!DIALOGUES[id]) return
    dialogueSession.current += 1
    setOverlay(null)
    setPlayerOpen(false)
    setDialogue({ id, session: dialogueSession.current })
  }, [])

  const openPlayer = useCallback(() => {
    setDialogue(null)
    setOverlay(null)
    setMemoryIndex(null)
    setPlayerOpen(true)
  }, [])

  const togglePlayer = useCallback(() => {
    if (playerOpen) setPlayerOpen(false)
    else openPlayer()
  }, [openPlayer, playerOpen])

  const openGallery = useCallback(() => {
    setDialogue(null)
    setPlayerOpen(false)
    setMemoryIndex(null)
    setOverlay('gallery')
  }, [])

  const toggleGallery = useCallback(() => {
    if (overlay === 'gallery' && memoryIndex === null) {
      setOverlay(null)
      return
    }
    openGallery()
  }, [memoryIndex, openGallery, overlay])

  const openStory = useCallback(() => {
    setDialogue(null)
    setPlayerOpen(false)
    setMemoryIndex(null)
    setOverlay('story')
  }, [])

  const toggleStory = useCallback(() => {
    if (overlay === 'story') {
      setOverlay(null)
      return
    }
    openStory()
  }, [openStory, overlay])

  const toggleHelp = useCallback(() => {
    if (overlay === 'help') {
      setOverlay(null)
      return
    }
    setDialogue(null)
    setPlayerOpen(false)
    setMemoryIndex(null)
    setOverlay('help')
  }, [overlay])

  const closeSecret = useCallback(() => {
    setOverlay(null)
    if (!secretToast.current) {
      secretToast.current = true
      notify('the sixth memory is waiting in the scrapbook')
    }
  }, [notify])

  const goTo = useCallback(
    (id: LocationId) => {
      setDialogue(null)
      setOverlay(null)
      setPlayerOpen(false)
      setMemoryIndex(null)
      if (id === location) return
      setLocation(id)
      if (!visited[id]) {
        setVisited((prev) => ({ ...prev, [id]: true }))
        if (FIRST_VISIT[id]) window.setTimeout(() => notify(FIRST_VISIT[id]), 480)
      }
    },
    [location, notify, visited],
  )

  const handleMoon = useCallback(
    (spot: Hotspot) => {
      const cx = spot.x + spot.w / 2
      if (secretRef.current) {
        showDialogue('rooftop-moon-done')
        spawnHearts(cx, spot.y + spot.h * 0.65)
        return
      }
      const next = Math.min(5, moonRef.current + 1)
      moonRef.current = next
      setMoonClicks(next)
      if (next >= 5) {
        secretRef.current = true
        setSecret(true)
        setUnlocked(true)
        setDialogue(null)
        setPlayerOpen(false)
        setMemoryIndex(null)
        setOverlay('secret')
        spawnHearts(cx, spot.y + spot.h * 0.7)
        spawnHearts(spot.x + spot.w * 0.3, spot.y + spot.h * 0.4)
        return
      }
      showDialogue(`rooftop-moon-${next}`)
      spawnHearts(cx, spot.y + spot.h * 0.75)
    },
    [setMoonClicks, setSecret, setUnlocked, showDialogue, spawnHearts],
  )

  const handleHotspot = useCallback(
    (spot: Hotspot) => {
      const cx = spot.x + spot.w / 2
      const cy = spot.y + spot.h / 2

      switch (spot.id) {
        case 'bedroom-cassette':
          openPlayer()
          return
        case 'rooftop-moon':
          handleMoon(spot)
          return
        case 'rooftop-a':
          waveARef.current = performance.now()
          spawnHearts(cx, spot.y + spot.h * 0.35)
          break
        case 'rooftop-b':
          waveBRef.current = performance.now()
          spawnHearts(cx, spot.y + spot.h * 0.35)
          break
        case 'rooftop-heart':
          spawnHearts(cx, cy)
          break
        case 'rooftop-wish':
          spawnShoot(spot.x + spot.w * 0.5, spot.y + spot.h * 0.35)
          break
        case 'street-pass':
          waveBRef.current = performance.now()
          break
        case 'bedroom-self':
          spawnHearts(cx, spot.y + spot.h * 0.28)
          break
        case 'bedroom-cat':
        case 'street-cat':
          catRef.current = performance.now()
          break
        default:
          break
      }

      showDialogue(spot.id)
    },
    [handleMoon, openPlayer, showDialogue, spawnHearts, spawnShoot],
  )

  const selectedMemory = memoryIndex !== null ? MEMORIES[memoryIndex] : null
  const memoryTotal = moonUnlocked ? MEMORIES.length : MEMORIES.length - 1

  const closeMemory = useCallback(() => setMemoryIndex(null), [])
  const prevMemory = useCallback(() => {
    setMemoryIndex((index) => (index === null ? null : (index - 1 + memoryTotal) % memoryTotal))
  }, [memoryTotal])
  const nextMemory = useCallback(() => {
    setMemoryIndex((index) => (index === null ? null : (index + 1) % memoryTotal))
  }, [memoryTotal])

  // ── overlay focus: move to the top card, then give focus back ──
  const overlayActive = Boolean(dialogue || overlay || memoryIndex !== null || playerOpen)
  useEffect(() => {
    if (overlayActive) setToast(null)
  }, [overlayActive])

  useEffect(() => {
    if (overlayActive) {
      if (
        !lastFocus.current &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        lastFocus.current = document.activeElement
      }
      const timer = window.setTimeout(() => {
        const targets = document.querySelectorAll<HTMLElement>('[data-autofocus]')
        targets[targets.length - 1]?.focus({ preventScroll: true })
      }, 80)
      return () => window.clearTimeout(timer)
    }
    const previous = lastFocus.current
    lastFocus.current = null
    if (previous && document.contains(previous)) {
      previous.focus({ preventScroll: true })
    } else {
      // Opened by shortcut from the page background — land somewhere visible.
      document.querySelector<HTMLElement>('.top-actions .icon-btn')?.focus({ preventScroll: true })
    }
    return undefined
  }, [overlayActive, overlay, dialogue, memoryIndex, playerOpen])

  // ── keep tab focus inside the topmost dialog ──
  useEffect(() => {
    if (!overlayActive) return
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"]')
      const dialog = dialogs[dialogs.length - 1]
      if (!dialog) return
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0)
      if (!focusables.length) {
        event.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      const inside = active ? dialog.contains(active) : false
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onTab)
    return () => document.removeEventListener('keydown', onTab)
  }, [overlayActive])

  // ── shortcuts ──
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (memoryIndex !== null) {
          setMemoryIndex(null)
          return
        }
        if (overlay === 'secret') {
          closeSecret()
          return
        }
        if (overlay) {
          setOverlay(null)
          return
        }
        if (playerOpen) {
          setPlayerOpen(false)
          return
        }
        if (dialogue) {
          setDialogue(null)
        }
        return
      }

      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      if (event.metaKey || event.ctrlKey || event.altKey) return
      const key = event.key.toLowerCase()

      if (key === '1' || key === '2' || key === '3') {
        event.preventDefault()
        goTo(ORDER[Number(key) - 1])
        return
      }
      if (key === '4' || key === 'g') {
        event.preventDefault()
        toggleGallery()
        return
      }
      if (key === '5' || key === 't') {
        event.preventDefault()
        toggleStory()
        return
      }
      if (key === 'm') {
        event.preventDefault()
        togglePlayer()
        return
      }
      if (key === '?') {
        event.preventDefault()
        toggleHelp()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    closeSecret,
    dialogue,
    goTo,
    memoryIndex,
    overlay,
    playerOpen,
    toggleGallery,
    toggleHelp,
    togglePlayer,
    toggleStory,
  ])

  const drawScene = (ctx: CanvasRenderingContext2D, frame: PixelFrame) => {
    const fx: SceneFx = {
      now: performance.now(),
      waveAAt: waveARef.current,
      waveBAt: waveBRef.current,
      shoots: shootsRef.current,
      moonClicks: moonRef.current,
      secret: secretRef.current,
      heartBursts: burstsRef.current,
      catAt: catRef.current,
    }
    scene.draw(ctx, { w: frame.w, h: frame.h, t: frame.t, reduced: frame.reduced, fx })
  }

  return (
    <main className="app">
      <section className="scene-stage" aria-label={`${scene.name} — ${scene.tagline}`}>
        <AnimatePresence initial={false}>
          <motion.div
            key={location}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PixelCanvas
              draw={drawScene}
              ariaLabel={scene.aria}
              onSize={handleSize}
              paused={Boolean(overlay && overlay !== 'help') || memoryIndex !== null || playerOpen}
            />
          </motion.div>
        </AnimatePresence>

        <div className="scene-wash" aria-hidden="true" />

        <div className="hotspot-layer">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className="hotspot"
              style={{
                left: `${spot.x * 100}%`,
                top: `${spot.y * 100}%`,
                width: `${spot.w * 100}%`,
                height: `${spot.h * 100}%`,
              }}
              onClick={() => handleHotspot(spot)}
              aria-label={`look at ${spot.label}`}
            >
              <span className={`hotspot-tip ${spot.y < 0.18 ? 'hotspot-tip--below' : ''}`} aria-hidden="true">
                {spot.label}
              </span>
            </button>
          ))}
        </div>

        <div className="atmosphere" aria-hidden="true">
          <div className="scanlines" />
          <div className="grain" />
          <div className="vignette" />
        </div>

        <div className="scene-caption">
          <div className="tiny">
            <span className="index">{scene.index}</span>
            <span className="name"> · {scene.name}</span>
          </div>
          <p className="tagline">{scene.tagline}</p>
        </div>

        <div className="scene-hint" aria-hidden="true">
          <span className="dot" />
          <span>{HINTS[location]}</span>
        </div>

        <p className="sr-only" aria-live="polite">
          now wandering: {scene.name}. {HINTS[location]}
        </p>
      </section>

      <TopBar
        playerOpen={playerOpen}
        playing={lullaby.playing}
        helpOpen={overlay === 'help'}
        onTogglePlayer={togglePlayer}
        onToggleHelp={toggleHelp}
      />

      <Dock
        location={location}
        galleryOpen={overlay === 'gallery'}
        storyOpen={overlay === 'story'}
        onLocation={goTo}
        onGallery={toggleGallery}
        onStory={toggleStory}
      />

      <MusicPlayer open={playerOpen} onClose={() => setPlayerOpen(false)} lullaby={lullaby} />

      <AnimatePresence>
        {dialogue && DIALOGUES[dialogue.id] ? (
          <DialogueBox
            key={`${dialogue.id}-${dialogue.session}`}
            data={DIALOGUES[dialogue.id]}
            sessionId={dialogue.session}
            onClose={() => setDialogue(null)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === 'help' ? (
          <HelpPop key="help" onClose={() => setOverlay(null)} />
        ) : null}
        {overlay === 'story' ? (
          <StoryOverlay
            key="story"
            onClose={() => setOverlay(null)}
            onOpenGallery={openGallery}
          />
        ) : null}
        {overlay === 'gallery' ? (
          <Gallery
            key="gallery"
            unlocked={moonUnlocked}
            onClose={() => {
              setOverlay(null)
              setMemoryIndex(null)
            }}
            onSelect={setMemoryIndex}
            onLocked={() => notify('the moon is still keeping that one')}
            onOpenSecret={() => {
              setMemoryIndex(null)
              setOverlay('secret')
            }}
          />
        ) : null}
        {overlay === 'secret' ? (
          <SecretOverlay key="secret" onClose={closeSecret} onOpenGallery={openGallery} />
        ) : null}
        {selectedMemory ? (
          <MemoryModal
            key={`memory-${selectedMemory.id}`}
            memory={selectedMemory}
            index={memoryIndex ?? 0}
            total={memoryTotal}
            onClose={closeMemory}
            onPrev={prevMemory}
            onNext={nextMemory}
          />
        ) : null}
      </AnimatePresence>

      <Toast toast={toast} />
    </main>
  )
}
