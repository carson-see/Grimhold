import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';

// Scene 00 — "The First Dark"
// Black → fungus glow → cell assembles → Mira sits up → music-box note → hold.
// ~3.8s total. Auto-advances. Skip surfaces at 800ms on replay.

const TOTAL_MS = 3800;
const NOTE_DELAY_MS = 1900;

export function Scene00() {
  const setScreen = useGame((s) => s.setScreen);
  const markOpeningSeen = useGame((s) => s.markOpeningSeen);
  const startLevel = useGame((s) => s.startLevel);
  const hasSeenOpening = useGame((s) => s.hasSeenOpening);
  const reduce = useReducedMotion();
  const [canSkip, setCanSkip] = useState(false);
  const advancedRef = useRef(false);

  const advance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    markOpeningSeen();
    startLevel(1);
    setScreen('level');
  };

  useEffect(() => {
    if (reduce) {
      advance();
      return;
    }
    const noteTimer = window.setTimeout(
      () => playMusicBoxNote({ freq: 523.25, detuneCents: -22, durationMs: 2200, gain: 0.14 }),
      NOTE_DELAY_MS,
    );
    const advanceTimer = window.setTimeout(advance, TOTAL_MS);
    const skipTimer = hasSeenOpening
      ? window.setTimeout(() => setCanSkip(true), 800)
      : undefined;
    return () => {
      clearTimeout(noteTimer);
      clearTimeout(advanceTimer);
      if (skipTimer) clearTimeout(skipTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, hasSeenOpening]);

  return (
    <Frame>
      <div className="absolute inset-0 bg-black">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
        >
          <div className="absolute -top-20 -left-24 w-80 h-80 rounded-full bg-primary/20 blur-[90px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.7 }}
        >
          <CellBackdrop />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-end justify-center pb-20"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 1.4 }}
        >
          <div className="animate-breathe">
            <MiraSmudge size={240} />
          </div>
        </motion.div>

        <motion.p
          className="absolute bottom-8 left-0 right-0 text-center font-body italic text-xs text-on-surface/55 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: reduce ? 0 : 1.6, duration: reduce ? 0 : 0.7 }}
        >
          somewhere, water drips
        </motion.p>

        {canSkip && (
          <button
            className="absolute top-3 right-3 w-11 h-11 inline-flex items-center justify-center text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-label border-[0.5px] border-outline/30 rounded-sm bg-surface-container/60 backdrop-blur-sm"
            onClick={advance}
          >
            Skip
          </button>
        )}
      </div>
    </Frame>
  );
}
