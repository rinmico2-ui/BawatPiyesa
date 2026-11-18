// ─────────────────────────────────────────────────────────────
//  audio.ts — an original, handmade lullaby rendered in the browser.
//  No album audio is used anywhere in this project.
// ─────────────────────────────────────────────────────────────

export const LULLABY_DURATION = 32 // 0:32 — four warm bars, made to loop
export const LULLABY_TITLE = 'a little lullaby'
export const LULLABY_NOTE = 'an original 0:32 instrumental, written for this little world'

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

type Chord = { bass: number; notes: number[] }

const CHORDS: Chord[] = [
  { bass: 41, notes: [53, 57, 60, 64, 67] }, // Fmaj9
  { bass: 36, notes: [48, 52, 55, 59, 62] }, // Cmaj7
  { bass: 38, notes: [50, 53, 57, 60, 64] }, // Dm7
  { bass: 33, notes: [45, 48, 52, 55, 59] }, // Am7
]

const MELODIES: number[][] = [
  [69, 72, 76, 79, 76],
  [76, 79, 83, 79, 76],
  [74, 77, 81, 77, 74],
  [72, 76, 79, 76, 72],
]

const NOTE_AT = [0.55, 2.05, 3.55, 5.15, 6.6]
const NOTE_LEN = [2.4, 1.6, 2.1, 1.5, 2.6]

function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tapeNoise(ctx: BaseAudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  const rnd = seeded(41)
  for (let i = 0; i < len; i++) data[i] = (rnd() * 2 - 1) * 0.22
  return buffer
}

function crackle(ctx: BaseAudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  const rnd = seeded(77)
  const clicks = Math.floor(seconds * 9)
  for (let i = 0; i < clicks; i++) {
    const idx = Math.floor(rnd() * (len - 2))
    const amp = (0.04 + rnd() * 0.16) * (rnd() > 0.5 ? 1 : -1)
    data[idx] += amp
    data[idx + 1] += amp * 0.6
  }
  return buffer
}

/**
 * Builds a warm, slow lullaby: felt-piano-ish plucks over soft pads,
 * a low hum, and a little cassette hiss. Original composition only.
 * `channels` defaults to 1 — the tape is deliberately mono, like a cassette.
 */
export async function renderLullaby(
  sampleRate: number,
  duration = LULLABY_DURATION,
  channels = 1,
) {
  const Offline =
    window.OfflineAudioContext ||
    (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext
  if (!Offline) throw new Error('Web Audio is not available in this browser.')

  const ctx = new Offline(channels, Math.ceil(sampleRate * duration), sampleRate)

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, 0)
  master.gain.exponentialRampToValueAtTime(0.82, 2.2)
  master.gain.setValueAtTime(0.82, duration - 2.6)
  master.gain.exponentialRampToValueAtTime(0.0001, duration - 0.05)

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.knee.value = 16
  comp.ratio.value = 3
  comp.attack.value = 0.02
  comp.release.value = 0.5
  master.connect(comp)
  comp.connect(ctx.destination)

  // shared spaces
  const padBus = ctx.createBiquadFilter()
  padBus.type = 'lowpass'
  padBus.frequency.value = 1350
  padBus.Q.value = 0.4
  const padGain = ctx.createGain()
  padGain.gain.value = 0.9
  padBus.connect(padGain)
  padGain.connect(master)

  const delay = ctx.createDelay(1.2)
  delay.delayTime.value = 0.46
  const feedback = ctx.createGain()
  feedback.gain.value = 0.27
  const wet = ctx.createGain()
  wet.gain.value = 0.26
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(wet)
  wet.connect(master)

  const pianoFilter = ctx.createBiquadFilter()
  pianoFilter.type = 'lowpass'
  pianoFilter.frequency.value = 2400
  pianoFilter.Q.value = 0.3
  pianoFilter.connect(master)
  pianoFilter.connect(delay)

  // soft room hiss
  const hiss = ctx.createBufferSource()
  hiss.buffer = tapeNoise(ctx, 4)
  hiss.loop = true
  const hissFilter = ctx.createBiquadFilter()
  hissFilter.type = 'lowpass'
  hissFilter.frequency.value = 900
  const hissGain = ctx.createGain()
  hissGain.gain.value = 0.014
  hiss.connect(hissFilter)
  hissFilter.connect(hissGain)
  hissGain.connect(master)
  hiss.start(0)

  // far-away crackle
  const crk = ctx.createBufferSource()
  crk.buffer = crackle(ctx, 5)
  crk.loop = true
  const crkFilter = ctx.createBiquadFilter()
  crkFilter.type = 'bandpass'
  crkFilter.frequency.value = 2600
  crkFilter.Q.value = 0.8
  const crkGain = ctx.createGain()
  crkGain.gain.value = 0.16
  crk.connect(crkFilter)
  crkFilter.connect(crkGain)
  crkGain.connect(master)
  crk.start(0)

  const pad = (freq: number, start: number, end: number, gainValue: number, detune = 0) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    osc.detune.value = detune
    const g = ctx.createGain()
    const attack = Math.min(2.2, (end - start) * 0.3)
    g.gain.setValueAtTime(0.0001, start)
    g.gain.exponentialRampToValueAtTime(gainValue, start + attack)
    g.gain.setValueAtTime(gainValue, Math.max(start + attack + 0.05, end - 2.4))
    g.gain.exponentialRampToValueAtTime(0.0001, end)
    osc.connect(g)
    g.connect(padBus)
    osc.start(start)
    osc.stop(end + 0.02)
  }

  const pluck = (freq: number, start: number, length: number, gainValue = 0.055) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = freq * 2.002
    const g2 = ctx.createGain()
    g2.gain.value = 0.22
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, start)
    g.gain.exponentialRampToValueAtTime(gainValue, start + 0.018)
    g.gain.exponentialRampToValueAtTime(0.0001, start + length)
    osc.connect(g)
    osc2.connect(g2)
    g2.connect(g)
    g.connect(pianoFilter)
    osc.start(start)
    osc2.start(start)
    osc.stop(start + length + 0.02)
    osc2.stop(start + length + 0.02)
  }

  const chordLen = 8
  for (let bar = 0; bar * chordLen < duration - 1; bar++) {
    const start = bar * chordLen
    const end = Math.min(duration, start + chordLen)
    const chord = CHORDS[bar % CHORDS.length]

    // low root, felt-soft
    pad(midi(chord.bass - 12), start, end, 0.06)
    pad(midi(chord.bass), start, end, 0.045, -3)

    chord.notes.forEach((n, i) => {
      pad(midi(n), start, end, i === 0 ? 0.036 : 0.028, i % 2 ? 5 : -5)
    })

    // sparse, singable little melody
    const melody = MELODIES[bar % MELODIES.length]
    for (let n = 0; n < melody.length; n++) {
      const at = start + NOTE_AT[n]
      if (at > duration - 2) break
      // breathe: drop a note now and then
      if (n > 0 && (bar + n) % 7 === 3) continue
      pluck(midi(melody[n]), at, NOTE_LEN[n], n === 0 ? 0.06 : 0.042)
      if (n === 2 && bar % 2 === 0) pluck(midi(melody[n] - 12), at + 0.02, 2.8, 0.018)
    }
  }

  return ctx.startRendering()
}
