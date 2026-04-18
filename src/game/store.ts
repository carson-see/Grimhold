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

interface Store {
  // Meta / progression
  screen: Screen;
  character: CharacterClass | null;
  name: string;
  hasSeenOpening: boolean;
  highestLevelCleared: number;
  tutorialSeen: boolean;
  bessieAllyActive: boolean;    // set to true if Level 3 recruit succeeds
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
  encounter: EncounterState;

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
  finishLevel: () => LevelResult;
  advanceToNextLevel: () => void;
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
function firstMatchingRecipe(ingredients: Ingredient[], level: LevelConfig): RecipePath | null {
  if (ingredients.some((i) => i.placedIn === null)) return null;
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

// Encounter outcomes — pure, returns delta to apply to store.
function resolveEncounterOutcome(choice: EncounterChoiceId, coins: number):
  { coinsDelta: number; movesDelta: number; ally: boolean } {
  switch (choice) {
    case 'bribe':
      return { coinsDelta: -Math.min(500, coins), movesDelta: 0, ally: true };
    case 'distract':
      return { coinsDelta: 0, movesDelta: 1, ally: false };
    case 'recruit': {
      // 60% success per Level Document. Seeded by Date.now (per-session).
      const success = Math.random() < 0.6;
      return { coinsDelta: 0, movesDelta: 0, ally: success };
    }
    case 'silent':
      return { coinsDelta: 0, movesDelta: 0, ally: false };
  }
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
      encounter: emptyEncounter(),

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
          encounter: emptyEncounter(),
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
          encounter: emptyEncounter(),
          lastResult: null,
        });
      },

      selectIngredient: (id) => {
        if (id === null) {
          set({ selectedIngredientId: null });
          return;
        }
        // Block selection while an encounter modal is open — the puzzle
        // should be visibly paused.
        if (get().encounter.open) return;
        const ing = get().ingredients.find((i) => i.id === id);
        if (!ing || ing.placedIn !== null) return;
        set({ selectedIngredientId: id });
      },

      placeInCauldron: (cauldron) => {
        const { selectedIngredientId, ingredients, movesUsed, level, completed, encounter } = get();
        if (completed || !selectedIngredientId) return;
        if (encounter.open) return;
        if (movesUsed >= level.moveLimit) return;
        const next = ingredients.map((i) =>
          i.id === selectedIngredientId ? { ...i, placedIn: cauldron } : i,
        );
        const nextMoves = movesUsed + 1;
        const match = firstMatchingRecipe(next, level);

        // Encounter check — fires at triggerMove unless already fired/completed.
        const enc = level.encounter;
        const shouldFire =
          !!enc &&
          !encounter.triggered &&
          nextMoves >= enc.triggerMove &&
          !match;

        set({
          ingredients: next,
          selectedIngredientId: null,
          movesUsed: nextMoves,
          completed: match !== null,
          completedPathId: match?.id ?? null,
          encounter: shouldFire && enc
            ? { open: true, triggered: true, choice: null, deadline: Date.now() + enc.decisionSeconds * 1000 }
            : encounter,
        });
      },

      removeFromCauldron: (id) => {
        const { ingredients, movesUsed, level, completed, encounter } = get();
        if (completed || movesUsed >= level.moveLimit) return;
        if (encounter.open) return;
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

      finishLevel: () => {
        const { movesUsed, level, completedPathId, coins, gems, highestLevelCleared, encounter } = get();
        const path = level.recipes.find((r) => r.id === completedPathId) ?? level.recipes[0];
        const stars = computeStars(movesUsed, level);
        const earnedCoins = stars === 3 ? 1000 : stars === 2 ? 600 : 200;
        const earnedGems = level.id > highestLevelCleared ? 1 : 0; // first clear only
        const result: LevelResult = {
          levelId: level.id,
          stars,
          movesUsed,
          coins: earnedCoins,
          gems: earnedGems,
          wispColor: path.wispColor,
          recipePathId: path.id,
          encounterChoice: encounter.choice ?? undefined,
        };
        set({
          lastResult: result,
          coins: coins + earnedCoins,
          gems: gems + earnedGems,
          highestLevelCleared: Math.max(highestLevelCleared, level.id),
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
          // End of built content → Larder stub.
          set({ screen: 'larder-stub' });
        }
      },
    }),
    {
      name: 'grimhold-save-v0',
      version: 2, // bumped — schema gained multi-level progression
      partialize: (s) => ({
        character: s.character,
        name: s.name,
        hasSeenOpening: s.hasSeenOpening,
        highestLevelCleared: s.highestLevelCleared,
        tutorialSeen: s.tutorialSeen,
        bessieAllyActive: s.bessieAllyActive,
        coins: s.coins,
        gems: s.gems,
      }),
      // Anyone can hand-edit localStorage. Validate every persisted field on
      // rehydrate so a corrupt value can't crash later code. Unknown fields
      // fall back to the current (default) value.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<{
          character: unknown;
          name: unknown;
          hasSeenOpening: unknown;
          highestLevelCleared: unknown;
          hasPlayedLevel1: unknown; // legacy v1 key
          tutorialSeen: unknown;
          bessieAllyActive: unknown;
          coins: unknown;
          gems: unknown;
        }>;
        const allowedClasses: CharacterClass[] = ['witch', 'rogue', 'scholar', 'knight'];
        const coinsNum = typeof p.coins === 'number' ? p.coins : Number(p.coins);
        const gemsNum = typeof p.gems === 'number' ? p.gems : Number(p.gems);
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
          coins: Number.isFinite(coinsNum) ? Math.max(0, Math.min(9_999_999, Math.floor(coinsNum))) : current.coins,
          gems: Number.isFinite(gemsNum) ? Math.max(0, Math.min(99_999, Math.floor(gemsNum))) : current.gems,
        };
      },
    },
  ),
);
