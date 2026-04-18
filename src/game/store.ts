import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CauldronId,
  EncounterChoice,
  EncounterChoiceId,
  Ingredient,
  IngredientId,
  LevelConfig,
  LevelResult,
  RecipePath,
  RecipePathId,
  Screen,
} from './types';
import { LEVEL_1, LEVELS, getLevel, nextLevelId } from '../data/levels';

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

export interface JointSyncState {
  open: boolean;
  triggered: boolean;
  hit: boolean;             // did the player land the sync window
  dismissAt: number | null; // epoch ms — window expiry
}

export interface NoteFromWallState {
  open: boolean;
  triggered: boolean;
  dismissAt: number | null;
}

// Persistent inventory — lore + key items collected during Act One.
// Single source of truth for the union AND the persisted allowlist.
export const INVENTORY_ITEM_IDS = [
  'wren-crest-memory',  // L7 observe
  'wall-note',          // L8 wall note added to lore log
  'bessie-key',         // L10 silent drop
] as const;
export type InventoryItemId = typeof INVENTORY_ITEM_IDS[number];

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
  inventory: InventoryItemId[]; // lore + key items, additive across the run
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
  jointSync: JointSyncState;          // L7+ — Aldric sync window
  noteFromWall: NoteFromWallState;    // L8 — Smudge prying note from crack
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
  dismissNoteFromWall: () => void;
  registerJointSyncHit: () => void;     // player tap landed inside the sync window
  expireJointSync: () => void;          // window elapsed without a hit
  addInventory: (id: InventoryItemId) => void;
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
// The conditional ingredient (L5's Unknown) may stay on the tray — the
// level can complete without it. Every other ingredient must be placed.
//
// On levels with `jointSync`, the recipe path it `unlocks` shares the
// wall placement (both are valid on the same multiset). When the player
// hit the sync, we PREFER the locked path so the joint wisp/reward
// fires; without a hit we skip the locked path entirely so the wall
// path wins instead.
function firstMatchingRecipe(
  ingredients: Ingredient[],
  level: LevelConfig,
  jointSyncHit: boolean,
): RecipePath | null {
  const cond = level.conditionalIngredient;
  const allPlaced = ingredients.every((i) => i.placedIn !== null || i.kind === cond?.kind);
  if (!allPlaced) return null;
  const lockedPathId = level.jointSync?.unlocks;
  if (lockedPathId && jointSyncHit) {
    const locked = level.recipes.find((r) => r.id === lockedPathId);
    if (locked && recipeMatches(ingredients, level, locked)) return locked;
  }
  for (const recipe of level.recipes) {
    if (lockedPathId && recipe.id === lockedPathId) continue;
    if (recipeMatches(ingredients, level, recipe)) return recipe;
  }
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
function emptyJointSync(): JointSyncState {
  return { open: false, triggered: false, hit: false, dismissAt: null };
}
function emptyNoteFromWall(): NoteFromWallState {
  return { open: false, triggered: false, dismissAt: null };
}

// Force-close any of the overlay states without touching `triggered` —
// keeps the "fired this level" marker intact so the overlay can't re-fire,
// just closes the visible UI when the level wins on the same tick. The
// shape varies (some have `dismissAt`, encounter has `deadline`); we
// blanket-null both fields where they exist.
function closeOverlay<T extends { open: boolean }>(s: T): T {
  if (!s.open) return s;
  const cleared: Record<string, unknown> = { ...s, open: false };
  if ('dismissAt' in cleared) cleared.dismissAt = null;
  if ('deadline' in cleared) cleared.deadline = null;
  return cleared as T;
}

// Encounter outcomes — pure, returns delta to apply to store. Wren and the
// final Bessie key drop add inventory effects via `grant`; `cost` from the
// choice config drives the coin/move penalty so doc-level tuning lives in
// `levels.ts`, not here.
function resolveEncounterOutcome(
  choice: EncounterChoice,
  coins: number,
):
  { coinsDelta: number; movesDelta: number; ally: boolean; grant?: InventoryItemId } {
  const movesDelta = choice.cost?.moves ?? 0;
  const coinCost = choice.cost?.coins ?? 0;
  const coinsDelta = coinCost > 0 ? -Math.min(coinCost, coins) : 0;
  switch (choice.id) {
    case 'bribe':
      return { coinsDelta, movesDelta, ally: true };
    case 'distract':
    case 'silent':
    case 'ignore':
      return { coinsDelta, movesDelta, ally: false };
    case 'recruit': {
      // 60% success per Level Document. Per-session Math.random — that's
      // desired (no save-scumming via reload).
      return { coinsDelta, movesDelta, ally: Math.random() < 0.6 };
    }
    case 'observe':
      return { coinsDelta, movesDelta, ally: false, grant: 'wren-crest-memory' };
    case 'callout':
      // Cost lives on the choice config (levels.ts). Doc says "next level"
      // but we land it on this brew so the player feels the cost in-flight.
      return { coinsDelta, movesDelta, ally: false };
    case 'pickup':
      return { coinsDelta, movesDelta, ally: false, grant: 'bessie-key' };
    default: {
      const _exhaustive: never = choice.id;
      throw new Error(`Unhandled encounter choice: ${_exhaustive}`);
    }
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
      inventory: [],
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
      jointSync: emptyJointSync(),
      noteFromWall: emptyNoteFromWall(),
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
          jointSync: emptyJointSync(),
          noteFromWall: emptyNoteFromWall(),
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
          jointSync: emptyJointSync(),
          noteFromWall: emptyNoteFromWall(),
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
        // Block selection during blocking overlays (encounter, memory,
        // note-from-wall). Architect voice and joint-sync are non-
        // blocking — player keeps sorting while they play.
        const { encounter, memoryVision, noteFromWall } = get();
        if (encounter.open || memoryVision.open || noteFromWall.open) return;
        const ing = get().ingredients.find((i) => i.id === id);
        if (!ing || ing.placedIn !== null) return;
        set({ selectedIngredientId: id });
      },

      placeInCauldron: (cauldron) => {
        const s = get();
        const { selectedIngredientId, ingredients, movesUsed, level, completed, failed, encounter, memoryVision, noteFromWall, timeSensitiveSatisfied, jointSync } = s;
        if (completed || failed || !selectedIngredientId) return;
        if (encounter.open || memoryVision.open || noteFromWall.open) return;
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

        const match = firstMatchingRecipe(next, level, jointSync.hit);

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
          // Suppress new overlay opens AND force-close any in-flight
          // overlay if the move also completed the level — otherwise the
          // joint-sync / note-from-wall panels linger over the wisp
          // celebration during the ~900ms transition.
          encounter: match ? closeOverlay(encounter) : (overlays.encounter ?? encounter),
          memoryVision: match ? closeOverlay(memoryVision) : (overlays.memoryVision ?? memoryVision),
          architectVoice: match ? closeOverlay(s.architectVoice) : (overlays.architectVoice ?? s.architectVoice),
          jointSync: match ? closeOverlay(s.jointSync) : (overlays.jointSync ?? s.jointSync),
          noteFromWall: match ? closeOverlay(s.noteFromWall) : (overlays.noteFromWall ?? s.noteFromWall),
          conditionalDelivered: overlays.conditionalDelivered ?? s.conditionalDelivered,
        });
      },

      removeFromCauldron: (id) => {
        const { ingredients, movesUsed, level, completed, failed, encounter, memoryVision, noteFromWall } = get();
        if (completed || failed || movesUsed >= level.moveLimit) return;
        if (encounter.open || memoryVision.open || noteFromWall.open) return;
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

      resolveEncounter: (choiceId) => {
        const { level, encounter, coins, movesUsed } = get();
        if (!encounter.open || !level.encounter) return;
        const choice = level.encounter.choices.find((c) => c.id === choiceId);
        if (!choice) return;
        const outcome = resolveEncounterOutcome(choice, coins);
        set({
          coins: coins + outcome.coinsDelta,
          movesUsed: movesUsed + outcome.movesDelta,
          bessieAllyActive: outcome.ally ? true : get().bessieAllyActive,
          encounter: { open: false, triggered: true, choice: choiceId, deadline: null },
        });
        if (outcome.grant) get().addInventory(outcome.grant);
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

      dismissNoteFromWall: () => {
        const { noteFromWall, level } = get();
        if (!noteFromWall.open) return;
        set({ noteFromWall: { ...noteFromWall, open: false, dismissAt: null } });
        if (level.noteFromWall) get().addInventory('wall-note');
      },

      registerJointSyncHit: () => {
        const { jointSync } = get();
        if (!jointSync.open || jointSync.hit) return;
        set({ jointSync: { ...jointSync, open: false, hit: true, dismissAt: null } });
      },

      expireJointSync: () => {
        const { jointSync } = get();
        if (!jointSync.open) return;
        // Window elapsed without a hit — joint recipe variant is now
        // unreachable for the rest of this level.
        set({ jointSync: { ...jointSync, open: false, dismissAt: null } });
      },

      addInventory: (id) => {
        const { inventory } = get();
        if (inventory.includes(id)) return;
        set({ inventory: [...inventory, id] });
      },

      finishLevel: () => {
        const { movesUsed, level, completedPathId, coins, gems, highestLevelCleared, encounter, lastResult, ingredients, conditionalDelivered, jointSync } = get();
        // Idempotent: React 18 StrictMode double-invokes setState initializers
        // and effect callbacks in dev, and LevelComplete calls this from a
        // useState initializer. Without this guard the user would double-bank
        // coins + gems on every mount.
        if (lastResult && lastResult.levelId === level.id) return lastResult;
        const path = level.recipes.find((r) => r.id === completedPathId) ?? level.recipes[0];
        const stars = computeStars(movesUsed, level);
        // L10 finale per doc: 1500/800/300 coins. Other levels: 1000/600/200.
        const finaleCoins = stars === 3 ? 1500 : stars === 2 ? 800 : 300;
        const standardCoins = stars === 3 ? 1000 : stars === 2 ? 600 : 200;
        const earnedCoins = level.id === LEVELS[LEVELS.length - 1].id ? finaleCoins : standardCoins;
        // First clear → 1 gem; L9 refusal path → +1 bonus gem; L10 finale → +5 chapter bonus.
        const firstClearGem = level.id > highestLevelCleared ? 1 : 0;
        const refusalBonus = path.id === 'refusal' ? 1 : 0;
        const finaleBonus = level.id === LEVELS[LEVELS.length - 1].id ? 5 : 0;
        const earnedGems = firstClearGem + refusalBonus + finaleBonus;
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
          jointHit: level.jointSync ? jointSync.hit : undefined,
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
      version: 4, // bumped — L7-L10 adds inventory + jointSync state
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
        inventory: s.inventory,
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
          inventory: unknown;
          coins: unknown;
          gems: unknown;
        }>;
        const allowedClasses: CharacterClass[] = ['witch', 'rogue', 'scholar', 'knight'];
        const allowedInventory: readonly InventoryItemId[] = INVENTORY_ITEM_IDS;
        // Strict: `Number(null) === 0` would silently zero out a user's
        // progress if the persisted field is null/undefined. Require the
        // value to already be a finite number before accepting it.
        const coinsNum = typeof p.coins === 'number' && Number.isFinite(p.coins) ? p.coins : null;
        const gemsNum = typeof p.gems === 'number' && Number.isFinite(p.gems) ? p.gems : null;
        // v1 stored hasPlayedLevel1 as a boolean; migrate to tutorialSeen and
        // highestLevelCleared=1 so returning players don't re-see the tutorial.
        const v1Played = typeof p.hasPlayedLevel1 === 'boolean' && p.hasPlayedLevel1 === true;
        const inv = Array.isArray(p.inventory)
          ? (p.inventory.filter(
              (x): x is InventoryItemId =>
                typeof x === 'string' && (allowedInventory as string[]).includes(x),
            ))
          : current.inventory;
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
            // Clamp against the act's defined level count, not a hard 10 —
            // Chapter Two will append IDs > 10 to LEVELS.
            ? Math.max(0, Math.min(LEVELS.length, Math.floor(p.highestLevelCleared)))
            : v1Played ? 1 : current.highestLevelCleared,
          tutorialSeen: typeof p.tutorialSeen === 'boolean' ? p.tutorialSeen : v1Played || current.tutorialSeen,
          bessieAllyActive: typeof p.bessieAllyActive === 'boolean' ? p.bessieAllyActive : current.bessieAllyActive,
          hasPocketedUnknown: typeof p.hasPocketedUnknown === 'boolean' ? p.hasPocketedUnknown : current.hasPocketedUnknown,
          inventory: inv,
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
  s: Pick<
    Store,
    'encounter' | 'memoryVision' | 'architectVoice' | 'jointSync' | 'noteFromWall' | 'conditionalDelivered' | 'bessieAllyActive'
  >,
  level: LevelConfig,
  nextMoves: number,
): {
  encounter?: EncounterState;
  memoryVision?: MemoryVisionState;
  architectVoice?: ArchitectVoiceState;
  jointSync?: JointSyncState;
  noteFromWall?: NoteFromWallState;
  conditionalDelivered?: boolean;
} {
  const out: ReturnType<typeof computeOverlays> = {};

  const enc = level.encounter;
  // Wren / Bessie-final encounters can be gated on ally state. The L10
  // Bessie key drop only fires if Bessie was recruited in L3.
  const allyOk = !enc?.requiresAlly || (enc.requiresAlly === 'bessie' && s.bessieAllyActive);
  if (enc && allyOk && !s.encounter.triggered && nextMoves >= enc.triggerMove) {
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

  const js = level.jointSync;
  if (js && !s.jointSync.triggered && nextMoves >= js.triggerMove) {
    out.jointSync = {
      open: true,
      triggered: true,
      hit: false,
      dismissAt: Date.now() + js.windowSeconds * 1000,
    };
  }

  const nfw = level.noteFromWall;
  if (nfw && !s.noteFromWall.triggered && nextMoves >= nfw.triggerMove) {
    out.noteFromWall = {
      open: true,
      triggered: true,
      dismissAt: Date.now() + nfw.durationMs,
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
