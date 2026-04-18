// Single off-key music-box note via Web Audio.
// Source: docs/grimhold_level_document.docx, Level 1 Narrative Close:
//   "A single music-box note — slightly off-key — and the screen clears."
// And docs/grimhold_transition_scenes.docx, Scene 00:
//   "Dripping water fades under a single low music-box note. Slightly off-key."
// Generated at runtime so we ship zero audio assets. The note is detuned
// ~18 cents flat to give it the faint wrongness the doc calls for.

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // iOS requires a resume triggered from a user gesture.
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {});
  }
  return ctx;
}

// HMR cleanup: close the AudioContext on Vite hot-replace so dev sessions
// don't accumulate contexts toward the per-tab limit (~6 in Chromium).
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void ctx?.close().catch(() => {});
    ctx = null;
  });
}

export function playMusicBoxNote(opts: {
  freq?: number;
  detuneCents?: number;
  durationMs?: number;
  gain?: number;
} = {}) {
  const c = getCtx();
  if (!c) return;

  const freq = opts.freq ?? 523.25;       // C5 — high, delicate
  const detune = opts.detuneCents ?? -18; // "slightly off-key"
  const dur = (opts.durationMs ?? 2200) / 1000;
  const peak = opts.gain ?? 0.18;

  const now = c.currentTime;

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(peak, now + 0.01);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3800, now);
  lp.Q.value = 0.6;

  const partials: Array<[number, number, OscillatorType]> = [
    [1, 1.0, 'sine'],
    [2, 0.28, 'sine'],
    [3.01, 0.14, 'triangle'],
    [4.97, 0.07, 'sine'],
  ];

  for (const [mult, g, type] of partials) {
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq * mult, now);
    osc.detune.setValueAtTime(detune, now);
    const pg = c.createGain();
    pg.gain.setValueAtTime(g, now);
    osc.connect(pg).connect(lp);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  lp.connect(masterGain).connect(c.destination);
}
