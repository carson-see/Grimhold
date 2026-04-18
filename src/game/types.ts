// Grimhold type surface.
// Act One Level 1 only — kept minimal; fields like `volatile`, `alt_recipe`,
// and `encounter` from PRD §07 are deferred until v0.2.

export type IngredientId =
  | 'moonbloom'
  | 'ashroot'
  | 'coldstone'
  | 'emberpetal';

export type CauldronId = 'left' | 'right';

export type Screen =
  | 'title'
  | 'character-select'
  | 'name'
  | 'scene-00'
  | 'level'
  | 'wisp'
  | 'scene-01'
  | 'level-complete'
  | 'larder-stub';

export interface Ingredient {
  id: string;            // unique runtime id (e.g. "moonbloom-0")
  kind: IngredientId;
  placedIn: CauldronId | null;
}

export interface LevelConfig {
  id: number;
  title: string;
  ingredients: Array<{ kind: IngredientId; count: number }>;
  cauldrons: CauldronId[];
  wallRecipe: Record<CauldronId, IngredientId[]>;
  moveLimit: number;
  targetMoves: number;       // 3-star threshold
  acceptableMoves: number;   // 2-star threshold
}

export interface LevelResult {
  stars: 1 | 2 | 3;
  movesUsed: number;
  coins: number;
  gems: number;
  wispColor: 'violet';
}
