import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Frame } from './Frame';
import { CellBackdrop } from './CellBackdrop';
import { BottomCTA } from './BottomCTA';
import { playMusicBoxNote } from '../game/audio';

// Shared scaffolding for the Scene 01 / 02 / 03 close-the-level moments:
//   * Cell backdrop at the requested opacity.
//   * An off-key music-box note at the configured moment.
//   * A CTA that fades in after `ctaMs` and routes forward on tap.
// The caller supplies the centrepiece (Mira, papers, door) as children.

type NoteSpec = {
  freq: number;
  detuneCents?: number;
  durationMs?: number;
  gain?: number;
  /** When (ms after scene mount) to play the note. */
  delayMs: number;
};

type Props = {
  /** ms before the CTA fades in. Reduced motion collapses to ~900ms. */
  ctaMs: number;
  ctaLabel: string;
  onAdvance: () => void;
  children: ReactNode;
  note?: NoteSpec;
  backdropOpacity?: number;
  /** Show a small Skip affordance from ~800ms. Pass `true` for scenes that
      a returning player may want to bypass on replay. Always off by default
      so first-play scenes aren't trivially skippable. */
  skippable?: boolean;
};

export function TransitionScene({
  ctaMs,
  ctaLabel,
  onAdvance,
  children,
  note,
  backdropOpacity = 0.9,
  skippable = false,
}: Props) {
  const reduce = useReducedMotion();
  const [canAdvance, setCanAdvance] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const ctaTimer = useRef<number | undefined>(undefined);
  const noteTimer = useRef<number | undefined>(undefined);
  const skipTimer = useRef<number | undefined>(undefined);
  // Callers pass `note` as an inline object; without this guard a re-render
  // of the parent would re-run the effect and re-schedule a duplicate note.
  const notePlayedRef = useRef(false);

  // Pull the primitives out so the effect's deps don't depend on a fresh
  // object reference each render — otherwise we'd re-arm everything
  // whenever the parent re-renders for any reason.
  const noteFreq = note?.freq;
  const noteDetune = note?.detuneCents;
  const noteDuration = note?.durationMs;
  const noteGain = note?.gain;
  const noteDelay = note?.delayMs;

  useEffect(() => {
    ctaTimer.current = window.setTimeout(() => setCanAdvance(true), reduce ? 900 : ctaMs);
    if (skippable) {
      skipTimer.current = window.setTimeout(() => setCanSkip(true), reduce ? 400 : 800);
    }
    if (noteFreq !== undefined && noteDelay !== undefined && !notePlayedRef.current) {
      noteTimer.current = window.setTimeout(() => {
        notePlayedRef.current = true;
        playMusicBoxNote({
          freq: noteFreq,
          detuneCents: noteDetune,
          durationMs: noteDuration,
          gain: noteGain,
        });
      }, reduce ? Math.min(noteDelay, 400) : noteDelay);
    }
    return () => {
      if (ctaTimer.current) clearTimeout(ctaTimer.current);
      if (noteTimer.current) clearTimeout(noteTimer.current);
      if (skipTimer.current) clearTimeout(skipTimer.current);
    };
  }, [reduce, ctaMs, skippable, noteFreq, noteDetune, noteDuration, noteGain, noteDelay]);

  return (
    <Frame>
      <CellBackdrop opacity={backdropOpacity} />
      {children}

      {skippable && canSkip && !canAdvance && (
        <button
          className="absolute top-3 right-3 w-11 h-11 inline-flex items-center justify-center text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-label border-[0.5px] border-outline/30 rounded-sm bg-surface-container/60 backdrop-blur-sm z-40"
          onClick={onAdvance}
          aria-label="Skip scene"
        >
          Skip
        </button>
      )}

      {canAdvance && (
        <BottomCTA>
          <motion.button
            className="btn-descend w-full"
            onClick={onAdvance}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7 }}
          >
            {ctaLabel}
          </motion.button>
        </BottomCTA>
      )}
    </Frame>
  );
}
