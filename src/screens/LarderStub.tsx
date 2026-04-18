import { Frame } from '../components/Frame';
import { TitleBar } from '../components/TopBar';
import { CellBackdrop } from '../components/CellBackdrop';
import { CurrencyChip } from '../components/CurrencyChip';
import { ChevronLeft, LockIcon } from '../assets/Icons';
import { IngredientSvg, INGREDIENT_NAMES, INGREDIENT_ORDER } from '../assets/Ingredients';
import { useGame } from '../game/store';
import { LEVELS } from '../data/levels';
import type { InventoryItemId } from '../game/store';

const LORE_LABEL: Record<InventoryItemId, { name: string; blurb: string }> = {
  'wren-crest-memory': {
    name: "Wren's Crest",
    blurb: 'Three iron barbs, no crown. Memorised through the cell window.',
  },
  'wall-note': {
    name: 'The Note',
    blurb: '"The recipe is not the product. You are." — Someone who got out.',
  },
  'bessie-key': {
    name: "Bessie's Key",
    blurb: 'Dark metal, the wrong shape for your lock. It opens something else.',
  },
};

// Three party-roster sketches — locked in Act One but visible so players
// can see who they will play in later chapters. Names + lore from the
// design bible character map; UI-style is intentionally a faded sepia
// roster pinned next to the larder shelf.
const PARTY_PREVIEW = [
  {
    id: 'aldric',
    name: 'Aldric Vane',
    role: 'The Vowed · Through the Wall',
    blurb: 'He let her go when ordered to arrest her. He thinks he failed her.',
  },
  {
    id: 'cael',
    name: 'Cael Driftmore',
    role: 'The Unbound · The Moth Chose Him',
    blurb: 'He passes through walls. He carries the Architect\'s survival instinct without knowing it.',
  },
  {
    id: 'petra',
    name: 'Petra Voss',
    role: 'The Written · Ink Companion',
    blurb: 'She carries the Architect\'s last letter — written before they became the Architect.',
  },
] as const;

export function LarderStub() {
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const setScreen = useGame((s) => s.setScreen);
  const startLevel = useGame((s) => s.startLevel);
  const highestLevelCleared = useGame((s) => s.highestLevelCleared);
  const inventory = useGame((s) => s.inventory);
  const bessieAlly = useGame((s) => s.bessieAllyActive);
  const hasPocketedUnknown = useGame((s) => s.hasPocketedUnknown);
  const canReplayChapter = highestLevelCleared >= 1;
  const finishedAct = highestLevelCleared >= LEVELS.length;
  const inventoryItems = inventory.map((id) => ({ id, ...LORE_LABEL[id] }));

  return (
    <Frame>
      <CellBackdrop opacity={0.55} />

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <TitleBar
          left={
            <button
              onClick={() => setScreen('title')}
              aria-label="Back to title"
              className="w-11 h-11 inline-flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
          }
          right={<CurrencyChip coins={coins} gems={gems} compact />}
        />

        <main className="flex-1 px-4 pt-2 pb-28 overflow-y-auto">
          <div className="text-center mb-5">
            <h2 className="font-headline italic text-2xl text-secondary">The Larder</h2>
            <p className="font-body italic text-[13px] text-on-surface-variant mt-1 leading-snug max-w-[320px] mx-auto">
              A larder is the corner of a kitchen where food is kept. This is
              Mira's — what the dungeon hasn't taken yet.
            </p>
          </div>

          {/* Orientation card — what coins/gems mean, and what is coming. */}
          <section className="mb-5 chalk-panel rounded-md p-3">
            <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/80 mb-2">
              What you're looking at
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-sm border-[0.5px] border-secondary/30 bg-surface-container-low/50 p-2">
                <p className="font-headline italic text-secondary text-sm leading-tight">Coins</p>
                <p className="font-body italic text-[12px] text-on-surface-variant/90 leading-snug mt-1">
                  Earned by brewing quickly. They'll buy ingredients and small
                  mercies from Bessie's kitchen in v0.2.
                </p>
              </div>
              <div className="rounded-sm border-[0.5px] border-tertiary/30 bg-tertiary-container/15 p-2">
                <p className="font-headline italic text-tertiary text-sm leading-tight">Gems</p>
                <p className="font-body italic text-[12px] text-on-surface-variant/90 leading-snug mt-1">
                  The Architect's attention, banked. Earned for first clears
                  and for finding alternate paths. Rare by design.
                </p>
              </div>
            </div>
            <p className="font-body italic text-[12px] text-on-surface-variant mt-2 leading-snug">
              The shelves below show every reagent Mira recognises, lore she
              has kept, and the four prisoners whose paths cross hers.
            </p>
          </section>

          <div className="text-center mb-5">
            <p className="font-body italic text-[13px] text-on-surface-variant leading-snug">
              {finishedAct
                ? 'She had learned to brew. She had learned to refuse. What she will carry through the floor.'
                : 'Keep brewing — the larder fills as she learns.'}
            </p>
          </div>

          {/* Lore items earned during play — surfaced as small chalk cards */}
          {inventoryItems.length > 0 && (
            <section className="mb-5">
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/80 mb-2">
                Kept · Lore
              </p>
              <div className="space-y-2">
                {inventoryItems.map((item) => (
                  <article
                    key={item.id}
                    className="chalk-panel rounded-sm p-3 border-[0.5px] border-secondary/25"
                  >
                    <p className="font-headline italic text-secondary text-sm">{item.name}</p>
                    <p className="font-body italic text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      {item.blurb}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Ally + secret status — small chips that appear when earned */}
          {(bessieAlly || hasPocketedUnknown) && (
            <section className="mb-5">
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/80 mb-2">
                Allies · Secrets
              </p>
              <div className="flex flex-wrap gap-2">
                {bessieAlly && (
                  <span className="rounded-sm border-[0.5px] border-tertiary/40 bg-tertiary-container/30 text-tertiary px-2 py-1 text-[10px] font-label uppercase tracking-[0.18em]">
                    Bessie · Recruited
                  </span>
                )}
                {hasPocketedUnknown && (
                  <span className="rounded-sm border-[0.5px] border-outline/40 bg-surface-container/40 text-on-surface-variant px-2 py-1 text-[10px] font-label uppercase tracking-[0.18em]">
                    Unknown · Pocketed
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Reagent shelf — what Mira recognises by Chapter Two */}
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/80 mb-2">
            Reagents
          </p>
          <div className="grid grid-cols-2 gap-3">
            {INGREDIENT_ORDER.map((k) => (
              <article key={k} className="chalk-panel rounded-md p-3 flex flex-col items-center gap-2">
                <div className="w-full aspect-square bg-surface-container-highest/40 rounded-sm flex items-center justify-center border-[0.5px] border-outline/10">
                  <IngredientSvg id={k} size={70} />
                </div>
                <p className="font-headline text-sm text-on-surface">{INGREDIENT_NAMES[k]}</p>
                <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                  Reagent · Common
                </p>
              </article>
            ))}
          </div>

          {/* Party preview — Aldric / Cael / Petra. Unlocked in later acts. */}
          <section className="mt-6">
            <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/80 mb-2">
              The Roster · Sealed
            </p>
            <div className="space-y-2">
              {PARTY_PREVIEW.map((p) => (
                <article
                  key={p.id}
                  className="rounded-sm p-3 border-[0.5px] border-outline/20 bg-surface-container-low/50 flex items-start gap-3"
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-surface-container-lowest flex items-center justify-center border-[0.5px] border-outline-variant/30">
                    <LockIcon size={18} className="text-outline" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline text-sm text-on-surface-variant">{p.name}</p>
                    <p className="font-label text-[9px] uppercase tracking-[0.18em] text-outline mt-0.5">
                      {p.role}
                    </p>
                    <p className="font-body italic text-[11px] text-on-surface-variant/85 mt-1 leading-snug">
                      {p.blurb}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-6 chalk-panel rounded-md p-4 text-center">
            <p className="font-headline italic text-secondary text-base">
              {finishedAct ? 'Chapter One closed. The floor is waiting.' : 'Chapter One continues.'}
            </p>
            <p className="font-body italic text-[11px] text-on-surface-variant mt-2 leading-relaxed">
              {finishedAct
                ? 'The seam in the brewing chamber rose a centimetre. Aldric has a key to the first lock. The Second Ward is below, and they don\'t send people there — they send failed experiments.'
                : 'Aldric speaks through the wall. Bessie drops bags outside your door. Somewhere, the Architect adjusts your next recipe.'}
            </p>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent space-y-2">
          {canReplayChapter && (
            <button
              className="btn-descend w-full"
              onClick={() => {
                startLevel(1);
                setScreen('level');
              }}
            >
              Replay the Chapter
            </button>
          )}
          <button className="btn-ghost w-full" onClick={() => setScreen('title')}>
            Return to Title
          </button>
        </div>
      </div>
    </Frame>
  );
}
