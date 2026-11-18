// ─────────────────────────────────────────────────────────────
//  sprites.ts — hand-placed pixels for two small people + a cat
// ─────────────────────────────────────────────────────────────

export const MAP_A = {
  a: '#2b2238',
  A: '#463554',
  s: '#f2c6a4',
  S: '#d79a7e',
  e: '#241b30',
  r: '#e79aa6',
  v: '#c67e8f',
  c: '#f3d7b3',
  C: '#d3ab86',
  p: '#4c4565',
  b: '#2b2338',
}

export const MAP_B = {
  h: '#5e3c45',
  H: '#8a5a5b',
  s: '#f2c6a4',
  S: '#d79a7e',
  e: '#241b30',
  r: '#e79aa6',
  d: '#ab94cf',
  D: '#cdb9e6',
  x: '#2f2740',
}

export const MAP_CAT = {
  c: '#c8a88f',
  C: '#a98873',
  k: '#46313f',
}

/** A — short dark hair, cream cardigan, rose scarf. 14 × 24 */
export const A_FRONT = [
  '....aaaaaa....',
  '...aaaaaaaa...',
  '..aaaaaaaaaa..',
  '..aAaaaaaaAa..',
  '..aassssssaa..',
  '.aassssssssaa.',
  '.aaseesseesaa.',
  '.aassssssssaa.',
  '..asrsssrssa..',
  '...ssSSSSss...',
  '....ssssss....',
  '..vvvvvvvvvv..',
  '..vccccccccv..',
  '..cccccccccc..',
  '..cccccccccc..',
  '..cCCCCCCCCc..',
  '..cCCCCCCCCc..',
  '..cccccccccc..',
  '..pppppppppp..',
  '..pppppppppp..',
  '...pppppppp...',
  '...ss....ss...',
  '...bb....bb...',
  '..bbb....bbb..',
]

export const A_WALK = [
  ...A_FRONT.slice(0, 21),
  '..ss......ss..',
  '..bb......bb..',
  '.bbb......bbb.',
]

export const A_BACK = [
  '....aaaaaa....',
  '...aaaaaaaa...',
  '..aaaaaaaaaa..',
  '..aAaaaaaaAa..',
  '..aaaaaaaaaa..',
  '..aaaaaaaaaa..',
  '..aaaaaaaaaa..',
  '..aaaaaaaaaa..',
  '...aaaaaaaa...',
  '....ssssss....',
  '..vvvvvvvvvv..',
  '..vccccccccv..',
  '..cccccccccc..',
  '..cccccccccc..',
  '..cCCCCCCCCc..',
  '..cCCCCCCCCc..',
  '..cccccccccc..',
  '..pppppppppp..',
  '..pppppppppp..',
  '..pppppppppp..',
  '...pppppppp...',
  '...ss....ss...',
  '...bb....bb...',
  '..bbb....bbb..',
]

export const A_SEATED_BACK = [
  '....aaaaaa....',
  '...aaaaaaaa...',
  '..aaaaaaaaaa..',
  '..aAaaaaaaAa..',
  '..aaaaaaaaaa..',
  '..aaaaaaaaaa..',
  '...aaaaaaaa...',
  '....ssssss....',
  '..vvvvvvvvvv..',
  '..cccccccccc..',
  '..cccccccccc..',
  '..cCCCCCCCCc..',
  '..cccccccccc..',
  '..pppppppppp..',
  '..pp.pppp.pp..',
  '..ss......ss..',
  '..bb......bb..',
]

/** B — warm brown hair, lilac dress. 14 × 24 */
export const B_FRONT = [
  '....hhhhhh....',
  '...hhhhhhhh...',
  '..hhhhhhhhhh..',
  '..hHhhhhhhHh..',
  '..hhsssssshh..',
  '.hhhsssssshhh.',
  '.hhseesseeshh.',
  '.hhsssssssshh.',
  '.hhsrsssrsshh.',
  '..hssssssssh..',
  '...hssssssh...',
  '..hhddddddhh..',
  '..hddddddddh..',
  '..hddddddddh..',
  '..dddddddddd..',
  '..ddDDDDDDdd..',
  '..ddDDDDDDdd..',
  '.dddddddddddd.',
  '.dddddddddddd.',
  '.ddddDDDDdddd.',
  '..dddddddddd..',
  '...ss....ss...',
  '...xx....xx...',
  '..xxx....xxx..',
]

export const B_WALK = [
  ...B_FRONT.slice(0, 21),
  '..ss......ss..',
  '..xx......xx..',
  '.xxx......xxx.',
]

export const B_SEATED_BACK = [
  '....hhhhhh....',
  '...hhhhhhhh...',
  '..hhhhhhhhhh..',
  '..hHhhhhhhHh..',
  '..hhhhhhhhhh..',
  '..hhhhhhhhhh..',
  '...hhhhhhhh...',
  '....ssssss....',
  '..hddddddddh..',
  '..hddddddddh..',
  '..hddddddddh..',
  '..dddddddddd..',
  '..ddDDDDDDdd..',
  '..dddddddddd..',
  '..dd.dddd.dd..',
  '..ss......ss..',
  '..xx......xx..',
]

/** a small cat, fast asleep. 16 × 9 */
export const CAT_SLEEP = [
  '....c......c....',
  '...ccc....ccc...',
  '..cccccccccccc..',
  '.cckccccccckcc..',
  '.cccccccccccccc.',
  '.cccCCCCCCCCccc.',
  '.cccccccccccccc.',
  '..cccccccccccc..',
  '...cccccccccc...',
]

/** a tiny bird in flight. 6 × 2 */
export const BIRD_A = ['#...#', '.#.#.']
export const BIRD_B = ['.#.#.', '#...#']

export const PORTRAIT_A = A_FRONT
export const PORTRAIT_B = B_FRONT
