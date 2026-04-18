// Grimhold type surface — Act One, Chapter One, Levels 1–3.
// Each level may carry multiple valid recipe paths (wall vs slid in L2) and
// an optional mid-level encounter (Bessie Tallow in L3). Ingredients and
// cauldron slots grow through the act; this union covers 1–3.

export type IngredientId =
  | 'moonbloom'
  | 'ashroot'
  | 'coldstone'
  | 'emberpetal'
  | 'darkspore'
  | 'silvermoss';

export type CauldronId = 'left' | 'center' | 'right';

export type WispColor = 'violet' | 'amber-threaded' | 'violet-amber';

export type Screen =
  | 'title'
  | 'character-select'
  | 'name'
  | 'scene-00'
  | 'level'
  | 'wisp'
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'level-complete'
  | 'larder-stub';

export interface Ingredient {
  id: string;            // unique runtime id (e.g. "moonbloom-0")
  kind: IngredientId;
  placedIn: CauldronId | null;
}

// A level can end by matching any one of several recipes. Each path has its
// own wisp color and narrative framing. L1 has a single path; L2 has two
// (wall + slid); L3 has one, produced jointly with Bessie's presence.
export type RecipePathId = 'wall' | 'slid' | 'joint';

export interface RecipePath {
  id: RecipePathId;
  label: string;          // "The Wall Recipe", "The Slid Paper", …
  handwriting: 'wall' | 'slid'; // which chalk treatment to use in UI
  placement: Partial<Record<CauldronId, IngredientId[]>>;
  wispColor: WispColor;
  powerUpLabel: string;
  powerUpDetail: string;
}

// Encounters interrupt the level at a specific move count. Currently only
// used by Level 3 (Bessie Tallow), but shaped to accept future encounters.
export type EncounterId = 'bessie-tallow';

export type EncounterChoiceId = 'bribe' | 'distract' | 'recruit' | 'silent';

export interface EncounterChoice {
  id: EncounterChoiceId;
  label: string;
  cost?: { coins?: number; moves?: number };
  risk?: 'safe' | 'risky' | 'expensive';
  blurb: string;
}

export interface EncounterConfig {
  id: EncounterId;
  triggerMove: number;        // the move count that opens the modal
  decisionSeconds: number;    // countdown before auto-defaulting
  defaultChoice: EncounterChoiceId;
  title: string;              // "Bessie Tallow"
  role: string;               // "Dungeon Cook"
  whisper: string;            // narrative setup
  choices: EncounterChoice[];
}

export interface LevelConfig {
  id: number;
  title: string;
  chapterLabel: string;  // "Cell 4 · Sub-Ward One"
  ingredients: Array<{ kind: IngredientId; count: number }>;
  cauldrons: CauldronId[];
  recipes: RecipePath[];
  moveLimit: number;
  targetMoves: number;       // 3-star threshold
  acceptableMoves: number;   // 2-star threshold
  encounter?: EncounterConfig;
  closingLine: string;       // small italic line under LC card
}

export interface LevelResult {
  levelId: number;
  stars: 1 | 2 | 3;
  movesUsed: number;
  coins: number;
  gems: number;
  wispColor: WispColor;
  recipePathId: RecipePathId;
  encounterChoice?: EncounterChoiceId;
}
