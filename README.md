# GRIMHOLD

A dark-whimsical sort-puzzle prototype. Sort ingredients. Watch the wisp.
Wonder what it feeds.

This repo contains **Act One, Chapter One, Level 1** — the v0 prototype
covering the full playable spine: title → character select → name → opening
scene → puzzle → wisp → closing scene → level complete → Larder stub.

## Quick Start

```sh
npm install
npm run dev
# → http://localhost:5173
```

Open at a 375×667 viewport for the intended phone layout. The frame caps
at 420px wide — larger screens show the phone inside a centered gutter.

## Stack

- **Vite + React 18 + TypeScript** — existing stack per PRD v1.0
- **Tailwind CSS** — "Obsidian Grimoire" design tokens in `tailwind.config.ts`
- **Framer Motion** — screen transitions, wisp rise, cauldron placement
- **Zustand** — tiny global store, persisted to localStorage
- **Web Audio API** — off-key music-box note, zero asset cost

No Supabase, Stripe, or Capacitor yet — those layer in from v0.2.

## Repo Layout

```
docs/                       # All design documents (PRD, Level Doc, etc.)
src/
  assets/                   # Custom hand-drawn SVG components
    Ingredients.tsx         # Moonbloom, Ashroot, Coldstone, Emberpetal
    Cauldron.tsx            # Asymmetric kettle with stitched seam
    MiraSmudge.tsx          # Protagonist + raven, with idle breath/blink
    Wisp.tsx                # Rising violet byproduct
    CellBackground.tsx      # Stone wall, fungus glows, ceiling grate
    Icons.tsx               # Custom chrome — coin, gem, heart, chevron, etc.
    Ink.tsx                 # Shared SVG <defs>
  components/
    Frame.tsx               # Phone-viewport wrapper
    TopBar.tsx              # TitleBar and HUD bar variants
  screens/
    Title.tsx               # Cold open
    CharacterSelect.tsx     # 4 cards, 3 sealed
    NameInput.tsx           # Underline input, Mira default
    Scene00.tsx             # "The First Dark"
    Level.tsx               # The puzzle
    Wisp.tsx                # Rise through the grate
    Scene01.tsx             # "After the First Wisp"
    LevelComplete.tsx       # Stars, coins, gems, continue
    LarderStub.tsx          # Placeholder store
  game/
    audio.ts                # Web Audio music-box note
    store.ts                # Zustand state machine
    types.ts                # TS types
  data/
    levels.ts               # LEVEL_1 config
```

## Design System

Every design token in `tailwind.config.ts` is lifted from
`docs/character_selection/code.html` and the Design Bible Vol 2 §2 ("Tonal
Submersion"). Highlights:

- **Teal `#00dfc1`** — bioluminescent magic / Proceed actions
- **Amber `#ffd799`** — human-made light, loot, Grimhold wordmark
- **Deep purple `#2d1b4e`** — shadow, depth, witchcraft
- **Stone `#131411`** — base surface; never pure white anywhere
- **Newsreader** — the only typeface
- **No perfect circles** — uses jagged/crystalline `rounded-sm` by default

## Compliance Notes

Built to the PRD §03 hard requirements:

- 44×44pt minimum hitboxes on every interactive element
- Portrait only, 375×667 minimum viewport
- No physical aging of Mira — state communicated via posture, hair, Smudge
  position, eye blink rate (PEGI 7 / ESRB E10+ safe)
- `prefers-reduced-motion` respected on every animation

## Next Up (v0.2)

- Level 2 "Someone Else's Recipe" — slid paper + alternate recipe path
- Supabase-backed progress save (currently localStorage only)
- The full Larder with 4 tabs (Brewed / Traded / Kept / Found)
- Bessie Tallow random encounter in Level 3
- First 5 Easter eggs including Edgar's Feather (Level 1 Smudge tap)
