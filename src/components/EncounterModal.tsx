import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { CoinIcon } from '../assets/Icons';
import { useGame } from '../game/store';
import type { EncounterChoice, EncounterChoiceId } from '../game/types';
import { useCountdownDismiss } from './useCountdownDismiss';

// Mid-level encounter — currently only Bessie Tallow in Level 3. The
// countdown duration lives on the encounter config (`decisionSeconds`);
// when it expires the encounter's `defaultChoice` is auto-selected. The
// PRD allows at most ONE numerical countdown on screen, so this is the
// only visible timer while the modal is open.

export function EncounterModal() {
  // Primitive selectors — the modal ticks at 10 Hz so we avoid pulling
  // full objects and forcing comparison of their contents every frame.
  const open = useGame((s) => s.encounter.open);
  const deadline = useGame((s) => s.encounter.deadline);
  const enc = useGame((s) => s.level.encounter);
  const coins = useGame((s) => s.coins);
  const resolveEncounter = useGame((s) => s.resolveEncounter);
  const reduce = useReducedMotion();
  const onExpire = useCallback(() => {
    if (enc) resolveEncounter(enc.defaultChoice);
  }, [enc, resolveEncounter]);
  const remainingMs = useCountdownDismiss(open ? deadline : null, onExpire);

  // Escape picks the default choice for keyboard users — mirrors what the
  // timer does on expiry. Always available while the modal is open.
  useEffect(() => {
    if (!open || !enc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resolveEncounter(enc.defaultChoice);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, enc, resolveEncounter]);

  if (!open || !enc) return null;
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
  const pctRemaining = Math.max(0, remainingMs / (enc.decisionSeconds * 1000));

  const canAfford = (c: EncounterChoice): boolean => {
    if (c.cost?.coins && coins < c.cost.coins) return false;
    return true;
  };

  const pickChoice = (id: EncounterChoiceId) => {
    resolveEncounter(id);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="encounter-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-md"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.4 }}
    >
      <motion.div
        className="chalk-panel rounded-md p-5 w-full max-w-sm"
        initial={reduce ? { scale: 1 } : { scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: 'backOut' }}
      >
        <div className="text-center mb-3">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/70">
            {enc.role}
          </p>
          <h2 id="encounter-title" className="font-headline italic text-2xl text-secondary mt-1">
            {enc.title}
          </h2>
          <p className="font-body italic text-[11px] text-on-surface-variant mt-2 leading-relaxed max-w-[280px] mx-auto">
            {enc.whisper}
          </p>
        </div>

        {/* Single countdown — the only numerical timer allowed on screen per PRD §03 */}
        <div className="mt-3 mb-4 px-3">
          <div className="flex items-end justify-between mb-1.5">
            <span className="font-label text-[9px] uppercase tracking-[0.24em] text-on-surface-variant">
              Decide
            </span>
            <span
              className={[
                'font-headline text-2xl leading-none font-bold tabular-nums',
                secondsLeft <= 4 ? 'text-error' : 'text-secondary',
              ].join(' ')}
              aria-live="polite"
            >
              {secondsLeft}s
            </span>
          </div>
          <div className="h-1 rounded-sm bg-surface-container-lowest overflow-hidden">
            <motion.div
              className={secondsLeft <= 4 ? 'h-full bg-error' : 'h-full bg-secondary'}
              initial={{ width: '100%' }}
              animate={{ width: `${pctRemaining * 100}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {enc.choices.map((choice) => {
            const disabled = !canAfford(choice);
            const isDefault = choice.id === enc.defaultChoice;
            return (
              <button
                key={choice.id}
                onClick={() => !disabled && pickChoice(choice.id)}
                disabled={disabled}
                className={[
                  'w-full text-left p-3 rounded-sm border-[0.5px] transition-colors',
                  disabled
                    ? 'border-outline-variant/30 bg-surface-container-lowest opacity-50 cursor-not-allowed'
                    : choice.risk === 'risky'
                      ? 'border-tertiary/40 bg-tertiary-container/30 hover:border-tertiary'
                      : choice.risk === 'expensive'
                        ? 'border-secondary/40 bg-secondary-container/15 hover:border-secondary'
                        : 'border-outline/25 bg-surface-container-high/60 hover:border-primary/50',
                ].join(' ')}
                aria-label={`${choice.label}${choice.cost?.coins ? `, costs ${choice.cost.coins} coins` : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-headline text-sm text-on-surface">{choice.label}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    {choice.cost?.coins && (
                      <span
                        className={[
                          'inline-flex items-center gap-1 text-[11px] font-label',
                          disabled ? 'text-error' : 'text-secondary',
                        ].join(' ')}
                      >
                        <CoinIcon size={12} />
                        {choice.cost.coins}
                      </span>
                    )}
                    {choice.cost?.moves && (
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                        −{choice.cost.moves} move
                      </span>
                    )}
                    {isDefault && (
                      <span className="text-[9px] font-label uppercase tracking-[0.2em] text-outline">
                        default
                      </span>
                    )}
                  </span>
                </div>
                <p className="font-body italic text-[11px] text-on-surface-variant/85 mt-0.5 leading-snug">
                  {choice.blurb}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
