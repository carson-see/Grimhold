import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './game/store';
import { TitleScreen } from './screens/Title';
import { CharacterSelectScreen } from './screens/CharacterSelect';
import { NameInputScreen } from './screens/NameInput';
import { Scene00 } from './screens/Scene00';
import { LevelScreen } from './screens/Level';
import { WispScene } from './screens/Wisp';
import { Scene01 } from './screens/Scene01';
import { LevelComplete } from './screens/LevelComplete';
import { LarderStub } from './screens/LarderStub';

export function App() {
  const screen = useGame((s) => s.screen);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {screen === 'title' && <TitleScreen />}
        {screen === 'character-select' && <CharacterSelectScreen />}
        {screen === 'name' && <NameInputScreen />}
        {screen === 'scene-00' && <Scene00 />}
        {screen === 'level' && <LevelScreen />}
        {screen === 'wisp' && <WispScene />}
        {screen === 'scene-01' && <Scene01 />}
        {screen === 'level-complete' && <LevelComplete />}
        {screen === 'larder-stub' && <LarderStub />}
      </motion.div>
    </AnimatePresence>
  );
}
