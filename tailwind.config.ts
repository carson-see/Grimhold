import type { Config } from 'tailwindcss';

// Design tokens lifted from docs/character_selection/code.html + Design Bible Vol 2 §2
// "The Obsidian Grimoire" — Tonal Submersion palette.
// Never use pure white. No 1px solid borders for sectioning. No perfect circles.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces — treat the screen as a cavern, not a flat page
        background: '#131411',
        surface: '#131411',
        'surface-dim': '#131411',
        'surface-bright': '#3a3936',
        'surface-container-lowest': '#0e0e0c',
        'surface-container-low': '#1c1c19',
        'surface-container': '#20201d',
        'surface-container-high': '#2a2a27',
        'surface-container-highest': '#353531',
        'surface-variant': '#353531',

        // Primary — The Teal Glow (bioluminescence, active magic, "Proceed")
        primary: '#00dfc1',
        'primary-fixed': '#26fedc',
        'primary-fixed-dim': '#00dfc1',
        'primary-container': '#002b24',
        'on-primary': '#00382f',
        'on-primary-container': '#009f89',
        'on-primary-fixed': '#00201a',
        'on-primary-fixed-variant': '#005144',

        // Secondary — The Amber Ambient (human light, torches, loot)
        secondary: '#ffd799',
        'secondary-fixed': '#ffdeac',
        'secondary-fixed-dim': '#ffba38',
        'secondary-container': '#feb300',
        'on-secondary': '#432c00',
        'on-secondary-container': '#6a4800',
        'on-secondary-fixed': '#281900',
        'on-secondary-fixed-variant': '#604100',

        // Tertiary — The Deep Purple (shadow, depth, witchcraft)
        tertiary: '#d2bcfa',
        'tertiary-fixed': '#ebddff',
        'tertiary-fixed-dim': '#d2bcfa',
        'tertiary-container': '#2d1b4e',
        'on-tertiary': '#38265a',
        'on-tertiary-container': '#9783bd',
        'on-tertiary-fixed': '#231043',
        'on-tertiary-fixed-variant': '#4f3d72',

        // Error
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        // Text + outlines
        'on-surface': '#e5e2dd', // never pure white
        'on-surface-variant': '#cbc4d0',
        'on-background': '#e5e2dd',
        outline: '#948e99',
        'outline-variant': '#49454e',
        'inverse-surface': '#e5e2dd',
        'inverse-on-surface': '#31302d',
        'inverse-primary': '#006b5b',
        'surface-tint': '#00dfc1',
      },
      borderRadius: {
        // Jagged/crystalline by default. `rounded-full` keeps Tailwind's
        // 9999px so blurred ambient halos still render as circles —
        // the "no perfect circles" rule applies to in-world objects only,
        // and we enforce it by not using `rounded-full` on those.
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
      },
      fontFamily: {
        headline: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        body: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        label: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
      },
      keyframes: {
        'fungal-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        'wisp-rise': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translateY(-420px) scale(0.4)', opacity: '0' },
        },
        'breathe': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1.5px)' },
        },
        'drip': {
          '0%': { transform: 'translateY(-2px)', opacity: '0' },
          '40%': { opacity: '0.7' },
          '100%': { transform: 'translateY(8px)', opacity: '0' },
        },
        'ink-flicker': {
          '0%, 100%': { opacity: '0.9' },
          '47%': { opacity: '0.9' },
          '50%': { opacity: '0.55' },
          '53%': { opacity: '0.9' },
        },
      },
      animation: {
        'fungal-pulse': 'fungal-pulse 4s ease-in-out infinite',
        'wisp-rise': 'wisp-rise 3.2s ease-out forwards',
        'breathe': 'breathe 4.2s ease-in-out infinite',
        'drip': 'drip 3s ease-in infinite',
        'ink-flicker': 'ink-flicker 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
