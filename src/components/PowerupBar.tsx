import { useGame } from '../game/store';
import { POWERUPS } from '../data/powerups';
import { INGREDIENT_NAMES } from '../assets/Ingredients';
import type { PowerUpId } from '../game/store';

// In-level power-up strip — three small token buttons. Each shows the
// current stash count; tapping consumes one and applies the effect.
// Disabled when stash is 0 or when the puzzle is in a state where the
// effect can't apply (e.g. no volatility on this level → freeze is
// useless; no hidden recipes left to peek → peek is useless).
//
// Positioned just above the Mira/quit row so it's reachable without
// hiding the cauldrons. Hidden when the puzzle is over.

const ICON: Record<PowerUpId, string> = {
  'extra-move': '+2',
  'freeze-volatile': '❄',
  'recipe-peek': '?',
};

export function PowerupBar() {
  const powerups = useGame((s) => s.powerups);
  const usePowerup = useGame((s) => s.usePowerup);
  const completed = useGame((s) => s.completed);
  const failed = useGame((s) => s.failed);
  const level = useGame((s) => s.level);
  const movesUsed = useGame((s) => s.movesUsed);
  const extraGranted = useGame((s) => s.extraMovesGranted);
  const freezeUntil = useGame((s) => s.freezeVolatileUntilMove);
  const revealedId = useGame((s) => s.revealedHiddenRecipeId);
  const cleared = useGame((s) => s.pathsCleared[level.id] ?? []);

  if (completed || failed) return null;

  // Per-button availability: don't let players burn tokens on a no-op.
  const movesAtLimit = movesUsed >= level.moveLimit + extraGranted;
  const freezeActive = movesUsed < freezeUntil;
  const hiddenLeft = (['aldric', 'cael', 'petra'] as const).filter(
    (id) =>
      level.recipes.some((r) => r.id === id) && !cleared.includes(id),
  ).length;

  const cantUse: Record<PowerUpId, boolean> = {
    'extra-move': movesAtLimit, // already burnt the budget
    'freeze-volatile': !level.volatility || freezeActive,
    'recipe-peek': hiddenLeft === 0 || revealedId !== null,
  };

  return (
    <div className="px-3 mt-1">
      <div className="flex items-center justify-between gap-2">
        <p className="font-label text-[9px] uppercase tracking-[0.22em] text-on-surface-variant/70">
          Power-ups
        </p>
        <div className="flex gap-1.5">
          {POWERUPS.map((p) => {
            const stash = powerups[p.id] ?? 0;
            const disabled = stash <= 0 || cantUse[p.id];
            return (
              <button
                key={p.id}
                onClick={() => !disabled && usePowerup(p.id)}
                disabled={disabled}
                aria-label={`${p.name} — ${stash} in stash. ${p.effect}`}
                title={`${p.name}\n${p.effect}\nIn stash: ${stash}`}
                className={[
                  'h-9 min-w-[44px] inline-flex items-center justify-center gap-1 px-2 rounded-sm border-[0.5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70',
                  disabled
                    ? 'border-outline/20 bg-surface-container-lowest/60 text-outline cursor-not-allowed opacity-55'
                    : 'border-secondary/40 bg-secondary-container/15 text-secondary hover:bg-secondary-container/30',
                ].join(' ')}
              >
                <span className="font-headline italic text-[12px]">{ICON[p.id]}</span>
                <span className="font-label text-[10px] tabular-nums">×{stash}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active-effect line — only when something's in flight */}
      {(extraGranted > 0 || freezeActive || revealedId) && (
        <p
          className="mt-1 font-body italic text-[11px] text-secondary/85 leading-snug"
          aria-live="polite"
        >
          {extraGranted > 0 && `+${extraGranted} extra moves · `}
          {freezeActive &&
            `volatility frozen for ${Math.max(0, freezeUntil - movesUsed)} more moves · `}
          {revealedId && isHiddenChar(revealedId) && (
            <span>
              Heard through the wall — <span className="text-secondary not-italic">{revealedId}</span>'s
              hand for this level. Watch which cauldron the {peekedHint(revealedId)} go into.
            </span>
          )}
        </p>
      )}
    </div>
  );
}

type HiddenChar = 'aldric' | 'cael' | 'petra';

function isHiddenChar(id: unknown): id is HiddenChar {
  return id === 'aldric' || id === 'cael' || id === 'petra';
}

function peekedHint(id: HiddenChar): string {
  // Light, narrative hints — not the placement itself. The player still
  // has to discover the exact pattern.
  if (id === 'aldric') return `${INGREDIENT_NAMES.coldstone}/${INGREDIENT_NAMES.darkspore}/${INGREDIENT_NAMES.hollowroot} (heavies)`;
  if (id === 'cael') return 'every kind, in every cauldron';
  return 'ingredients in alphabetical order';
}
