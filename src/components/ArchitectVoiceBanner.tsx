import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGame } from '../game/store';

// Non-blocking banner — fragments of the Architect's voice fade in/out
// along the top of the screen while the player keeps sorting underneath.
// "Do not subtitle it" per the level doc is honoured loosely — we show
// low-contrast italic text that reads as ambient caption rather than
// dialogue. Dismisses when the store's `dismissAt` elapses.

export function ArchitectVoiceBanner() {
  const dismissAt = useGame((s) => s.architectVoice.dismissAt);
  const dismiss = useGame((s) => s.dismissArchitectVoice);
  const level = useGame((s) => s.level);
  const reduce = useReducedMotion();
  const fragments = level.architectVoice?.fragments ?? [];
  const durationMs = level.architectVoice?.durationMs ?? 8000;
  const [idx, setIdx] = useState(0);

  // One interval drives both fragment rotation and dismissal — the
  // position in the sequence is derived from elapsed time.
  useEffect(() => {
    if (!dismissAt || fragments.length === 0) return;
    const startedAt = dismissAt - durationMs;
    const perFragment = Math.max(1000, durationMs / fragments.length);
    const tick = () => {
      const now = Date.now();
      if (now >= dismissAt) {
        dismiss();
        return;
      }
      const elapsed = now - startedAt;
      const nextIdx = Math.min(fragments.length - 1, Math.floor(elapsed / perFragment));
      setIdx((cur) => (cur === nextIdx ? cur : nextIdx));
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [dismissAt, fragments.length, durationMs, dismiss]);

  if (fragments.length === 0) return null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="absolute top-16 left-3 right-3 z-40 pointer-events-none"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: reduce ? 0 : 0.6 }}
    >
      <div className="relative rounded-sm px-3 py-2 bg-surface-container-lowest/85 border-[0.5px] border-tertiary/30 shadow-[inset_0_0_18px_rgba(45,27,78,0.55)] backdrop-blur-sm">
        <p className="font-label text-[9px] uppercase tracking-[0.24em] text-tertiary/75">
          Through the stone
        </p>
        <motion.p
          key={idx}
          className="font-body italic text-[12px] text-on-surface/85 mt-0.5 leading-snug"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.6 }}
        >
          {fragments[idx]}
        </motion.p>
      </div>
    </motion.div>
  );
}
