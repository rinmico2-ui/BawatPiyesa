import { PixelIcon } from './PixelIcon'

type Props = {
  playerOpen: boolean
  playing: boolean
  helpOpen: boolean
  onTogglePlayer: () => void
  onToggleHelp: () => void
}

export function TopBar({ playerOpen, playing, helpOpen, onTogglePlayer, onToggleHelp }: Props) {
  return (
    <header className="top-bar">
      <div className="brand">
        <span className="brand-mark">
          <PixelIcon name="heart" size={15} />
        </span>
        <div>
          <span className="brand-name">bawat piyesa</span>
          <span className="brand-sub">a little world</span>
        </div>
      </div>

      <div className="top-actions">
        <button
          type="button"
          className={`icon-btn ${playerOpen || playing ? 'icon-btn--active' : ''}`}
          onClick={onTogglePlayer}
          aria-label={playerOpen ? 'close the cassette player' : 'open the cassette player'}
          aria-pressed={playerOpen}
          title="the little tape · m"
        >
          <PixelIcon name={playing ? 'soundOn' : 'cassette'} size={18} />
        </button>
        <button
          type="button"
          className={`icon-btn ${helpOpen ? 'icon-btn--active' : ''}`}
          onClick={onToggleHelp}
          aria-label="how this little world works"
          aria-expanded={helpOpen}
          title="how to wander · ?"
        >
          <PixelIcon name="help" size={18} />
        </button>
      </div>
    </header>
  )
}
