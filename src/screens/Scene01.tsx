import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { BottomCTA } from '../components/BottomCTA';
import { MiraReaching } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 01 — "After the First Wisp"
// Mira watches the grate; reaches up and falls six inches short; a folded
// paper appears under the door; she does not pick it up. ~5–6 seconds.

export function Scene01() {
  const setScreen = useGame((s) => s.setScreen);
  const finishLevel = useGame((s) => s.finishLevel);
  const reduce = useReducedMotion();
  const [canAdvance, setCanAdvance] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    timer.current = window.setTimeout(() => setCanAdvance(true), reduce ? 800 : 2800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduce]);

  const advance = () => {
    finishLevel();
    setScreen('level-complete');
  };

  return (
    <Frame>
      <CellBackdrop opacity={0.9} />

      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          initial={reduce ? { y: 0, opacity: 0.92 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 0.92 }}
          transition={{ duration: reduce ? 0 : 0.7 }}
        >
          <MiraReaching size={230} />
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-[14%] w-10 h-6 rounded-sm pointer-events-none"
          aria-hidden="true"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: reduce ? 0.4 : 1.6, duration: reduce ? 0.3 : 0.6, ease: 'easeOut' }}
          style={{
            backgroundImage: 'linear-gradient(180deg, #e5e2dd 0%, #c9c5bc 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 0 4px rgba(0,0,0,0.15)',
            transform: 'rotate(-6deg)',
          }}
        />

        <motion.p
          className="absolute top-[40%] left-0 right-0 text-center font-body italic text-sm text-on-surface/80 px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: reduce ? 0.3 : 2.0, duration: reduce ? 0.5 : 0.7 }}
        >
          Her fingers stopped six inches short of the grate.
        </motion.p>
      </div>

      {canAdvance && (
        <BottomCTA>
          <motion.button
            className="btn-descend w-full"
            onClick={advance}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8 }}
          >
            Continue
          </motion.button>
        </BottomCTA>
      )}
    </Frame>
  );
}
