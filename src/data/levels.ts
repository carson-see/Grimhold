import type { LevelConfig } from '../game/types';

// Act One, Level 1 — "The First Recipe"
// Source: docs/grimhold_level_document.docx, lines 28-67.
//   Ingredients: Moonbloom ×2, Ashroot ×2, Coldstone ×1, Emberpetal ×1 (6 total)
//   Wall Recipe:  Left: Moonbloom + Ashroot  |  Right: Coldstone + Emberpetal
//   Move Limit: 18 — generous teaching level.
// The doc lists the recipe as ingredient *types*, not slot counts. With 2 of
// each baseline ingredient, both Moonblooms and both Ashroots belong in
// Left; Coldstone and Emberpetal belong in Right. Every ingredient has one
// obvious home. The level teaches the sort mechanic and nothing else.

export const LEVEL_1: LevelConfig = {
  id: 1,
  title: 'The First Recipe',
  ingredients: [
    { kind: 'moonbloom', count: 2 },
    { kind: 'ashroot', count: 2 },
    { kind: 'coldstone', count: 1 },
    { kind: 'emberpetal', count: 1 },
  ],
  cauldrons: ['left', 'right'],
  wallRecipe: {
    left: ['moonbloom', 'moonbloom', 'ashroot', 'ashroot'],
    right: ['coldstone', 'emberpetal'],
  },
  moveLimit: 18,
  targetMoves: 8,       // 6 placements + 2 corrections allowed for 3-star
  acceptableMoves: 12,  // 2-star
};
