import { motion, useReducedMotion } from 'framer-motion';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { InkDivider } from '../components/InkDivider';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';
import { nextLevelId } from '../data/levels';

export function TitleScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const hasSeenOpening = useGame((s) => s.hasSeenOpening);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const startLevel = useGame((s) => s.startLevel);
  const reduce = useReducedMotion();

  const resumeId = nextLevelId(highestLevelCleared);
  const allCleared = hasSeenOpening && resumeId === null;

  const begin = () => {
    playMusicBoxNote({ freq: 440, detuneCents: -14, durationMs: 1800, gain: 0.12 });
    if (!hasSeenOpening) {
      setScreen('character-select');
      return;
    }
    if (allCleared) {
      // Player has already reached the end of built content — send them to
      // the Larder stub rather than silently restarting at Level 1.
      setScreen('larder-stub');
      return;
    }
    startLevel(resumeId ?? 1);
    setScreen('level');
  };

  const ctaLabel = !hasSeenOpening
    ? 'Begin the Descent'
    : allCleared
      ? 'Return to the Larder'
      : `Continue — Level ${resumeId}`;

  return (
    <Frame>
      <CellBackdrop />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-between h-[100dvh] pt-20 pb-10 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.4, ease: 'easeOut' }}
      >
        <div className="text-center">
          <motion.h1
            className="ink-title text-5xl uppercase tracking-[0.18em]"
            initial={reduce ? { y: 0, opacity: 1 } : { y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.3, duration: reduce ? 0 : 1.4 }}
          >
            Grimhold
          </motion.h1>
          <motion.div
            className="mx-auto mt-5"
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: reduce ? 0 : 1.0, duration: reduce ? 0 : 1.2 }}
          >
            <InkDivider tone="primary" />
          </motion.div>
          <motion.p
            className="font-body italic text-[11px] text-on-surface-variant mt-3 tracking-wider"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 1.6, duration: reduce ? 0 : 0.9 }}
          >
            Act One · Chapter One
          </motion.p>
        </div>

        <motion.div
          className="flex-1 flex items-end justify-center animate-breathe"
          initial={reduce ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.8, duration: reduce ? 0 : 2 }}
        >
          <MiraSmudge size={220} />
        </motion.div>

        <motion.button
          className="btn-descend w-full max-w-xs mt-6"
          onClick={begin}
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.6, duration: reduce ? 0 : 1.0 }}
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </motion.button>
      </motion.div>
    </Frame>
  );
}
