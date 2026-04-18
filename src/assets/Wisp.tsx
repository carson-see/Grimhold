import { InkSvg, useAllowMotion } from './Ink';
import type { WispColor } from '../game/types';

type Props = { className?: string; size?: number; color?: WispColor };

// Four colors through the act — per Level Doc:
//   violet         → standard wall-recipe clear (L1, L2 wall)
//   amber-threaded → slid-recipe clear (L2 slid)
//   violet-amber   → encounter-perturbed wisp (L3, Bessie present)
//   amber          → reserved for pure human-made wisps; used as ambient
//                    drifting in LevelComplete backgrounds
const PALETTE: Record<WispColor | 'amber', { core: string; mid: string; halo: string; thread?: string }> = {
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
  amber: { core: '#ffd799', mid: '#ffba38', halo: 'rgba(255,215,153,0.55)' },
};

export function Wisp({ className, size = 120, color = 'violet' }: Props) {
  const palette = PALETTE[color as keyof typeof PALETTE] ?? PALETTE.violet;
  const { core, mid, halo, thread } = palette;
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
