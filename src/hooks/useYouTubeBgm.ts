import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

export type YouTubeBgm = {
  containerRef: React.RefObject<HTMLDivElement | null>
  ready: boolean
  playing: boolean
  play: () => void
  pause: () => void
}

export function useYouTubeBgm(videoId: string): YouTubeBgm {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false

    const init = () => {
      if (cancelled || !containerRef.current || !window.YT || !window.YT.Player) return
      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) setReady(true)
            },
            onStateChange: (event: { data: number }) => {
              if (cancelled) return
              setPlaying(event.data === 1)
            },
          },
        })
      } catch {
        /* ignore */
      }
    }

    if (window.YT && window.YT.Player) {
      init()
    } else {
      if (!document.getElementById('yt-iframe-api')) {
        const script = document.createElement('script')
        script.id = 'yt-iframe-api'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (previous) previous()
        init()
      }
    }

    return () => {
      cancelled = true
      const player = playerRef.current
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy()
        } catch {
          /* ignore */
        }
      }
      playerRef.current = null
    }
  }, [videoId])

  const play = useCallback(() => {
    const player = playerRef.current
    if (player && typeof player.playVideo === 'function') {
      try {
        player.playVideo()
      } catch {
        /* ignore */
      }
    }
  }, [])

  const pause = useCallback(() => {
    const player = playerRef.current
    if (player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo()
      } catch {
        /* ignore */
      }
    }
  }, [])

  return { containerRef, ready, playing, play, pause }
}
