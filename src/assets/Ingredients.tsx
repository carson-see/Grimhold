// Hand-drawn ingredient SVGs for Act One, Chapter One, Levels 1–3.
//   L1: Moonbloom, Ashroot, Coldstone, Emberpetal.
//   L2 adds: Darkspore.
//   L3 adds: Silvermoss.
// Every asset is asymmetric — petals lean, facets mismatch, eye gleams use
// ellipses (no perfect circles per visual-direction rule).
// `noFilter` skips the expensive ink-grain feTurbulence at small sizes;
// the displacement is invisible below ~32px anyway.

import { InkSvg } from './Ink';
import type { IngredientId } from '../game/types';

type Props = { className?: string; size?: number; dim?: boolean; noFilter?: boolean };

const FILTER_SIZE_THRESHOLD = 32; // below this, the displacement is invisible

function Moonbloom({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        <ellipse cx="32" cy="33" rx="22" ry="20" fill="url(#teal-bloom)" />
        <path d="M32 10 C 38 14, 40 22, 35 28 C 31 25, 30 18, 32 10 Z" fill="#e5e2dd" opacity="0.85" stroke="#cbc4d0" strokeWidth="0.6" />
        <path d="M50 20 C 52 27, 48 33, 40 33 C 39 28, 43 22, 50 20 Z" fill="#cbc4d0" opacity="0.75" stroke="#948e99" strokeWidth="0.5" />
        <path d="M47 44 C 42 48, 34 46, 33 39 C 39 38, 45 40, 47 44 Z" fill="#e5e2dd" opacity="0.8" stroke="#cbc4d0" strokeWidth="0.5" />
        <path d="M20 48 C 16 43, 20 36, 27 36 C 29 41, 26 46, 20 48 Z" fill="#cbc4d0" opacity="0.7" stroke="#948e99" strokeWidth="0.5" />
        <path d="M14 24 C 20 20, 27 22, 28 28 C 23 31, 17 30, 14 24 Z" fill="#e5e2dd" opacity="0.85" stroke="#cbc4d0" strokeWidth="0.5" />
        {/* pistil — slightly oval, off-center */}
        <ellipse cx="30" cy="31" rx="3.6" ry="3.2" fill="#00dfc1" opacity="0.85" />
        <ellipse cx="30" cy="31" rx="1.5" ry="1.3" fill="#26fedc" />
      </g>
    </InkSvg>
  );
}

function Ashroot({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        <path d="M30 8 C 33 16, 28 22, 32 30 C 36 38, 30 44, 34 54" fill="none" stroke="#3a2b1e" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 30 C 24 34, 18 40, 14 52" fill="none" stroke="#2e2116" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M32 30 C 42 33, 48 40, 50 52" fill="none" stroke="#3a2b1e" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14 52 l -3 5" stroke="#5a4430" strokeWidth="1" strokeLinecap="round" />
        <path d="M50 52 l 3 4" stroke="#5a4430" strokeWidth="1" strokeLinecap="round" />
        <path d="M34 54 l 2 4" stroke="#5a4430" strokeWidth="1" strokeLinecap="round" />
        <path d="M31 14 l 1 4" stroke="#6b4f34" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M33 22 l 1 3" stroke="#6b4f34" strokeWidth="0.6" strokeLinecap="round" />
      </g>
    </InkSvg>
  );
}

function Coldstone({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        <ellipse cx="32" cy="36" rx="20" ry="16" fill="url(#teal-bloom)" opacity="0.5" />
        <path d="M22 50 L 18 30 L 28 12 L 40 18 L 46 34 L 38 52 Z" fill="#4a6a7a" stroke="#0e0e0c" strokeWidth="0.8" />
        <path d="M28 12 L 40 18 L 32 28 Z" fill="#7aa3b4" opacity="0.9" />
        <path d="M22 50 L 18 30 L 26 32 Z" fill="#2f4552" opacity="0.8" />
        <path d="M40 18 L 46 34 L 34 30 Z" fill="#5a7f90" opacity="0.85" />
        <path d="M24 14 L 28 12" stroke="#cbe7ee" strokeWidth="1" strokeLinecap="round" />
        <path d="M42 22 L 46 34" stroke="#cbe7ee" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
      </g>
    </InkSvg>
  );
}

function Emberpetal({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        <ellipse cx="32" cy="34" rx="22" ry="18" fill="url(#amber-bloom)" />
        <path d="M14 38 C 10 22, 22 8, 40 12 C 52 16, 56 32, 44 48 C 34 56, 20 52, 14 38 Z" fill="#7a2f10" stroke="#1a0a04" strokeWidth="0.8" />
        <path d="M20 36 C 18 24, 26 16, 38 18 C 46 22, 48 32, 40 42 C 32 48, 24 46, 20 36 Z" fill="#b8551e" opacity="0.9" />
        {/* ember core — slightly oval, offset right of center */}
        <ellipse cx="35" cy="32" rx="6.6" ry="6" fill="#ffb65a" />
        <ellipse cx="35" cy="32" rx="3.1" ry="2.7" fill="#ffe2b2" />
        <path d="M14 38 L 10 44" stroke="#0e0e0c" strokeWidth="1" strokeLinecap="round" />
      </g>
    </InkSvg>
  );
}

// DARKSPORE — near-black seedpod, mottled, splits open at the top with a
// ring of fine spores leaking sideways. Introduced Level 2 per the doc.
function Darkspore({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        {/* faint dark halo */}
        <ellipse cx="32" cy="36" rx="20" ry="16" fill="#2d1b4e" opacity="0.35" />
        {/* main pod — ovoid, leaning slightly */}
        <path
          d="M22 14 C 14 22, 14 42, 22 52 C 30 58, 40 56, 46 50 C 52 40, 50 22, 42 14 C 34 10, 28 10, 22 14 Z"
          fill="#0e0e0c"
          stroke="#2a2a27"
          strokeWidth="0.8"
        />
        {/* split seam down the front */}
        <path d="M32 12 C 30 24, 34 36, 32 52" stroke="#1c1c19" strokeWidth="1.2" fill="none" />
        {/* spore puff at the crown */}
        <ellipse cx="32" cy="14" rx="6" ry="2.4" fill="#3a2a1a" opacity="0.7" />
        <ellipse cx="38" cy="11" rx="1.2" ry="0.8" fill="#5a4430" opacity="0.6" />
        <ellipse cx="26" cy="11" rx="1" ry="0.7" fill="#5a4430" opacity="0.55" />
        <ellipse cx="44" cy="9" rx="0.8" ry="0.5" fill="#6b5a49" opacity="0.5" />
        {/* dim violet flecks — the only color */}
        <ellipse cx="28" cy="32" rx="1.4" ry="1.1" fill="#4f3d72" opacity="0.7" />
        <ellipse cx="38" cy="40" rx="1.1" ry="0.9" fill="#4f3d72" opacity="0.6" />
      </g>
    </InkSvg>
  );
}

// SILVERMOSS — silver-green moss tendrils splayed asymmetrically, a few
// hanging strands. Introduced Level 2 per the doc.
function Silvermoss({ className, size = 44, dim, noFilter }: Props) {
  const useFilter = !noFilter && size >= FILTER_SIZE_THRESHOLD;
  return (
    <InkSvg size={size} viewBox="0 0 64 64" className={className} style={{ opacity: dim ? 0.4 : 1 }}>
      <g filter={useFilter ? 'url(#ink-grain)' : undefined}>
        {/* halo */}
        <ellipse cx="32" cy="34" rx="22" ry="18" fill="#a8c5b8" opacity="0.18" />
        {/* central clump */}
        <path
          d="M16 34 C 14 22, 22 16, 32 16 C 44 16, 50 24, 48 36 C 46 46, 36 50, 28 48 C 20 46, 16 42, 16 34 Z"
          fill="#7a9a8a"
          stroke="#3a4a42"
          strokeWidth="0.8"
        />
        {/* moss tufts */}
        <path d="M22 22 C 26 18, 30 18, 32 22" stroke="#a8c5b8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M36 20 C 40 22, 42 26, 42 28" stroke="#a8c5b8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M20 38 C 22 42, 24 44, 28 46" stroke="#a8c5b8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M40 40 C 44 38, 46 36, 48 34" stroke="#a8c5b8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* hanging strands */}
        <path d="M22 48 L 20 56" stroke="#7a9a8a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M30 50 L 30 58" stroke="#7a9a8a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M40 48 L 42 56" stroke="#7a9a8a" strokeWidth="1.6" strokeLinecap="round" />
        {/* a single silver-bright spore */}
        <ellipse cx="34" cy="30" rx="1.6" ry="1.4" fill="#cbe7d5" />
      </g>
    </InkSvg>
  );
}

export function IngredientSvg({ id, className, size, dim, noFilter }: Props & { id: IngredientId }) {
  switch (id) {
    case 'moonbloom': return <Moonbloom className={className} size={size} dim={dim} noFilter={noFilter} />;
    case 'ashroot': return <Ashroot className={className} size={size} dim={dim} noFilter={noFilter} />;
    case 'coldstone': return <Coldstone className={className} size={size} dim={dim} noFilter={noFilter} />;
    case 'emberpetal': return <Emberpetal className={className} size={size} dim={dim} noFilter={noFilter} />;
    case 'darkspore': return <Darkspore className={className} size={size} dim={dim} noFilter={noFilter} />;
    case 'silvermoss': return <Silvermoss className={className} size={size} dim={dim} noFilter={noFilter} />;
  }
}

export const INGREDIENT_NAMES: Record<IngredientId, string> = {
  moonbloom: 'Moonbloom',
  ashroot: 'Ashroot',
  coldstone: 'Coldstone',
  emberpetal: 'Emberpetal',
  darkspore: 'Darkspore',
  silvermoss: 'Silvermoss',
};

export const INGREDIENT_ORDER: IngredientId[] = [
  'moonbloom', 'ashroot', 'coldstone', 'emberpetal', 'darkspore', 'silvermoss',
];
