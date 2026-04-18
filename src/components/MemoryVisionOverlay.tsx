import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useGame } from '../game/store';
import { useCountdownDismiss } from './useCountdownDismiss';

// Silent 3-second overlay. The cauldron stills and "shows" a scene — the
// figure at a workbench, the moth in a glass jar. Rendered inline as
// abstract shapes so the image implies without over-specifying. The
// overlay is non-interactive; it dismisses itself when the store's
// `dismissAt` timestamp elapses. Tapping also dismisses early.

export function MemoryVisionOverlay() {
  const dismissAt = useGame((s) => s.memoryVision.dismissAt);
  const dismiss = useGame((s) => s.dismissMemoryVision);
  const reduce = useReducedMotion();
  const remainingMs = useCountdownDismiss(dismissAt, dismiss);

  // Escape / Enter / Space dismiss early — keeps keyboard users in flow.
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

  const progress = dismissAt ? 1 - Math.min(1, remainingMs / 3200) : 0;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="A memory surfaces in the cauldron"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
      onClick={dismiss}
    >
      <div className="relative max-w-xs w-full text-center px-6">
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-primary/75">
          In the still water
        </p>

        <svg
          width="220"
          height="200"
          viewBox="0 0 220 200"
          className="mx-auto mt-4"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="mv-halo" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(0,223,193,0.22)" />
              <stop offset="100%" stopColor="rgba(0,223,193,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="110" cy="110" rx="110" ry="90" fill="url(#mv-halo)" />

          {/* Workbench — a stone slab with a small jar on it */}
          <rect x="40" y="140" width="140" height="6" fill="#2a2a27" />
          <rect x="40" y="146" width="140" height="34" fill="#1a1a18" />

          {/* The figure — hunched, head bowed, viewed from behind */}
          <motion.g
            initial={reduce ? { opacity: 0.9 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: reduce ? 0 : 1.0, delay: reduce ? 0 : 0.2 }}
          >
            <path
              d="M92 70 C 88 88, 84 110, 86 140 L 134 140 C 136 110, 132 88, 128 70 C 124 62, 96 62, 92 70 Z"
              fill="#2d1b4e"
              stroke="#0e0e0c"
              strokeWidth="0.8"
            />
            <ellipse cx="110" cy="58" rx="14" ry="16" fill="#1a0e2b" />
            <ellipse cx="110" cy="52" rx="13" ry="12" fill="#0a0608" />
          </motion.g>

          {/* Jar + moth — the centerpiece */}
          <motion.g
            initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.7 }}
          >
            <rect
              x="100"
              y="122"
              width="20"
              height="20"
              rx="2"
              fill="rgba(210,232,230,0.15)"
              stroke="#6b7a82"
              strokeWidth="0.8"
            />
            <rect x="102" y="120" width="16" height="4" fill="#3a3a37" />
            {/* moth — wings pressed against glass */}
            <path d="M108 134 L 104 130 L 108 132 L 112 130 L 108 134 Z" fill="#e5e2dd" opacity="0.85" />
            <ellipse cx="108" cy="134" rx="0.8" ry="1.4" fill="#0a0608" />
          </motion.g>

          {/* Rippling water at the bottom — SMIL animate so framer doesn't
              fight us over the `d` attribute. */}
          <path
            d="M20 180 Q 55 176 90 180 T 160 180 T 200 180"
            fill="none"
            stroke="rgba(0,223,193,0.4)"
            strokeWidth="0.8"
          >
            {!reduce && (
              <animate
                attributeName="d"
                values="M20 180 Q 55 176 90 180 T 160 180 T 200 180;M20 180 Q 55 184 90 180 T 160 180 T 200 180;M20 180 Q 55 176 90 180 T 160 180 T 200 180"
                dur="2.4s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </svg>

        <motion.p
          className="mt-4 font-body italic text-[13px] text-on-surface-variant leading-relaxed"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.4, duration: reduce ? 0 : 0.8 }}
        >
          A moth on the back of a hand.
          <br />
          The hand stayed very still.
        </motion.p>

        {/* Bottom progress bar — the only UI cue that the moment will pass. */}
        <div className="mt-6 mx-auto h-[2px] w-20 rounded-sm bg-surface-container-lowest overflow-hidden">
          <div
            className="h-full bg-primary/70"
            style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
