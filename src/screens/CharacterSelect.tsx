import { motion, useReducedMotion } from 'framer-motion';
import { Frame } from '../components/Frame';
import { CellBackdrop } from '../components/CellBackdrop';
import { BottomCTA } from '../components/BottomCTA';
import { InkDivider } from '../components/InkDivider';
import { TitleBar } from '../components/TopBar';
import { MiraSmudge } from '../assets/MiraSmudge';
import { LockIcon, SparkIcon } from '../assets/Icons';
import { InkSvg } from '../assets/Ink';
import { useGame, type CharacterClass } from '../game/store';

type Card = {
  id: CharacterClass;
  name: string;
  subtitle: string;
  available: boolean;
  accent: 'tertiary' | 'secondary' | 'primary' | 'outline';
  descriptor: string;
};

const CARDS: Card[] = [
  { id: 'witch', name: 'Witch', subtitle: 'Void Weaver', available: true, accent: 'tertiary', descriptor: 'Mira Ashveil · Cell 4' },
  { id: 'rogue', name: 'Rogue', subtitle: 'Shadow Blade', available: false, accent: 'secondary', descriptor: 'Sealed in Act Two' },
  { id: 'scholar', name: 'Scholar', subtitle: 'Lore Keeper', available: false, accent: 'primary', descriptor: 'Sealed in Act Two' },
  { id: 'knight', name: 'Knight', subtitle: 'Iron Warden', available: false, accent: 'outline', descriptor: 'Sealed in Act Two' },
];

const ACCENT_BADGE: Record<Card['accent'], string> = {
  tertiary: 'bg-tertiary-container text-tertiary',
  secondary: 'bg-secondary-container/15 text-secondary/80',
  primary: 'bg-primary-container/40 text-primary-fixed-dim/80',
  outline: 'bg-surface-variant text-on-surface-variant/70',
};

const SILHOUETTE_GRADIENT: Record<Exclude<CharacterClass, 'witch'>, string> = {
  rogue: 'silhouette-rogue',
  scholar: 'silhouette-scholar',
  knight: 'silhouette-knight',
};

export function CharacterSelectScreen() {
  const pickCharacter = useGame((s) => s.pickCharacter);
  const setScreen = useGame((s) => s.setScreen);
  const reduce = useReducedMotion();

  const confirm = () => {
    pickCharacter('witch');
    setScreen('name');
  };

  return (
    <Frame>
      <CellBackdrop opacity={0.7} />

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <TitleBar />

        <main className="flex-1 flex flex-col px-5 pt-4 pb-28 overflow-y-auto">
          <header className="text-center mb-6">
            <h2 className="font-headline text-2xl text-on-surface font-bold tracking-tight">
              Choose Your Seeker
            </h2>
            <p className="font-body italic text-on-surface-variant text-xs mt-1 max-w-[240px] mx-auto">
              The descent demands a heavy toll. Who shall bear it?
            </p>
            <InkDivider tone="primary" widthClass="w-14" className="mt-3" />
          </header>

          <div className="grid grid-cols-2 gap-3">
            {CARDS.map((card) => {
              // Witch is the only available path in Act One; the other three
              // render as locked silhouettes per project_grimhold_decisions.
              const isSelected = card.id === 'witch';
              const locked = !card.available;
              return (
                <motion.button
                  key={card.id}
                  disabled={locked}
                  onClick={() => !locked && confirm()}
                  whileTap={locked || reduce ? undefined : { scale: 0.98 }}
                  aria-pressed={isSelected}
                  aria-disabled={locked}
                  className={[
                    'relative text-left h-56 rounded-lg overflow-hidden border-[0.5px]',
                    locked
                      ? 'bg-surface-container-lowest border-outline-variant/20 opacity-60'
                      : isSelected
                      ? 'bg-surface-container-high border-tertiary shadow-[0_0_22px_rgba(210,188,250,0.22)]'
                      : 'bg-surface-container-low border-outline/20 hover:border-secondary/30',
                  ].join(' ')}
                >
                  <div className="absolute inset-0 flex items-end justify-center">
                    {card.id === 'witch' ? (
                      <div className="scale-[1.1] translate-y-3 opacity-85">
                        <MiraSmudge size={150} />
                      </div>
                    ) : (
                      <LockedSilhouette gradientId={SILHOUETTE_GRADIENT[card.id]} />
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest/95 via-surface-container-low/30 to-transparent z-10" />

                  {isSelected && !locked && (
                    <div className="absolute top-2 right-2 z-20 text-tertiary">
                      <SparkIcon size={16} />
                    </div>
                  )}
                  {locked && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-outline">
                      <LockIcon size={30} />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                    <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-label uppercase tracking-[0.18em] mb-1 ${ACCENT_BADGE[card.accent]}`}>
                      {card.subtitle}
                    </span>
                    <h3 className={`font-headline text-base font-bold leading-tight ${locked ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                      {card.name}
                    </h3>
                    <p className={`font-body italic text-[10px] mt-0.5 ${locked ? 'text-outline' : 'text-on-surface-variant'}`}>
                      {card.descriptor}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-outline italic mt-4 px-4">
            Three paths are still sealed. The dungeon chooses when they open.
          </p>
        </main>

        <BottomCTA>
          <button className="btn-descend w-full" onClick={confirm}>
            Begin the Descent
          </button>
        </BottomCTA>
      </div>
    </Frame>
  );
}

function LockedSilhouette({ gradientId }: { gradientId: string }) {
  return (
    <InkSvg size={150} height={206} viewBox="0 0 160 220" className="opacity-35">
      <path d="M40 70 C 44 30, 118 30, 122 70 L 134 220 L 28 220 Z" fill={`url(#${gradientId})`} />
      {/* Hollow under the hood — face well */}
      <ellipse cx="80" cy="84" rx="22" ry="14" fill="#000" opacity="0.85" />
      <ellipse cx="74" cy="82" rx="1" ry="0.9" fill="#6b5a49" opacity="0.8" />
    </InkSvg>
  );
}
