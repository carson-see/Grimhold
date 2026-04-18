import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 03 — "The Bag"  (after Level 3 Bessie encounter)
// Mira at the door. If Bessie was recruited, a small cloth bag sits
// against the door base. Otherwise the corridor is empty. First spoken
// line of the game ("I know.") only fires on the recruited branch.

export function Scene03() {
  const setScreen = useGame((s) => s.setScreen);
  const startLevel = useGame((s) => s.startLevel);
  const bessieAllyActive = useGame((s) => s.bessieAllyActive);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const reduce = useReducedMotion();

  const advance = () => {
    startLevel(4);
    setScreen('level');
  };

  return (
    <TransitionScene
      ctaMs={4400}
      ctaLabel="Into Cell 4"
      onAdvance={advance}
      skippable={highestLevelCleared >= 3}
      note={{ freq: 415.3, detuneCents: -24, durationMs: 2000, gain: 0.11, delayMs: 2200 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh]">
        <div className="relative flex-1 flex items-end justify-center pb-12">
          <motion.div
            className="absolute top-14 left-1/2 -translate-x-1/2 w-48 h-80 rounded-sm"
            style={{
              background: 'linear-gradient(180deg, #2e2a24 0%, #1a1815 100%)',
              boxShadow: 'inset 0 0 28px rgba(0,0,0,0.7), 0 0 24px rgba(0,0,0,0.4)',
            }}
            aria-hidden="true"
            initial={reduce ? { opacity: 0.9 } : { opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: reduce ? 0 : 0.8 }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-14 rounded-sm bg-surface-container-lowest border-[0.5px] border-outline/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent 0 10px, rgba(58,54,51,0.8) 10px 11px)',
                }}
              />
            </div>
            <div className="absolute bottom-10 right-4 w-3 h-3 rounded-sm bg-secondary/40" />
          </motion.div>

          {bessieAllyActive && (
            <motion.div
              aria-hidden="true"
              className="absolute bottom-10 left-1/2 -translate-x-1/2 -ml-12"
              initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: reduce ? 0.2 : 2.0, duration: reduce ? 0 : 0.8 }}
            >
              <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden="true">
                <path
                  d="M8 22 C 4 36, 10 48, 24 50 C 42 52, 58 44, 56 28 C 54 18, 44 14, 32 14 C 20 14, 10 16, 8 22 Z"
                  fill="#6b5a49"
                  stroke="#2a2218"
                  strokeWidth="1"
                />
                <path
                  d="M18 14 C 22 8, 42 8, 46 14 C 42 16, 22 16, 18 14 Z"
                  fill="#3a2e22"
                  stroke="#1a130a"
                  strokeWidth="0.8"
                />
                <path
                  d="M20 14 L 18 10 M 44 14 L 46 10"
                  stroke="#1a130a"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="28" cy="30" rx="1.4" ry="1.1" fill="#4a3a28" opacity="0.8" />
                <ellipse cx="40" cy="34" rx="1.2" ry="1" fill="#4a3a28" opacity="0.8" />
              </svg>
            </motion.div>
          )}

          <motion.div
            className="relative z-10 animate-breathe"
            initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.9, duration: reduce ? 0 : 1.0 }}
          >
            <MiraSmudge size={170} />
          </motion.div>

          <motion.p
            className="absolute top-[46%] left-0 right-0 text-center font-body italic text-[13px] text-on-surface/85 px-10"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0.5 : 2.8, duration: reduce ? 0 : 0.9 }}
          >
            {bessieAllyActive ? (
              <>
                <span className="text-secondary not-italic">&ldquo;I know.&rdquo;</span>
                <br />
                <span className="text-[11px] text-on-surface-variant">
                  — thinking out loud, to no one
                </span>
              </>
            ) : (
              <>
                The corridor was empty.
                <br />
                <span className="text-[11px] text-on-surface-variant">
                  She turned away. Smudge did not.
                </span>
              </>
            )}
          </motion.p>
        </div>
      </div>
    </TransitionScene>
  );
}
