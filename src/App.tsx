import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './game/store';
import { TitleScreen } from './screens/Title';
import { CharacterSelectScreen } from './screens/CharacterSelect';
import { NameInputScreen } from './screens/NameInput';
import { Scene00 } from './screens/Scene00';
import { Scene01 } from './screens/Scene01';
import { Scene02 } from './screens/Scene02';
import { Scene03 } from './screens/Scene03';
import { Scene04 } from './screens/Scene04';
import { Scene05 } from './screens/Scene05';
import { Scene06 } from './screens/Scene06';
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
        {screen === 'level-complete' && <LevelComplete />}
        {screen === 'larder-stub' && <LarderStub />}
      </motion.div>
    </AnimatePresence>
  );
}
