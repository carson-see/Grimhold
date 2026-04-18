// Shared SVG <defs> — gradients, filters, and the base SVG props every
// hand-drawn asset uses. Keep all reusable paint definitions here so we
// don't accumulate per-component duplicates.

import type { ReactNode, SVGProps } from 'react';
import { useReducedMotion } from 'framer-motion';

// SMIL <animate> tags ignore both the global CSS `prefers-reduced-motion`
// rule and framer-motion's `useReducedMotion`. Every animated SVG asset
// calls this hook and gates its SMIL children on the result.
export const useAllowMotion = (): boolean => !useReducedMotion();

export const InkDefs = () => (
  <defs>
    {/* Rough paper-grain filter we apply only to large illustrations.
        Cheap-looking on small chips and expensive on mobile, so callers
        opt in via `noFilter` props on the asset components. */}
    <filter id="ink-grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="2" seed="7" />
      <feDisplacementMap in="SourceGraphic" scale="0.6" />
    </filter>

    {/* Bloom halos */}
    <radialGradient id="teal-bloom" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stopColor="#00dfc1" stopOpacity="0.55" />
      <stop offset="70%" stopColor="#00dfc1" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#00dfc1" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="amber-bloom" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stopColor="#ffd799" stopOpacity="0.55" />
      <stop offset="70%" stopColor="#ffd799" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#ffd799" stopOpacity="0" />
    </radialGradient>

    {/* Stone fill — the cauldron belly and recipe-panel glints reuse this. */}
    <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2a2a27" />
      <stop offset="100%" stopColor="#131411" />
    </linearGradient>

    {/* Mira's costume + ambient aura — centralized so MiraSmudge and MiraBust
        share one source of truth. */}
    <linearGradient id="mira-dress" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2d1b4e" />
      <stop offset="100%" stopColor="#130a26" />
    </linearGradient>
    <linearGradient id="mira-hair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1a1114" />
      <stop offset="100%" stopColor="#0a0608" />
    </linearGradient>
    <radialGradient id="mira-aura" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stopColor="rgba(0,223,193,0.2)" />
      <stop offset="100%" stopColor="rgba(0,223,193,0)" />
    </radialGradient>

    {/* Cauldron-state under-glows — keyed by tint */}
    <radialGradient id="cauldron-glow-neutral" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="rgba(255,215,153,0.25)" />
      <stop offset="80%" stopColor="transparent" />
    </radialGradient>
    <radialGradient id="cauldron-glow-correct" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="rgba(0,223,193,0.55)" />
      <stop offset="80%" stopColor="transparent" />
    </radialGradient>
    <radialGradient id="cauldron-glow-wrong" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="rgba(255,180,171,0.55)" />
      <stop offset="80%" stopColor="transparent" />
    </radialGradient>

    {/* Locked-card silhouette tints */}
    <linearGradient id="silhouette-rogue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1a1107" />
      <stop offset="100%" stopColor="#000000" />
    </linearGradient>
    <linearGradient id="silhouette-scholar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0a1720" />
      <stop offset="100%" stopColor="#000000" />
    </linearGradient>
    <linearGradient id="silhouette-knight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10181a" />
      <stop offset="100%" stopColor="#000000" />
    </linearGradient>
  </defs>
);

// Common SVG attribute set — drop the boilerplate from every asset file.
type InkSvgProps = {
  size: number;
  height?: number;
  viewBox: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'style'>;

export function InkSvg({ size, height, viewBox, className, style, children, ...rest }: InkSvgProps) {
  return (
    <svg
      width={size}
      height={height ?? size}
      viewBox={viewBox}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}
