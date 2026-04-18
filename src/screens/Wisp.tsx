import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { MiraSmudge } from '../assets/MiraSmudge';
import { Wisp } from '../assets/Wisp';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';

// The wisp rise. Level Document, Level 1: "a violet wisp rises from the
// surface of the left cauldron... drifts toward a grate in the ceiling and
// disappears through it. The player is not told what it is."
// Held ~4.5s. After the grate flash, push to Scene 01.

export function WispScene() {
  const setScreen = useGame((s) => s.setScreen);
  const reduce = useReducedMotion();
  const advanceTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    playMusicBoxNote({ freq: 698.46, detuneCents: -16, durationMs: 2400, gain: 0.13 });
    advanceTimer.current = window.setTimeout(() => setScreen('scene-01'), reduce ? 1500 : 3600);
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [setScreen, reduce]);

  return (
    <Frame>
      <CellBackdrop />

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        initial={reduce ? { opacity: 0.85 } : { opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: reduce ? 0 : 0.8 }}
      >
        <MiraSmudge size={200} />
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        initial={{ bottom: '16%', opacity: 0, scale: 1 }}
        animate={
          reduce
            ? { bottom: '70%', opacity: [0, 1, 0], scale: 0.6 }
            : {
                bottom: ['18%', '82%'],
                opacity: [0, 1, 1, 0.3, 0],
                scale: [1, 0.95, 0.8, 0.55, 0.35],
              }
        }
        transition={{ duration: reduce ? 1 : 3.2, times: reduce ? undefined : [0, 0.15, 0.7, 0.9, 1], ease: 'easeOut' }}
      >
        <Wisp size={110} color="violet" />
      </motion.div>

      <motion.div
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm bg-tertiary/30 blur-[14px] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ delay: reduce ? 0.6 : 2.1, duration: reduce ? 0.6 : 1.2 }}
      />

      <motion.p
        className="absolute top-14 left-0 right-0 text-center text-on-surface-variant italic text-xs tracking-widest z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ delay: reduce ? 0.4 : 2.4, duration: reduce ? 0.8 : 1.0 }}
      >
        the dungeon did not celebrate — it got what it wanted
      </motion.p>
    </Frame>
  );
}
