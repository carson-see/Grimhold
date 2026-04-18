import type { EncounterConfig, LevelConfig } from '../game/types';

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
// "Bessie Tallow" — three cauldrons, random encounter at move 10.
// Ingredients: Moonbloom ×2, Ashroot ×2, Coldstone ×2, Emberpetal ×1, Darkspore ×1, Silvermoss ×1 (9)
// Wall: Left = MM | Center = AAE | Right = CCDS.
const BESSIE_ENCOUNTER: EncounterConfig = {
  id: 'bessie-tallow',
  triggerMove: 10,
  decisionSeconds: 8,
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

export const LEVELS: LevelConfig[] = [LEVEL_1, LEVEL_2, LEVEL_3];

export function getLevel(id: number): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVEL_1;
}

export function nextLevelId(currentId: number): number | null {
  const idx = LEVELS.findIndex((l) => l.id === currentId);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1].id;
}
