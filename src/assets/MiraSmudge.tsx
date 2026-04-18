// Mira + Smudge — the protagonist and her soot-covered raven.
// Compliance (PRD §03 Feedback 2): no physical aging, no grey hair, no
// sunken eyes. State is communicated by posture, hair animation, Smudge
// position, and eye-blink rate. v0 renders the bright "3-star" pose.

import { InkSvg, useAllowMotion } from './Ink';

type Props = { className?: string; size?: number };

export function MiraSmudge({ className, size = 180 }: Props) {
  const allowMotion = useAllowMotion();

  return (
    <InkSvg size={size} height={size * 1.45} viewBox="0 0 160 232" className={className}>
      {/* faint teal aura — Smudge and Mira are the only warmth in the cell */}
      <ellipse cx="80" cy="120" rx="72" ry="100" fill="url(#mira-aura)" />

      <path
        d="M50 118 C 36 160, 28 200, 34 222 C 48 228, 110 228, 124 222 C 130 200, 124 162, 108 118 C 98 130, 60 130, 50 118 Z"
        fill="url(#mira-dress)"
        stroke="#0e0e0c"
        strokeWidth="1.2"
      />
      <path
        d="M34 222 L 38 226 L 44 222 L 52 228 L 62 224 L 72 228 L 82 224 L 92 228 L 102 222 L 114 228 L 124 222"
        stroke="#0e0e0c"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Single gold button — Design Bible Vol 2 §2 (Mira's Second Dress reference) */}
      <ellipse cx="80" cy="134" rx="2.4" ry="2" fill="#ffd799" />

      <path d="M66 114 L 80 120 L 94 114 L 92 124 L 80 128 L 68 124 Z" fill="#130a26" stroke="#0e0e0c" strokeWidth="0.8" />

      {/* Neck — a touch too long, intentional */}
      <path d="M74 112 L 74 96 L 86 96 L 86 112 Z" fill="#e8d1c4" />

      <path
        d="M62 78 C 60 60, 70 46, 80 46 C 92 46, 100 60, 98 80 C 96 94, 88 100, 80 100 C 72 100, 64 92, 62 78 Z"
        fill="#eed6c7"
        stroke="#3a2b1e"
        strokeWidth="0.6"
      />

      <path
        d="M58 62 C 54 48, 62 32, 80 30 C 96 30, 104 44, 104 62 C 106 76, 100 94, 96 98 C 94 88, 96 78, 92 74 C 86 72, 74 72, 70 74 C 64 78, 66 88, 64 98 C 58 90, 54 76, 58 62 Z"
        fill="url(#mira-hair)"
      >
        {allowMotion && (
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.2; 0 0" dur="4.2s" repeatCount="indefinite" />
        )}
      </path>
      <path d="M68 58 C 74 62, 82 60, 90 58" stroke="#0a0608" strokeWidth="1" fill="none" />

      {/* Eyes — wide ellipses, not circles. Each blinks on its own clock. */}
      <ellipse cx="72" cy="76" rx="3.6" ry="4.2" fill="#0e0e0c">
        {allowMotion && (
          <animate attributeName="ry" values="4.2;0.4;4.2" dur="5.8s" repeatCount="indefinite" />
        )}
      </ellipse>
      <ellipse cx="88" cy="76" rx="3.6" ry="4.2" fill="#0e0e0c">
        {allowMotion && (
          <animate attributeName="ry" values="4.2;4.2;0.4;4.2" dur="7.2s" repeatCount="indefinite" />
        )}
      </ellipse>
      <ellipse cx="73" cy="75" rx="0.9" ry="0.7" fill="#e5e2dd" />
      <ellipse cx="89" cy="75" rx="0.9" ry="0.7" fill="#e5e2dd" />

      <path d="M80 82 L 79 88 L 82 88" stroke="#b6998a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M75 92 C 78 94, 82 93, 85 92" stroke="#6b4230" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* Arms — spindly */}
      <path d="M58 124 C 48 146, 46 168, 50 184" stroke="url(#mira-dress)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M102 122 C 114 140, 116 162, 112 178" stroke="url(#mira-dress)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="49" cy="186" rx="3.4" ry="3" fill="#eed6c7" />
      <ellipse cx="113" cy="180" rx="3.4" ry="3" fill="#eed6c7" />

      {/* SMUDGE — on her right shoulder, ragged feathers */}
      <g transform="translate(92 96)">
        <path d="M-2 4 C -6 0, -4 -8, 4 -10 C 14 -12, 22 -6, 22 4 C 22 12, 14 18, 4 16 C -4 14, -6 10, -2 4 Z" fill="#0e0e0c" stroke="#2a2a27" strokeWidth="0.6" />
        <path d="M6 -4 C 14 -8, 22 -6, 24 0 C 22 6, 14 8, 6 4 Z" fill="#1c1c19">
          {allowMotion && (
            <animateTransform attributeName="transform" type="rotate" values="0 8 0; -6 8 0; 0 8 0" dur="5.2s" repeatCount="indefinite" />
          )}
        </path>
        <path d="M-2 4 L -8 8 L -4 10 L -8 12" stroke="#0e0e0c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M22 -4 L 30 -6 L 22 -1 Z" fill="#3a2a1a" />
        <ellipse cx="16" cy="-5" rx="1.5" ry="1.3" fill="#ffd799">
          {allowMotion && (
            <animate attributeName="ry" values="1.3;0.2;1.3" dur="6.4s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="-4" cy="-4" rx="0.8" ry="0.6" fill="#0e0e0c" opacity="0.5" />
        <ellipse cx="26" cy="8" rx="0.6" ry="0.4" fill="#0e0e0c" opacity="0.6" />
      </g>
    </InkSvg>
  );
}

// Mira plus an extra long arm reaching for the grate — the Scene 01 pose.
export function MiraReaching({ className, size = 230 }: Props) {
  return (
    <div className={`relative ${className ?? ''}`} aria-hidden="true">
      <MiraSmudge size={size} />
      <InkSvg
        size={60}
        height={110}
        viewBox="0 0 60 110"
        className="absolute pointer-events-none"
        style={{ top: -50, left: 'calc(50% - 6px)' }}
      >
        <path d="M30 110 C 26 80, 22 50, 28 10" stroke="#2d1b4e" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="28" cy="10" rx="4.2" ry="3.6" fill="#eed6c7" />
      </InkSvg>
    </div>
  );
}

export function MiraBust({ className, size = 56 }: Props) {
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className}>
      <ellipse cx="32" cy="32" rx="30" ry="29" fill="url(#mira-aura)" opacity="0.5" />
      <path d="M14 54 C 18 46, 26 44, 32 44 C 38 44, 46 46, 50 54 Z" fill="url(#mira-dress)" />
      <rect x="29" y="38" width="6" height="8" fill="#eed6c7" />
      <ellipse cx="32" cy="30" rx="13" ry="15" fill="#eed6c7" />
      <path d="M18 30 C 16 14, 30 10, 44 14 C 50 22, 48 38, 46 40 C 44 32, 40 30, 32 30 C 24 30, 20 32, 18 40 Z" fill="url(#mira-hair)" />
      <ellipse cx="26" cy="30" rx="1.6" ry="2" fill="#0e0e0c" />
      <ellipse cx="38" cy="30" rx="1.6" ry="2" fill="#0e0e0c" />
      <ellipse cx="46" cy="46" rx="5" ry="3.6" fill="#0e0e0c" />
      <ellipse cx="49" cy="45" rx="0.7" ry="0.6" fill="#ffd799" />
    </InkSvg>
  );
}
