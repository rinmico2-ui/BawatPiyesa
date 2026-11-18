/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171126',
        'ink-2': '#211936',
        'ink-3': '#2c2142',
        plum: '#3a2a4d',
        'plum-2': '#4a3559',
        mauve: '#6c4d68',
        rose: '#c67e8f',
        'rose-2': '#e3a0ad',
        blush: '#f5c8cf',
        cream: '#f8ecd9',
        sand: '#dfb98f',
        amber: '#f0b072',
        lilac: '#b7a4d8',
        mint: '#9dbfae',
      },
      fontFamily: {
        pixel: ['"Pixelify Sans"', 'monospace'],
        tiny: ['Silkscreen', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      screens: {
        short: { raw: '(max-height: 720px)' },
      },
    },
  },
  plugins: [],
}
