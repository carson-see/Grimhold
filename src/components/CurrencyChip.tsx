import { CoinIcon, GemIcon } from '../assets/Icons';

// Coin · Gem chip — appears in the Larder header.
// Tailwind classes must be statically resolvable, so the compact/standard
// variants are spelled out in full conditionals (no string interpolation).
export function CurrencyChip({ coins, gems, compact }: { coins: number; gems: number; compact?: boolean }) {
  const iconSize = compact ? 12 : 14;
  return (
    <div
      className={
        compact
          ? 'flex items-center gap-2 px-2 py-1 rounded-sm bg-surface-container-high border-[0.5px] border-outline/20'
          : 'flex items-center gap-3 px-2.5 py-1 rounded-sm bg-surface-container-high border-[0.5px] border-outline/20'
      }
    >
      <span className={compact ? 'flex items-center gap-1 text-secondary text-xs' : 'flex items-center gap-1 text-secondary text-sm'}>
        <CoinIcon size={iconSize} /> {coins}
      </span>
      <span className="w-px h-3 bg-outline/30" />
      <span className={compact ? 'flex items-center gap-1 text-tertiary text-xs' : 'flex items-center gap-1 text-tertiary text-sm'}>
        <GemIcon size={iconSize} /> {gems}
      </span>
    </div>
  );
}
