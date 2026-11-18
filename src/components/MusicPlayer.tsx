import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Lullaby } from '../hooks/useLullaby'
import { LINKS, SONG } from '../lib/content'
import { PixelIcon } from './PixelIcon'

type Props = {
  open: boolean
  onClose: () => void
  lullaby: Lullaby
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export function MusicPlayer({ open, onClose, lullaby }: Props) {
  const {
    status,
    playing,
    position,
    duration,
    volume,
    setVolume,
    loop,
    setLoop,
    bars,
    error,
    play,
    pause,
    seek,
  } = lullaby
  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0
  const loading = status === 'loading'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="player-backdrop"
          className="player-backdrop"
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
          key="player"
          className="player"
          role="dialog"
          aria-modal="true"
          aria-label="the cassette player"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
        >
          <div className="player-top">
            <span className="label">the little tape</span>
            <button
              type="button"
              className="player-close"
              onClick={onClose}
              aria-label="close the cassette player"
              data-autofocus
            >
              <PixelIcon name="close" size={13} />
            </button>
          </div>

          <div className="player-body">
            <div className="cassette-wrap">
              <div className="cassette" aria-hidden="true">
                <div className="cassette-label">
                  <span className="tape-title">bawat piyesa</span>
                  <span className="tape-art">
                    <i
                      style={{
                        left: 3,
                        top: 3,
                        width: 7,
                        height: 7,
                        background: '#fff0c4',
                        boxShadow: '0 0 6px rgba(255,240,196,0.55)',
                      }}
                    />
                    <i style={{ left: 0, top: 11, width: 30, height: 2, background: '#8b5a6b' }} />
                    <i style={{ left: 15, top: 9, width: 11, height: 2, background: '#4a3559' }} />
                    <i style={{ left: 20, top: 6, width: 5, height: 2, background: '#4a3559' }} />
                  </span>
                  <span className="tape-meta">side a · {formatTime(duration)}</span>
                </div>
                <div className="cassette-window">
                  <span className={`reel ${playing ? 'reel--spin' : ''}`} />
                  <span className="spindle" />
                  <span className={`reel ${playing ? 'reel--spin' : ''}`} />
                </div>
                <div className="cassette-foot">
                  <span>
                    <i className={`cassette-playing-light ${playing ? 'cassette-playing-light--on' : ''}`} />
                    {playing ? 'playing' : 'paused'}
                  </span>
                  <span>c · 60</span>
                </div>
              </div>
            </div>

            <div className="player-track">
              <div>
                <span className="label">inspired by</span>
                <h3>{SONG.title}</h3>
                <p>
                  {SONG.artist} · {SONG.album}, {SONG.year}
                </p>
              </div>
              <span className="bpm">
                68 bpm
                <br />
                made in
                <br />
                your browser
              </span>
            </div>

            <div className="visualizer" aria-hidden="true">
              {bars.map((bar, index) => (
                <i key={index} style={{ height: `${Math.max(2, Math.min(32, bar))}px` }} />
              ))}
            </div>

            <div className="progress-block">
              <div className="progress-times">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                className="pixel-range progress-range"
                min={0}
                max={duration}
                step={0.1}
                value={Math.min(position, duration)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="seek through the lullaby"
                style={{ '--progress': `${progress}%` } as CSSProperties}
              />
            </div>

            <div className="player-controls">
              <button
                type="button"
                className="play-btn"
                onClick={() => {
                  if (playing) pause()
                  else void play()
                }}
                disabled={loading}
                aria-label={playing ? 'pause the lullaby' : 'play the lullaby'}
              >
                <PixelIcon name={playing ? 'pause' : 'play'} size={18} />
              </button>

              <button
                type="button"
                className={`player-btn ${loop ? 'player-btn--on' : ''}`}
                onClick={() => setLoop(!loop)}
                aria-pressed={loop}
                title="loop the tape"
              >
                <span className="pip" aria-hidden="true" />
                loop
              </button>

              <div className="volume-wrap">
                <PixelIcon name="volume" size={13} />
                <input
                  type="range"
                  className="pixel-range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  aria-label="volume"
                />
              </div>
            </div>

            {loading ? <p className="player-note">winding the little tape…</p> : null}
            {error ? (
              <p className="player-note" role="alert">
                {error} The real song is still one link away.
              </p>
            ) : null}

            <a
              className="listen-btn"
              href={LINKS.officialVideo}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>
                Listen to the song
                <small style={{ display: 'block', marginTop: 4 }}>munimuni · official video</small>
              </span>
              <PixelIcon name="external" size={15} />
            </a>

            <p className="player-note">
              The tape above is an original instrumental lullaby made for this little world — not the
              album recording. No autoplay, no album audio, no lyrics.
            </p>

            <div className="player-foot">
              <span>a fan-made keepsake</span>
              <a href={LINKS.spotify} target="_blank" rel="noreferrer noopener">
                official song on spotify ↗
              </a>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
