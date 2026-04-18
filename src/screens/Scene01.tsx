import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { SceneCaption } from '../components/SceneCaption';
import { MiraReaching } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 01 — "After the First Wisp"  (only fires after Level 1)
// Mira reaches up, falls six inches short; a folded paper slides in under
// the door; she does not pick it up.

export function Scene01() {
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
      ctaMs={4200}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 1}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          initial={reduce ? { y: 0, opacity: 0.92 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 0.92 }}
          transition={{ duration: reduce ? 0 : 1.1 }}
        >
          <MiraReaching size={230} />
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-[14%] w-10 h-6 rounded-sm pointer-events-none"
          aria-hidden="true"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: reduce ? 0.5 : 2.6, duration: reduce ? 0.3 : 0.8, ease: 'easeOut' }}
          style={{
            backgroundImage: 'linear-gradient(180deg, #e5e2dd 0%, #c9c5bc 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 0 4px rgba(0,0,0,0.15)',
            transform: 'rotate(-6deg)',
          }}
        />

        <SceneCaption
          delaySec={reduce ? 0.4 : 3.2}
          sub="A folded paper slid in, and she did not pick it up."
        >
          Her fingers stopped six inches short of the grate.
        </SceneCaption>
      </div>
    </TransitionScene>
  );
}
