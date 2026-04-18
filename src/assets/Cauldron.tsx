import { InkSvg, useAllowMotion } from './Ink';
import type { CauldronStatus } from '../game/store';

type Props = {
  className?: string;
  size?: number;
  tint?: CauldronStatus;
  glowing?: boolean;
};

const RIM_BY_TINT: Record<CauldronStatus, string> = {
  neutral: '#948e99',
  correct: '#00dfc1',
  wrong: '#ffb4ab',
};

const BODY_BY_TINT: Record<CauldronStatus, string> = {
  neutral: '#1c1c19',
  correct: '#0c3b33',
  wrong: '#4a1f14',
};

const SHEEN_BY_TINT: Record<CauldronStatus, string> = {
  neutral: 'rgba(255,215,153,0.25)',
  correct: 'rgba(0,223,193,0.55)',
  wrong: 'rgba(255,180,171,0.55)',
};

export function Cauldron({ className, size = 110, tint = 'neutral', glowing }: Props) {
  const body = BODY_BY_TINT[tint];
  const rim = RIM_BY_TINT[tint];
  const sheen = SHEEN_BY_TINT[tint];
  const allowMotion = useAllowMotion();

  return (
    <InkSvg size={size} height={size * 1.02} viewBox="0 0 120 122" className={className}>
      {glowing && (
        <ellipse cx="60" cy="96" rx="50" ry="14" fill={sheen} opacity="0.6">
          {allowMotion && (
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.6s" repeatCount="indefinite" />
          )}
        </ellipse>
      )}

      <ellipse cx="58" cy="42" rx="44" ry="9" fill="#0e0e0c" stroke={rim} strokeWidth="1.2" />
      <ellipse cx="58" cy="41" rx="42" ry="7" fill="url(#stone)" />

      <ellipse cx="58" cy="42" rx="38" ry="6" fill={body} />
      <ellipse cx="58" cy="41" rx="38" ry="6" fill={`url(#cauldron-glow-${tint})`} />

      <path
        d="M16 44 C 10 70, 20 108, 60 108 C 100 108, 112 70, 104 44 C 96 46, 20 46, 16 44 Z"
        fill={body}
        stroke="#0e0e0c"
        strokeWidth="1.4"
      />

      {/* Stitched belly seam — slightly bowed, deliberately uneven */}
      <path
        d="M60 48 C 58 66, 62 82, 60 104"
        stroke="#3a2a1a"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
        opacity="0.85"
      />

      <path d="M24 60 C 22 74, 28 94, 44 102" stroke="rgba(255,215,153,0.15)" strokeWidth="2" fill="none" />

      <ellipse cx="32" cy="104" rx="1.6" ry="1.2" fill={rim} opacity="0.7" />
      <ellipse cx="60" cy="108" rx="1.8" ry="1.4" fill={rim} opacity="0.7" />
      <ellipse cx="88" cy="104" rx="1.5" ry="1.1" fill={rim} opacity="0.6" />

      <path d="M14 44 C 6 42, 6 52, 14 54" fill="none" stroke={rim} strokeWidth="1.4" />
      <path d="M106 44 C 114 42, 114 52, 106 54" fill="none" stroke={rim} strokeWidth="1.4" />

      <path d="M30 110 L 26 118" stroke="#0e0e0c" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M90 110 L 94 118" stroke="#0e0e0c" strokeWidth="1.4" strokeLinecap="round" />
    </InkSvg>
  );
}
