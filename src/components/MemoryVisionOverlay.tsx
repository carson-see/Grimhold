import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useGame } from '../game/store';
import { useCountdownDismiss } from './useCountdownDismiss';

// L4 "Memory in the Cauldron" — per Designer Notes: "should feel like a
// glitch, not a cutscene — something the cauldron did that the dungeon
// didn't intend." No title chrome, no progress bar — just a fast ghost
// of an image that snaps in and bleeds out. The puzzle is blocked
// (per doc: "3-second pause" — we use 2.2s) so the player can't miss
// the moth, but no dialog UI frames it as an explainable event.

export function MemoryVisionOverlay() {
  const dismissAt = useGame((s) => s.memoryVision.dismissAt);
  const dismiss = useGame((s) => s.dismissMemoryVision);
  const reduce = useReducedMotion();
  useCountdownDismiss(dismissAt, dismiss);

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
      role="img"
      aria-label="A sudden still: a moth pressed against the inside of a glass jar. The image is gone almost before you see it."
      className="absolute inset-0 z-50 cursor-pointer"
      // The whole overlay "pushes in" with an off-by-half-a-frame twitch.
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
      onClick={dismiss}
      style={{
        background:
          'radial-gradient(ellipse at 50% 55%, rgba(0,223,193,0.2) 0%, rgba(10,10,9,0.96) 55%, rgba(0,0,0,1) 100%)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
    >
      {/* Interlaced scanline overlay — reads as bad film, not UI */}
      {!reduce && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-35"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)',
          }}
        />
      )}

      <svg
        width="260"
        height="260"
        viewBox="0 0 260 260"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        {/* Workbench silhouette */}
        <rect x="52" y="188" width="156" height="4" fill="#2a2a27" />
        <rect x="52" y="192" width="156" height="36" fill="#1a1a18" />

        {/* Hunched figure from behind — never rendered in detail */}
        <motion.g
          initial={reduce ? { opacity: 0.92, y: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 0.92, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          <path
            d="M112 110 C 108 132, 104 160, 106 188 L 154 188 C 156 160, 152 132, 148 110 C 144 100, 116 100, 112 110 Z"
            fill="#2d1b4e"
            stroke="#0e0e0c"
            strokeWidth="0.7"
          />
          <ellipse cx="130" cy="94" rx="13" ry="15" fill="#1a0e2b" />
          <ellipse cx="130" cy="88" rx="12" ry="11" fill="#0a0608" />
        </motion.g>

        {/* The jar and moth — centerpiece. Slight jitter on the moth. */}
        <motion.g
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 }}
        >
          <rect
            x="120"
            y="162"
            width="20"
            height="22"
            rx="2"
            fill="rgba(210,232,230,0.18)"
            stroke="#6b7a82"
            strokeWidth="0.8"
          />
          <rect x="122" y="160" width="16" height="4" fill="#3a3a37" />
          {/* Moth shape — wings pressed flat against the glass */}
          <motion.path
            d="M128 174 L 124 170 L 128 172 L 132 170 L 128 174 Z"
            fill="#e5e2dd"
            initial={reduce ? { opacity: 0.9 } : { opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.75, 0.95] }}
            transition={{ duration: reduce ? 0 : 1.0, delay: reduce ? 0 : 0.5 }}
          />
          <ellipse cx="128" cy="174" rx="0.8" ry="1.4" fill="#0a0608" />
        </motion.g>
      </svg>

      {/* Just three letters fading in — the initials Mira will scratch next. */}
      <motion.p
        aria-hidden="true"
        className="absolute bottom-[18%] left-0 right-0 text-center font-headline italic text-outline"
        style={{ fontSize: 40, letterSpacing: '0.26em', textShadow: '0 0 12px rgba(203,196,208,0.25)' }}
        initial={reduce ? { opacity: 0.7 } : { opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.45] }}
        transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.8 }}
      >
        M.J.M.
      </motion.p>
    </motion.div>
  );
}
