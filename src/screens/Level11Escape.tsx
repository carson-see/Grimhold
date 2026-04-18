import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { BottomCTA } from '../components/BottomCTA';
import { InkDivider } from '../components/InkDivider';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';
import {
  ESCAPE_STEPS,
  ESCAPE_OUTCOMES,
  type EscapeChoice,
  type EscapeItemId,
  type EscapeOutcomeId,
  type EscapeStepId,
} from '../data/escape';

// L11 — non-cauldron capstone. A short choice-tree bridging Chapter One
// to Chapter Two. The engine is small on purpose: walk the step graph,
// validate required items, apply grants / consumes, render an outcome
// when reached. Outcomes persist via a new `chapter2Start` flag on the
// store so Chapter Two knows where to pick up.
//
// Per-choice `requires` pulls from TWO sources:
//   1. The "bag" of items granted during L11
//   2. The persistent `store.inventory` (Bessie's key / wall note / Wren crest)
// This lets us gate the "down-the-floor" path on the L10 Bessie key,
// for example, without introducing new coupling.

export function Level11Escape() {
  const setScreen = useGame((s) => s.setScreen);
  const name = useGame((s) => s.name);
  const inventory = useGame((s) => s.inventory);
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const setChapter2Start = useGame((s) => s.setChapter2Start);
  const addEscapeRewards = useGame((s) => s.addEscapeRewards);
  const reduce = useReducedMotion();

  const [stepId, setStepId] = useState<EscapeStepId>('start');
  const [bag, setBag] = useState<EscapeItemId[]>([]);
  const [outcomeId, setOutcomeId] = useState<EscapeOutcomeId | null>(null);
  const committedRef = useRef(false);

  // Carry the persistent inventory into the bag (read-only union).
  // Items in the persistent store count for `requires` checks.
  const carried = useMemo<Set<EscapeItemId>>(() => {
    const s = new Set<EscapeItemId>();
    for (const b of bag) s.add(b);
    for (const inv of inventory) {
      if (inv === 'bessie-key') s.add('bessie-key');
      if (inv === 'wall-note') s.add('wall-note');
      if (inv === 'wren-crest-memory') s.add('wren-crest-memory');
    }
    return s;
  }, [bag, inventory]);

  useEffect(() => {
    playMusicBoxNote({ freq: 293.66, detuneCents: -24, durationMs: 2600, gain: 0.11 });
  }, []);

  useEffect(() => {
    // On outcome, commit rewards + chapter-2-start ONCE. Order matters:
    // addEscapeRewards gates on chapter2Start being null, so it must run
    // before setChapter2Start flips the flag.
    if (!outcomeId || committedRef.current) return;
    committedRef.current = true;
    const data = ESCAPE_OUTCOMES[outcomeId];
    addEscapeRewards(data.coins, data.gems);
    setChapter2Start(outcomeId);
  }, [outcomeId, addEscapeRewards, setChapter2Start]);

  const canPick = (c: EscapeChoice): { ok: boolean; missing: EscapeItemId[] } => {
    const missingAll = (c.requires ?? []).filter((r) => !carried.has(r));
    const anyOk =
      !c.requiresAny || c.requiresAny.length === 0 || c.requiresAny.some((r) => carried.has(r));
    if (missingAll.length === 0 && anyOk) return { ok: true, missing: [] };
    // For UI: surface missing items. requiresAny shows the OR list when
    // none are present.
    const missing = [
      ...missingAll,
      ...(anyOk ? [] : c.requiresAny ?? []),
    ];
    return { ok: false, missing };
  };

  const pick = (c: EscapeChoice) => {
    const avail = canPick(c);
    if (!avail.ok) return;
    // Apply consumes (from bag only; persistent inventory is not consumed here).
    let nextBag = bag;
    if (c.consumes && c.consumes.length > 0) {
      nextBag = nextBag.filter((i) => !c.consumes!.includes(i));
    }
    if (c.grants && c.grants.length > 0) {
      const toAdd = c.grants.filter((g) => !nextBag.includes(g));
      nextBag = [...nextBag, ...toAdd];
    }
    setBag(nextBag);
    if (typeof c.next === 'string') {
      setStepId(c.next);
    } else {
      setOutcomeId(c.next.outcome);
    }
  };

  if (outcomeId) {
    const data = ESCAPE_OUTCOMES[outcomeId];
    return (
      <Frame>
        <CellBackdrop opacity={0.88} />
        <div className="relative z-10 flex flex-col h-[100dvh] px-6 pt-10 pb-28">
          <div className="flex-1 overflow-y-auto">
            <p className="font-label text-[11px] uppercase tracking-[0.28em] text-secondary/85 text-center">
              Chapter One · Closing
            </p>
            <h2 className="font-headline italic text-[28px] leading-tight text-on-surface text-center mt-3">
              {data.title}
            </h2>
            <InkDivider tone="secondary" widthClass="w-20" className="mx-auto mt-4 mb-5" />
            {data.prose.map((p, i) => (
              <motion.p
                key={i}
                className="font-body text-[16px] leading-relaxed text-on-surface/90 mb-4"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : i * 0.6, duration: reduce ? 0 : 0.9 }}
              >
                {p}
              </motion.p>
            ))}

            <div
              className="mt-6 rounded-sm border-[0.5px] border-tertiary/35 bg-tertiary-container/15 p-3"
              role="status"
            >
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-tertiary/90">
                What you carry into Chapter Two
              </p>
              <p className="font-body italic text-[13px] text-on-surface/90 mt-1 leading-snug">
                {data.ch2Hook}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[12px]">
                <span className="text-secondary font-headline">+{data.coins} coins</span>
                <span className="text-tertiary font-headline">+{data.gems} gems</span>
                <span className="text-outline font-label text-[10px] ml-auto">
                  Totals now {coins + data.coins}c · {gems + data.gems}g
                </span>
              </div>
            </div>
          </div>
        </div>

        <BottomCTA>
          <button
            className="btn-descend w-full"
            onClick={() => setScreen('larder-stub')}
          >
            The Larder · Chapter Two Awaits
          </button>
        </BottomCTA>
      </Frame>
    );
  }

  const step = ESCAPE_STEPS[stepId];
  return (
    <Frame>
      <CellBackdrop opacity={0.82} />
      <div className="relative z-10 flex flex-col h-[100dvh] px-6 pt-10 pb-4">
        <p className="font-label text-[11px] uppercase tracking-[0.28em] text-secondary/85 text-center">
          Level 11 · The Door That Wasn't Locked
        </p>
        <h2 className="font-headline italic text-[22px] leading-tight text-on-surface text-center mt-3">
          {step.heading}
        </h2>
        <InkDivider tone="secondary" widthClass="w-16" className="mx-auto mt-4 mb-5" />

        <div className="flex-1 overflow-y-auto">
          {step.prose.map((p, i) => (
            <p
              key={i}
              className="font-body text-[15px] leading-relaxed text-on-surface/90 mb-3"
            >
              {p.replace(/\{name\}/g, name)}
            </p>
          ))}

          {/* Bag — what you're carrying */}
          {bag.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {bag.map((b) => (
                <span
                  key={b}
                  className="rounded-sm border-[0.5px] border-secondary/40 bg-secondary-container/15 text-secondary px-2 py-1 text-[11px] font-label uppercase tracking-[0.18em]"
                >
                  {ITEM_LABEL[b]}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 space-y-2">
            {step.choices.map((c) => {
              const avail = canPick(c);
              return (
                <button
                  key={c.id}
                  onClick={() => pick(c)}
                  disabled={!avail.ok}
                  aria-label={`${c.label}. ${c.blurb}`}
                  className={[
                    'w-full text-left p-3 rounded-sm border-[0.5px] min-h-[44px]',
                    avail.ok
                      ? 'border-outline/30 bg-surface-container-low/60 hover:border-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60'
                      : 'border-outline-variant/30 bg-surface-container-lowest/40 opacity-55 cursor-not-allowed',
                  ].join(' ')}
                >
                  <p className="font-headline text-[15px] text-on-surface leading-snug">
                    {c.label}
                  </p>
                  <p className="font-body italic text-[12px] text-on-surface-variant mt-1 leading-snug">
                    {c.blurb}
                  </p>
                  {!avail.ok && avail.missing.length > 0 && (
                    <p className="font-label text-[10px] uppercase tracking-[0.18em] text-error/85 mt-1">
                      Need: {avail.missing.map((m) => ITEM_LABEL[m]).join(' · ')}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Frame>
  );
}

const ITEM_LABEL: Record<EscapeItemId, string> = {
  'bessie-key': "Bessie's key",
  'wall-note': 'The wall note',
  'wren-crest-memory': "Wren's crest",
  'smudge-feather': "Smudge's feather",
  'kitchen-rag': 'Kitchen rag',
  'iron-pin': 'Iron pin',
  'silver-thread': 'Silver thread',
  'prologue-tonic': "Bessie's vial",
};
