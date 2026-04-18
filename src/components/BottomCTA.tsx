import type { ReactNode } from 'react';

// Bottom anchor used by 4 screens: a fade-up scrim + the CTA(s) above it.
// The scrim hides any content scrolling underneath without a hard line.
export function BottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-5 z-30 bg-gradient-to-t from-background via-background/90 to-transparent">
      {children}
    </div>
  );
}
