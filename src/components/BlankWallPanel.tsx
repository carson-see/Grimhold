import type { LevelConfig } from '../game/types';

// L9 — wall recipe is intentionally absent. Player has the knowledge
// from prior levels and must choose: comply, deviate, or refuse.
// The header sits where RecipePanel would; the same chalk-panel chrome.

export function BlankWallPanel({ level }: { level: LevelConfig }) {
  return (
    <div className="chalk-panel rounded-sm px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="font-label text-[10px] uppercase tracking-[0.22em] text-on-surface-variant/70">
          The wall is blank
        </span>
        <span className="font-body italic text-[10px] text-outline">{level.chapterLabel}</span>
      </div>
      <h2 className="font-headline italic text-secondary text-lg mt-0.5 leading-tight">
        {level.title}
      </h2>
      <p className="font-body italic text-[11px] text-on-surface-variant mt-1 leading-snug">
        Nobody has told you what to do with any of it. You know the system. The cauldrons are waiting.
      </p>
    </div>
  );
}
