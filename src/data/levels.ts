import type { CauldronId, EncounterConfig, LevelConfig, RecipePath } from '../game/types';
import { withHiddenAlternates } from './altRecipes';

// Shared cauldron labels — kept here so every surface (puzzle HUD, recipe
// panels, transition scenes, level-complete card) agrees on spelling.
export const CAULDRON_LABEL: Record<CauldronId, string> = {
  left: 'Left',
  'center-left': 'C-Left',
  center: 'Centre',
  'center-right': 'C-Right',
  right: 'Right',
};
export const CAULDRON_INITIAL: Record<CauldronId, string> = {
  left: 'L',
  'center-left': 'CL',
  center: 'C',
  'center-right': 'CR',
  right: 'R',
};

// Source: docs/grimhold_level_document.docx (internal, v1.0)
// Any recipe mismatch vs the source doc is noted inline.

// ── Level 1 ────────────────────────────────────────────────────────────────
// "The First Recipe" — teaching level, one path only.
// Ingredients: Moonbloom ×2, Ashroot ×2, Coldstone ×1, Emberpetal ×1 (6)
// Wall:  Left = MM + AA  |  Right = C + E.
export const LEVEL_1: LevelConfig = {
  id: 1,
  title: 'The First Recipe',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 1 },
    { kind: 'emberpetal', count: 1 },
  ],
  cauldrons: ['left', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'ashroot', 'ashroot'],
        right: ['coldstone', 'emberpetal'],
      },
      wispColor: 'violet',
      powerUpLabel: '+2 Extra Move Tokens',
      powerUpDetail: 'For when the cauldrons outnumber you.',
    },
  ],
  moveLimit: 18,
  targetMoves: 8,
  acceptableMoves: 12,
  closingLine:
    '{name} sat on the floor with the paper that had just slid in. She did not pick it up.',
};

// ── Level 2 ────────────────────────────────────────────────────────────────
// "Someone Else's Recipe" — two valid paths.
// Ingredients: Moonbloom ×2, Ashroot ×2, Coldstone ×2, Emberpetal ×1, Darkspore ×1 (8)
//
// The level doc lists the wall recipe as MM+C | AA+E+D (7 slots for 8 items).
// Treating this as a doc typo — the wall places all 8 as MM+CC | AA+E+D so
// the player doesn't end the level holding an unused coldstone. The slid
// recipe uses all 8 as written.
export const LEVEL_2: LevelConfig = {
  id: 2,
  title: "Someone Else's Recipe",
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 1 },
    { kind: 'darkspore', count: 1 },
  ],
  cauldrons: ['left', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'coldstone', 'coldstone'],
        right: ['ashroot', 'ashroot', 'emberpetal', 'darkspore'],
      },
      wispColor: 'violet',
      powerUpLabel: '+2 Extra Move Tokens',
      powerUpDetail: 'The wall rewards obedience.',
    },
    {
      id: 'slid',
      label: 'Folded paper, slid under the door',
      handwriting: 'slid',
      placement: {
        left: ['moonbloom', 'ashroot', 'darkspore'],
        right: ['moonbloom', 'ashroot', 'coldstone', 'coldstone', 'emberpetal'],
      },
      wispColor: 'amber-threaded',
      powerUpLabel: '1 Wildcard Ingredient',
      powerUpDetail: 'Someone down here wants you to keep options.',
    },
  ],
  moveLimit: 14,
  targetMoves: 9,
  acceptableMoves: 12,
  closingLine:
    '{name} looked at both papers. Someone down here knows how these cauldrons work.',
};

// ── Level 3 ────────────────────────────────────────────────────────────────
// "Bessie Tallow" — three cauldrons, random encounter.
// Ingredients: Moonbloom ×2, Ashroot ×2, Coldstone ×2, Emberpetal ×1, Darkspore ×1, Silvermoss ×1 (9)
// Wall: Left = MM | Center = AAE | Right = CCDS.
const BESSIE_ENCOUNTER: EncounterConfig = {
  id: 'bessie-tallow',
  // Doc specifies move 10, but the puzzle only needs 9 placements — an
  // efficient player can clear it before ever meeting Bessie. Fire at move
  // 5 so every player sees her (the encounter is the narrative point of L3).
  triggerMove: 5,
  // Doc specifies 8s, but 2026-04-18 playtest flagged that as too tight to
  // read all four options + blurbs. 15s keeps the "thoughtful pressure"
  // tone without sacrificing legibility.
  decisionSeconds: 15,
  defaultChoice: 'silent',
  title: 'Bessie Tallow',
  role: 'Dungeon Cook · Twenty Years',
  whisper:
    'She drops a supply bag meant for the cell across the hall. She freezes when she sees you.',
  choices: [
    {
      id: 'bribe',
      label: 'Slide the coins',
      cost: { coins: 500 },
      risk: 'expensive',
      blurb: 'She takes them without looking. A nod. Ingredients outside your door in coming days.',
    },
    {
      id: 'distract',
      label: 'Knock something over',
      cost: { moves: 1 },
      risk: 'safe',
      blurb: 'She leaves fast. Nothing said. Nothing owed.',
    },
    {
      id: 'recruit',
      label: 'Meet her eye',
      risk: 'risky',
      blurb: 'A gamble. Something in her face may shift. Or she may report it upstairs.',
    },
    {
      id: 'silent',
      label: 'Say nothing',
      risk: 'safe',
      blurb: 'She collects her bag and goes. The timer picks this one if you wait.',
    },
  ],
};

export const LEVEL_3: LevelConfig = {
  id: 3,
  title: 'Bessie Tallow',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 1 },
    { kind: 'darkspore', count: 1 },
    { kind: 'silvermoss', count: 1 },
  ],
  cauldrons: ['left', 'center', 'right'],
  recipes: [
    {
      id: 'joint',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom'],
        center: ['ashroot', 'ashroot', 'emberpetal'],
        right: ['coldstone', 'coldstone', 'darkspore', 'silvermoss'],
      },
      // Per Level Doc: "Violet with a faint amber thread regardless of path.
      // The cook's presence slightly altered the atmospheric conditions."
      wispColor: 'violet-amber',
      powerUpLabel: '+2 Extra Move Tokens',
      powerUpDetail: 'Bessie leaves the air stirred. The cauldrons notice.',
    },
  ],
  moveLimit: 18,
  targetMoves: 11,
  acceptableMoves: 15,
  encounter: BESSIE_ENCOUNTER,
  closingLine:
    '{name} looked at the door Bessie used. The dungeon runs on something. It has a kitchen.',
};

// ── Level 4 ────────────────────────────────────────────────────────────────
// "The Memory in the Cauldron" — volatile ingredients, silent memory vision.
// Ingredients: M×2, A×2, C×2, E×2, D×1, S×1 (10)
// Wall: Left = MM+E | Center = AA+E | Right = CC+D+S.
// Volatile: Darkspore + Silvermoss shift one cauldron every 5 placements.
// Memory Vision: fires at move 8 — 3-second overlay, auto-dismissed.
export const LEVEL_4: LevelConfig = {
  id: 4,
  title: 'The Memory in the Cauldron',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 1 },
    { kind: 'silvermoss', count: 1 },
  ],
  cauldrons: ['left', 'center', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'emberpetal'],
        center: ['ashroot', 'ashroot', 'emberpetal'],
        right: ['coldstone', 'coldstone', 'darkspore', 'silvermoss'],
      },
      wispColor: 'violet-dark',
      powerUpLabel: '+2 Extra Move Tokens',
      powerUpDetail: 'Something about the memory steadied your hands.',
    },
  ],
  moveLimit: 16,
  targetMoves: 11,
  acceptableMoves: 14,
  volatility: {
    kinds: ['darkspore', 'silvermoss'],
    shiftEveryMoves: 5,
  },
  memoryVision: {
    triggerMove: 8,
    // Per Designer Notes: "should feel like a glitch, not a cutscene —
    // something the cauldron did that the dungeon didn't intend." 2200ms
    // is long enough to see the moth; short enough the player isn't
    // sure what they saw.
    durationMs: 2200,
    initials: 'M.J.M.',
  },
  closingLine:
    'A figure at a workbench. A glass jar. A moth. {name} filed the image somewhere safe.',
};

// ── Level 5 ────────────────────────────────────────────────────────────────
// "Smudge Does Something Impossible" — Smudge delivers an Unknown mid-level.
// Ingredients: M×2, A×2, C×2, E×2, D×1, S×1 (10), + Unknown delivered at move 9.
// Wall: Left = MM+C | Center = AA+C | Right = EE+D+S.
// The 'wall' recipe matches with only the 10 base items. The 'downward'
// recipe fires when the Unknown is placed in Left (next to the two
// Moonblooms). Either path ends the level; placing Unknown in Right
// dissolves it (functionally equivalent to leaving it out).
//
// Note on matching: the store's `recipeMatches` requires the placed
// multiset to equal the required multiset per cauldron. The 'wall' recipe
// is listed BEFORE 'downward' in `recipes[]`. If the player leaves Unknown
// in the tray, `firstMatchingRecipe` needs ingredients.every(placed!=null)
// to return a match — but Unknown is in `ingredients` and not placed. We
// special-case Unknown in the store: the conditional ingredient is exempt
// from the "every ingredient placed" rule.
export const LEVEL_5: LevelConfig = {
  id: 5,
  title: 'Smudge Does Something Impossible',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 1 },
    { kind: 'silvermoss', count: 1 },
  ],
  cauldrons: ['left', 'center', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'coldstone'],
        center: ['ashroot', 'ashroot', 'coldstone'],
        right: ['emberpetal', 'emberpetal', 'darkspore', 'silvermoss'],
      },
      wispColor: 'violet',
      powerUpLabel: '+2 Extra Move Tokens',
      powerUpDetail: 'The wall recipe held, even with a strange visitor on the rim.',
    },
    {
      id: 'downward',
      label: 'The grey-silver placement',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'coldstone', 'unknown'],
        center: ['ashroot', 'ashroot', 'coldstone'],
        right: ['emberpetal', 'emberpetal', 'darkspore', 'silvermoss'],
      },
      wispColor: 'downward-grey',
      powerUpLabel: '1 Rare-Event Token',
      powerUpDetail: 'Something went down, not up. The grate did not log it.',
    },
  ],
  moveLimit: 18,
  targetMoves: 11,
  acceptableMoves: 14,
  conditionalIngredient: {
    kind: 'unknown',
    deliverAtMove: 9,
    downwardCauldron: 'left',
    dissolveCauldron: 'right',
  },
  closingLine:
    '{name} pressed her hand against the wall. Solid. Smudge looked at it anyway.',
};

// ── Level 6 ────────────────────────────────────────────────────────────────
// "The Architect Speaks" — four cauldrons, time-sensitive overheat, voice fragment.
// Ingredients: M×2, A×3, C×2, E×2, D×2, S×1, Hollowroot×1 (13)
// Wall: Left=MM | C-Left=AAA | C-Right=CCEE | Right=DDS+Hollowroot
// Volatile: Hollowroot shifts every 4 moves.
// Time-sensitive: C-Left overheats if empty after move 5 → level fails.
// Architect voice fires at move 12, 8-second overlay, puzzle keeps running.
export const LEVEL_6: LevelConfig = {
  id: 6,
  title: 'The Architect Speaks',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 3 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 2 },
    { kind: 'silvermoss', count: 1 },
    { kind: 'hollowroot', count: 1 },
  ],
  cauldrons: ['left', 'center-left', 'center-right', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom'],
        'center-left': ['ashroot', 'ashroot', 'ashroot'],
        'center-right': ['coldstone', 'coldstone', 'emberpetal', 'emberpetal'],
        right: ['darkspore', 'darkspore', 'silvermoss', 'hollowroot'],
      },
      wispColor: 'violet-strong',
      powerUpLabel: '+3 Extra Move Tokens',
      powerUpDetail: 'The Architect is paying attention — and so are you.',
    },
  ],
  // Playtest 2026-04-18: 20-move budget with C-Left overheat at move 5
  // and Hollowroot volatility every 4 moves was unwinnable — the player
  // had no slack for any wrong placement or any volatile shift. Bumped
  // budget to 24 moves, deadline to 8, and slowed Hollowroot drift to
  // every 5 moves so a player who notices the warning has a chance to
  // react.
  moveLimit: 24,
  targetMoves: 16,
  acceptableMoves: 20,
  volatility: {
    kinds: ['hollowroot'],
    shiftEveryMoves: 5,
  },
  timeSensitive: {
    cauldron: 'center-left',
    fillByMove: 8,
  },
  architectVoice: {
    triggerMove: 12,
    durationMs: 9000,
    fragments: [
      '…the violet output from Cell 4 is cleaner than expected for this stage of residue extraction…',
      '…increase the complexity of the Ashveil recipe on the next rotation…',
      '…grief resonance is elevated — class two moving toward class three…',
      '…do not reduce cauldron temperature in Sub-Ward One this cycle…',
    ],
  },
  closingLine:
    '{name} wrote G.R.C.2 on the wall. Smudge was very still. He heard it too.',
};

// ── Level 7 ────────────────────────────────────────────────────────────────
// "Through the Wall" — Aldric speaks. Joint sync introduced. Wren visits.
// Ingredients: M×2 A×2 C×3 E×2 D×1 S×2 H×1 G×1 (14)
// Wall: Left=MM+G | C-Left=AA+EE | C-Right=CCC+S | Right=D+S+H.
// Joint hold: Center-Right at move 14 — 5s window. Successful sync swaps
// in the 'joint' recipe variant (warm-grey threading on the violet wisp).
const ALDRIC_L7_JOINT: RecipePath = {
  id: 'joint',
  label: 'Aldric matched the cue',
  handwriting: 'wall',
  // Same placement as the wall recipe; the joint result is a different
  // wisp, not a different sort. Sync is the differentiator.
  placement: {
    left: ['moonbloom', 'moonbloom', 'greystone'],
    'center-left': ['ashroot', 'ashroot', 'emberpetal', 'emberpetal'],
    'center-right': ['coldstone', 'coldstone', 'coldstone', 'silvermoss'],
    right: ['darkspore', 'silvermoss', 'hollowroot'],
  },
  wispColor: 'violet-grey',
  powerUpLabel: '+1 Wildcard · +2 Move Tokens',
  powerUpDetail: 'Two cells brewed in time. The grate logged the blend.',
  hidden: true,
};
const WREN_ENCOUNTER: EncounterConfig = {
  id: 'wren-visitor',
  triggerMove: 7,
  decisionSeconds: 12,
  defaultChoice: 'silent',
  title: 'Wren',
  role: 'A Luminar Noble · The Counter',
  whisper:
    'A man stops at the cell window. He has a small black book. He looks past you and writes a number.',
  choices: [
    {
      id: 'silent',
      label: 'Say nothing',
      risk: 'safe',
      blurb: 'He writes. He moves on. The timer picks this if you wait.',
    },
    {
      id: 'observe',
      label: 'Memorise the ring',
      risk: 'safe',
      blurb: 'A crest in iron — three barbs, no crown. You will know it later.',
    },
    {
      id: 'callout',
      label: 'Speak up — Aldric: "Don\'t."',
      risk: 'risky',
      cost: { moves: 2 },
      blurb: 'He pauses. Writes longer. The cost lands on this brew — two extra moves spent.',
    },
  ],
};
export const LEVEL_7: LevelConfig = {
  id: 7,
  title: 'Through the Wall',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 3 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 1 },
    { kind: 'silvermoss', count: 2 },
    { kind: 'hollowroot', count: 1 },
    { kind: 'greystone', count: 1 },
  ],
  cauldrons: ['left', 'center-left', 'center-right', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'greystone'],
        'center-left': ['ashroot', 'ashroot', 'emberpetal', 'emberpetal'],
        'center-right': ['coldstone', 'coldstone', 'coldstone', 'silvermoss'],
        right: ['darkspore', 'silvermoss', 'hollowroot'],
      },
      wispColor: 'violet',
      powerUpLabel: '+2 Move Tokens',
      powerUpDetail: 'You held the wall recipe under pressure.',
    },
    ALDRIC_L7_JOINT,
  ],
  moveLimit: 18,
  targetMoves: 12,
  acceptableMoves: 15,
  encounter: WREN_ENCOUNTER,
  volatility: { kinds: ['greystone'], shiftEveryMoves: 6 },
  jointSync: {
    triggerMove: 14,
    cauldron: 'center-right',
    windowSeconds: 5,
    unlocks: 'joint',
    whisper: 'Now. The same low note we settled on.',
  },
  closingLine:
    'Aldric, through the wall: the noble is called Wren. He counts the wisps. {name} wrote W.C.W. on the wall.',
};

// ── Level 8 ────────────────────────────────────────────────────────────────
// "The Note in the Wall" — note pried from a crack mid-level.
// Per PRD UX cap: max 14 ingredients. Doc lists 17; we use the PRD cap.
// Ingredients: M×2 A×3 C×2 E×2 D×1 S×1 H×2 G×1 (14)
// Wall: Left=MM+E | C-Left=AAA+S | C-Right=CC+G+D | Right=E+HH
const ALDRIC_L8_JOINT: RecipePath = {
  id: 'joint',
  label: 'Aldric held the second sync',
  handwriting: 'wall',
  placement: {
    left: ['moonbloom', 'moonbloom', 'emberpetal'],
    'center-left': ['ashroot', 'ashroot', 'ashroot', 'silvermoss'],
    'center-right': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
    right: ['emberpetal', 'hollowroot', 'hollowroot'],
  },
  wispColor: 'violet-grey',
  powerUpLabel: 'Grate Tap Unlocked',
  powerUpDetail: 'You can tap the grate now. It still does nothing. Yet.',
  hidden: true,
};
export const LEVEL_8: LevelConfig = {
  id: 8,
  title: 'The Note in the Wall',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 3 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 1 },
    { kind: 'silvermoss', count: 1 },
    { kind: 'hollowroot', count: 2 },
    { kind: 'greystone', count: 1 },
  ],
  cauldrons: ['left', 'center-left', 'center-right', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'emberpetal'],
        'center-left': ['ashroot', 'ashroot', 'ashroot', 'silvermoss'],
        'center-right': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        right: ['emberpetal', 'hollowroot', 'hollowroot'],
      },
      wispColor: 'violet-strong',
      powerUpLabel: '+3 Move Tokens',
      powerUpDetail: 'Class three resonance achieved. The wall held.',
    },
    ALDRIC_L8_JOINT,
  ],
  moveLimit: 18,
  targetMoves: 13,
  acceptableMoves: 16,
  // Per PRD §03: never combine volatile + time-pressure + cooperative sync
  // in the same window. L8 keeps the time-sensitive cauldron + sync; the
  // single volatile (greystone) is dropped vs. the doc's 2 to stay safe.
  volatility: { kinds: ['greystone'], shiftEveryMoves: 5 },
  timeSensitive: { cauldron: 'right', fillByMove: 8 },
  jointSync: {
    triggerMove: 16,
    cauldron: 'center-right',
    windowSeconds: 6,
    unlocks: 'joint',
    whisper: 'Same as last time. Slower this time.',
  },
  noteFromWall: {
    triggerMove: 11,
    durationMs: 5000,
    text:
      'The recipe is not the product. You are. They built the cauldrons to measure what you carry, not what you make. The wisps are the residue. — Someone who got out.',
  },
  closingLine:
    'Aldric, through the wall: how long have you been here? {name} did not know. Neither did he. That is how they knew it was working.',
};

// ── Level 9 ────────────────────────────────────────────────────────────────
// "The Black Wisp" — the wall is blank. Three valid paths.
// Ingredients: M×2 A×2 C×2 E×2 D×2 S×2 H×1 G×1 (14)
// Compliance: the same shape Mira learned from L8 wall (she remembers it).
// Deviation: one swap — moonblooms split across left+center-left.
// Refusal: full miss-match — places everything in the "wrong" cauldrons.
//          Yields a black wisp that does not rise.
export const LEVEL_9: LevelConfig = {
  id: 9,
  title: 'The Black Wisp',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 2 },
    { kind: 'silvermoss', count: 2 },
    { kind: 'hollowroot', count: 1 },
    { kind: 'greystone', count: 1 },
  ],
  cauldrons: ['left', 'center-left', 'center-right', 'right'],
  recipes: [
    {
      id: 'compliant',
      label: 'The shape she has been taught',
      handwriting: 'unwritten',
      placement: {
        left: ['moonbloom', 'moonbloom', 'emberpetal'],
        'center-left': ['ashroot', 'ashroot', 'silvermoss'],
        'center-right': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        right: ['emberpetal', 'darkspore', 'silvermoss', 'hollowroot'],
      },
      wispColor: 'violet',
      powerUpLabel: '+2 Move Tokens',
      powerUpDetail: 'You followed the shape. Habit is a kind of consent.',
    },
    {
      id: 'deviation',
      label: 'A single shift — the moonblooms split',
      handwriting: 'unwritten',
      placement: {
        left: ['moonbloom', 'emberpetal'],
        'center-left': ['moonbloom', 'ashroot', 'ashroot', 'silvermoss'],
        'center-right': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        right: ['emberpetal', 'darkspore', 'silvermoss', 'hollowroot'],
      },
      wispColor: 'amber-threaded',
      powerUpLabel: 'Refusal Resilience',
      powerUpDetail: 'A small swerve. The grate still received — but less.',
    },
    {
      id: 'refusal',
      label: 'Inverted — every cauldron the wrong colour',
      handwriting: 'unwritten',
      placement: {
        left: ['emberpetal', 'darkspore', 'silvermoss', 'hollowroot'],
        'center-left': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        'center-right': ['ashroot', 'ashroot', 'silvermoss'],
        right: ['moonbloom', 'moonbloom', 'emberpetal'],
      },
      wispColor: 'black',
      powerUpLabel: '+1 Bonus Gem · Refusal Banked',
      powerUpDetail: 'The wisp circled the room and returned. The Architect: "interesting."',
    },
    // Pocketed-Unknown chain — only reachable if the player kept the L5
    // Unknown. Both place the Unknown in left (mirroring L5's downward
    // wisp) on top of a compliant or refusal sort.
    {
      id: 'downward',
      label: 'Pocketed Unknown · into the left cauldron',
      handwriting: 'unwritten',
      placement: {
        left: ['moonbloom', 'moonbloom', 'emberpetal', 'unknown'],
        'center-left': ['ashroot', 'ashroot', 'silvermoss'],
        'center-right': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        right: ['emberpetal', 'darkspore', 'silvermoss', 'hollowroot'],
      },
      wispColor: 'downward-grey',
      powerUpLabel: '+2 Bonus Gems · Off-Ledger',
      powerUpDetail:
        'A grey wisp went down through the floor. The Architect cannot account for it.',
    },
    {
      id: 'silent',
      label: 'Refusal · plus the Unknown · max denial',
      handwriting: 'unwritten',
      placement: {
        left: ['emberpetal', 'darkspore', 'silvermoss', 'hollowroot', 'unknown'],
        'center-left': ['coldstone', 'coldstone', 'greystone', 'darkspore'],
        'center-right': ['ashroot', 'ashroot', 'silvermoss'],
        right: ['moonbloom', 'moonbloom', 'emberpetal'],
      },
      wispColor: 'silent',
      powerUpLabel: '+3 Bonus Gems · The Quiet Cycle',
      powerUpDetail:
        'No wisp at all. The grate stayed shut. The Architect heard the silence and made a note.',
    },
  ],
  moveLimit: 22,
  targetMoves: 14,
  acceptableMoves: 18,
  blankWall: true,
  // The pocketed Unknown from L5 is added to the L9 starting tray when
  // hasPocketedUnknown is true. It's exempt from the "every ingredient
  // placed" check so the non-Unknown paths (compliant / deviation /
  // refusal) remain reachable for players who didn't pocket it.
  chainsPocketedUnknown: true,
  conditionalIngredient: {
    kind: 'unknown',
    deliverAtMove: 0, // pre-populated; deliverAtMove is unused for L9
    downwardCauldron: 'left',
    dissolveCauldron: 'right',
  },
  volatility: { kinds: ['hollowroot', 'greystone'], shiftEveryMoves: 4 },
  timeSensitive: { cauldron: 'center-left', fillByMove: 7 },
  closingLine:
    'Aldric: they noticed. {name}: I know. She drew a circle on the wall, with an arrow pointing back into itself.',
};

// ── Level 10 ───────────────────────────────────────────────────────────────
// "The Floor Below" — chapter finale. Two syncs with Aldric. Bessie key
// drop (silent encounter, no decision window). Per PRD: max 14
// ingredients (doc lists 18, we trim to 14 to stay inside the cap).
// Ingredients: M×2 A×2 C×2 E×2 D×2 S×1 H×2 G×1 (14)
// Wall: Left=MM+G | C-Left=AA+E | C-Right=CC+E+S | Right=DD+HH
const ALDRIC_L10_JOINT: RecipePath = {
  id: 'joint',
  label: 'Both syncs caught — the trust path',
  handwriting: 'wall',
  placement: {
    left: ['moonbloom', 'moonbloom', 'greystone'],
    'center-left': ['ashroot', 'ashroot', 'emberpetal'],
    'center-right': ['coldstone', 'coldstone', 'emberpetal', 'silvermoss'],
    right: ['darkspore', 'darkspore', 'hollowroot', 'hollowroot'],
  },
  wispColor: 'violet-grey',
  powerUpLabel: '+5 Gems · Chapter Bonus',
  powerUpDetail: 'Two cells, one rhythm. The first lock listens.',
  hidden: true,
};
const BESSIE_FINAL_ENCOUNTER: EncounterConfig = {
  id: 'bessie-final',
  triggerMove: 12,
  decisionSeconds: 10,
  defaultChoice: 'pickup',
  title: 'Bessie Tallow',
  role: 'Twenty Years · She Does Not Stop',
  whisper:
    'A small dark-metal key skids under the door. Bessie\'s footsteps do not pause. She does not look back.',
  requiresAlly: 'bessie',
  choices: [
    {
      id: 'pickup',
      label: 'Pick it up',
      risk: 'safe',
      blurb: 'It is not for your lock. The bow is the wrong shape. You keep it.',
    },
    {
      id: 'ignore',
      label: 'Leave it for now',
      risk: 'safe',
      blurb: 'It will be there after the brew. Whoever the lock belongs to, they can wait.',
    },
  ],
};
export const LEVEL_10: LevelConfig = {
  id: 10,
  title: 'The Floor Below',
  chapterLabel: 'Cell 4 · Sub-Ward One',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 2 },
    { kind: 'emberpetal', count: 2 },
    { kind: 'darkspore', count: 2 },
    { kind: 'silvermoss', count: 1 },
    { kind: 'hollowroot', count: 2 },
    { kind: 'greystone', count: 1 },
  ],
  cauldrons: ['left', 'center-left', 'center-right', 'right'],
  recipes: [
    {
      id: 'wall',
      label: 'Scratched into the wall',
      handwriting: 'wall',
      placement: {
        left: ['moonbloom', 'moonbloom', 'greystone'],
        'center-left': ['ashroot', 'ashroot', 'emberpetal'],
        'center-right': ['coldstone', 'coldstone', 'emberpetal', 'silvermoss'],
        right: ['darkspore', 'darkspore', 'hollowroot', 'hollowroot'],
      },
      wispColor: 'violet-strong',
      powerUpLabel: '+5 Gems · Chapter Bonus',
      powerUpDetail: 'She had learned to brew. She had not yet learned to refuse.',
    },
    ALDRIC_L10_JOINT,
  ],
  moveLimit: 24,
  targetMoves: 16,
  acceptableMoves: 20,
  encounter: BESSIE_FINAL_ENCOUNTER,
  volatility: { kinds: ['greystone'], shiftEveryMoves: 4 },
  timeSensitive: { cauldron: 'left', fillByMove: 7 },
  jointSync: {
    triggerMove: 18,
    cauldron: 'center-right',
    windowSeconds: 6,
    unlocks: 'joint',
    whisper: 'The first of two. Steady.',
  },
  closingLine:
    'Aldric: how many locks do you think there are? {name}: exactly as many as there need to be.',
};

// Each level gets the three hidden character alternates (Aldric / Cael /
// Petra) appended. They share the level's ingredient multiset so any of
// the four sorts (wall + 3 hidden) is a valid completion. The store's
// `firstMatchingRecipe` already handles "joint" priority on sync; the
// rest fall through in order, with hidden variants only winning when
// the player's actual placement matches them exactly.
function attachHiddenAlternates(level: LevelConfig): LevelConfig {
  return {
    ...level,
    recipes: [...level.recipes, ...withHiddenAlternates(level)],
  };
}

export const LEVELS: LevelConfig[] = [
  LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5,
  LEVEL_6, LEVEL_7, LEVEL_8, LEVEL_9, LEVEL_10,
].map(attachHiddenAlternates);

export function getLevel(id: number): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVEL_1;
}

export function nextLevelId(currentId: number): number | null {
  const idx = LEVELS.findIndex((l) => l.id === currentId);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}
