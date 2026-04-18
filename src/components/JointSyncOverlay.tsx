import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { useGame } from '../game/store';
import { useCountdownDismiss } from './useCountdownDismiss';
import { playMusicBoxNote } from '../game/audio';
import { CAULDRON_LABEL } from '../data/levels';

// Non-blocking sync window — Aldric whispers a low note from the next
// cell over and a glowing ring fills around the indicated cauldron edge.
// Player must tap the ring before the window expires to lock in the
// joint variant of the recipe (warm-grey threading on the violet wisp).
//
// Per PRD §03: this is the only on-screen countdown allowed at this
// moment. Architect voice may co-exist (it carries no number); other
// blocking overlays are suppressed by the store while this is open.

export function JointSyncOverlay() {
  const open = useGame((s) => s.jointSync.open);
  const dismissAt = useGame((s) => s.jointSync.dismissAt);
  const sync = useGame((s) => s.level.jointSync);
  const registerHit = useGame((s) => s.registerJointSyncHit);
  const expire = useGame((s) => s.expireJointSync);
  const reduce = useReducedMotion();

  const onExpire = useCallback(() => expire(), [expire]);
  const remainingMs = useCountdownDismiss(open ? dismissAt : null, onExpire);
  const totalMs = (sync?.windowSeconds ?? 5) * 1000;
  const elapsed = totalMs - remainingMs;
  const progress = Math.max(0, Math.min(1, elapsed / totalMs));

  const playedToneRef = useRef(false);

  useEffect(() => {
    if (!open) {
      playedToneRef.current = false;
      return;
    }
    if (playedToneRef.current) return;
    playedToneRef.current = true;
    // Aldric's low matching note — sustained, slightly off-key.
    playMusicBoxNote({ freq: 261.63, detuneCents: -22, durationMs: 1800, gain: 0.1 });
  }, [open]);

  const handleHit = useCallback(() => {
    if (!open) return;
    // An octave above Aldric's — the hold confirmation.
    playMusicBoxNote({ freq: 523.25, detuneCents: -8, durationMs: 1100, gain: 0.13 });
    registerHit();
  }, [open, registerHit]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleHit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleHit]);

  if (!open || !sync) return null;
  const cauldronLabel = CAULDRON_LABEL[sync.cauldron];

  return (
    <motion.div
      role="dialog"
      aria-label={`Aldric is matching the cue at the ${cauldronLabel} cauldron. Press the Sync button before the window closes.`}
      className="absolute inset-x-0 bottom-0 top-1/3 z-40 pointer-events-none"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      <div className="relative h-full flex items-end justify-center pb-32">
        <div className="pointer-events-auto chalk-panel rounded-md px-4 py-3 max-w-xs w-[80%] shadow-[0_0_28px_rgba(154,138,122,0.35)]">
          <p className="font-label text-[9px] uppercase tracking-[0.24em] text-secondary/85 text-center">
            Through the wall — Aldric
          </p>
          <p className="font-body italic text-[12px] text-on-surface/85 mt-1 text-center leading-snug">
            {sync.whisper}
          </p>
          <button
            onClick={handleHit}
            className="mt-3 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-sm border-[0.5px] border-secondary/60 bg-secondary-container/20 hover:bg-secondary-container/35 transition-colors py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70"
            aria-label={`Sync with Aldric on the ${cauldronLabel} cauldron`}
          >
            <span className="font-label text-[10px] uppercase tracking-[0.22em] text-secondary">
              Sync · {cauldronLabel}
            </span>
          </button>
          <div className="mt-2 h-[3px] rounded-sm bg-surface-container-lowest overflow-hidden">
            <motion.div
              className="h-full bg-secondary"
              initial={{ width: '100%' }}
              animate={{ width: `${(1 - progress) * 100}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
