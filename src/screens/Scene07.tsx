import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { SceneCaption } from '../components/SceneCaption';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 07 — "Back to Back"  (Level 7 → Level 8 transition)
// Mira sits against the shared wall. Aldric, on the other side, settles
// into the same position. She cannot see him. The grate-tap is a small
// motor of three taps — nothing happens. Smudge is already watching the
// crack near the floor where the L8 note will appear.

export function Scene07() {
  const setScreen = useGame((s) => s.setScreen);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  // Read live `jointSync.hit` rather than `lastResult.jointHit` — finishLevel
  // hasn't run yet at scene mount; LevelComplete's effect handles that.
  const synced = useGame((s) => s.jointSync.hit);
  const reduce = useReducedMotion();

  const advance = () => setScreen('level-complete');

  return (
    <TransitionScene
      ctaMs={4800}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 7}
      note={{ freq: 261.63, detuneCents: -22, durationMs: 2400, gain: 0.11, delayMs: 1800 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        {/* Shared wall — a vertical chalk seam between the two cells */}
        <motion.div
          aria-hidden="true"
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[2px] h-[40%] bg-outline/40"
          initial={reduce ? { opacity: 0.5 } : { opacity: 0, scaleY: 0.4 }}
          animate={{ opacity: 0.5, scaleY: 1 }}
          style={{ transformOrigin: 'top' }}
          transition={{ duration: reduce ? 0 : 1.0 }}
        />

        {/* Mira's silhouette — leaning left, against the seam */}
        <motion.div
          className="absolute bottom-[18%] left-[22%] animate-breathe"
          initial={reduce ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }}
        >
          <MiraSmudge size={150} />
        </motion.div>

        {/* Aldric's stand-in — a faint silhouette on the other side */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[20%] right-[22%]"
          initial={reduce ? { opacity: 0.4 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ delay: reduce ? 0.2 : 1.4, duration: reduce ? 0 : 1.0 }}
        >
          <svg width="140" height="170" viewBox="0 0 140 170" aria-hidden="true">
            <path
              d="M30 50 C 36 18, 104 18, 110 50 L 122 170 L 18 170 Z"
              fill="rgba(58,52,42,0.8)"
              stroke="#0e0e0c"
              strokeWidth="0.6"
            />
            <ellipse cx="70" cy="50" rx="16" ry="12" fill="#0a0608" />
          </svg>
        </motion.div>

        <SceneCaption
          className="bottom-28"
          delaySec={reduce ? 0.4 : 2.6}
          sub={synced
            ? 'The brew had blended. Two cells, one rhythm. Her shoulder against the wall agreed.'
            : 'They had not synced this time. The wall did not seem to mind.'}
        >
          She heard him settle into the same shape on the other side of the stone.
        </SceneCaption>

        {/* The grate-tap motor — three small chalk dashes near the top */}
        <motion.div
          aria-hidden="true"
          className="absolute top-[10%] left-1/2 -translate-x-1/2 flex gap-1"
          initial={reduce ? { opacity: 0.7 } : { opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: reduce ? 0.6 : 3.6, duration: reduce ? 0 : 0.6 }}
        >
          <span className="block w-2 h-[3px] bg-outline" />
          <span className="block w-2 h-[3px] bg-outline" />
          <span className="block w-2 h-[3px] bg-outline" />
        </motion.div>
      </div>
    </TransitionScene>
  );
}
