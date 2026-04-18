import { IngredientSvg, INGREDIENT_NAMES } from '../assets/Ingredients';
import type { CauldronId, IngredientId, RecipePath } from '../game/types';
import { CAULDRON_INITIAL } from '../data/levels';

// Shared recipe card — used by the in-puzzle HUD on Level.tsx and by
// Scene02 for the wall-recipe card in the "two handwritings" comparison.
// `handwriting` picks visual treatment: dark chalk (wall) vs
// amber-inflected chalk (slid). The slid-paper artwork in Scene02 is a
// different art direction and is rendered inline there; this component
// only renders the chalk treatments.

type Props = {
  recipe: RecipePath;
  cauldrons: CauldronId[];
  title?: string;
  chapter?: string;
};

export function RecipePanel({ recipe, cauldrons, title, chapter }: Props) {
  const isSlid = recipe.handwriting === 'slid';
  return (
    <div
      className={[
        'chalk-panel rounded-sm px-3 py-2',
        isSlid
          ? 'bg-[linear-gradient(180deg,rgba(58,50,34,0.5),rgba(22,20,16,0.65))] border-secondary/20'
          : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span
          className={[
            'font-label text-[10px] uppercase tracking-[0.22em]',
            isSlid ? 'text-secondary/85' : 'text-on-surface-variant/70',
          ].join(' ')}
        >
          {recipe.label}
        </span>
        {chapter && <span className="font-body italic text-[10px] text-outline">{chapter}</span>}
      </div>
      {title && (
        <h2 className="font-headline italic text-secondary text-lg mt-0.5 leading-tight">{title}</h2>
      )}
      <div
        className={`grid gap-1.5 mt-1 font-body text-xs text-on-surface/85 ${
          cauldrons.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {cauldrons.map((cid) => (
          <RecipeLine key={cid} cauldron={cid} items={recipe.placement[cid] ?? []} slid={isSlid} />
        ))}
      </div>
    </div>
  );
}

function RecipeLine({
  cauldron,
  items,
  slid,
}: {
  cauldron: CauldronId;
  items: IngredientId[];
  slid?: boolean;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span
        className={[
          'font-label text-[10px] uppercase tracking-[0.2em] shrink-0 mt-0.5',
          slid ? 'text-secondary/70' : 'text-outline',
        ].join(' ')}
      >
        {CAULDRON_INITIAL[cauldron]}
      </span>
      <div className="flex items-center gap-0.5 flex-wrap">
        {items.length === 0 && <span className="text-outline italic text-[10px]">—</span>}
        {items.map((ing, i) => (
          <span
            key={`${cauldron}-${i}`}
            className="inline-flex items-center"
            title={INGREDIENT_NAMES[ing]}
            aria-label={INGREDIENT_NAMES[ing]}
          >
            <IngredientSvg id={ing} size={16} noFilter />
          </span>
        ))}
      </div>
    </div>
  );
}
