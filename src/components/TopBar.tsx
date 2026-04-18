import type { ReactNode } from 'react';
import { GearIcon, HeartIcon, MenuIcon } from '../assets/Icons';

// Tap target ≥44pt — enforced by Tailwind class on every chrome button.
const HIT = 'inline-flex items-center justify-center w-11 h-11';

const HEART_SLOTS = [0, 1, 2, 3, 4] as const;

export function TitleBar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <header
      className="flex items-center justify-between px-2 h-14 relative z-20"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(45,27,78,0.45) 0%, rgba(19,20,17,0) 100%)' }}
    >
      <div className={`${HIT} text-secondary/70 hover:text-primary transition-colors`}>
        {left ?? <MenuIcon />}
      </div>
      <h1 className="ink-title text-lg uppercase">GRIMHOLD</h1>
      <div className={`${HIT} text-secondary/70 hover:text-primary transition-colors`}>
        {right ?? <GearIcon />}
      </div>
    </header>
  );
}

export function HudBar({ lives = 3, movesRemaining }: { lives?: number; movesRemaining: number }) {
  return (
    <div className="flex items-center justify-between px-5 h-14 relative z-20">
      <div className="flex items-center gap-1.5">
        {HEART_SLOTS.map((i) => (
          <HeartIcon key={i} size={15} filled={i < lives} />
        ))}
      </div>
      <h1 className="ink-title text-lg uppercase">GRIMHOLD</h1>
      <div className="font-label text-on-surface/80 text-xs tracking-widest uppercase">
        Moves · <span className="text-secondary text-sm font-bold">{movesRemaining}</span>
      </div>
    </div>
  );
}
