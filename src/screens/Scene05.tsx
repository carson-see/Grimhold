import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { MiraSmudge } from '../assets/MiraSmudge';
import { IngredientSvg } from '../assets/Ingredients';
import { useGame } from '../game/store';

// Scene 05 — "The Decision in the Pocket"  (Level 5 → Level 6 transition)
// Branches on what the player did with the Unknown:
//   * pocketed  → Mira holds it, slides it into a hidden pocket
//   * downward  → her hand is empty; she looks at the floor
//   * dissolved → her hand is empty; she looks at her palm
// The narrative line changes accordingly. Music-box note lands on the
// "settling" beat.

export function Scene05() {
  const setScreen = useGame((s) => s.setScreen);
  const finishLevel = useGame((s) => s.finishLevel);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const lastResult = useGame((s) => s.lastResult);
  const completedPathId = useGame((s) => s.completedPathId);
  const ingredients = useGame((s) => s.ingredients);
  const hasPocketed = useGame((s) => s.hasPocketedUnknown);
  const reduce = useReducedMotion();

  // Infer branch: prefer result if finishLevel already ran, otherwise peek
  // at the live state. The three outcomes map to distinct final-frame text.
  const conditionalDelivered = useGame((s) => s.conditionalDelivered);
  // Read live placement state — finishLevel hasn't run yet when the scene
  // first mounts (advance() calls it on CTA). Using pre-finish state means
  // the branch resolves correctly from the first paint.
  const path = lastResult?.recipePathId ?? completedPathId;
  const unknownPlaced = ingredients.some((i) => i.kind === 'unknown' && i.placedIn !== null);
  const unknownDelivered = conditionalDelivered || ingredients.some((i) => i.kind === 'unknown');
  const branch: 'pocketed' | 'downward' | 'dissolved' | 'undelivered' =
    path === 'downward'
      ? 'downward'
      : !unknownDelivered
        ? 'undelivered'
        : !unknownPlaced
          ? 'pocketed'
          : 'dissolved';
  // `hasPocketedUnknown` persists across levels; referenced implicitly via
  // the branch logic above but kept as a selector to satisfy future UI
  // (e.g. a "still pocketed" indicator in a later scene).
  void hasPocketed;

  const advance = () => {
    finishLevel();
    setScreen('level-complete');
  };

  return (
    <TransitionScene
      ctaMs={4600}
      ctaLabel="Continue"
      onAdvance={advance}
      skippable={highestLevelCleared >= 5}
      note={{ freq: 392.0, detuneCents: -28, durationMs: 2400, gain: 0.1, delayMs: 2600 }}
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

        {branch === 'pocketed' && (
          <motion.div
            aria-hidden="true"
            className="absolute top-[58%] left-1/2 -translate-x-1/2"
            initial={reduce ? { opacity: 0.9, scale: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.9, 0.9, 0.0], scale: [0.8, 1, 1, 0.6], y: [0, 0, 6, 20] }}
            transition={{ delay: reduce ? 0.4 : 2.2, duration: reduce ? 0.6 : 2.4, times: [0, 0.35, 0.65, 1] }}
          >
            <IngredientSvg id="unknown" size={42} noFilter />
          </motion.div>
        )}

        <motion.p
          className="absolute top-[42%] left-0 right-0 text-center font-body italic text-sm text-on-surface/85 px-10"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0.4 : 3.2, duration: reduce ? 0 : 0.9 }}
        >
          {branch === 'pocketed' && (
            <>
              Her hand disappeared into the pocket.
              <br />
              <span className="text-[11px] text-on-surface-variant">
                It came back empty. She did not look at Smudge.
              </span>
            </>
          )}
          {branch === 'downward' && (
            <>
              The grate was quiet.
              <br />
              <span className="text-[11px] text-on-surface-variant">
                Whatever it was, it had gone the wrong way. Nobody above knew.
              </span>
            </>
          )}
          {branch === 'dissolved' && (
            <>
              It dissolved. She watched her palm, then the cauldron.
              <br />
              <span className="text-[11px] text-on-surface-variant">
                Nothing kept. Smudge tilted his head — disappointed, maybe.
              </span>
            </>
          )}
          {branch === 'undelivered' && (
            <>
              Smudge watched the wall for a long moment, then looked away.
              <br />
              <span className="text-[11px] text-on-surface-variant">
                The cauldrons settled. Whatever it was, it did not arrive this time.
              </span>
            </>
          )}
        </motion.p>
      </div>
    </TransitionScene>
  );
}
