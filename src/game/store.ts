import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CauldronId,
  EncounterChoiceId,
  Ingredient,
  IngredientId,
  LevelConfig,
  LevelResult,
  RecipePath,
  RecipePathId,
  Screen,
} from './types';
import { LEVEL_1, getLevel, nextLevelId } from '../data/levels';

export type CharacterClass = 'witch' | 'rogue' | 'scholar' | 'knight';

export interface EncounterState {
  open: boolean;
  triggered: boolean;       // already fired this level
  choice: EncounterChoiceId | null;
  deadline: number | null;  // epoch ms; null when closed
}

export interface MemoryVisionState {
  open: boolean;
  triggered: boolean;
  dismissAt: number | null; // epoch ms
}

export interface ArchitectVoiceState {
  open: boolean;
  triggered: boolean;
  fragmentIdx: number;      // which fragment is currently visible
  dismissAt: number | null; // epoch ms when the whole voice moment ends
}

interface Store {
  // Meta / progression
  screen: Screen;
  character: CharacterClass | null;
  name: string;
  hasSeenOpening: boolean;
  highestLevelCleared: number;
  tutorialSeen: boolean;
  bessieAllyActive: boolean;    // set to true if Level 3 recruit succeeds
  hasPocketedUnknown: boolean;  // L5 outcome — used in later acts
  coins: number;
  gems: number;
  lastResult: LevelResult | null;

  // Active puzzle
  level: LevelConfig;
  ingredients: Ingredient[];
  selectedIngredientId: string | null;
  movesUsed: number;
  completed: boolean;
  completedPathId: RecipePathId | null;
  failed: boolean;                    // e.g. L6 overheat — distinct from move-limit soft-fail
  encounter: EncounterState;
  memoryVision: MemoryVisionState;
  architectVoice: ArchitectVoiceState;
  conditionalDelivered: boolean;      // L5: Smudge has brought the Unknown
  timeSensitiveSatisfied: boolean;    // L6: C-Left has been filled at least once

  // Actions
  setScreen: (s: Screen) => void;
  pickCharacter: (c: CharacterClass) => void;
  setName: (n: string) => void;
  markOpeningSeen: () => void;
  markTutorialSeen: () => void;
  startLevel: (id: number) => void;
  resetLevel: () => void;
  selectIngredient: (id: string | null) => void;
  placeInCauldron: (cauldron: CauldronId) => void;
  removeFromCauldron: (id: string) => void;
  resolveEncounter: (choice: EncounterChoiceId) => void;
  dismissMemoryVision: () => void;
  dismissArchitectVoice: () => void;
  finishLevel: () => LevelResult;
  advanceToNextLevel: () => void;
}

// Type for the dev-only window handle — the actual assignment lives in
// `src/main.tsx` behind an `import.meta.env.DEV` guard so production builds
// tree-shake it out. Do not call this from app code.
declare global {
  interface Window {
    __GRIMHOLD__?: { store: typeof useGame };
  }
}

// ── Recipe matching ────────────────────────────────────────────────────────
// A cauldron matches a recipe's slot list when the multiset of placed
// ingredients equals the required multiset. All recipes for a level must
// match for the level to be won.

function placedIn(ingredients: Ingredient[], cauldron: CauldronId): IngredientId[] {
  return ingredients.filter((i) => i.placedIn === cauldron).map((i) => i.kind);
}

function multisetEqual(a: IngredientId[], b: IngredientId[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<IngredientId, number>();
  for (const k of a) counts.set(k, (counts.get(k) ?? 0) + 1);
  for (const k of b) {
    const c = counts.get(k);
    if (!c) return false;
    counts.set(k, c - 1);
  }
  return [...counts.values()].every((v) => v === 0);
}

function recipeMatches(ingredients: Ingredient[], level: LevelConfig, recipe: RecipePath): boolean {
  for (const cauldron of level.cauldrons) {
    const required = recipe.placement[cauldron] ?? [];
    if (!multisetEqual(placedIn(ingredients, cauldron), required)) return false;
  }
  return true;
}

export type CauldronStatus = 'neutral' | 'correct' | 'wrong';

// A cauldron is "correct" when at least one of the level's recipes fully
// matches it at the current placement count. "Wrong" means no recipe could
// possibly match with this cauldron's current contents (every recipe has
// already been violated here). Otherwise "neutral".
export function cauldronStatus(
  ingredients: Ingredient[],
  cauldron: CauldronId,
  level: LevelConfig,
): CauldronStatus {
  const placed = placedIn(ingredients, cauldron);
  if (placed.length === 0) return 'neutral';

  let anyStillPossible = false;
  let anyCorrect = false;
  for (const recipe of level.recipes) {
    const required = recipe.placement[cauldron] ?? [];
    if (isPrefixMultiset(placed, required)) {
      anyStillPossible = true;
      if (placed.length === required.length) anyCorrect = true;
    }
  }
  if (anyCorrect) return 'correct';
  if (!anyStillPossible) return 'wrong';
  return 'neutral';
}

// True when every kind in `placed` can still fit into `required` without
// overflow. Used to grey-out a cauldron the moment a recipe is broken.
function isPrefixMultiset(placed: IngredientId[], required: IngredientId[]): boolean {
  if (placed.length > required.length) return false;
  const counts = new Map<IngredientId, number>();
  for (const k of required) counts.set(k, (counts.get(k) ?? 0) + 1);
  for (const k of placed) {
    const c = counts.get(k);
    if (!c) return false;
    counts.set(k, c - 1);
  }
  return true;
}

// ── Win detection ──────────────────────────────────────────────────────────
// If a conditional ingredient (L5's Unknown) is configured, it's allowed to
// stay on the tray — the level can complete without it. Every other
// ingredient must be placed before win is evaluated.
function firstMatchingRecipe(ingredients: Ingredient[], level: LevelConfig): RecipePath | null {
  const cond = level.conditionalIngredient;
  const allPlaced = ingredients.every((i) => i.placedIn !== null || i.kind === cond?.kind);
  if (!allPlaced) return null;
  for (const recipe of level.recipes) if (recipeMatches(ingredients, level, recipe)) return recipe;
  return null;
}

function buildInitialIngredients(level: LevelConfig): Ingredient[] {
  const out: Ingredient[] = [];
  for (const group of level.ingredients) {
    for (let i = 0; i < group.count; i++) {
      out.push({ id: `${group.kind}-${i}`, kind: group.kind, placedIn: null });
    }
  }
  return out;
}

function computeStars(movesUsed: number, level: LevelConfig): 1 | 2 | 3 {
  if (movesUsed <= level.targetMoves) return 3;
  if (movesUsed <= level.acceptableMoves) return 2;
  return 1;
}

function emptyEncounter(): EncounterState {
  return { open: false, triggered: false, choice: null, deadline: null };
}
function emptyMemoryVision(): MemoryVisionState {
  return { open: false, triggered: false, dismissAt: null };
}
function emptyArchitectVoice(): ArchitectVoiceState {
  return { open: false, triggered: false, fragmentIdx: 0, dismissAt: null };
}

// Encounter outcomes — pure, returns delta to apply to store.
function resolveEncounterOutcome(choice: EncounterChoiceId, coins: number):
  { coinsDelta: number; movesDelta: number; ally: boolean } {
  switch (choice) {
    case 'bribe':
      return { coinsDelta: -Math.min(500, coins), movesDelta: 0, ally: true };
    case 'distract':
      return { coinsDelta: 0, movesDelta: 1, ally: false };
    case 'recruit': {
      // 60% success per Level Document. Per-session Math.random — that's
      // desired (no save-scumming via reload).
      const success = Math.random() < 0.6;
      return { coinsDelta: 0, movesDelta: 0, ally: success };
    }
    case 'silent':
      return { coinsDelta: 0, movesDelta: 0, ally: false };
  }
}

// Volatility — every `shiftEveryMoves` placements, nudge each placed
// volatile ingredient one slot over (clamped at the right-most cauldron
// so the shift feels like drift, not teleport). Time-sensitive cauldrons
// are excluded from the shift so the L6 overheat warning can't be re-
// triggered by a cauldron the player already satisfied.
function applyVolatilityShift(
  ingredients: Ingredient[],
  level: LevelConfig,
  nextMoves: number,
): Ingredient[] {
  const vol = level.volatility;
  if (!vol || nextMoves === 0 || nextMoves % vol.shiftEveryMoves !== 0) return ingredients;
  const order = level.cauldrons;
  const tsCauldron = level.timeSensitive?.cauldron;
  return ingredients.map((ing) => {
    if (!vol.kinds.includes(ing.kind) || ing.placedIn === null) return ing;
    const idx = order.indexOf(ing.placedIn);
    if (idx < 0 || idx === order.length - 1) return ing; // clamp at the end
    const next = order[idx + 1];
    if (next === tsCauldron || ing.placedIn === tsCauldron) return ing;
    return { ...ing, placedIn: next };
  });
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      // Meta
      screen: 'title',
      character: null,
      name: 'Mira',
      hasSeenOpening: false,
      highestLevelCleared: 0,
      tutorialSeen: false,
      bessieAllyActive: false,
      hasPocketedUnknown: false,
      coins: 0,
      gems: 0,
      lastResult: null,

      // Puzzle
      level: LEVEL_1,
      ingredients: buildInitialIngredients(LEVEL_1),
      selectedIngredientId: null,
      movesUsed: 0,
      completed: false,
      completedPathId: null,
      failed: false,
      encounter: emptyEncounter(),
      memoryVision: emptyMemoryVision(),
      architectVoice: emptyArchitectVoice(),
      conditionalDelivered: false,
      timeSensitiveSatisfied: false,

      setScreen: (s) => set({ screen: s }),
      pickCharacter: (c) => set({ character: c }),
      setName: (n) => set({ name: n.trim().slice(0, 20) || 'Mira' }),
      markOpeningSeen: () => set({ hasSeenOpening: true }),
      markTutorialSeen: () => set({ tutorialSeen: true }),

      startLevel: (id) => {
        const level = getLevel(id);
        set({
          level,
          ingredients: buildInitialIngredients(level),
          selectedIngredientId: null,
          movesUsed: 0,
          completed: false,
          completedPathId: null,
          failed: false,
          encounter: emptyEncounter(),
          memoryVision: emptyMemoryVision(),
          architectVoice: emptyArchitectVoice(),
          conditionalDelivered: false,
      timeSensitiveSatisfied: false,
          lastResult: null,
        });
      },

      resetLevel: () => {
        const { level } = get();
        set({
          ingredients: buildInitialIngredients(level),
          selectedIngredientId: null,
          movesUsed: 0,
          completed: false,
          completedPathId: null,
          failed: false,
          encounter: emptyEncounter(),
          memoryVision: emptyMemoryVision(),
          architectVoice: emptyArchitectVoice(),
          conditionalDelivered: false,
      timeSensitiveSatisfied: false,
          lastResult: null,
        });
      },

      selectIngredient: (id) => {
        if (id === null) {
          set({ selectedIngredientId: null });
          return;
        }
        // Block selection during blocking overlays (encounter or memory).
        // Architect voice is intentionally non-blocking — player keeps
        // sorting while the fragments play.
        const { encounter, memoryVision } = get();
        if (encounter.open || memoryVision.open) return;
        const ing = get().ingredients.find((i) => i.id === id);
        if (!ing || ing.placedIn !== null) return;
        set({ selectedIngredientId: id });
      },

      placeInCauldron: (cauldron) => {
        const s = get();
        const { selectedIngredientId, ingredients, movesUsed, level, completed, failed, encounter, memoryVision, timeSensitiveSatisfied } = s;
        if (completed || failed || !selectedIngredientId) return;
        if (encounter.open || memoryVision.open) return;
        if (movesUsed >= level.moveLimit) return;

        const nextMoves = movesUsed + 1;

        // 1. Drift existing placements BEFORE the new placement lands —
        //    otherwise a Darkspore placed on move 5 would rotate out of
        //    its intended slot on the same move.
        let next = applyVolatilityShift(ingredients, level, nextMoves);
        // 2. Apply the new placement.
        next = next.map((i) =>
          i.id === selectedIngredientId ? { ...i, placedIn: cauldron } : i,
        );

        // Side triggers — each fires at most once per level.
        const overlays = computeOverlays(s, level, nextMoves);
        const justDelivered = overlays.conditionalDelivered && level.conditionalIngredient;
        if (justDelivered) {
          const kind = level.conditionalIngredient!.kind;
          next = [...next, { id: `${kind}-delivered`, kind, placedIn: null }];
        }

        const match = firstMatchingRecipe(next, level);

        // Time-sensitive cauldron — tracked as "has it ever been filled
        // by the deadline?" Once satisfied, the check stays satisfied
        // (volatility can't un-satisfy an already-filled slot).
        const ts = level.timeSensitive;
        const nowSatisfied =
          timeSensitiveSatisfied ||
          (!!ts && next.some((i) => i.placedIn === ts.cauldron));
        const overheated =
          !!ts && !nowSatisfied && nextMoves >= ts.fillByMove && match === null;

        set({
          ingredients: next,
          selectedIngredientId: null,
          movesUsed: nextMoves,
          // A successful match always wins, even if the overheat check
          // would otherwise fire on the same move. The doc says an
          // overflow costs a life — not the level.
          completed: match !== null,
          completedPathId: match?.id ?? null,
          failed: overheated,
          timeSensitiveSatisfied: nowSatisfied,
          // Suppress overlay opens if the move also completed the level.
          encounter: match ? encounter : (overlays.encounter ?? encounter),
          memoryVision: match ? memoryVision : (overlays.memoryVision ?? memoryVision),
          architectVoice: match ? s.architectVoice : (overlays.architectVoice ?? s.architectVoice),
          conditionalDelivered: overlays.conditionalDelivered ?? s.conditionalDelivered,
        });
      },

      removeFromCauldron: (id) => {
        const { ingredients, movesUsed, level, completed, failed, encounter, memoryVision } = get();
        if (completed || failed || movesUsed >= level.moveLimit) return;
        if (encounter.open || memoryVision.open) return;
        const target = ingredients.find((i) => i.id === id);
        if (!target || target.placedIn === null) return; // no-op on unplaced
        const next = ingredients.map((i) =>
          i.id === id ? { ...i, placedIn: null } : i,
        );
        set({
          ingredients: next,
          selectedIngredientId: null,
          movesUsed: movesUsed + 1,
        });
      },

      resolveEncounter: (choice) => {
        const { level, encounter, coins, movesUsed } = get();
        if (!encounter.open || !level.encounter) return;
        const outcome = resolveEncounterOutcome(choice, coins);
        set({
          coins: coins + outcome.coinsDelta,
          movesUsed: movesUsed + outcome.movesDelta,
          bessieAllyActive: outcome.ally ? true : get().bessieAllyActive,
          encounter: { open: false, triggered: true, choice, deadline: null },
        });
      },

      dismissMemoryVision: () => {
        const { memoryVision } = get();
        if (!memoryVision.open) return;
        set({ memoryVision: { ...memoryVision, open: false, dismissAt: null } });
      },

      dismissArchitectVoice: () => {
        const { architectVoice } = get();
        if (!architectVoice.open) return;
        set({ architectVoice: { ...architectVoice, open: false, dismissAt: null } });
      },

      finishLevel: () => {
        const { movesUsed, level, completedPathId, coins, gems, highestLevelCleared, encounter, lastResult, ingredients, conditionalDelivered } = get();
        // Idempotent: React 18 StrictMode double-invokes setState initializers
        // and effect callbacks in dev, and LevelComplete calls this from a
        // useState initializer. Without this guard the user would double-bank
        // coins + gems on every mount.
        if (lastResult && lastResult.levelId === level.id) return lastResult;
        const path = level.recipes.find((r) => r.id === completedPathId) ?? level.recipes[0];
        const stars = computeStars(movesUsed, level);
        const earnedCoins = stars === 3 ? 1000 : stars === 2 ? 600 : 200;
        const earnedGems = level.id > highestLevelCleared ? 1 : 0; // first clear only
        const cond = level.conditionalIngredient;
        // Only counts as "pocketed" if the Unknown was actually delivered
        // first — an early-finish player who never saw it shouldn't get
        // credit for hiding it.
        const pocketedUnknown =
          !!cond && conditionalDelivered &&
          ingredients.some((i) => i.kind === cond.kind && i.placedIn === null);
        const result: LevelResult = {
          levelId: level.id,
          stars,
          movesUsed,
          coins: earnedCoins,
          gems: earnedGems,
          wispColor: path.wispColor,
          recipePathId: path.id,
          encounterChoice: encounter.choice ?? undefined,
          pocketedUnknown: cond ? pocketedUnknown : undefined,
        };
        set({
          lastResult: result,
          coins: coins + earnedCoins,
          gems: gems + earnedGems,
          highestLevelCleared: Math.max(highestLevelCleared, level.id),
          hasPocketedUnknown: pocketedUnknown || get().hasPocketedUnknown,
        });
        return result;
      },

      advanceToNextLevel: () => {
        const { level } = get();
        const nxt = nextLevelId(level.id);
        if (nxt !== null) {
          get().startLevel(nxt);
          set({ screen: 'level' });
        } else {
          set({ screen: 'larder-stub' });
        }
      },
    }),
    {
      name: 'grimhold-save-v0',
      version: 3, // bumped — L4-L6 adds hasPocketedUnknown + new screens
      // Any version < current → let the merge() below clean it up. Returning
      // the raw persisted state here means merge() handles all validation.
      migrate: (persisted) => persisted,
      partialize: (s) => ({
        character: s.character,
        name: s.name,
        hasSeenOpening: s.hasSeenOpening,
        highestLevelCleared: s.highestLevelCleared,
        tutorialSeen: s.tutorialSeen,
        bessieAllyActive: s.bessieAllyActive,
        hasPocketedUnknown: s.hasPocketedUnknown,
        coins: s.coins,
        gems: s.gems,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<{
          character: unknown;
          name: unknown;
          hasSeenOpening: unknown;
          highestLevelCleared: unknown;
          hasPlayedLevel1: unknown; // legacy v1 key
          tutorialSeen: unknown;
          bessieAllyActive: unknown;
          hasPocketedUnknown: unknown;
          coins: unknown;
          gems: unknown;
        }>;
        const allowedClasses: CharacterClass[] = ['witch', 'rogue', 'scholar', 'knight'];
        // Strict: `Number(null) === 0` would silently zero out a user's
        // progress if the persisted field is null/undefined. Require the
        // value to already be a finite number before accepting it.
        const coinsNum = typeof p.coins === 'number' && Number.isFinite(p.coins) ? p.coins : null;
        const gemsNum = typeof p.gems === 'number' && Number.isFinite(p.gems) ? p.gems : null;
        // v1 stored hasPlayedLevel1 as a boolean; migrate to tutorialSeen and
        // highestLevelCleared=1 so returning players don't re-see the tutorial.
        const v1Played = typeof p.hasPlayedLevel1 === 'boolean' && p.hasPlayedLevel1 === true;
        return {
          ...current,
          character: typeof p.character === 'string' && (allowedClasses as string[]).includes(p.character)
            ? (p.character as CharacterClass)
            : current.character,
          name: typeof p.name === 'string' && p.name.trim().length > 0
            ? p.name.trim().slice(0, 20)
            : current.name,
          hasSeenOpening: typeof p.hasSeenOpening === 'boolean' ? p.hasSeenOpening : current.hasSeenOpening,
          highestLevelCleared: typeof p.highestLevelCleared === 'number' && Number.isFinite(p.highestLevelCleared)
            ? Math.max(0, Math.min(10, Math.floor(p.highestLevelCleared)))
            : v1Played ? 1 : current.highestLevelCleared,
          tutorialSeen: typeof p.tutorialSeen === 'boolean' ? p.tutorialSeen : v1Played || current.tutorialSeen,
          bessieAllyActive: typeof p.bessieAllyActive === 'boolean' ? p.bessieAllyActive : current.bessieAllyActive,
          hasPocketedUnknown: typeof p.hasPocketedUnknown === 'boolean' ? p.hasPocketedUnknown : current.hasPocketedUnknown,
          coins: coinsNum !== null ? Math.max(0, Math.min(9_999_999, Math.floor(coinsNum))) : current.coins,
          gems: gemsNum !== null ? Math.max(0, Math.min(99_999, Math.floor(gemsNum))) : current.gems,
        };
      },
    },
  ),
);

// Mid-placement overlay triggers — returns only the overlays that should
// open on this move. Caller spreads the result into `set`. The caller is
// responsible for suppressing overlays when the move also won the level.
function computeOverlays(
  s: Pick<Store, 'encounter' | 'memoryVision' | 'architectVoice' | 'conditionalDelivered'>,
  level: LevelConfig,
  nextMoves: number,
): {
  encounter?: EncounterState;
  memoryVision?: MemoryVisionState;
  architectVoice?: ArchitectVoiceState;
  conditionalDelivered?: boolean;
} {
  const out: ReturnType<typeof computeOverlays> = {};

  const enc = level.encounter;
  if (enc && !s.encounter.triggered && nextMoves >= enc.triggerMove) {
    out.encounter = {
      open: true,
      triggered: true,
      choice: null,
      deadline: Date.now() + enc.decisionSeconds * 1000,
    };
  }

  const mv = level.memoryVision;
  if (mv && !s.memoryVision.triggered && nextMoves >= mv.triggerMove) {
    out.memoryVision = {
      open: true,
      triggered: true,
      dismissAt: Date.now() + mv.durationMs,
    };
  }

  const av = level.architectVoice;
  if (av && !s.architectVoice.triggered && nextMoves >= av.triggerMove) {
    out.architectVoice = {
      open: true,
      triggered: true,
      fragmentIdx: 0,
      dismissAt: Date.now() + av.durationMs,
    };
  }

  const cond = level.conditionalIngredient;
  if (cond && !s.conditionalDelivered && nextMoves >= cond.deliverAtMove) {
    // Flag flips here; the actual Unknown ingredient is appended to the
    // ingredients array by the caller (placeInCauldron) on the same tick.
    out.conditionalDelivered = true;
  }

  return out;
}
