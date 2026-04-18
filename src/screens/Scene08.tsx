import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 08 — "After the Note"  (Level 8 → Level 9 transition)
// Mira against the far wall. Note in hand. She does not read it again —
// she watches the grate. Smudge on her shoulder, perfectly still.
// She writes B.W. on the wall before standing.
//
// This is the emotional peak of Act One. Slower CTA, slower note.

export function Scene08() {
  const setScreen = useGame((s) => s.setScreen);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const reduce = useReducedMotion();

  const advance = () => setScreen('level-complete');

  return (
    <TransitionScene
      ctaMs={5400}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 8}
      backdropOpacity={0.92}
      note={{ freq: 311.13, detuneCents: -34, durationMs: 2800, gain: 0.1, delayMs: 3200 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          className="animate-breathe"
          initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 1.2 }}
        >
          <MiraSmudge size={210} />
        </motion.div>

        {/* The note in her hand — folded paper, shown briefly */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[34%] right-[28%] w-8 h-10 rounded-sm"
          style={{
            backgroundImage: 'linear-gradient(180deg, #d8ccb0 0%, #bfb297 100%)',
            transform: 'rotate(-8deg)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
          initial={reduce ? { opacity: 0.95 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 0.95, y: 0 }}
          transition={{ delay: reduce ? 0.2 : 0.8, duration: reduce ? 0 : 0.9 }}
        />

        {/* B.W. — Black Wisp — written before the next level */}
        <motion.div
          aria-hidden="true"
          className="absolute top-[20%] right-[14%] font-headline italic text-outline"
          style={{ fontSize: 28, letterSpacing: '0.2em', textShadow: '0 0 6px rgba(203,196,208,0.18)' }}
          initial={reduce ? { opacity: 0.65 } : { opacity: 0, x: 10 }}
          animate={{ opacity: 0.65, x: 0 }}
          transition={{ delay: reduce ? 0.4 : 4.0, duration: reduce ? 0 : 1.0 }}
        >
          B.W.
        </motion.div>

        <motion.p
          className="absolute top-[40%] left-0 right-0 text-center font-body italic text-sm text-on-surface/85 px-10"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0.4 : 2.4, duration: reduce ? 0 : 0.9 }}
        >
          <span className="text-secondary not-italic">&ldquo;The recipe is not the product.&rdquo;</span>
          <br />
          <span className="text-[11px] text-on-surface-variant">
            She closed her hand around the note. Smudge did not tilt his head.
          </span>
        </motion.p>
      </div>
    </TransitionScene>
  );
}
