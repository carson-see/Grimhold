import { motion, useReducedMotion } from 'framer-motion';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { InkDivider } from '../components/InkDivider';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';

export function TitleScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const hasSeenOpening = useGame((s) => s.hasSeenOpening);
  const reduce = useReducedMotion();

  const begin = () => {
    playMusicBoxNote({ freq: 440, detuneCents: -14, durationMs: 1800, gain: 0.12 });
    setScreen('character-select');
  };

  const fade = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 1.4 } };

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
          <motion.p
            className="mt-4 text-on-surface-variant italic text-sm max-w-[260px] mx-auto leading-relaxed"
            {...fade(1.2)}
          >
            The recipe is not the product. You are.
          </motion.p>
          <motion.div
            className="mx-auto mt-5"
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: reduce ? 0 : 1.6, duration: reduce ? 0 : 1.4 }}
          >
            <InkDivider tone="primary" />
          </motion.div>
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
          {...fade(2.2)}
          aria-label={hasSeenOpening ? 'Continue' : 'Begin the Descent'}
        >
          {hasSeenOpening ? 'Continue' : 'Begin the Descent'}
        </motion.button>
      </motion.div>
    </Frame>
  );
}
