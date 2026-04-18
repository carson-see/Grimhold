import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// Shared caption used by every transition scene — centred italic text with
// an optional sub-line underneath. Ensures the reading experience is
// consistent: 17px body, 14px sub, warm chalk-panel background so the
// words read cleanly against the cell backdrop's animated glow.
//
// Earlier scenes passed 14px/11px styles inline; first-time players
// reported the text was too small and shown too briefly. The panel
// anchors the reader's eye and the longer default fade keeps the words
// on screen long enough to finish reading.

type Props = {
  /** Primary line — a quote or a sentence. */
  children: ReactNode;
  /** Secondary supporting line. Usually the "what Mira did" bit. */
  sub?: ReactNode;
  /** Seconds to delay before the caption starts to fade in. */
  delaySec?: number;
  /** Seconds the fade-in takes. */
  durationSec?: number;
  /** Optional Tailwind positioning classes (for layouts that pin the caption). */
  className?: string;
  /** When true, render `children` in the secondary (quieter) treatment and
      style the caption as Architect/echo text (tertiary-tinted). */
  tone?: 'default' | 'architect' | 'aldric';
};

export function SceneCaption({
  children,
  sub,
  delaySec = 1.4,
  durationSec = 1.0,
  className = '',
  tone = 'default',
}: Props) {
  const reduce = useReducedMotion();
  // Distinct accents per voice so quotes read different from narration:
  //   default   → on-surface (warm parchment)
  //   architect → tertiary (cold purple — the wall voice)
  //   aldric    → secondary (warm amber — through-the-stone)
  const primaryColor =
    tone === 'architect'
      ? 'text-tertiary'
      : tone === 'aldric'
        ? 'text-secondary'
        : 'text-on-surface/95';
  return (
    <motion.div
      className={[
        'absolute left-4 right-4 z-20 pointer-events-none',
        className || 'bottom-28',
      ].join(' ')}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : delaySec, duration: reduce ? 0 : durationSec, ease: 'easeOut' }}
    >
      <div
        className="mx-auto max-w-[420px] rounded-sm px-4 py-3"
        style={{
          background:
            'linear-gradient(180deg, rgba(19,20,17,0.72) 0%, rgba(19,20,17,0.88) 100%)',
          boxShadow: 'inset 0 0 18px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      >
        <p className={`font-body italic text-[17px] leading-[1.45] ${primaryColor} text-center`}>
          {children}
        </p>
        {sub && (
          <p className="font-body italic text-[14px] leading-[1.5] text-on-surface-variant text-center mt-2">
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}
