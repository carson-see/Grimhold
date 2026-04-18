import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { SceneCaption } from '../components/SceneCaption';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 04 — "What the Cauldron Showed"  (Level 4 → Level 5 transition)
// Mira kneels by the cauldron after the memory. Writes M.J.M. on the wall.
// Smudge is watching a different wall — the one he'll pass through next.

export function Scene04() {
  const setScreen = useGame((s) => s.setScreen);
  const finishLevel = useGame((s) => s.finishLevel);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const reduce = useReducedMotion();

  const advance = () => {
    finishLevel();
    setScreen('level-complete');
  };

  return (
    <TransitionScene
      ctaMs={4400}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 4}
      note={{ freq: 466.16, detuneCents: -26, durationMs: 2200, gain: 0.11, delayMs: 2000 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          className="animate-breathe"
          initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 1.0 }}
        >
          <MiraSmudge size={200} />
        </motion.div>

        {/* Chalk letters on the wall beside the cot — M.J.M. */}
        <motion.div
          aria-hidden="true"
          className="absolute top-[22%] right-[14%] font-headline italic text-outline"
          style={{ fontSize: 34, letterSpacing: '0.2em', textShadow: '0 0 6px rgba(203,196,208,0.2)' }}
          initial={reduce ? { opacity: 0.6 } : { opacity: 0, x: 12 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ delay: reduce ? 0.4 : 2.4, duration: reduce ? 0 : 1.2 }}
        >
          M.J.M.
        </motion.div>

        <SceneCaption
          className="bottom-28"
          delaySec={reduce ? 0.4 : 3.0}
          sub="She wrote three letters on the wall and stepped back to look at them."
        >
          She didn't know whose moth it was.
        </SceneCaption>
      </div>
    </TransitionScene>
  );
}
