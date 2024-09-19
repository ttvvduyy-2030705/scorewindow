import {Scenes, Screens} from 'types/scenes';

import Home from './home';
import GameSettings from './game/settings';
import GamePlay from './game/game-play';
import History from './history';
import Playback from './playback';
import Configs from './configs';

const scenes: Scenes = {
  home: Home,
  gameSettings: GameSettings,
  gamePlay: GamePlay,
  history: History,
  playback: Playback,
  configs: Configs,
};

const sceneKeys = Object.keys(scenes);

const screens: Screens = sceneKeys.reduce(
  (result, item) => ({...result, [item]: item}),
  {} as Screens,
);

export {screens, scenes, sceneKeys};
