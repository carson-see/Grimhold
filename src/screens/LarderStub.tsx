import { Frame } from '../components/Frame';
import { TitleBar } from '../components/TopBar';
import { CellBackdrop } from '../components/CellBackdrop';
import { CurrencyChip } from '../components/CurrencyChip';
import { ChevronLeft, LockIcon } from '../assets/Icons';
import { IngredientSvg, INGREDIENT_NAMES, INGREDIENT_ORDER } from '../assets/Ingredients';
import { useGame } from '../game/store';

const LOCKED_PLACEHOLDERS = ['?-1', '?-2'];

export function LarderStub() {
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const setScreen = useGame((s) => s.setScreen);

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
          <div className="text-center mb-4">
            <h2 className="font-headline italic text-2xl text-secondary">The Larder</h2>
            <p className="font-body italic text-[11px] text-on-surface-variant mt-0.5">
              What Mira kept on the corner shelf.
            </p>
          </div>

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

            {LOCKED_PLACEHOLDERS.map((k) => (
              <article
                key={k}
                className="rounded-md p-3 flex flex-col items-center gap-2 border-[0.5px] border-outline-variant/20 bg-surface-container-lowest opacity-70"
              >
                <div className="w-full aspect-square rounded-sm flex items-center justify-center bg-surface-container-lowest">
                  <LockIcon size={34} className="text-outline" />
                </div>
                <p className="font-headline text-sm text-on-surface-variant">???</p>
                <p className="font-label text-[9px] uppercase tracking-widest text-outline">
                  Requires Cell 5
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 chalk-panel rounded-md p-4 text-center">
            <p className="font-headline italic text-secondary text-base">
              Chapter One continues in v0.2.
            </p>
            <p className="font-body italic text-[11px] text-on-surface-variant mt-2 leading-relaxed">
              Aldric has begun speaking through the wall. Bessie has dropped
              a bag outside your door. Somewhere, the Architect is adjusting
              a recipe. None of it is ready yet — but your first wisp has
              already gone where wisps go.
            </p>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
          <button className="btn-ghost w-full" onClick={() => setScreen('title')}>
            Return to Title
          </button>
        </div>
      </div>
    </Frame>
  );
}
