import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { HudBar } from '../components/TopBar';
import { CellBackdrop } from '../components/CellBackdrop';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { EncounterModal } from '../components/EncounterModal';
import { FailOverlay } from '../components/FailOverlay';
import { MemoryVisionOverlay } from '../components/MemoryVisionOverlay';
import { ArchitectVoiceBanner } from '../components/ArchitectVoiceBanner';
import { JointSyncOverlay } from '../components/JointSyncOverlay';
import { NoteFromWallOverlay } from '../components/NoteFromWallOverlay';
import { EventToast } from '../components/EventToast';
import { MiraBust } from '../assets/MiraSmudge';
import { Cauldron } from '../assets/Cauldron';
import { IngredientSvg, INGREDIENT_NAMES } from '../assets/Ingredients';
import { MenuIcon } from '../assets/Icons';
import type { CauldronId } from '../game/types';
import { cauldronStatus, useGame } from '../game/store';
import { CAULDRON_LABEL } from '../data/levels';
import { playMusicBoxNote } from '../game/audio';
import { RecipePanel } from '../components/RecipePanel';
import { BlankWallPanel } from '../components/BlankWallPanel';

export function LevelScreen() {
  const level = useGame((s) => s.level);
  const ingredients = useGame((s) => s.ingredients);
  const selectedIngredientId = useGame((s) => s.selectedIngredientId);
  const movesUsed = useGame((s) => s.movesUsed);
  const completed = useGame((s) => s.completed);
  const selectIngredient = useGame((s) => s.selectIngredient);
  const placeInCauldron = useGame((s) => s.placeInCauldron);
  const removeFromCauldron = useGame((s) => s.removeFromCauldron);
  const setScreen = useGame((s) => s.setScreen);
  const resetLevel = useGame((s) => s.resetLevel);
  const name = useGame((s) => s.name);
  const tutorialSeen = useGame((s) => s.tutorialSeen);
  const markTutorialSeen = useGame((s) => s.markTutorialSeen);
  const startLevel = useGame((s) => s.startLevel);
  // Narrowed selector — we only gate behavior on whether the encounter modal
  // is up. Pulling the whole object would rerender the entire LevelScreen at
  // the modal's ~10 Hz countdown tick.
  const encounterOpen = useGame((s) => s.encounter.open);
  const memoryVisionOpen = useGame((s) => s.memoryVision.open);
  const architectVoiceOpen = useGame((s) => s.architectVoice.open);
  const jointSyncOpen = useGame((s) => s.jointSync.open);
  const noteFromWallOpen = useGame((s) => s.noteFromWall.open);
  const storeFailed = useGame((s) => s.failed);
  const reduce = useReducedMotion();
  // Joint sync and architect voice are intentionally non-blocking — the
  // puzzle keeps running underneath. Encounter, memory and the wall note
  // are blocking modals.
  const anyBlockingOverlay = encounterOpen || memoryVisionOpen || noteFromWallOpen;

  // Tutorial only appears once, on Level 1, for the very first session.
  const [tutorialOpen, setTutorialOpen] = useState(!tutorialSeen && level.id === 1);
  const movesRemaining = Math.max(0, level.moveLimit - movesUsed);
  const failed = storeFailed || (!completed && movesUsed >= level.moveLimit);
  const failReason = storeFailed ? 'overheat' : 'moves';
  const [pulseCauldron, setPulseCauldron] = useState<CauldronId | null>(null);
  const pulseTimerRef = useRef<number | undefined>(undefined);
  const transitionTimerRef = useRef<number | undefined>(undefined);

  const cauldronCount = level.cauldrons.length;
  const gridColsClass =
    cauldronCount >= 4 ? 'grid-cols-4' : cauldronCount === 3 ? 'grid-cols-3' : 'grid-cols-2';
  const cauldronSize =
    cauldronCount >= 4 ? 64 : cauldronCount === 3 ? 80 : 104;
  // Hidden recipes (joint variants, L9 unwritten paths) are not shown in
  // the HUD — the player discovers them through play.
  const wallRecipe = level.recipes.find((r) => r.handwriting === 'wall' && !r.hidden);
  const slidRecipe = level.recipes.find((r) => r.handwriting === 'slid' && !r.hidden);
  const volatileKinds = new Set(level.volatility?.kinds ?? []);
  const tsCauldron = level.timeSensitive?.cauldron;
  const tsMovesLeft = level.timeSensitive
    ? Math.max(0, level.timeSensitive.fillByMove - movesUsed)
    : null;
  const syncCauldron = jointSyncOpen ? level.jointSync?.cauldron : null;

  const dismissTutorial = () => {
    setTutorialOpen(false);
    markTutorialSeen();
  };

  // When the store flips `completed` to true, hold one beat then advance.
  useEffect(() => {
    if (!completed) return;
    playMusicBoxNote({ freq: 659.25, detuneCents: -12, durationMs: 1800, gain: 0.12 });
    transitionTimerRef.current = window.setTimeout(() => setScreen('wisp'), 900);
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [completed, setScreen]);

  useEffect(() => () => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
  }, []);

  const onCauldronTap = (cid: CauldronId) => {
    if (!selectedIngredientId || anyBlockingOverlay) return;
    placeInCauldron(cid);
    setPulseCauldron(cid);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => setPulseCauldron(null), 500);
  };

  const trayIngredients = ingredients.filter((i) => i.placedIn === null);

  return (
    <Frame>
      <CellBackdrop />

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <HudBar lives={3} movesRemaining={movesRemaining} />

        <div className="mx-4 mt-1 mb-2 space-y-2">
          {level.blankWall ? (
            <BlankWallPanel level={level} />
          ) : (
            <>
              {wallRecipe && (
                <RecipePanel
                  recipe={wallRecipe}
                  cauldrons={level.cauldrons}
                  title={level.title}
                  chapter={level.chapterLabel}
                />
              )}
              {slidRecipe && <RecipePanel recipe={slidRecipe} cauldrons={level.cauldrons} />}
            </>
          )}
        </div>

        <div className="px-3 mt-1">
          <div className={`grid gap-2 ${gridColsClass}`}>
            {level.cauldrons.map((cid) => {
              const state = cauldronStatus(ingredients, cid, level);
              const placed = ingredients.filter((i) => i.placedIn === cid);
              const isPulsing = pulseCauldron === cid;
              const tapDisabled = completed || !selectedIngredientId || anyBlockingOverlay;
              const cueing = !!selectedIngredientId && !completed && !anyBlockingOverlay && state !== 'correct' && !reduce;
              const labelText = CAULDRON_LABEL[cid];
              const isTimeSensitive = tsCauldron === cid && !placed.length && tsMovesLeft !== null && tsMovesLeft > 0;
              const isSyncTarget = syncCauldron === cid;
              return (
                <div
                  key={cid}
                  className={[
                    'relative rounded-md p-2 transition-all border-[0.5px]',
                    selectedIngredientId && !anyBlockingOverlay
                      ? 'border-primary/40 bg-surface-container/60 shadow-[0_0_18px_rgba(0,223,193,0.15)]'
                      : 'border-outline/20 bg-surface-container-low/40',
                    state === 'correct' ? 'ring-1 ring-primary/30' : '',
                    state === 'wrong' ? 'ring-1 ring-error/40' : '',
                    isTimeSensitive ? 'ring-1 ring-secondary/60 shadow-[0_0_16px_rgba(255,215,153,0.28)]' : '',
                    isSyncTarget ? 'ring-2 ring-secondary/80 shadow-[0_0_22px_rgba(255,215,153,0.45)] animate-pulse' : '',
                  ].join(' ')}
                >
                  {isTimeSensitive && (
                    <span
                      className="absolute top-1 right-1 font-label text-[9px] uppercase tracking-wider text-secondary/85"
                      aria-label={`Fill within ${tsMovesLeft} moves — or this cauldron overheats`}
                    >
                      ▲ {tsMovesLeft}
                    </span>
                  )}
                  {/* role="button" so the tappable ingredient-removal buttons
                      below can sit alongside the drop-zone without nesting
                      interactive elements. The store's placeInCauldron gates
                      itself — we only use `tapDisabled` for a11y attributes. */}
                  <div
                    role="button"
                    tabIndex={tapDisabled ? -1 : 0}
                    onClick={() => onCauldronTap(cid)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCauldronTap(cid);
                      }
                    }}
                    aria-label={`${labelText} cauldron${tapDisabled ? '' : ' — tap to place chosen ingredient'}`}
                    aria-disabled={tapDisabled}
                    className="flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
                  >
                    <div className={`transition-transform ${isPulsing ? 'scale-105' : ''} ${cueing ? 'animate-cauldron-cue' : ''}`}>
                      <Cauldron size={cauldronSize} tint={state} glowing={selectedIngredientId !== null || state === 'correct'} />
                    </div>
                    <p className="font-label text-[10px] uppercase tracking-[0.22em] text-on-surface-variant mt-0.5">
                      {labelText}
                    </p>
                  </div>

                  <div className="flex justify-center gap-1 mt-1 min-h-[44px] flex-wrap">
                    <AnimatePresence>
                      {placed.map((ing) => (
                        <motion.button
                          key={ing.id}
                          initial={{ scale: 0.6, opacity: 0, y: -8 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'backOut' }}
                          onClick={() => removeFromCauldron(ing.id)}
                          disabled={completed || anyBlockingOverlay}
                          className={[
                            'w-11 h-11 inline-flex items-center justify-center rounded-sm hover:bg-surface-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                            volatileKinds.has(ing.kind)
                              ? 'ring-1 ring-tertiary/40 shadow-[0_0_10px_rgba(210,188,250,0.35)]'
                              : '',
                          ].join(' ')}
                          aria-label={`Return ${INGREDIENT_NAMES[ing.kind]} to the tray${volatileKinds.has(ing.kind) ? ' (volatile)' : ''}`}
                          title={`${INGREDIENT_NAMES[ing.kind]}${volatileKinds.has(ing.kind) ? ' · volatile — drifts every few moves' : ''} — tap to return`}
                        >
                          <IngredientSvg id={ing.kind} size={cauldronCount >= 4 ? 18 : cauldronCount === 3 ? 22 : 26} noFilter />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 mt-3 mx-4 mb-2 overflow-y-auto">
          <div className="chalk-panel rounded-sm p-3 min-h-[150px]">
            <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/70 mb-2">
              {selectedIngredientId ? 'Chosen — tap a cauldron' : 'Tap an ingredient to lift it'}
            </p>
            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence>
                {trayIngredients.map((ing, idx) => {
                  const isSelected = selectedIngredientId === ing.id;
                  // Pulse only the first untapped ingredient — the cue
                  // disappears once the player has selected anything.
                  const isCueing = !selectedIngredientId && !completed && !anyBlockingOverlay && idx === 0 && !reduce;
                  return (
                    <motion.button
                      key={ing.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: isSelected ? 1.08 : 1, y: isSelected ? -4 : 0 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      onClick={() => selectIngredient(isSelected ? null : ing.id)}
                      disabled={completed || anyBlockingOverlay}
                      aria-label={INGREDIENT_NAMES[ing.kind]}
                      aria-pressed={isSelected}
                      className={[
                        'h-[64px] rounded-sm flex flex-col items-center justify-center gap-0.5 border-[0.5px]',
                        isSelected
                          ? 'bg-tertiary-container border-tertiary shadow-[0_0_14px_rgba(210,188,250,0.35)]'
                          : 'bg-surface-container-highest/70 border-outline/20 hover:border-primary/40',
                        volatileKinds.has(ing.kind) && !isSelected
                          ? 'ring-1 ring-tertiary/30'
                          : '',
                        ing.kind === 'unknown' && !isSelected
                          ? 'shadow-[0_0_14px_rgba(148,142,153,0.45)] border-outline/50'
                          : '',
                        isCueing ? 'animate-cue-pulse' : '',
                      ].join(' ')}
                    >
                      <IngredientSvg id={ing.kind} size={30} />
                      <span className="font-label text-[9px] uppercase tracking-wider text-on-surface/80 truncate max-w-full px-0.5">
                        {INGREDIENT_NAMES[ing.kind]}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {trayIngredients.length === 0 && (
                <div className="col-span-4 text-center font-body italic text-outline text-xs py-6">
                  The tray is empty. Watch the cauldrons.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="shrink-0 rounded-sm overflow-hidden border-[0.5px] border-outline/20 bg-surface-container-low p-1">
            <MiraBust size={44} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-sm text-on-surface truncate">{name}</p>
            <p className="font-body italic text-[11px] text-on-surface-variant">
              {completed
                ? 'Something is rising.'
                : anyBlockingOverlay
                  ? 'Someone is at the door.'
                  : 'Smudge is watching the grate.'}
            </p>
          </div>
          <button
            className="w-11 h-11 inline-flex items-center justify-center text-outline hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
            onClick={() => {
              setScreen('title');
              resetLevel();
            }}
            aria-label="Quit to title"
          >
            <MenuIcon />
          </button>
        </div>

        <AnimatePresence>
          {tutorialOpen && <TutorialOverlay onDismiss={dismissTutorial} />}
        </AnimatePresence>

        <AnimatePresence>
          {encounterOpen && level.encounter && <EncounterModal />}
        </AnimatePresence>

        <AnimatePresence>
          {memoryVisionOpen && level.memoryVision && <MemoryVisionOverlay />}
        </AnimatePresence>

        <AnimatePresence>
          {architectVoiceOpen && level.architectVoice && <ArchitectVoiceBanner />}
        </AnimatePresence>

        <AnimatePresence>
          {jointSyncOpen && level.jointSync && <JointSyncOverlay />}
        </AnimatePresence>

        <AnimatePresence>
          {noteFromWallOpen && level.noteFromWall && <NoteFromWallOverlay />}
        </AnimatePresence>

        <EventToast />

        <AnimatePresence>
          {failed && !anyBlockingOverlay && (
            <FailOverlay
              playerName={name}
              reason={failReason}
              onReplay={() => startLevel(level.id)}
              onQuit={() => {
                resetLevel();
                setScreen('title');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

