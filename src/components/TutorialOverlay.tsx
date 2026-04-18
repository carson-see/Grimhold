import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { IngredientSvg } from '../assets/Ingredients';
import { Cauldron } from '../assets/Cauldron';

// First-time tutorial that appears once on the player's first puzzle entry.
// Persisted via `hasPlayedLevel1` in the store. Dismiss to begin.

export function TutorialOverlay({ onDismiss }: { onDismiss: () => void }) {
  const reduce = useReducedMotion();

  // Esc to dismiss for keyboard users.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="chalk-panel rounded-md p-6 max-w-sm w-full"
        initial={reduce ? { scale: 1 } : { scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: 'backOut' }}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant text-center">
          Cell 4 · First Brew
        </p>
        <h2
          id="tutorial-title"
          className="font-headline italic text-2xl text-secondary text-center mt-1 mb-4"
        >
          How to brew
        </h2>

        <ol className="space-y-4 mb-6">
          <li className="flex items-start gap-3">
            <Step n={1} />
            <div>
              <p className="font-headline text-sm text-on-surface">Read the wall.</p>
              <p className="font-body italic text-[11px] text-on-surface-variant mt-0.5">
                The recipe lives at the top — which ingredients go in which cauldron.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <Step n={2} />
            <div>
              <p className="font-headline text-sm text-on-surface">Tap an ingredient.</p>
              <p className="font-body italic text-[11px] text-on-surface-variant mt-0.5">
                It will lift from the tray and glow violet.
              </p>
              <div className="flex items-center gap-2 mt-2 px-2 py-1 rounded-sm bg-tertiary-container/40 border-[0.5px] border-tertiary/40 inline-flex">
                <IngredientSvg id="moonbloom" size={28} noFilter />
                <span className="font-body italic text-[10px] text-tertiary">selected</span>
              </div>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <Step n={3} />
            <div>
              <p className="font-headline text-sm text-on-surface">Tap a cauldron.</p>
              <p className="font-body italic text-[11px] text-on-surface-variant mt-0.5">
                The ingredient drops in. Place every ingredient and the brew completes.
              </p>
              <div className="mt-2">
                <Cauldron size={56} tint="correct" glowing />
              </div>
            </div>
          </li>
        </ol>

        <p className="font-body italic text-[11px] text-on-surface-variant text-center mb-4">
          Tap an ingredient by mistake? Tap it again to put it back.
        </p>

        <button className="btn-descend w-full" onClick={onDismiss} autoFocus>
          Begin
        </button>
      </motion.div>
    </motion.div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-sm bg-primary-container border-[0.5px] border-primary/40 font-headline text-primary text-sm font-bold">
      {n}
    </span>
  );
}
