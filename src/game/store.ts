import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CauldronId,
  Ingredient,
  IngredientId,
  LevelConfig,
  LevelResult,
  Screen,
} from './types';
import { LEVEL_1 } from '../data/levels';

export type CharacterClass = 'witch' | 'rogue' | 'scholar' | 'knight';

interface Store {
  // Meta / progression
  screen: Screen;
  character: CharacterClass | null;
  name: string;
  hasSeenOpening: boolean;
  coins: number;
  gems: number;
  lastResult: LevelResult | null;

  // Active puzzle
  level: LevelConfig;
  ingredients: Ingredient[];
  selectedIngredientId: string | null;
  movesUsed: number;
  completed: boolean;

  // Actions
  setScreen: (s: Screen) => void;
  pickCharacter: (c: CharacterClass) => void;
  setName: (n: string) => void;
  markOpeningSeen: () => void;
  resetLevel: () => void;
  selectIngredient: (id: string | null) => void;
  placeInCauldron: (cauldron: CauldronId) => void;
  removeFromCauldron: (id: string) => void;
  finishLevel: () => LevelResult;
}

export function isCauldronCorrect(
  ingredients: Ingredient[],
  cauldron: CauldronId,
  wallRecipe: Record<CauldronId, IngredientId[]>,
): boolean {
  const placed = ingredients.filter((i) => i.placedIn === cauldron).map((i) => i.kind);
  const required = wallRecipe[cauldron];
  if (placed.length !== required.length) return false;
  // Multiset compare — order doesn't matter.
  const counts = new Map<IngredientId, number>();
  for (const r of required) counts.set(r, (counts.get(r) ?? 0) + 1);
  for (const p of placed) {
    const c = counts.get(p);
    if (!c) return false;
    counts.set(p, c - 1);
  }
  return [...counts.values()].every((v) => v === 0);
}

export type CauldronStatus = 'neutral' | 'correct' | 'wrong';

export function cauldronStatus(
  ingredients: Ingredient[],
  cauldron: CauldronId,
  wallRecipe: Record<CauldronId, IngredientId[]>,
): CauldronStatus {
  const placed = ingredients.filter((i) => i.placedIn === cauldron).map((i) => i.kind);
  if (placed.length === 0) return 'neutral';
  const required = wallRecipe[cauldron];
  const counts = new Map<IngredientId, number>();
  for (const r of required) counts.set(r, (counts.get(r) ?? 0) + 1);
  for (const p of placed) {
    const c = counts.get(p);
    if (!c) return 'wrong';
    counts.set(p, c - 1);
  }
  if (placed.length === required.length && [...counts.values()].every((v) => v === 0)) return 'correct';
  return 'neutral';
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

function isWin(ingredients: Ingredient[], level: LevelConfig): boolean {
  if (ingredients.some((i) => i.placedIn === null)) return false;
  return level.cauldrons.every((c) => isCauldronCorrect(ingredients, c, level.wallRecipe));
}

function computeStars(movesUsed: number, level: LevelConfig): 1 | 2 | 3 {
  if (movesUsed <= level.targetMoves) return 3;
  if (movesUsed <= level.acceptableMoves) return 2;
  return 1;
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      // Meta
      screen: 'title',
      character: null,
      name: 'Mira',
      hasSeenOpening: false,
      coins: 0,
      gems: 0,
      lastResult: null,

      // Puzzle
      level: LEVEL_1,
      ingredients: buildInitialIngredients(LEVEL_1),
      selectedIngredientId: null,
      movesUsed: 0,
      completed: false,

      setScreen: (s) => set({ screen: s }),
      pickCharacter: (c) => set({ character: c }),
      setName: (n) => set({ name: n.trim().slice(0, 20) || 'Mira' }),
      markOpeningSeen: () => set({ hasSeenOpening: true }),

      resetLevel: () =>
        set({
          ingredients: buildInitialIngredients(LEVEL_1),
          selectedIngredientId: null,
          movesUsed: 0,
          completed: false,
          lastResult: null,
        }),

      selectIngredient: (id) => {
        if (id === null) {
          set({ selectedIngredientId: null });
          return;
        }
        const ing = get().ingredients.find((i) => i.id === id);
        if (!ing || ing.placedIn !== null) return;
        set({ selectedIngredientId: id });
      },

      placeInCauldron: (cauldron) => {
        const { selectedIngredientId, ingredients, movesUsed, level, completed } = get();
        if (completed || !selectedIngredientId || movesUsed >= level.moveLimit) return;
        const next = ingredients.map((i) =>
          i.id === selectedIngredientId ? { ...i, placedIn: cauldron } : i,
        );
        set({
          ingredients: next,
          selectedIngredientId: null,
          movesUsed: movesUsed + 1,
          completed: isWin(next, level),
        });
      },

      removeFromCauldron: (id) => {
        const { ingredients, movesUsed, level, completed } = get();
        if (completed || movesUsed >= level.moveLimit) return;
        const next = ingredients.map((i) =>
          i.id === id ? { ...i, placedIn: null } : i,
        );
        set({
          ingredients: next,
          selectedIngredientId: null,
          movesUsed: movesUsed + 1,
        });
      },

      finishLevel: () => {
        const { movesUsed, level, coins, gems } = get();
        const stars = computeStars(movesUsed, level);
        const earnedCoins = stars === 3 ? 1000 : stars === 2 ? 600 : 200;
        const earnedGems = 1; // First-clear gem per Design Bible Vol 2 §1
        const result: LevelResult = {
          stars,
          movesUsed,
          coins: earnedCoins,
          gems: earnedGems,
          wispColor: 'violet',
        };
        set({
          lastResult: result,
          coins: coins + earnedCoins,
          gems: gems + earnedGems,
        });
        return result;
      },
    }),
    {
      name: 'grimhold-save-v0',
      partialize: (s) => ({
        character: s.character,
        name: s.name,
        hasSeenOpening: s.hasSeenOpening,
        coins: s.coins,
        gems: s.gems,
      }),
      // Anyone can hand-edit localStorage. Validate every persisted field
      // on rehydrate so a corrupt value can't crash later code (e.g.
      // `n.trim()` blowing up if `name` was set to a non-string).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<{
          character: unknown;
          name: unknown;
          hasSeenOpening: unknown;
          coins: unknown;
          gems: unknown;
        }>;
        const allowedClasses: CharacterClass[] = ['witch', 'rogue', 'scholar', 'knight'];
        return {
          ...current,
          character: typeof p.character === 'string' && (allowedClasses as string[]).includes(p.character)
            ? (p.character as CharacterClass)
            : current.character,
          name: typeof p.name === 'string' && p.name.trim().length > 0
            ? p.name.trim().slice(0, 20)
            : current.name,
          hasSeenOpening: typeof p.hasSeenOpening === 'boolean' ? p.hasSeenOpening : current.hasSeenOpening,
          coins: Number.isFinite(p.coins) ? Math.max(0, Math.min(9_999_999, Math.floor(p.coins as number))) : current.coins,
          gems: Number.isFinite(p.gems) ? Math.max(0, Math.min(99_999, Math.floor(p.gems as number))) : current.gems,
        };
      },
    },
  ),
);
