import { InkSvg, useAllowMotion } from './Ink';
import type { WispColor } from '../game/types';

type Props = { className?: string; size?: number; color?: WispColor };

// Wisp colors through Act One per Level Doc:
//   violet         → standard wall-recipe clear (L1, L2 wall, L5 wall)
//   amber-threaded → slid-recipe clear (L2 slid, L9 partial deviation)
//   violet-amber   → encounter-perturbed wisp (L3, Bessie present)
//   violet-dark    → memory-vision wisp (L4 — grief-resonance darkening)
//   violet-strong  → Architect-noticed wisp (L6, L8, L10 — cleaner output)
//   violet-grey    → joint sync with Aldric (L7, L8, L10)
//   downward-grey  → the wisp that doesn't rise (L5, Unknown in Left)
//   black          → L9 refusal — circles the room and returns to cauldron
//   silent         → L9 hard refusal stub (no wisp at all; Wisp screen
//                    suppresses render and the palette entry is unused)
const PALETTE: Record<WispColor, { core: string; mid: string; halo: string; thread?: string }> = {
  violet: { core: '#d2bcfa', mid: '#9783bd', halo: 'rgba(210,188,250,0.55)' },
  'amber-threaded': {
    core: '#d2bcfa',
    mid: '#9783bd',
    halo: 'rgba(210,188,250,0.5)',
    thread: '#ffd799',
  },
  'violet-amber': {
    core: '#e4d5fb',
    mid: '#b8a7de',
    halo: 'rgba(255,215,153,0.35)',
    thread: '#ffba38',
  },
  'violet-dark': {
    core: '#b49bdb',
    mid: '#5e4f7a',
    halo: 'rgba(90,72,120,0.55)',
    thread: '#2a1e3a',
  },
  'violet-strong': {
    core: '#e7d6ff',
    mid: '#a786d8',
    halo: 'rgba(167,134,216,0.7)',
  },
  'violet-grey': {
    // Aldric's contribution — warm grey threading through the violet.
    core: '#d2bcfa',
    mid: '#9783bd',
    halo: 'rgba(154,138,122,0.45)',
    thread: '#9a8a7a',
  },
  'downward-grey': {
    core: '#babac0',
    mid: '#6b6670',
    halo: 'rgba(107,102,112,0.55)',
  },
  black: {
    // The wisp that circles back. Almost-black with a faint violet edge.
    core: '#3a2a4a',
    mid: '#1a0e2b',
    halo: 'rgba(20,14,30,0.7)',
  },
  silent: {
    // Defensive entry — Wisp.tsx skips rendering on silent paths, but the
    // type system still requires a record entry.
    core: 'transparent',
    mid: 'transparent',
    halo: 'transparent',
  },
};

export function Wisp({ className, size = 120, color = 'violet' }: Props) {
  const { core, mid, halo, thread } = PALETTE[color];
  const allowMotion = useAllowMotion();

  return (
    <InkSvg size={size} height={size * 1.6} viewBox="0 0 120 192" className={className}>
      <ellipse cx="60" cy="92" rx="54" ry="68" fill={halo}>
        {allowMotion && (
          <animate attributeName="rx" values="50;58;50" dur="3.8s" repeatCount="indefinite" />
        )}
      </ellipse>
      <path
        d="M60 24 C 42 60, 40 92, 54 118 C 62 130, 76 128, 82 116 C 92 92, 84 58, 60 24 Z"
        fill={mid}
        opacity="0.9"
      >
        {allowMotion && (
          <animate
            attributeName="d"
            values="
              M60 24 C 42 60, 40 92, 54 118 C 62 130, 76 128, 82 116 C 92 92, 84 58, 60 24 Z;
              M60 22 C 38 54, 42 92, 52 118 C 62 132, 78 130, 84 114 C 94 92, 80 54, 60 22 Z;
              M60 24 C 42 60, 40 92, 54 118 C 62 130, 76 128, 82 116 C 92 92, 84 58, 60 24 Z
            "
            dur="3.6s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path d="M60 40 C 50 66, 50 96, 60 116 C 70 98, 72 68, 60 40 Z" fill={core} opacity="0.85" />

      {/* Amber thread — drawn only for dual-color wisps. A slender ribbon
          winding through the violet body, slowly animating its opacity. */}
      {thread && (
        <path
          d="M58 40 C 64 58, 52 76, 62 96 C 70 110, 56 124, 60 138"
          stroke={thread}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        >
          {allowMotion && (
            <animate attributeName="opacity" values="0.4;0.85;0.4" dur="4.4s" repeatCount="indefinite" />
          )}
        </path>
      )}

      <ellipse cx="60" cy="148" rx="2.6" ry="2.2" fill={core} opacity="0.8">
        {allowMotion && (
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
        )}
      </ellipse>
      <ellipse cx="66" cy="168" rx="1.8" ry="1.4" fill={mid} opacity="0.7">
        {allowMotion && (
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.3s" repeatCount="indefinite" />
        )}
      </ellipse>
    </InkSvg>
  );
}
