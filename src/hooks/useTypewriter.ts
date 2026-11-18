import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Reveals prose a few characters at a time; skippable, and calm by default. */
export function useTypewriter(text: string, active = true, speed = 18) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? text : '')
  const textRef = useRef(text)
  const indexRef = useRef(0)

  useEffect(() => {
    textRef.current = text
    indexRef.current = 0
    if (!active) {
      setShown(text)
      return
    }
    if (reduced) {
      setShown(text)
      indexRef.current = text.length
      return
    }
    setShown('')
    const id = window.setInterval(() => {
      indexRef.current += 1
      const next = textRef.current.slice(0, indexRef.current)
      setShown(next)
      if (indexRef.current >= textRef.current.length) window.clearInterval(id)
    }, speed)
    return () => window.clearInterval(id)
  }, [text, active, reduced, speed])

  const skip = useCallback(() => {
    indexRef.current = textRef.current.length
    setShown(textRef.current)
  }, [])

  return { shown, done: shown.length >= text.length, skip }
}
