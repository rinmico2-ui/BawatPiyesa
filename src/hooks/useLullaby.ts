import { useCallback, useEffect, useRef, useState } from 'react'
import { LULLABY_DURATION, renderLullaby } from '../lib/audio'

export type LullabyStatus = 'idle' | 'loading' | 'ready' | 'error'

const BAR_COUNT = 28
const idleBars = Array.from({ length: BAR_COUNT }, (_, i) => 3 + Math.round(7 * Math.abs(Math.sin(i * 0.55))))

export function useLullaby() {
  const [status, setStatus] = useState<LullabyStatus>('idle')
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [loop, setLoopState] = useState(true)
  const [bars, setBars] = useState<number[]>(idleBars)
  const [error, setError] = useState<string | null>(null)

  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const offsetRef = useRef(0)
  const startedAtRef = useRef(0)
  const playingRef = useRef(false)
  const loopRef = useRef(true)
  const volumeRef = useRef(0.7)
  const renderingRef = useRef<Promise<AudioBuffer | null> | null>(null)
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  const setPlayingBoth = (v: boolean) => {
    playingRef.current = v
    setPlaying(v)
  }

  const getPosition = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || !playingRef.current) return offsetRef.current
    const elapsed = offsetRef.current + Math.max(0, ctx.currentTime - startedAtRef.current)
    return loopRef.current ? elapsed % LULLABY_DURATION : Math.min(LULLABY_DURATION, elapsed)
  }, [])

  const startSource = useCallback(
    (at: number) => {
      const ctx = ctxRef.current
      const buffer = bufferRef.current
      const gain = gainRef.current
      if (!ctx || !buffer || !gain) return
      const old = sourceRef.current
      if (old) {
        old.onended = null
        try {
          old.stop()
        } catch {
          /* already stopped */
        }
      }
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.loop = loopRef.current
      src.loopStart = 0
      src.loopEnd = LULLABY_DURATION
      src.connect(gain)
      const startAt = Math.min(Math.max(0, at), LULLABY_DURATION - 0.05)
      sourceRef.current = src
      offsetRef.current = startAt
      startedAtRef.current = ctx.currentTime
      src.start(0, startAt)
      setPlayingBoth(true)
      src.onended = () => {
        if (sourceRef.current !== src) return
        sourceRef.current = null
        if (loopRef.current) return
        setPlayingBoth(false)
        offsetRef.current = 0
        setPosition(LULLABY_DURATION)
      }
    },
    [],
  )

  const ensureGraph = useCallback(() => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) throw new Error('Web Audio is not available in this browser.')
      const ctx = new AC()
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.gain.setTargetAtTime(volumeRef.current, ctx.currentTime, 0.08)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.82
      gain.connect(analyser)
      analyser.connect(ctx.destination)
      ctxRef.current = ctx
      gainRef.current = gain
      analyserRef.current = analyser
      dataRef.current = new Uint8Array(analyser.frequencyBinCount)
    }
    return ctxRef.current
  }, [])

  const ensureBuffer = useCallback(async () => {
    if (bufferRef.current) return bufferRef.current
    if (!renderingRef.current) {
      setStatus('loading')
      setError(null)
      // 22.05 kHz mono keeps the tape warm and the first render quick.
      renderingRef.current = renderLullaby(22050)
        .then((buffer) => {
          bufferRef.current = buffer
          setStatus('ready')
          return buffer
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'the tape would not wind.')
          setStatus('error')
          return null
        })
        .finally(() => {
          renderingRef.current = null
        })
    }
    return renderingRef.current
  }, [])

  const prepare = useCallback(async () => {
    try {
      ensureGraph()
      await ensureBuffer()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'the tape would not wind.')
      setStatus('error')
    }
  }, [ensureBuffer, ensureGraph])

  const ensureAudio = useCallback(async () => {
    const ctx = ensureGraph()
    if (ctx.state === 'suspended') await ctx.resume()
    return ensureBuffer()
  }, [ensureBuffer, ensureGraph])

  const play = useCallback(async () => {
    if (playingRef.current) return
    try {
      const buffer = await ensureAudio()
      if (!buffer) return
      startSource(offsetRef.current >= LULLABY_DURATION - 0.2 ? 0 : offsetRef.current)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'the tape would not wind.')
      setStatus('error')
    }
  }, [ensureAudio, startSource])

  const pause = useCallback(() => {
    const src = sourceRef.current
    if (!src) return
    const pos = getPosition()
    src.onended = null
    try {
      src.stop()
    } catch {
      /* noop */
    }
    sourceRef.current = null
    offsetRef.current = pos >= LULLABY_DURATION - 0.1 ? 0 : pos
    setPosition(offsetRef.current)
    setPlayingBoth(false)
    setBars(idleBars)
  }, [getPosition])

  const toggle = useCallback(() => {
    if (playingRef.current) pause()
    else void play()
  }, [pause, play])

  const seek = useCallback(
    (seconds: number) => {
      const pos = Math.min(Math.max(0, seconds), LULLABY_DURATION)
      offsetRef.current = pos
      setPosition(pos)
      if (playingRef.current) startSource(pos)
    },
    [startSource],
  )

  const setVolume = useCallback((value: number) => {
    const v = Math.min(1, Math.max(0, value))
    volumeRef.current = v
    setVolumeState(v)
    const ctx = ctxRef.current
    if (ctx && gainRef.current) {
      gainRef.current.gain.setTargetAtTime(v, ctx.currentTime, 0.06)
    }
  }, [])

  const setLoop = useCallback(
    (value: boolean) => {
      loopRef.current = value
      setLoopState(value)
      if (playingRef.current) {
        const pos = getPosition()
        startSource(pos)
      }
    },
    [getPosition, startSource],
  )

  // progress + visualizer heartbeat
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!playingRef.current) return
      setPosition(getPosition())
      const analyser = analyserRef.current
      const data = dataRef.current
      if (!analyser || !data) return
      analyser.getByteFrequencyData(data)
      const next: number[] = []
      const usable = Math.floor(data.length * 0.72)
      for (let i = 0; i < BAR_COUNT; i++) {
        const idx = Math.floor((i / BAR_COUNT) * usable)
        const v = data[idx] / 255
        next.push(2 + Math.round(v * 30))
      }
      setBars(next)
    }, 110)
    return () => window.clearInterval(id)
  }, [getPosition])

  useEffect(() => {
    return () => {
      const src = sourceRef.current
      if (src) {
        src.onended = null
        try {
          src.stop()
        } catch {
          /* noop */
        }
      }
      const ctx = ctxRef.current
      if (ctx) void ctx.close().catch(() => undefined)
    }
  }, [])

  return {
    status,
    playing,
    position,
    duration: LULLABY_DURATION,
    volume,
    setVolume,
    loop,
    setLoop,
    bars,
    error,
    play,
    pause,
    toggle,
    seek,
    prepare,
  }
}

export type Lullaby = ReturnType<typeof useLullaby>
