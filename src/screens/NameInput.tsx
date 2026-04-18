import { motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { BottomCTA } from '../components/BottomCTA';
import { TitleBar } from '../components/TopBar';
import { ChevronLeft } from '../assets/Icons';
import { useGame } from '../game/store';

export function NameInputScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const setName = useGame((s) => s.setName);
  const existing = useGame((s) => s.name);
  const [draft, setDraft] = useState(existing || 'Mira');
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  const inputId = useId();

  const submit = () => {
    setName(draft);
    setScreen('scene-00');
  };

  return (
    <Frame>
      <CellBackdrop opacity={0.7} />

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <TitleBar
          left={
            <button
              onClick={() => setScreen('character-select')}
              aria-label="Back to character select"
              className="w-11 h-11 inline-flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
          }
        />

        <main className="flex-1 flex flex-col justify-center px-8 pb-32">
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h2 className="font-headline italic text-2xl text-on-surface font-semibold">
              What will the stone remember you by?
            </h2>
            <p className="font-body italic text-on-surface-variant text-xs mt-3 leading-relaxed">
              The Architect's file lists you as <span className="text-secondary not-italic">Ashveil, M.</span>
              <br />
              It needn't be correct.
            </p>
          </motion.div>

          <div className="space-y-2">
            <label
              htmlFor={inputId}
              className="block text-center font-label text-[11px] uppercase tracking-[0.24em] text-on-surface-variant"
            >
              Seeker's Name
            </label>
            <div className="relative">
              <input
                id={inputId}
                className="w-full bg-transparent text-center font-headline text-3xl py-3 text-on-surface focus:outline-none"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={20}
                autoComplete="off"
                spellCheck={false}
              />
              <div
                className={[
                  'absolute left-0 right-0 bottom-1 h-px transition-all',
                  focused
                    ? 'bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_#00dfc1]'
                    : 'bg-gradient-to-r from-transparent via-outline-variant to-transparent',
                ].join(' ')}
              />
              {/* Tapered ink ends — Design Bible Vol 2 §5 */}
              <span className="absolute left-4 bottom-0 h-2 w-px bg-outline-variant/40 rotate-12" />
              <span className="absolute right-4 bottom-0 h-2 w-px bg-outline-variant/40 -rotate-12" />
            </div>
          </div>
        </main>

        <BottomCTA>
          <button
            className="btn-descend w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={submit}
            disabled={!draft.trim()}
            aria-disabled={!draft.trim()}
          >
            Enter the Cell
          </button>
        </BottomCTA>
      </div>
    </Frame>
  );
}
