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
      // Per Designer Notes L6: "Do not subtitle it. Players who want to
      // replay to catch every word will do so." The banner is
      // intentionally caption-less and low-contrast — it reads as
      // something half-heard through stone, not dialogue UI.
      className="absolute top-14 left-6 right-6 z-40 pointer-events-none"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: reduce ? 0 : 0.6 }}
    >
      <motion.p
        key={idx}
        className="font-body italic text-[13px] leading-[1.5] text-on-surface-variant/80 text-center"
        style={{
          // Muffled feel — slight blur + low-key purple shadow, no panel.
          filter: 'blur(0.2px)',
          textShadow: '0 0 14px rgba(45,27,78,0.55), 0 0 4px rgba(0,0,0,0.6)',
          letterSpacing: '0.01em',
        }}
        initial={reduce ? { opacity: 0.85 } : { opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0.85, 0.6] }}
        transition={{ duration: reduce ? 0 : 1.2 }}
      >
        {fragments[idx]}
      </motion.p>
    </motion.div>
  );
}
