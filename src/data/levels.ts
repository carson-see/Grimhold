import type { CauldronId, EncounterConfig, LevelConfig } from '../game/types';

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
    durationMs: 3200,
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
  moveLimit: 20,
  targetMoves: 14,
  acceptableMoves: 17,
  volatility: {
    kinds: ['hollowroot'],
    shiftEveryMoves: 4,
  },
  timeSensitive: {
    cauldron: 'center-left',
    fillByMove: 5,
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

export const LEVELS: LevelConfig[] = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];

export function getLevel(id: number): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVEL_1;
}

export function nextLevelId(currentId: number): number | null {
  const idx = LEVELS.findIndex((l) => l.id === currentId);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}
