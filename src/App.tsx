import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './game/store';
import { TitleScreen } from './screens/Title';
import { Prologue } from './screens/Prologue';
import { CharacterSelectScreen } from './screens/CharacterSelect';
import { NameInputScreen } from './screens/NameInput';
import { Scene00 } from './screens/Scene00';
import { Scene01 } from './screens/Scene01';
import { Scene02 } from './screens/Scene02';
import { Scene03 } from './screens/Scene03';
import { Scene04 } from './screens/Scene04';
import { Scene05 } from './screens/Scene05';
import { Scene06 } from './screens/Scene06';
import { Scene07 } from './screens/Scene07';
import { Scene08 } from './screens/Scene08';
import { Scene09 } from './screens/Scene09';
import { Scene10 } from './screens/Scene10';
import { Level11Escape } from './screens/Level11Escape';
import { LevelScreen } from './screens/Level';
import { WispScene } from './screens/Wisp';
import { LevelComplete } from './screens/LevelComplete';
import { LarderStub } from './screens/LarderStub';

export function App() {
  const screen = useGame((s) => s.screen);

  return (
    <AnimatePresence>
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {screen === 'title' && <TitleScreen />}
        {screen === 'prologue' && <Prologue />}
        {screen === 'character-select' && <CharacterSelectScreen />}
        {screen === 'name' && <NameInputScreen />}
        {screen === 'scene-00' && <Scene00 />}
        {screen === 'level' && <LevelScreen />}
        {screen === 'wisp' && <WispScene />}
        {screen === 'scene-01' && <Scene01 />}
        {screen === 'scene-02' && <Scene02 />}
        {screen === 'scene-03' && <Scene03 />}
        {screen === 'scene-04' && <Scene04 />}
        {screen === 'scene-05' && <Scene05 />}
        {screen === 'scene-06' && <Scene06 />}
        {screen === 'scene-07' && <Scene07 />}
        {screen === 'scene-08' && <Scene08 />}
        {screen === 'scene-09' && <Scene09 />}
        {screen === 'scene-10' && <Scene10 />}
        {screen === 'level-11' && <Level11Escape />}
        {screen === 'level-complete' && <LevelComplete />}
        {screen === 'larder-stub' && <LarderStub />}
      </motion.div>
    </AnimatePresence>
  );
}
