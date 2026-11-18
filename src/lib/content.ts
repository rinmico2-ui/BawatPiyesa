export const SONG = {
  title: 'Bawat Piyesa',
  artist: 'Munimuni',
  album: 'Kulayan Natin',
  year: '2019',
  duration: '6:42',
}

export const LINKS = {
  officialVideo: 'https://music.youtube.com/watch?v=vvFSVIy1Nqs&list=RDAMVMvvFSVIy1Nqs',
  spotify: 'https://open.spotify.com/album/0BDVa2cVDEhfy3telrAIux',
}

export const STORY_LINES = [
  'We live in different provinces — close enough to dream about meeting, far enough to miss you.',
  'The road between us is long, but it is not impossible.',
  'Some days I look at the sky and wonder if you are looking too.',
  'Distance is not a wall. It is a pause between visits.',
  'Every message, every song, every shared sunset makes the space between us feel a little smaller.',
  'Until the next time we see each other, I will keep you in my world.',
]

export type DialogueData = {
  speaker: string
  lines: string[]
}

export const DIALOGUES: Record<string, DialogueData> = {
  'bedroom-window': {
    speaker: 'the window',
    lines: ['The sky does this every evening.', 'I wonder if yours looks the same.'],
  },
  'bedroom-books': {
    speaker: 'the shelf',
    lines: ['Stories we keep meaning to finish.', 'Soft things, waiting.'],
  },
  'bedroom-screen': {
    speaker: 'the screen',
    lines: ['A half-written message, saved for later.', 'Some feelings take their time.'],
  },
  'bedroom-cat': {
    speaker: 'Mochi',
    lines: ['Mochi purrs like a tiny engine.', 'The whole room gets warmer.'],
  },
  'bedroom-self': {
    speaker: 'you',
    lines: ['You hum two bars of a song you can’t name.', 'The evening hums back.'],
  },
  'street-pass': {
    speaker: 'a passerby',
    lines: ['A stranger hums as they pass.', 'Funny how a melody can make a town feel smaller.'],
  },
  'street-window': {
    speaker: 'a warm window',
    lines: ['Someone inside is making dinner.', 'For a second, the whole street smells like home.'],
  },
  'street-shop': {
    speaker: 'the little shop',
    lines: ['The shop is closing soon.', 'Its light stays on for one last customer.'],
  },
  'street-bench': {
    speaker: 'the bench',
    lines: ['We used to sit here after the long walk home.', 'We never said much. It was enough.'],
  },
  'street-cat': {
    speaker: 'the street cat',
    lines: ['A small cat claims the warmest stone on the street.', 'Nobody argues. You wouldn’t either.'],
  },
  'rooftop-a': {
    speaker: 'them',
    lines: ['They lean closer, just a little.', 'You pretend not to notice. You notice.'],
  },
  'rooftop-b': {
    speaker: 'them',
    lines: ['“Look,” they say, pointing at a falling star.', '“Make a wish.”'],
  },
  'rooftop-heart': {
    speaker: 'a little heart',
    lines: ['You press the little heart into the night.', 'It floats up anyway.'],
  },
  'rooftop-wish': {
    speaker: 'a wish',
    lines: ['You wish for something small.', 'You wish for more ordinary days.'],
  },
  'rooftop-moon': {
    speaker: 'the moon',
    lines: ['The moon listens.'],
  },
  'rooftop-moon-1': {
    speaker: 'the moon',
    lines: ['The moon listens.', 'You have its attention.'],
  },
  'rooftop-moon-2': {
    speaker: 'the moon',
    lines: ['The stars lean in.', 'One more, it seems to say.'],
  },
  'rooftop-moon-3': {
    speaker: 'the moon',
    lines: ['You are close to something.', 'The city holds its breath.'],
  },
  'rooftop-moon-4': {
    speaker: 'the moon',
    lines: ['Almost.', 'The quiet is listening back.'],
  },
  'rooftop-moon-done': {
    speaker: 'the moon',
    lines: ['The moon remembers you.', 'It keeps your wish safe.'],
  },
}

export type MemoryArtKey = 'hello' | 'afternoon' | 'little' | 'moment' | 'home' | 'moon'

export type Memory = {
  id: string
  title: string
  date: string
  excerpt: string
  body: string[]
  sign: string
  art: MemoryArtKey
  locked?: boolean
}

export const MEMORIES: Memory[] = [
  {
    id: 'first-message',
    title: 'The First Message',
    date: 'a quiet evening',
    excerpt: 'You said hello like it was nothing. My whole evening rearranged itself around it.',
    body: [
      'You said hello like it was nothing. My whole evening rearranged itself around it.',
      'I remember the streetlight flickering on outside, and thinking: oh. This is going to be one of the days I keep.',
    ],
    sign: 'the beginning of everything small',
    art: 'hello',
  },
  {
    id: 'ordinary-evening',
    title: 'An Ordinary Evening',
    date: 'a tuesday · 9:12 pm',
    excerpt: 'Two phones on two desks, one song on repeat. Nothing happened, and everything did.',
    body: [
      'Two phones on two desks, one song on repeat. You were typing. I was pretending not to wait for the next message.',
      'Nothing happened, and everything did. That’s the trick of the good days, I think. You don’t know to mark them.',
    ],
    sign: 'nothing, and everything',
    art: 'afternoon',
  },
  {
    id: 'little-things',
    title: 'The Little Things',
    date: 'most days',
    excerpt: 'A photo you sent. A song you shared. The way you say goodnight.',
    body: [
      'A photo you sent from your window. A song you shared at midnight. The way you say goodnight like it means stay.',
      'I used to wait for something grand. Now I collect these, quietly, the way you’d pocket a smooth stone from the shore.',
    ],
    sign: 'the small archaeology of love',
    art: 'little',
  },
  {
    id: 'shared-sunset',
    title: 'A Shared Sunset',
    date: '6:48 pm',
    excerpt: 'We looked at the same sky from different provinces. I think we both knew.',
    body: [
      'We looked at the same sky from different provinces. You said, “Look, it’s orange today.” I was already looking.',
      'For a moment, the distance felt small. Like we were standing side by side, watching the same light fade.',
    ],
    sign: 'same sky, different places',
    art: 'moment',
  },
  {
    id: 'long-wait',
    title: 'The Long Wait',
    date: 'somewhere between visits',
    excerpt: 'An empty seat beside me, and the long way home I always take anyway.',
    body: [
      'An empty seat beside me, and the long way home I always take anyway.',
      'One of us is always a little far. Neither of us ever mentions it. That might be the whole love story, right there.',
    ],
    sign: 'between visits',
    art: 'home',
  },
  {
    id: 'moon-knows',
    title: 'What the Moon Knows',
    date: 'only after you stayed',
    excerpt: 'Some things are only said to the moon. She keeps them anyway.',
    body: [
      'You found the quietest part of the night. Thank you for staying a while — for clicking the little things, for letting the room breathe.',
      'Some love is not loud. It is a lamp left on. A song played twice. A moon you keep looking back at.',
      'I hope you have someone who feels like home. And if not yet, I hope you are learning to be that for yourself.',
    ],
    sign: 'for the quiet ones, with love',
    art: 'moon',
    locked: true,
  },
]

export const MESSAGES = [
  { from: "them", text: "How was your day?" },
  { from: "you", text: "Quiet. I kept thinking about you." },
  { from: "them", text: "I wish we could go out today." },
  { from: "you", text: "One day. Soon." },
  { from: "them", text: "Look at the sky. I think we’re seeing the same sunset." },
  { from: "you", text: "Same sky. Different places." },
  { from: "them", text: "One day, this distance will just be another memory." },
]
export const MEMORY_TRIGGER = 'the moon saw you'

export const LOCATIONS = {
  bedroom: {
    name: 'the bedroom',
    index: 'i',
    tagline: 'where the evening settles',
  },
  street: {
    name: 'the street',
    index: 'ii',
    tagline: 'where the lights come on, one by one',
  },
  rooftop: {
    name: 'the rooftop',
    index: 'iii',
    tagline: 'where you whisper things to the sky',
  },
} as const

export const HELP_ITEMS = [
  'Wander with the dock below, or press 1 – 3.',
  'Click the little things in every room. The cassette opens the music.',
  'Click the people. They might wave back.',
  'Press 4 for the scrapbook, 5 for the story, M for the tape.',
  'Some things need a second look. Or a fifth.',
]

export const SECRET_TITLE = 'What the Moon Knows'

export const SECRET_MESSAGE = [
  'Even if we can’t be in the same place every day, I’m happy that you’re somewhere in this world. And whenever I look at the sky, it reminds me that we’re sharing the same night.',
]
