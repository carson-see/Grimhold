import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/store';

// Small toast that surfaces one-shot mid-level events the player might
// otherwise miss: Smudge delivered an Unknown, a volatile shift just
// fired, etc. Each toast lives for LIFETIME_MS and then fades out.

const LIFETIME_MS = 2800;

interface ToastEvent {
  id: number;
  tone: 'primary' | 'tertiary';
  message: string;
}

export function EventToast() {
  const conditionalDelivered = useGame((s) => s.conditionalDelivered);
  const movesUsed = useGame((s) => s.movesUsed);
  const level = useGame((s) => s.level);
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<ToastEvent[]>([]);
  const idRef = useRef(0);

  const push = (tone: ToastEvent['tone'], message: string) => {
    const id = ++idRef.current;
    setToasts((cur) => [...cur, { id, tone, message }]);
    window.setTimeout(
      () => setToasts((cur) => cur.filter((t) => t.id !== id)),
      LIFETIME_MS,
    );
  };

  // "Unknown delivered" — fires once when Smudge drops it in.
  const prevDelivered = useRef(false);
  useEffect(() => {
    if (conditionalDelivered && !prevDelivered.current) {
      prevDelivered.current = true;
      push('tertiary', 'Smudge dropped something on the cauldron rim.');
    }
    if (!conditionalDelivered) prevDelivered.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionalDelivered]);

  // "Volatile drift" — fires once per shift cycle, but only when a
  // volatile ingredient is actually placed and not already clamped at the
  // rightmost cauldron (those cases don't actually drift). We read
  // placements directly to check before toasting.
  const vol = level.volatility;
  const shiftEvery = vol?.shiftEveryMoves ?? 0;
  const ingredientsSnapshot = useGame((s) => s.ingredients);
  const driftCycle = (() => {
    if (!vol || shiftEvery <= 0) return 0;
    if (movesUsed === 0 || movesUsed % shiftEvery !== 0) return 0;
    const lastCauldron = level.cauldrons[level.cauldrons.length - 1];
    const tsCauldron = level.timeSensitive?.cauldron;
    const anyActuallyDrifted = ingredientsSnapshot.some(
      (i) =>
        vol.kinds.includes(i.kind) &&
        i.placedIn !== null &&
        i.placedIn !== lastCauldron &&
        i.placedIn !== tsCauldron,
    );
    return anyActuallyDrifted ? movesUsed : 0;
  })();
  const lastDrift = useRef(0);
  useEffect(() => {
    if (driftCycle > 0 && driftCycle !== lastDrift.current) {
      lastDrift.current = driftCycle;
      push('primary', 'The cauldrons stirred. Volatile ingredients drifted.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driftCycle]);

  return (
    <div className="absolute top-14 left-0 right-0 z-30 pointer-events-none flex flex-col items-center gap-1 px-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={[
              'rounded-sm px-3 py-1.5 border-[0.5px] backdrop-blur-sm',
              'font-body italic text-[11px] max-w-[320px] text-center leading-snug',
              t.tone === 'primary'
                ? 'border-primary/40 bg-[linear-gradient(180deg,rgba(0,223,193,0.12),rgba(0,223,193,0.03))] text-primary-fixed'
                : 'border-tertiary/40 bg-[linear-gradient(180deg,rgba(210,188,250,0.15),rgba(210,188,250,0.04))] text-tertiary',
            ].join(' ')}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
