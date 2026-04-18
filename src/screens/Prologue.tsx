import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { BottomCTA } from '../components/BottomCTA';
import { InkDivider } from '../components/InkDivider';
import { useGame } from '../game/store';
import { playMusicBoxNote } from '../game/audio';

// Pre-Scene-00 exposition — 4 cards that orient a first-time player on
// what Grimhold is, who Mira is, and why Smudge matters. First-play only;
// returning players skip to the smart-resume CTA.
//
// Tone rule (from the story doc): don't perform sympathy, don't dramatise.
// Let the facts sit. The kingdom calls itself light. She was three days
// from proving otherwise. Smudge was there before she woke.

type Card = {
  heading: string;
  body: string;
  /** ms to hold this card before advancing. */
  holdMs: number;
  /** Optional italic attribution / caption below body. */
  footer?: string;
};

const CARDS: Card[] = [
  {
    heading: 'Lumara',
    body: 'The kingdom that called itself light. White stone palace. Beautiful festivals. Smiling citizens.',
    footer: 'It is named after the light. It requires the light to be fed.',
    holdMs: 5200,
  },
  {
    heading: 'At every festival, a tonic',
    body: "At every school, a tonic. At every funeral, a tonic. They were told it was civic health. They were told it was a kindness.",
    footer: 'The tonics were taking their memories.',
    holdMs: 5600,
  },
  {
    heading: 'Mira Ashveil, age 11',
    body: "Curious. Irreverent. Finds the dark funny. Talks to things that don't talk back, because they usually answer. She was three days from publishing proof.",
    footer: 'They came for her at night.',
    holdMs: 6000,
  },
  {
    heading: 'Grimhold',
    body: "Underneath the white palace. Not a prison — a workshop. The prisoners brew potions toward a freedom they are told is one thousand completed potions away. None of the numbers are true.",
    footer: 'Somewhere in Cell 4, a raven is waiting for her.',
    holdMs: 6400,
  },
];

export function Prologue() {
  const setScreen = useGame((s) => s.setScreen);
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const advanceTimer = useRef<number | undefined>(undefined);
  const notePlayedRef = useRef(false);

  const total = CARDS.length;
  const card = CARDS[idx];

  useEffect(() => {
    // Play the music-box opening note on mount, once.
    if (!notePlayedRef.current) {
      notePlayedRef.current = true;
      playMusicBoxNote({ freq: 329.63, detuneCents: -20, durationMs: 2400, gain: 0.1 });
    }
  }, []);

  useEffect(() => {
    if (reduce) {
      advanceTimer.current = window.setTimeout(next, 2000);
    } else {
      advanceTimer.current = window.setTimeout(next, card.holdMs);
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, reduce]);

  function next() {
    if (idx >= total - 1) {
      setScreen('character-select');
      return;
    }
    setIdx((i) => i + 1);
  }

  function skip() {
    setScreen('character-select');
  }

  return (
    <Frame>
      {/* Black-on-black background with a single slow ambient glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(45,27,78,0.28) 0%, rgba(19,20,17,0.98) 60%, rgba(10,10,9,1) 100%)',
        }}
      />

      {/* Progress dots — subtle, four ticks */}
      <div className="absolute top-6 left-0 right-0 z-20 flex justify-center gap-2">
        {CARDS.map((_, i) => (
          <span
            key={i}
            className={[
              'block h-[3px] w-8 rounded-sm transition-all',
              i < idx
                ? 'bg-secondary/50'
                : i === idx
                  ? 'bg-secondary'
                  : 'bg-outline/25',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Skip — top-right, small but always available */}
      <button
        onClick={skip}
        className="absolute top-5 right-5 w-11 h-11 inline-flex items-center justify-center text-[11px] font-label uppercase tracking-[0.2em] text-on-surface-variant/80 hover:text-on-surface border-[0.5px] border-outline/30 rounded-sm bg-surface-container/50 backdrop-blur-sm z-20"
        aria-label="Skip prologue"
      >
        Skip
      </button>

      <div
        className="relative z-10 flex flex-col items-center justify-center h-[100dvh] px-7"
        onClick={next}
        role="button"
        aria-label="Tap to continue"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            next();
          }
        }}
      >
        <motion.div
          key={idx}
          className="max-w-md w-full text-center"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduce ? 0 : 1.0, ease: 'easeOut' }}
        >
          <p className="font-label text-[11px] uppercase tracking-[0.32em] text-secondary/75 mb-3">
            Chapter One · Before
          </p>
          <h2 className="font-headline italic text-[28px] leading-tight text-on-surface">
            {card.heading}
          </h2>
          <InkDivider tone="secondary" widthClass="w-16" className="mx-auto mt-4 mb-5" />
          <p className="font-body text-[16px] leading-relaxed text-on-surface/90">
            {card.body}
          </p>
          {card.footer && (
            <p className="font-body italic text-[13px] text-on-surface-variant/85 mt-4 leading-relaxed">
              {card.footer}
            </p>
          )}
        </motion.div>

        <motion.p
          className="absolute bottom-24 left-0 right-0 text-center font-label uppercase tracking-[0.28em] text-outline text-[10px]"
          initial={reduce ? { opacity: 0.6 } : { opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: reduce ? 0 : 1.8, duration: reduce ? 0 : 0.8 }}
        >
          Tap anywhere · {idx + 1} of {total}
        </motion.p>
      </div>

      <BottomCTA>
        <button
          className="btn-descend w-full"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          {idx === total - 1 ? 'Begin' : 'Continue'}
        </button>
      </BottomCTA>
    </Frame>
  );
}
