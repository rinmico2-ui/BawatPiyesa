import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Opening } from './components/Opening'
import { EnterVeil, LoadingVeil } from './components/LoadingVeil'
import { World } from './components/World'
import './styles.css'

function App() {
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<'opening' | 'world'>('opening')
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    let dead = false
    const minWait = new Promise((resolve) => setTimeout(resolve, 950))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.all([minWait, fonts]).then(() => {
      if (!dead) setReady(true)
    })
    return () => {
      dead = true
    }
  }, [])

  const enter = () => {
    if (entering) return
    setEntering(true)
    window.setTimeout(() => setPhase('world'), 560)
    window.setTimeout(() => setEntering(false), 1250)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        {phase === 'opening' ? <Opening onEnter={enter} /> : <World />}

        <AnimatePresence>{!ready && <LoadingVeil />}</AnimatePresence>
        <AnimatePresence>{entering && <EnterVeil />}</AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default App
