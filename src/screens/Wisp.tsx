import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { MiraSmudge } from '../assets/MiraSmudge';
import { Wisp } from '../assets/Wisp';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';
import type { Screen, WispColor } from '../game/types';

// The wisp rise — shared by every level. Color, caption and direction are
// pulled from the completed recipe path. The downward-grey variant sinks
// into the floor instead of rising — the only direction inversion.

const WISP_CAPTION: Record<WispColor, string> = {
  violet: 'the dungeon did not celebrate — it got what it wanted',
  'amber-threaded': 'something in the wisp is not the wall recipe',
  'violet-amber': 'the cook stirred the air — and the brew noticed',
  'violet-dark': 'a thread of something dark wove through the rise',
  'violet-strong': 'the wisp rose faster than before — the Architect will notice',
  'violet-grey': 'two cells brewed in time — the wisp threaded warm grey',
  'downward-grey': 'it went the wrong way — and nobody above saw it leave',
  black: 'it circled the room and returned — the Architect received nothing',
  silent: 'no wisp rose — the cauldrons settled, and the grate stayed quiet',
};

const FLASH_COLOR: Record<WispColor, string> = {
  violet: 'bg-tertiary/30',
  'amber-threaded': 'bg-secondary/30',
  'violet-amber': 'bg-secondary/25',
  'violet-dark': 'bg-tertiary/20',
  'violet-strong': 'bg-tertiary/40',
  'violet-grey': 'bg-secondary/20',
  'downward-grey': 'bg-outline/30',
  black: 'bg-on-surface/20',
  silent: 'bg-transparent',
};

// Each level's close beat. L2 and L3 have BETWEEN-level scenes (Scene 02
// fires after L1 LC; Scene 03 after L3 LC) — so they skip the post-wisp
// scene and go straight to the level-complete card. Every other level
// has its own post-wisp scene.
const POST_WISP_SCREEN: Record<number, Screen> = {
  1: 'scene-01',
  2: 'level-complete',
  3: 'level-complete',
  4: 'scene-04',
  5: 'scene-05',
  6: 'scene-06',
  7: 'scene-07',
  8: 'scene-08',
  9: 'scene-09',
  10: 'scene-10',
};

export function WispScene() {
  const setScreen = useGame((s) => s.setScreen);
  const level = useGame((s) => s.level);
  const completedPathId = useGame((s) => s.completedPathId);
  const reduce = useReducedMotion();
  const advanceTimer = useRef<number | undefined>(undefined);

  const recipe =
    level.recipes.find((r) => r.id === completedPathId) ?? level.recipes[0];
  const color = recipe.wispColor;
  const goesDown = color === 'downward-grey';
  const circlesBack = color === 'black';
  const isSilent = color === 'silent';

  useEffect(() => {
    playMusicBoxNote({ freq: 698.46, detuneCents: -16, durationMs: 2400, gain: 0.13 });
    const next = POST_WISP_SCREEN[level.id] ?? 'level-complete';
    advanceTimer.current = window.setTimeout(() => setScreen(next), reduce ? 1500 : 3600);
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [setScreen, reduce, level.id]);

  // Downward variant inverts the vertical travel. Everything else rises,
  // except the circle-back (black) wisp, which arcs across the middle of
  // the room and returns to the cauldron.
  const animateRise = reduce
    ? { bottom: '70%', opacity: [0, 1, 0], scale: 0.6 }
    : {
        bottom: ['18%', '82%'],
        opacity: [0, 1, 1, 0.3, 0],
        scale: [1, 0.95, 0.8, 0.55, 0.35],
      };
  const animateSink = reduce
    ? { bottom: '2%', opacity: [0, 1, 0], scale: 0.4 }
    : {
        bottom: ['30%', '-4%'],
        opacity: [0, 1, 1, 0.4, 0],
        scale: [1, 0.95, 0.82, 0.6, 0.3],
      };
  const animateCircle = reduce
    ? { bottom: '20%', opacity: [0, 1, 0], scale: 0.5 }
    : {
        // Rise → drift laterally → fall back. The horizontal shift is
        // implied by the x translation; we keep the element centered and
        // let the scale + opacity tail feel like a return.
        bottom: ['18%', '48%', '58%', '22%'],
        x: ['0%', '28%', '-28%', '0%'],
        opacity: [0, 1, 0.85, 0.0],
        scale: [1, 0.92, 0.85, 0.7],
      };

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

      {/* The wisp itself — suppressed entirely on the silent path. */}
      {!isSilent && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          initial={{ bottom: goesDown ? '32%' : '16%', opacity: 0, scale: 1 }}
          animate={
            goesDown ? animateSink : circlesBack ? animateCircle : animateRise
          }
          transition={{
            duration: reduce ? 1 : 3.2,
            times: reduce
              ? undefined
              : circlesBack
                ? [0, 0.35, 0.7, 1]
                : [0, 0.15, 0.7, 0.9, 1],
            ease: 'easeOut',
          }}
        >
          <Wisp size={110} color={color} />
        </motion.div>
      )}

      {/* Grate flash (rising) or floor flash (downward). */}
      <motion.div
        className={[
          'absolute left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm blur-[14px] z-10',
          goesDown ? 'bottom-[2%]' : 'top-[6%]',
          FLASH_COLOR[color],
        ].join(' ')}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ delay: reduce ? 0.6 : 2.1, duration: reduce ? 0.6 : 1.2 }}
      />

      <motion.p
        className="absolute top-14 left-0 right-0 text-center text-on-surface-variant italic text-xs tracking-widest z-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ delay: reduce ? 0.4 : 2.4, duration: reduce ? 0.8 : 1.0 }}
      >
        {WISP_CAPTION[color]}
      </motion.p>
    </Frame>
  );
}
