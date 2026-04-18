import type { PowerUpId, UnlockId } from '../game/store';

// Power-up + unlock catalogue. Drives both the Larder shop UI and the
// in-level token strip. Prices stay in this file so the design tuning
// is reviewable in one place.

export type PowerUpDef = {
  id: PowerUpId;
  name: string;
  blurb: string;     // shopkeeper-tone description
  effect: string;    // mechanical effect, plain
  coinPrice: number;
};

export const POWERUPS: PowerUpDef[] = [
  {
    id: 'extra-move',
    name: 'Extra Move Tokens · ×2',
    blurb: 'Bessie can spare two more moves if you can spare the coin.',
    effect:
      '+2 moves to this level\u2019s budget. Does not extend time-sensitive cauldron deadlines.',
    coinPrice: 250,
  },
  {
    id: 'freeze-volatile',
    name: "Stillstone Powder",
    blurb: 'A pinch on the cauldron rim. Volatile drift settles for a beat.',
    effect: 'Freezes volatile ingredient shifts for the next 5 placements.',
    coinPrice: 400,
  },
  {
    id: 'recipe-peek',
    name: "Aldric's Whisper",
    blurb: 'Listen at the wall before you sort.',
    effect: 'Reveals one hidden recipe (Aldric / Cael / Petra) for this level.',
    coinPrice: 600,
  },
];

export type UnlockDef = {
  id: UnlockId;
  name: string;
  blurb: string;
  gemPrice: number;
};

export const UNLOCKS: UnlockDef[] = [
  {
    id: 'smudge-skin-tarred',
    name: 'Smudge · Tarred Variant',
    blurb: 'A second coat. The feathers gleam wrong on purpose.',
    gemPrice: 6,
  },
  {
    id: 'music-box-phrase',
    name: 'The Long Music-Box Phrase',
    blurb: 'The note Mira heard was the start of a longer line. This unlocks it across all scenes.',
    gemPrice: 8,
  },
  {
    id: 'character-peek',
    name: 'Field Notes · Roster',
    blurb: "Aldric, Cael and Petra start whispering hints when you load a level — not how, just whose hand it might be.",
    gemPrice: 12,
  },
];

export function findPowerup(id: PowerUpId): PowerUpDef | undefined {
  return POWERUPS.find((p) => p.id === id);
}
export function findUnlock(id: UnlockId): UnlockDef | undefined {
  return UNLOCKS.find((u) => u.id === id);
}
