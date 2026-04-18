import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { SceneCaption } from '../components/SceneCaption';
import { MiraSmudge } from '../assets/MiraSmudge';
import { useGame } from '../game/store';

// Scene 09 — "The Circle"  (Level 9 → Level 10 transition)
// Mira looking up at the ceiling. Architect's "interesting" echoes faintly.
// She draws a circle on the wall with an arrow pointing back into itself.
// The chalk drawing is the centerpiece.

export function Scene09() {
  const setScreen = useGame((s) => s.setScreen);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  // The branch reads live `completedPathId` since finishLevel hasn't run yet.
  const refused = useGame((s) => s.completedPathId === 'refusal');
  const reduce = useReducedMotion();

  const advance = () => setScreen('level-complete');

  return (
    <TransitionScene
      ctaMs={5000}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 9}
      backdropOpacity={0.92}
      note={{ freq: 277.18, detuneCents: -36, durationMs: 2600, gain: 0.1, delayMs: 2400 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-end pb-24">
        <motion.div
          className="animate-breathe"
          initial={reduce ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: reduce ? 0 : 1.0 }}
        >
          <MiraSmudge size={200} />
        </motion.div>

        {/* The circle with the arrow looping back */}
        <motion.svg
          aria-hidden="true"
          className="absolute top-[16%] left-[14%]"
          width="86"
          height="86"
          viewBox="0 0 86 86"
          initial={reduce ? { opacity: 0.7 } : { opacity: 0, rotate: -8 }}
          animate={{ opacity: 0.7, rotate: 0 }}
          transition={{ delay: reduce ? 0.3 : 2.8, duration: reduce ? 0 : 1.4 }}
        >
          <ellipse
            cx="43"
            cy="43"
            rx="32"
            ry="30"
            fill="none"
            stroke="rgba(203,196,208,0.7)"
            strokeWidth="1.6"
          />
          {/* Arrow head pointing back into the loop */}
          <path
            d="M 67 38 L 75 28 L 80 40"
            fill="none"
            stroke="rgba(203,196,208,0.7)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.svg>

        {refused ? (
          <SceneCaption
            className="bottom-28"
            delaySec={reduce ? 0.4 : 3.2}
            sub="The Architect's voice. Two words, flat, through the stone."
            tone="architect"
          >
            &ldquo;Interesting.&rdquo;
          </SceneCaption>
        ) : (
          <SceneCaption
            className="bottom-28"
            delaySec={reduce ? 0.4 : 3.2}
            sub="She did not answer Aldric's question. The circle on the wall did."
            tone="aldric"
          >
            &ldquo;I need to understand the floor.&rdquo;
          </SceneCaption>
        )}
      </div>
    </TransitionScene>
  );
}
