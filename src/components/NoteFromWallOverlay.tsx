import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useGame } from '../game/store';
import { useCountdownDismiss } from './useCountdownDismiss';

// Level 8 — Smudge pries an old folded note from a crack near the floor
// and drops it in front of Mira. The puzzle pauses for ~5s while she
// reads it. Tap or any key dismisses early. The note text is added to
// the lore log when dismissed (handled by the store).

export function NoteFromWallOverlay() {
  const dismissAt = useGame((s) => s.noteFromWall.dismissAt);
  const dismiss = useGame((s) => s.dismissNoteFromWall);
  const text = useGame((s) => s.level.noteFromWall?.text ?? '');
  const totalMs = useGame((s) => s.level.noteFromWall?.durationMs ?? 5000);
  const remainingMs = useCountdownDismiss(dismissAt, dismiss);
  const reduce = useReducedMotion();
  const progress = dismissAt ? 1 - Math.min(1, remainingMs / totalMs) : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dismiss]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="A folded note pried from the wall"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md cursor-pointer p-6"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
      onClick={dismiss}
    >
      <motion.div
        className="relative max-w-sm w-full"
        initial={reduce ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 10, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: reduce ? 0 : 0.7, ease: 'easeOut' }}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-secondary/85 mb-2 text-center">
          Pried from a crack near the floor
        </p>
        {/* The note — paper texture via gradient + slight rotation. The
            ink-grain filter from the SVG library is intentionally NOT used
            here: this is supposed to read like real paper, not a glyph. */}
        <div
          className="relative px-5 py-4 rounded-sm border-[0.5px] border-secondary/30"
          style={{
            background:
              'linear-gradient(180deg, rgba(58,52,42,0.92), rgba(34,30,24,0.96))',
            boxShadow: '0 0 24px rgba(0,0,0,0.55), inset 0 0 12px rgba(255,215,153,0.08)',
          }}
        >
          <p className="font-body italic text-[14px] leading-relaxed text-on-surface/95">
            {text}
          </p>
          <p className="mt-3 font-headline italic text-[12px] text-secondary/80 text-right">
            — Someone who got out
          </p>
        </div>

        <div className="mt-4 mx-auto h-[2px] w-20 rounded-sm bg-surface-container-lowest overflow-hidden">
          <div
            className="h-full bg-secondary/70"
            style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
          />
        </div>
        <p className="text-center text-[10px] font-label uppercase tracking-[0.24em] text-on-surface-variant/60 mt-2">
          Tap to continue · the puzzle resumes
        </p>
      </motion.div>
    </motion.div>
  );
}
