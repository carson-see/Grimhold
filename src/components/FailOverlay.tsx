import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

// Shown when the player either runs out of moves or triggers a level-fail
// condition (L6 overheat). The level screen would otherwise soft-lock —
// this gives them a way back with context-specific flavor text.
export function FailOverlay({ onReplay, onQuit, playerName, reason = 'moves' }: {
  onReplay: () => void;
  onQuit: () => void;
  playerName: string;
  reason?: 'moves' | 'overheat';
}) {
  const reduce = useReducedMotion();

  // Enter + Escape to dismiss. Esc → quit (fastest exit), Enter → replay.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onQuit();
      else if (e.key === 'Enter') onReplay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onReplay, onQuit]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fail-title"
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.4 }}
    >
      <motion.div
        className="chalk-panel rounded-md p-6 max-w-sm w-full text-center"
        initial={reduce ? { scale: 1 } : { scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: 'backOut' }}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/70">
          {reason === 'overheat' ? 'A cauldron boiled over' : 'The cauldron cooled'}
        </p>
        <h2 id="fail-title" className="font-headline italic text-2xl text-secondary mt-1">
          Not yet, <span className="text-on-surface">{playerName || 'seeker'}</span>.
        </h2>
        <p className="font-body italic text-[12px] text-on-surface-variant mt-3 leading-relaxed">
          {reason === 'overheat' ? (
            <>
              One of the cauldrons went unattended too long.
              <br />
              The heat found nothing to brew and took what it could. Try again — watch the marked cauldron first.
            </>
          ) : (
            <>
              The last of the moves slipped away. Nothing rose from the grate.
              <br />
              Try the pattern again — the ingredients will remember where they wanted to go.
            </>
          )}
        </p>

        <div className="space-y-2 mt-6">
          <button className="btn-descend w-full" onClick={onReplay} autoFocus>
            Replay the Level
          </button>
          <button className="btn-ghost w-full" onClick={onQuit}>
            Quit to Title
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
