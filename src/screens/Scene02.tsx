import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { BottomCTA } from '../components/BottomCTA';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';

// Scene 02 — "Two Handwritings"  (Level 1 → Level 2 transition)
// Mira holds both papers side by side. The handwriting comparison confirms
// the slid recipe was deliberate. She makes a small sound. Writes two
// initials on the wall. ~5 seconds.

export function Scene02() {
  const setScreen = useGame((s) => s.setScreen);
  const startLevel = useGame((s) => s.startLevel);
  const name = useGame((s) => s.name);
  const reduce = useReducedMotion();
  const [canAdvance, setCanAdvance] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    timer.current = window.setTimeout(() => setCanAdvance(true), reduce ? 900 : 4200);
    const noteTimer = window.setTimeout(
      () => playMusicBoxNote({ freq: 493.88, detuneCents: -20, durationMs: 1800, gain: 0.1 }),
      reduce ? 400 : 2400,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
      clearTimeout(noteTimer);
    };
  }, [reduce]);

  const advance = () => {
    startLevel(2);
    setScreen('level');
  };

  return (
    <Frame>
      <CellBackdrop opacity={0.85} />

      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-center p-6">
        <div className="relative w-full max-w-xs h-72">
          <motion.div
            className="absolute left-0 top-2 chalk-panel rounded-sm px-3 py-4 w-40 h-56"
            style={{ transform: 'rotate(-6deg)' }}
            initial={reduce ? { x: 0, opacity: 0.95 } : { x: -80, opacity: 0, rotate: -14 }}
            animate={{ x: 0, opacity: 0.95, rotate: -6 }}
            transition={{ duration: reduce ? 0 : 1.0, ease: 'easeOut' }}
          >
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-on-surface-variant/70 text-center">
              From the wall
            </p>
            <p
              className="font-body italic text-on-surface/85 text-sm leading-[1.7] mt-4"
              style={{ fontFamily: '"Caveat", "Newsreader", serif' }}
            >
              Moon &amp; Ash · <br />
              left cauldron.<br />
              Cold &amp; Ember · <br />
              right cauldron.
            </p>
          </motion.div>

          <motion.div
            className="absolute right-0 top-8 rounded-sm px-3 py-4 w-40 h-52 bg-[linear-gradient(180deg,#d8ccb0_0%,#bfb297_100%)] text-stone-900"
            style={{
              transform: 'rotate(4deg)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.15)',
            }}
            initial={reduce ? { x: 0, opacity: 0.95 } : { x: 90, opacity: 0, rotate: 12 }}
            animate={{ x: 0, opacity: 0.95, rotate: 4 }}
            transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 1.0, ease: 'easeOut' }}
          >
            <p
              className="font-label text-[9px] uppercase tracking-[0.22em] text-stone-700 text-center"
              style={{ fontFamily: '"Newsreader", serif' }}
            >
              Slid under the door
            </p>
            <p
              className="italic text-stone-800 text-[13px] leading-[1.5] mt-3"
              style={{ fontFamily: '"Newsreader", serif' }}
            >
              Moon + Ash + Dark — Left.<br />
              Moon + Ash + Cold · Cold + Ember — Right.
            </p>
            <p
              className="italic text-stone-600 text-[10px] mt-3 text-right"
              style={{ fontFamily: '"Newsreader", serif' }}
            >
              — A friend
            </p>
          </motion.div>
        </div>

        <motion.p
          className="font-body italic text-sm text-on-surface/85 text-center max-w-[300px] mt-3"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 2.2, duration: reduce ? 0 : 0.9 }}
        >
          Someone down here knows how these cauldrons work.
          <br />
          <span className="text-on-surface-variant">They knew what would be on {name}'s wall today.</span>
        </motion.p>
      </div>

      {canAdvance && (
        <BottomCTA>
          <motion.button
            className="btn-descend w-full"
            onClick={advance}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7 }}
          >
            Choose a Recipe
          </motion.button>
        </BottomCTA>
      )}
    </Frame>
  );
}
