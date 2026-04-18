import { InkSvg, useAllowMotion } from './Ink';

// Three layers: stone field, ceiling grate, fungus glows in the corners.
// The two fungus pulses are SMIL — gated by useAllowMotion so reduced-motion
// users get a static cell.

export function CellBackground({ className }: { className?: string }) {
  const allowMotion = useAllowMotion();

  return (
    <InkSvg
      size={420}
      height={720}
      viewBox="0 0 420 720"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cellWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0b0a" />
          <stop offset="45%" stopColor="#181815" />
          <stop offset="100%" stopColor="#0a0a09" />
        </linearGradient>
        <radialGradient id="fungusTL" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="rgba(0,223,193,0.35)" />
          <stop offset="70%" stopColor="rgba(0,223,193,0.04)" />
          <stop offset="100%" stopColor="rgba(0,223,193,0)" />
        </radialGradient>
        <radialGradient id="fungusBR" cx="1" cy="1" r="1">
          <stop offset="0%" stopColor="rgba(0,223,193,0.3)" />
          <stop offset="70%" stopColor="rgba(0,223,193,0.03)" />
          <stop offset="100%" stopColor="rgba(0,223,193,0)" />
        </radialGradient>
        <radialGradient id="torchlight" cx="0.5" cy="0" r="0.7">
          <stop offset="0%" stopColor="rgba(255,215,153,0.1)" />
          <stop offset="100%" stopColor="rgba(255,215,153,0)" />
        </radialGradient>
        <pattern id="stoneGrain" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="transparent" />
          <ellipse cx="20" cy="30" rx="0.6" ry="0.4" fill="rgba(255,215,153,0.04)" />
          <ellipse cx="80" cy="55" rx="0.7" ry="0.5" fill="rgba(255,215,153,0.03)" />
          <ellipse cx="50" cy="90" rx="0.5" ry="0.3" fill="rgba(0,223,193,0.05)" />
          <ellipse cx="100" cy="100" rx="0.4" ry="0.3" fill="rgba(255,215,153,0.03)" />
        </pattern>
      </defs>

      <rect width="420" height="720" fill="url(#cellWall)" />
      <rect width="420" height="720" fill="url(#stoneGrain)" />

      {/* Mortar lines — uneven, hand-drawn */}
      <g stroke="rgba(0,0,0,0.6)" strokeWidth="1" fill="none">
        <path d="M0 160 L 90 162 L 180 158 L 260 163 L 340 160 L 420 162" />
        <path d="M0 280 L 70 282 L 150 279 L 230 283 L 320 280 L 420 282" />
        <path d="M0 420 L 80 422 L 160 419 L 250 423 L 340 420 L 420 422" />
        <path d="M0 560 L 60 562 L 140 559 L 220 563 L 310 560 L 420 562" />
        <path d="M90 0 L 92 160" />
        <path d="M220 162 L 220 280" />
        <path d="M140 282 L 140 420" />
        <path d="M300 422 L 300 560" />
        <path d="M180 562 L 180 720" />
      </g>

      <rect width="420" height="720" fill="url(#torchlight)" />

      {/* Ceiling grate — small, very high up */}
      <g transform="translate(180 38)" opacity="0.85">
        <rect x="0" y="0" width="60" height="22" fill="#0a0a09" stroke="#2a2a27" strokeWidth="0.8" />
        <line x1="10" y1="0" x2="10" y2="22" stroke="#3a3633" strokeWidth="1" />
        <line x1="20" y1="0" x2="20" y2="22" stroke="#3a3633" strokeWidth="1" />
        <line x1="30" y1="0" x2="30" y2="22" stroke="#3a3633" strokeWidth="1" />
        <line x1="40" y1="0" x2="40" y2="22" stroke="#3a3633" strokeWidth="1" />
        <line x1="50" y1="0" x2="50" y2="22" stroke="#3a3633" strokeWidth="1" />
        <rect x="0" y="-8" width="60" height="8" fill="rgba(255,215,153,0.06)" />
      </g>

      <rect width="420" height="720" fill="url(#fungusTL)">
        {allowMotion && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="6s" repeatCount="indefinite" />
        )}
      </rect>
      <rect width="420" height="720" fill="url(#fungusBR)">
        {allowMotion && (
          <animate attributeName="opacity" values="1;0.7;1" dur="6.4s" repeatCount="indefinite" />
        )}
      </rect>
    </InkSvg>
  );
}
