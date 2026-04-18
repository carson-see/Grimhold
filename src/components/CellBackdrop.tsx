import { CellBackground } from '../assets/CellBackground';

// Every screen pins the same stone-cell background behind everything else.
// `opacity` lets the chapter-lit scenes feel different without re-drawing it.
export function CellBackdrop({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0" style={{ opacity }} aria-hidden="true">
      <CellBackground className="w-full h-full" />
    </div>
  );
}
