import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 10 — "The Chapter Close"  (after Level 10)
// Mira at center. Key in left hand, note in right (if she has them).
// The floor seam appears. Music-box theme plays in full for the first
// time — Level 1's note plus its continuation. Fades to chapter card.
//
// This is the post-wisp scene for L10; advancing routes through the
// LevelComplete card to the Larder stub.

export function Scene10() {
  const setScreen = useGame((s) => s.setScreen);
  const inventory = useGame((s) => s.inventory);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  // Live state — finishLevel hasn't committed `lastResult` yet at scene mount.
  const synced = useGame((s) => s.jointSync.hit);
  const reduce = useReducedMotion();
  const hasKey = inventory.includes('bessie-key');
  const hasNote = inventory.includes('wall-note');

  const advance = () => setScreen('level-complete');

  return (
    <TransitionScene
      ctaMs={6200}
      ctaLabel="The Chapter Closes"
      onAdvance={advance}
      skippable={highestLevelCleared >= 10}
      backdropOpacity={0.95}
      // The "second phrase" — a lower note layered under the L1 motif, played
      // here for the first time. Players who notice get the easter egg.
      note={{ freq: 196.0, detuneCents: -40, durationMs: 3600, gain: 0.13, delayMs: 3400 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          className="animate-breathe"
          initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 1.4 }}
        >
          <MiraSmudge size={220} />
        </motion.div>

        {/* The floor seam — a thin rectangle that rises a centimetre. */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-44 h-1 rounded-sm bg-on-surface/40"
          initial={reduce ? { y: 0, opacity: 0.6 } : { y: 0, opacity: 0 }}
          animate={{ y: [-0, -2, 0, -1, 0], opacity: [0, 0.7, 0.6, 0.6, 0.6] }}
          transition={{ delay: reduce ? 0.2 : 1.8, duration: reduce ? 0 : 2.2, times: [0, 0.3, 0.5, 0.7, 1] }}
          style={{ boxShadow: '0 0 18px rgba(0,223,193,0.18)' }}
        />

        {/* The key — small dark-metal in her left hand */}
        {hasKey && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[34%] left-[28%]"
            initial={reduce ? { opacity: 0.95 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ delay: reduce ? 0.4 : 2.4, duration: reduce ? 0 : 0.9 }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              {/* Bow — teardrop, slightly asymmetric. No perfect circles per
                  visual-direction rule. */}
              <path
                d="M5 14 C 5 9, 11 8, 14 12 C 16 16, 12 19, 8 19 C 5 18, 4 16, 5 14 Z"
                fill="#3a342c"
                stroke="#0e0e0c"
                strokeWidth="0.8"
              />
              <ellipse cx="9" cy="14" rx="2.6" ry="2.2" fill="#0a0a09" />
              <rect x="14" y="13" width="20" height="3" rx="0.5" fill="#3a342c" />
              <rect x="28" y="16" width="3" height="4" fill="#3a342c" />
              <rect x="32" y="16" width="2" height="3" fill="#3a342c" />
            </svg>
          </motion.div>
        )}

        {/* The note — folded paper in her right */}
        {hasNote && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[34%] right-[26%] w-7 h-9 rounded-sm"
            style={{
              backgroundImage: 'linear-gradient(180deg, #d8ccb0 0%, #bfb297 100%)',
              transform: 'rotate(8deg)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.55)',
            }}
            initial={reduce ? { opacity: 0.95 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ delay: reduce ? 0.5 : 2.7, duration: reduce ? 0 : 0.9 }}
          />
        )}

        <motion.p
          className="absolute top-[36%] left-0 right-0 text-center font-body italic text-sm text-on-surface/90 px-10"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0.4 : 3.4, duration: reduce ? 0 : 1.0 }}
        >
          <span className="text-secondary not-italic">
            &ldquo;Exactly as many as there need to be.&rdquo;
          </span>
          <br />
          <span className="text-[11px] text-on-surface-variant">
            {synced
              ? 'She had learned to brew. She had learned to refuse. She had learned to listen.'
              : 'She had learned to brew. She had not yet learned to refuse.'}
          </span>
        </motion.p>

        <motion.p
          className="absolute top-[8%] left-0 right-0 text-center font-label uppercase tracking-[0.32em] text-tertiary/80 text-[10px]"
          initial={reduce ? { opacity: 0.85 } : { opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: reduce ? 0.6 : 5.0, duration: reduce ? 0 : 1.4 }}
        >
          End of Act One · Chapter One
        </motion.p>
      </div>
    </TransitionScene>
  );
}
