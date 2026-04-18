import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { CoinIcon, GemIcon, StarIcon } from '../assets/Icons';
import { Wisp } from '../assets/Wisp';
import { useGame } from '../game/store';
import type { LevelResult } from '../game/types';
import { getLevel, nextLevelId } from '../data/levels';

// Quiet — no fanfare. Per Level Document L1: "No music sting. No fanfare."
// Stars + reward + continue. Continue advances to the level-appropriate
// close scene (Scene 02 after L1, Scene 03 after L3, etc.).

const WISP_LABEL: Record<LevelResult['wispColor'], string> = {
  violet: 'a violet wisp',
  'amber-threaded': 'a violet wisp threaded amber',
  'violet-amber': 'a violet wisp, faintly amber-stirred',
};

const PATH_LABEL: Record<LevelResult['recipePathId'], string> = {
  wall: 'The wall recipe',
  slid: "The slid paper's recipe",
  joint: 'The wall recipe',
};

export function LevelComplete() {
  const reduce = useReducedMotion();

  // Snapshot result at mount. For L1 the wisp-scene-01 chain calls
  // finishLevel() before nav; for L2/L3 the wisp scene routes here
  // directly, so we commit the result on first render if the store
  // hasn't yet. `useState` initializer runs exactly once per mount.
  const [result, setResult] = useState<LevelResult | null>(() => {
    const s = useGame.getState();
    if (s.lastResult) return s.lastResult;
    if (s.completed && s.completedPathId) return s.finishLevel();
    return null;
  });

  const name = useGame((s) => s.name);
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const setScreen = useGame((s) => s.setScreen);
  const resetLevel = useGame((s) => s.resetLevel);
  const startLevel = useGame((s) => s.startLevel);
  const storeResult = useGame((s) => s.lastResult);

  // Keep our mount-time snapshot aligned if the store commits after the
  // first render — otherwise the wisp-color line can be stale on first paint.
  useEffect(() => {
    if (!result && storeResult) setResult(storeResult);
  }, [result, storeResult]);

  // True only when a user deep-links to this screen without a completed level.
  useEffect(() => {
    if (!result && !storeResult) setScreen('title');
  }, [result, storeResult, setScreen]);

  if (!result) return null;

  const { stars, movesUsed, levelId, wispColor, recipePathId } = result;
  const level = getLevel(levelId);
  const recipe = level.recipes.find((r) => r.id === recipePathId) ?? level.recipes[0];
  const nextId = nextLevelId(levelId);

  const continueLabel =
    levelId === 1
      ? 'Continue'            // → Scene 02 (two handwritings)
      : nextId !== null
        ? 'Continue'          // → Level 3
        : 'The Larder';

  const handleContinue = () => {
    if (levelId === 1) {
      setScreen('scene-02');
    } else if (levelId === 2) {
      startLevel(3);
      setScreen('level');
    } else if (levelId === 3) {
      setScreen('scene-03');
    } else {
      setScreen('larder-stub');
    }
  };

  const handleReplay = () => {
    startLevel(levelId);
    setScreen('level');
  };

  const handleTitle = () => {
    resetLevel();
    setScreen('title');
  };

  const closingLine = level.closingLine.replace('{name}', name);

  return (
    <Frame>
      <CellBackdrop opacity={0.6} />

      {/* Ambient drifting wisps — CSS keyframe animation, no per-frame work */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute left-[12%] bottom-0 animate-wisp-rise"
          style={{ animationDelay: '0s' }}
        >
          <Wisp size={50} color={wispColor} />
        </div>
        <div
          className="absolute right-[16%] bottom-0 animate-wisp-rise"
          style={{ animationDelay: '3s' }}
        >
          <Wisp size={60} color={wispColor} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-center p-6">
        <motion.div
          initial={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
          className="chalk-panel rounded-md px-6 py-7 w-full max-w-sm"
        >
          <div className="text-center mb-3">
            <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              {level.chapterLabel} · Level {levelId}
            </p>
            <h2 className="font-headline italic text-2xl text-secondary mt-1">{level.title}</h2>
            <p className="font-body italic text-[11px] text-on-surface-variant mt-1">
              {movesUsed} moves · {WISP_LABEL[wispColor]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 my-4">
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                initial={reduce ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: reduce ? 0 : 0.6 + n * 0.2, duration: reduce ? 0 : 0.5, ease: 'backOut' }}
              >
                <StarIcon size={40} filled={n <= stars} />
              </motion.div>
            ))}
          </div>

          {level.recipes.length > 1 && (
            <p className="text-center font-body italic text-[11px] text-on-surface-variant mb-3">
              {PATH_LABEL[recipePathId]} ·{' '}
              {stars === 3 ? 'quick hands' : stars === 2 ? 'measured' : 'slow and sure'}
            </p>
          )}

          <div className="mt-3 space-y-2">
            <RewardRow
              icon={<CoinIcon size={18} />}
              label="Coins"
              amount={`+${result.coins}`}
              total={coins}
              accent="secondary"
            />
            {result.gems > 0 && (
              <RewardRow
                icon={<GemIcon size={18} />}
                label="Gems · First Clear"
                amount={`+${result.gems}`}
                total={gems}
                accent="tertiary"
              />
            )}
          </div>

          <div className="mt-4 px-3 py-2 rounded-sm bg-surface-container/70 border-[0.5px] border-primary/20">
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-primary">Power stored</p>
            <p className="font-body text-sm text-on-surface mt-0.5">{recipe.powerUpLabel}</p>
            <p className="font-body italic text-[10px] text-on-surface-variant mt-0.5">
              {recipe.powerUpDetail}
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <button className="btn-descend w-full" onClick={handleContinue}>
              {continueLabel}
            </button>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={handleReplay} aria-label={`Replay level ${levelId}`}>
                Replay
              </button>
              <button className="btn-ghost flex-1" onClick={handleTitle} aria-label="Return to title">
                Title
              </button>
            </div>
          </div>
        </motion.div>

        <p className="font-body italic text-[11px] text-on-surface-variant mt-5 max-w-xs text-center">
          {closingLine}
        </p>
      </div>
    </Frame>
  );
}

function RewardRow({
  icon,
  label,
  amount,
  total,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  amount: string;
  total: number;
  accent: 'secondary' | 'tertiary';
}) {
  return (
    <div className="flex items-center justify-between bg-surface-container-low/70 rounded-sm px-3 py-2 border-[0.5px] border-outline/15">
      <div className="flex items-center gap-2">
        <span className={accent === 'secondary' ? 'text-secondary' : 'text-tertiary'}>{icon}</span>
        <span className="font-body text-sm text-on-surface">{label}</span>
      </div>
      <div className="text-right">
        <p className={`font-headline font-bold text-sm ${accent === 'secondary' ? 'text-secondary' : 'text-tertiary'}`}>
          {amount}
        </p>
        <p className="font-label text-[10px] text-outline">total {total}</p>
      </div>
    </div>
  );
}
