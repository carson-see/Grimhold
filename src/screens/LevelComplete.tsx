import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { CoinIcon, GemIcon, StarIcon } from '../assets/Icons';
import { Wisp } from '../assets/Wisp';
import { useGame } from '../game/store';

// Level Complete card. Stars + reward + continue. Quiet, not a fanfare —
// per Level Document, Level 1: "No music sting. No fanfare."

export function LevelComplete() {
  // Snapshot the result at mount. Continue/Replay reset the store via
  // resetLevel() which nulls `lastResult` — without this snapshot, the
  // defensive redirect would fire on the same tick and bounce to title.
  const [result] = useState(() => useGame.getState().lastResult);
  const name = useGame((s) => s.name);
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const setScreen = useGame((s) => s.setScreen);
  const resetLevel = useGame((s) => s.resetLevel);
  const reduce = useReducedMotion();

  // True only when a user deep-links to this screen with no prior win.
  useEffect(() => {
    if (!result) setScreen('title');
  }, [result, setScreen]);

  if (!result) return null;

  const { stars, movesUsed } = result;

  const handleContinue = () => {
    setScreen('larder-stub');
    resetLevel();
  };
  const handleReplay = () => {
    setScreen('level');
    resetLevel();
  };

  return (
    <Frame>
      <CellBackdrop opacity={0.6} />

      {/* Ambient drifting wisps — CSS keyframe animation, no per-frame work */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-[12%] bottom-0 animate-wisp-rise" style={{ animationDelay: '0s' }}>
          <Wisp size={50} color="violet" />
        </div>
        <div className="absolute right-[16%] bottom-0 animate-wisp-rise" style={{ animationDelay: '3s' }}>
          <Wisp size={60} color="amber-threaded" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh] items-center justify-center p-6">
        <motion.div
          initial={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
          className="chalk-panel rounded-md px-6 py-8 w-full max-w-sm"
        >
          <div className="text-center mb-4">
            <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              Cell 4 · Sub-Ward One
            </p>
            <h2 className="font-headline italic text-2xl text-secondary mt-1">
              The First Recipe
            </h2>
            <p className="font-body italic text-[11px] text-on-surface-variant mt-1">
              {movesUsed} moves · a violet wisp
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

          <div className="mt-4 space-y-2">
            <RewardRow icon={<CoinIcon size={18} />} label="Coins" amount={`+${result.coins}`} total={coins} accent="secondary" />
            <RewardRow icon={<GemIcon size={18} />} label="Gems · First Clear" amount={`+${result.gems}`} total={gems} accent="tertiary" />
          </div>

          <div className="mt-4 px-3 py-2 rounded-sm bg-surface-container/70 border-[0.5px] border-primary/20">
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-primary">Power stored</p>
            <p className="font-body text-sm text-on-surface mt-0.5">+2 Extra Move Tokens</p>
            <p className="font-body italic text-[10px] text-on-surface-variant mt-0.5">
              For when the cauldrons outnumber you.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <button className="btn-descend w-full" onClick={handleContinue}>Continue</button>
            <button className="btn-ghost w-full" onClick={handleReplay}>Replay</button>
          </div>
        </motion.div>

        <p className="font-body italic text-[11px] text-on-surface-variant mt-5 max-w-xs text-center">
          {name} sat on the floor with the paper that had just slid in.
          She did not pick it up.
        </p>
      </div>
    </Frame>
  );
}

function RewardRow({ icon, label, amount, total, accent }: {
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
