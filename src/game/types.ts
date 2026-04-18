// Grimhold type surface — Act One, Chapter One, Levels 1–10.
// Mechanics accumulate through the act:
//   L1: single-recipe teaching level
//   L2: multi-recipe paths (wall + slid)
//   L3: mid-level encounter (Bessie Tallow)
//   L4: volatile ingredients + memory vision
//   L5: conditional ingredient + downward wisp
//   L6: four cauldrons + time-sensitive overheat + Architect voice
//   L7: Aldric joint sync, Wren encounter, Greystone introduced
//   L8: Note from the wall (long pause), Bessie window cameo, sync + time + volatile
//   L9: blank wall — full deviation freedom (compliance/deviation/refusal paths)
//   L10: chapter finale — two syncs, Bessie key drop, floor reveal

export type IngredientId =
  | 'moonbloom'
  | 'ashroot'
  | 'coldstone'
  | 'emberpetal'
  | 'darkspore'
  | 'silvermoss'
  | 'hollowroot'
  | 'greystone'
  | 'unknown';

// Four distinct slot IDs — L6+ uses center-left and center-right for the
// four-cauldron layout.
export type CauldronId = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

export type WispColor =
  | 'violet'
  | 'amber-threaded'
  | 'violet-amber'
  | 'violet-dark'
  | 'violet-strong'
  | 'violet-grey'        // L7: Aldric synced — partly violet, partly warm grey
  | 'downward-grey'
  | 'black'              // L9 deviation — circles the room, returns to cauldron
  | 'silent';            // L9 fully refused — no wisp, the dungeon receives nothing

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
  | 'scene-07'
  | 'scene-08'
  | 'scene-09'
  | 'scene-10'
  | 'level-complete'
  | 'larder-stub';

export interface Ingredient {
  id: string;            // unique runtime id (e.g. "moonbloom-0")
  kind: IngredientId;
  placedIn: CauldronId | null;
}

// A level can end by matching any one of several recipes. Each path has its
// own wisp color and narrative framing.
export type RecipePathId =
  | 'wall'
  | 'slid'
  | 'joint'
  | 'downward'
  | 'compliant'
  | 'deviation'         // L9 — partial deviation, mixed wisp
  | 'refusal';          // L9 — full deviation, black wisp / silent rise

export interface RecipePath {
  id: RecipePathId;
  label: string;          // "The Wall Recipe", "The Slid Paper", …
  handwriting: 'wall' | 'slid' | 'unwritten'; // 'unwritten' for L9's blank wall
  placement: Partial<Record<CauldronId, IngredientId[]>>;
  wispColor: WispColor;
  powerUpLabel: string;
  powerUpDetail: string;
  /** Hide this recipe from the in-puzzle HUD (player must discover it). */
  hidden?: boolean;
}

// Encounters interrupt the level at a specific move count. L7 adds Wren
// (the noble visitor), L10 adds the silent Bessie key drop.
export type EncounterId = 'bessie-tallow' | 'wren-visitor' | 'bessie-final';

export type EncounterChoiceId =
  | 'bribe'
  | 'distract'
  | 'recruit'
  | 'silent'
  | 'observe'    // L7 Wren — memorise his ring crest
  | 'callout'    // L7 Wren — speak up despite Aldric's warning
  | 'pickup'     // L10 Bessie — pick up the key
  | 'ignore';    // L10 Bessie — leave it for now

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
  /** Suppress this encounter unless Bessie was recruited in L3. */
  requiresAlly?: 'bessie';
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
// are affected; the rotation order is the level's cauldron list.
export interface VolatilityConfig {
  kinds: IngredientId[];
  shiftEveryMoves: number;
}

// L7 / L8 / L10 — Aldric joins from the next cell over. Player taps the
// indicated cauldron during the sync window; success unlocks a joint
// recipe variant (warm-grey wisp). Miss → variant unreachable this run.
export interface JointSyncConfig {
  /** Move at which the sync window opens. */
  triggerMove: number;
  /** Cauldron the player must tap-and-hold against. */
  cauldron: CauldronId;
  /** Sync window size in seconds. */
  windowSeconds: number;
  /** Recipe path id unlocked by a successful sync (default: 'joint'). */
  unlocks?: RecipePathId;
  /** Fragment Aldric whispers when the sync opens. */
  whisper: string;
}

// L8 — Smudge pries a worn note from a crack in the floor. Blocking
// pause; the puzzle resumes when the player dismisses (or the timer
// expires). The text is added to the lore log on dismiss.
export interface NoteFromWallConfig {
  triggerMove: number;
  durationMs: number;
  text: string;
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
  jointSync?: JointSyncConfig;
  noteFromWall?: NoteFromWallConfig;
  /** L9 — wall is intentionally blank; player navigates without a recipe HUD. */
  blankWall?: boolean;
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
  jointHit?: boolean;        // L7+ — true if the Aldric sync window was caught
}
