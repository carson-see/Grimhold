import { motion, useReducedMotion } from 'framer-motion';
import { TransitionScene } from '../components/TransitionScene';
import { SceneCaption } from '../components/SceneCaption';
import { RecipePanel } from '../components/RecipePanel';
import { useGame } from '../game/store';
import { CAULDRON_LABEL, getLevel } from '../data/levels';
import type { CauldronId } from '../game/types';

// Scene 02 — "Two Handwritings"  (Level 1 → Level 2 transition)
// Mira holds both L2 papers side by side. Both recipes pull from the level
// config so the scene never drifts out of sync with the puzzle data.

export function Scene02() {
  const setScreen = useGame((s) => s.setScreen);
  const startLevel = useGame((s) => s.startLevel);
  const name = useGame((s) => s.name);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const reduce = useReducedMotion();

  const level2 = getLevel(2);
  const wallRecipe = level2.recipes.find((r) => r.handwriting === 'wall');
  const slidRecipe = level2.recipes.find((r) => r.handwriting === 'slid');

  const advance = () => {
    startLevel(2);
    setScreen('level');
  };

  if (!wallRecipe || !slidRecipe) return null;

  return (
    <TransitionScene
      ctaMs={4200}
      ctaLabel="Choose a Recipe"
      onAdvance={advance}
      backdropOpacity={0.85}
      skippable={highestLevelCleared >= 2}
      note={{ freq: 493.88, detuneCents: -20, durationMs: 1800, gain: 0.1, delayMs: 2400 }}
    >
      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-center px-5 py-8">
        <div className="relative w-full max-w-xs h-80 mb-2">
          <motion.div
            className="absolute left-0 top-2 w-40 h-60"
            style={{ transform: 'rotate(-6deg)' }}
            initial={reduce ? { x: 0, opacity: 0.95 } : { x: -80, opacity: 0, rotate: -14 }}
            animate={{ x: 0, opacity: 0.95, rotate: -6 }}
            transition={{ duration: reduce ? 0 : 1.0, ease: 'easeOut' }}
          >
            <RecipePanel recipe={wallRecipe} cauldrons={level2.cauldrons} />
          </motion.div>

          {/* Slid paper — tan sheet rotated right, warm shadow. Rendered as
              its own tan card because RecipePanel only knows dark-chalk and
              inline-slid treatments; this scene needs a distinct "paper"
              look to stage the handwriting-comparison moment. */}
          <motion.div
            className="absolute right-0 top-10 rounded-sm px-3 py-4 w-40 h-56 bg-[linear-gradient(180deg,#d8ccb0_0%,#bfb297_100%)]"
            style={{
              transform: 'rotate(4deg)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.15)',
            }}
            initial={reduce ? { x: 0, opacity: 0.95 } : { x: 90, opacity: 0, rotate: 12 }}
            animate={{ x: 0, opacity: 0.95, rotate: 4 }}
            transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 1.0, ease: 'easeOut' }}
          >
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-stone-700 text-center">
              Slid under the door
            </p>
            <div className="mt-2 space-y-1 text-stone-800 text-[11px] leading-tight italic">
              {level2.cauldrons.map((cid) => (
                <p key={cid}>
                  <span className="font-label not-italic text-[8px] uppercase tracking-[0.18em] text-stone-600">
                    {cauldronCaption(cid)}
                  </span>
                  <br />
                  {(slidRecipe.placement[cid] ?? []).map(capitalize).join(' · ')}
                </p>
              ))}
            </div>
            <p className="italic text-stone-600 text-[10px] mt-3 text-right">— a friend</p>
          </motion.div>
        </div>

        <SceneCaption
          className="bottom-28"
          delaySec={reduce ? 0 : 2.2}
          sub={`They knew what would be on ${name}'s wall today.`}
        >
          Someone down here knows how these cauldrons work.
        </SceneCaption>
      </div>
    </TransitionScene>
  );
}

function cauldronCaption(cid: CauldronId): string {
  return `${CAULDRON_LABEL[cid].toLowerCase()} cauldron`;
}

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}
