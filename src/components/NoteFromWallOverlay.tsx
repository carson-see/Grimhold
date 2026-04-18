import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useGame } from '../game/store';

// L8 — Smudge pries an old folded note from a crack near the floor and
// drops it in front of Mira. Per level doc §Designer Notes: "the level
// resuming automatically after is the critical design choice — the
// player does not get to stop and reflect." So this is NON-blocking:
// the note appears as a weighted banner along the top while sorting
// continues underneath. Auto-dismisses when the configured duration
// elapses; tapping reads the full note in a lingering beat but does
// not pause the puzzle.

export function NoteFromWallOverlay() {
  const dismissAt = useGame((s) => s.noteFromWall.dismissAt);
  const dismiss = useGame((s) => s.dismissNoteFromWall);
  const text = useGame((s) => s.level.noteFromWall?.text ?? '');
  const reduce = useReducedMotion();
  const dismissedRef = useRef(false);

  // One-shot auto-dismiss at the configured duration. No 10Hz tick — the
  // player doesn't need a countdown for a narrative beat. `dismissedRef`
  // guards StrictMode double-invocation.
  useEffect(() => {
    if (!dismissAt) return;
    const remaining = Math.max(0, dismissAt - Date.now());
    const id = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      dismiss();
    }, remaining);
    return () => window.clearTimeout(id);
  }, [dismissAt, dismiss]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`A note pried from the wall: ${text}`}
      className="absolute top-14 left-3 right-3 z-40 pointer-events-auto"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: reduce ? 0 : 0.8, ease: 'easeOut' }}
      onClick={() => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        dismiss();
      }}
    >
      <div
        className="relative rounded-sm px-4 py-3 border-[0.5px] border-secondary/35"
        style={{
          background:
            'linear-gradient(180deg, rgba(58,52,42,0.94) 0%, rgba(34,30,24,0.96) 100%)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.5), inset 0 0 12px rgba(255,215,153,0.08)',
          // Slight rotation so the banner reads as a physical scrap,
          // not a system alert.
          transform: 'rotate(-0.6deg)',
        }}
      >
        <p className="font-label text-[9px] uppercase tracking-[0.24em] text-secondary/85">
          Pried from a crack near the floor — Smudge dropped it
        </p>
        <p className="font-body italic text-[13px] leading-[1.5] text-on-surface/95 mt-1">
          {text}
        </p>
        <p className="font-headline italic text-[11px] text-secondary/80 text-right mt-1">
          — Someone who got out
        </p>
      </div>
    </motion.div>
  );
}
