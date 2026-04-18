import { useEffect, useState } from 'react';

// Shared countdown for overlays with an epoch-ms deadline. Returns the
// remaining ms, clamped to zero. Calls `onExpire` once when the deadline
// elapses and stops the interval. Used by EncounterModal, MemoryVision,
// ArchitectVoice — any dismissAt-based overlay.
export function useCountdownDismiss(
  deadline: number | null,
  onExpire: () => void,
  intervalMs: number = 100,
): number {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    deadline ? Math.max(0, deadline - Date.now()) : 0,
  );

  useEffect(() => {
    if (!deadline) return;
    let fired = false;
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemainingMs(left);
      if (left <= 0 && !fired) {
        fired = true;
        onExpire();
      }
    };
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [deadline, onExpire, intervalMs]);

  return remainingMs;
}
