// Grimhold type surface — Act One, Chapter One, Levels 1–6.
// Mechanics accumulate through the act:
//   L1: single-recipe teaching level
//   L2: multi-recipe paths (wall + slid)
//   L3: mid-level encounter (Bessie Tallow)
//   L4: volatile ingredients + memory vision
//   L5: conditional ingredient + downward wisp
//   L6: four cauldrons + time-sensitive overheat + Architect voice

export type IngredientId =
  | 'moonbloom'
  | 'ashroot'
  | 'coldstone'
  | 'emberpetal'
  | 'darkspore'
  | 'silvermoss'
  | 'hollowroot'
  | 'unknown';

// Four distinct slot IDs — L6 introduces center-left and center-right for
// the four-cauldron layout.
export type CauldronId = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

export type WispColor =
  | 'violet'
  | 'amber-threaded'
  | 'violet-amber'
  | 'violet-dark'
  | 'violet-strong'
  | 'downward-grey';

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
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'level-complete'
  | 'larder-stub';

export interface Ingredient {
  id: string;            // unique runtime id (e.g. "moonbloom-0")
  kind: IngredientId;
  placedIn: CauldronId | null;
}

// A level can end by matching any one of several recipes. Each path has its
// own wisp color and narrative framing.
export type RecipePathId = 'wall' | 'slid' | 'joint' | 'downward' | 'compliant';

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
// Bessie Tallow (L3), but shaped to accept future encounters.
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
  triggerMove: number;
  decisionSeconds: number;
  defaultChoice: EncounterChoiceId;
  title: string;
  role: string;
  whisper: string;
  choices: EncounterChoice[];
}

// L4 — the cauldron water stills and shows a silent memory vision.
// Non-interactive; auto-dismisses after `durationMs`.
export interface MemoryVisionConfig {
  triggerMove: number;
  durationMs: number;
  initials: string;        // the note Mira scratches onto the wall afterward
}

// L5 — Smudge drops a new, unrecognised ingredient on the cauldron rim
// mid-level. It's not on the wall recipe. Three player options:
//   * place in a "wrong" cauldron → downward-grey wisp (rare event)
//   * place in a "neutral" cauldron → standard wisp, ingredient dissolves
//   * leave it in the tray (unplaced) → pocketed for a later level
export interface ConditionalIngredientConfig {
  kind: IngredientId;
  deliverAtMove: number;
  downwardCauldron: CauldronId;   // placement that yields the downward wisp
  dissolveCauldron: CauldronId;    // placement that yields the standard wisp
}

// L6 — the Architect's voice leaks through the wall mid-level. Non-blocking:
// the puzzle keeps running while the fragments play.
export interface ArchitectVoiceConfig {
  triggerMove: number;
  durationMs: number;
  fragments: string[];    // sequential whispered phrases
}

// L6 — the Center-Left cauldron overheats if it hasn't received any
// ingredient by `fillByMove`. Overheating fails the level.
export interface TimeSensitiveConfig {
  cauldron: CauldronId;
  fillByMove: number;
}

// L4 / L6 — volatile ingredients relocate to the next cauldron every
// `shiftEveryMoves` placements. Only ingredients in the listed `kinds`
// volatility; the rotation order is the level's cauldron list.
export interface VolatilityConfig {
  kinds: IngredientId[];
  shiftEveryMoves: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  chapterLabel: string;
  ingredients: Array<{ kind: IngredientId; count: number }>;
  cauldrons: CauldronId[];
  recipes: RecipePath[];
  moveLimit: number;
  targetMoves: number;
  acceptableMoves: number;
  encounter?: EncounterConfig;
  memoryVision?: MemoryVisionConfig;
  conditionalIngredient?: ConditionalIngredientConfig;
  architectVoice?: ArchitectVoiceConfig;
  timeSensitive?: TimeSensitiveConfig;
  volatility?: VolatilityConfig;
  closingLine: string;
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
  pocketedUnknown?: boolean; // only meaningful on L5
}
