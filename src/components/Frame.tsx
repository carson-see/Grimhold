import type { ReactNode } from 'react';
import { InkDefs } from '../assets/Ink';

// Every screen is wrapped in <Frame> — it establishes the 420px phone
// viewport, the cavern background tint, and the shared SVG <defs> that
// ingredient/cauldron/wisp art rely on.

export function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grimhold-frame text-on-surface ${className ?? ''}`}>
      {/* Single shared <defs> for every ink/ambient gradient in the app */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <InkDefs />
      </svg>
      {children}
    </div>
  );
}
