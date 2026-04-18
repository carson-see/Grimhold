import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 06 — "Grief Resonance"  (Level 6 close)
// Mira says the phrase aloud, testing it. Crosses out "We" and replaces
// with "I" — she hasn't met Aldric yet. Note comes as she writes.

export function Scene06() {
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
      ctaMs={4600}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 6}
      note={{ freq: 349.23, detuneCents: -30, durationMs: 2400, gain: 0.11, delayMs: 2400 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          className="animate-breathe"
          initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 1.0 }}
        >
          <MiraSmudge size={210} />
        </motion.div>

        {/* Wall writing — G.R.C.2 already there; W.L.T.G. with W crossed out to I. */}
        <motion.div
          aria-hidden="true"
          className="absolute top-[18%] right-[14%] text-right"
          initial={reduce ? { opacity: 0.7 } : { opacity: 0, x: 10 }}
          animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: reduce ? 0.2 : 1.6, duration: reduce ? 0 : 1.0 }}
        >
          <p
            className="font-headline italic text-outline"
            style={{ fontSize: 26, letterSpacing: '0.18em', textShadow: '0 0 6px rgba(203,196,208,0.18)' }}
          >
            G.R.C.2
          </p>
          <motion.p
            className="font-headline italic text-outline mt-2 relative"
            style={{ fontSize: 22, letterSpacing: '0.16em' }}
            initial={reduce ? { opacity: 0.7 } : { opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: reduce ? 0.3 : 2.8, duration: reduce ? 0 : 0.9 }}
          >
            <span className="relative inline-block">
              W
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-[2px] bg-outline"
                style={{ width: '100%' }}
                initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: reduce ? 0 : 3.4, duration: reduce ? 0 : 0.4 }}
              />
            </span>
            <span className="text-secondary/80 ml-1">I</span>
            .L.T.G.
          </motion.p>
        </motion.div>

        <motion.p
          className="absolute top-[44%] left-0 right-0 text-center font-body italic text-sm text-on-surface/85 px-10"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0.5 : 3.6, duration: reduce ? 0 : 0.9 }}
        >
          <span className="text-secondary not-italic">&ldquo;Grief resonance.&rdquo;</span>
          <br />
          <span className="text-[11px] text-on-surface-variant">
            She tested the phrase in her mouth. Something in her face rearranged itself.
          </span>
        </motion.p>
      </div>
    </TransitionScene>
  );
}
