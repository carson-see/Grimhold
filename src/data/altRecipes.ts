import type {
  CauldronId,
  IngredientId,
  LevelConfig,
  RecipePath,
  WispColor,
} from '../game/types';

// Per-class hidden recipes — every level can be cleared four ways:
//   * Wall (Mira / shown on wall) — explicit in the level data
//   * Aldric (Vowed / Knight) — defensive STACK: clusters into Right
//   * Cael   (Unbound / Rogue) — drift SPREAD: balances across cauldrons
//   * Petra  (Written / Scholar) — archived ALPHABETICAL: groups by name
//
// The strategies are deterministic functions of the level's ingredient
// pool and cauldron list. They produce a `Partial<Record<CauldronId,
// IngredientId[]>>` placement that uses the EXACT same ingredient
// multiset as the wall recipe — so any of the four sorts is a valid
// completion. The wisp colour and powerUp framing surface the
// character's signature on the result.
//
// Discovery loop: hidden recipes are not shown in the HUD. The player
// finds them by experimenting (or by remembering a character's
// personality from the lore log). Clearing a level via a non-wall
// recipe earns +400 coins and +1 gem (handled in store.finishLevel).

const INGREDIENT_NAMES_FOR_SORT: IngredientId[] = [
  'ashroot',
  'coldstone',
  'darkspore',
  'emberpetal',
  'greystone',
  'hollowroot',
  'moonbloom',
  'silvermoss',
  'unknown',
];

function ingredientPool(level: LevelConfig): IngredientId[] {
  const pool: IngredientId[] = [];
  for (const g of level.ingredients) for (let i = 0; i < g.count; i++) pool.push(g.kind);
  return pool;
}

// Distribute `pool` items into `cauldrons` by index `placer(i)`.
function distribute(
  pool: IngredientId[],
  cauldrons: CauldronId[],
  placer: (item: IngredientId, idx: number, pool: IngredientId[]) => CauldronId,
): Partial<Record<CauldronId, IngredientId[]>> {
  const out: Partial<Record<CauldronId, IngredientId[]>> = {};
  for (const c of cauldrons) out[c] = [];
  pool.forEach((item, i) => {
    const target = placer(item, i, pool);
    out[target] = [...(out[target] ?? []), item];
  });
  return out;
}

// ── Aldric — defensive STACK ───────────────────────────────────────────
// Heavies (Coldstone / Darkspore / Hollowroot) cluster in the rightmost
// cauldron; everything else fills left → right in order. Reads as the
// character who would put the dangerous things in one place and stand
// in front of them.
function aldricPlacement(level: LevelConfig): Partial<Record<CauldronId, IngredientId[]>> {
  const pool = ingredientPool(level);
  const cauldrons = level.cauldrons;
  const HEAVY = new Set<IngredientId>(['coldstone', 'darkspore', 'hollowroot']);
  const right = cauldrons[cauldrons.length - 1];
  // Non-heavies go round-robin into the non-right cauldrons.
  const others = cauldrons.slice(0, -1);
  let r = 0;
  return distribute(pool, cauldrons, (item) => {
    if (HEAVY.has(item)) return right;
    const c = others[r % Math.max(1, others.length)] ?? right;
    r++;
    return c;
  });
}

// ── Cael — drift SPREAD ─────────────────────────────────────────────────
// Round-robin every ingredient through every cauldron in order. The
// effect: each cauldron carries a slice of every kind. Reads as the
// character who passes through walls — nothing stays in one place.
function caelPlacement(level: LevelConfig): Partial<Record<CauldronId, IngredientId[]>> {
  const pool = ingredientPool(level);
  const cauldrons = level.cauldrons;
  return distribute(pool, cauldrons, (_, i) => cauldrons[i % cauldrons.length]);
}

// ── Petra — archived ALPHABETICAL ──────────────────────────────────────
// Sort the pool by ingredient name, then divide into N contiguous chunks
// by cauldron count. The cauldrons end up holding alphabetical ranges.
// Reads as the character who would catalogue first, brew second.
function petraPlacement(level: LevelConfig): Partial<Record<CauldronId, IngredientId[]>> {
  const pool = ingredientPool(level)
    .slice()
    .sort(
      (a, b) =>
        INGREDIENT_NAMES_FOR_SORT.indexOf(a) - INGREDIENT_NAMES_FOR_SORT.indexOf(b),
    );
  const cauldrons = level.cauldrons;
  const chunkSize = Math.ceil(pool.length / cauldrons.length);
  return distribute(pool, cauldrons, (_, i) => {
    const idx = Math.min(cauldrons.length - 1, Math.floor(i / chunkSize));
    return cauldrons[idx];
  });
}

const HIDDEN_VARIANTS: Array<{
  id: 'aldric' | 'cael' | 'petra';
  label: string;
  wispColor: WispColor;
  powerUpLabel: string;
  powerUpDetail: string;
  placement: (l: LevelConfig) => Partial<Record<CauldronId, IngredientId[]>>;
}> = [
  {
    id: 'aldric',
    label: "Aldric's hand — heavies held to the right",
    wispColor: 'violet-grey',
    powerUpLabel: 'The Vow',
    powerUpDetail: 'Aldric would have stacked the danger in one place. The wisp threads warm grey.',
    placement: aldricPlacement,
  },
  {
    id: 'cael',
    label: "Cael's hand — every cauldron a little of everything",
    wispColor: 'violet-green',
    powerUpLabel: 'The Drift',
    powerUpDetail: 'Cael would have spread it thin. Nothing stays where it was put. The wisp glows moth-green.',
    placement: caelPlacement,
  },
  {
    id: 'petra',
    label: "Petra's hand — sorted alphabetically, like an index",
    wispColor: 'violet-ink',
    powerUpLabel: 'The Index',
    powerUpDetail: 'Petra would have catalogued it first. The wisp bleeds ink-blue at the edges.',
    placement: petraPlacement,
  },
];

// Generate the three hidden alternates for a level. The placement
// function may produce empty arrays per cauldron — those are valid
// (some cauldrons hold nothing for the alphabetical or drift sorts).
export function withHiddenAlternates(level: LevelConfig): RecipePath[] {
  return HIDDEN_VARIANTS.map((v) => ({
    id: v.id,
    label: v.label,
    handwriting: 'unwritten',
    placement: v.placement(level),
    wispColor: v.wispColor,
    powerUpLabel: v.powerUpLabel,
    powerUpDetail: v.powerUpDetail,
    hidden: true,
  }));
}

export const HIDDEN_RECIPE_IDS = ['aldric', 'cael', 'petra'] as const;
export type HiddenRecipeId = typeof HIDDEN_RECIPE_IDS[number];
