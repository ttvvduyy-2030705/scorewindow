import {ReadGames} from 'data/realm/RQL/game';
import i18n from 'i18n';
import {useCallback, useMemo} from 'react';
import {screens} from 'scenes/screens';
import {GameSettings} from 'types/settings';
import {navigate} from 'utils/navigation';

const HistoryViewModel = () => {
  const games = ReadGames();

  const buildCategoryTitle = useCallback((game: GameSettings) => {
    return i18n.t(`${game?.category}`).toUpperCase();
  }, []);

  const buildModeTitle = useCallback((game: GameSettings) => {
    return i18n.t(`${game?.mode?.mode}`).toUpperCase();
  }, []);

  const onReWatchGame = useCallback((webcamFolderName?: string) => {
    if (!webcamFolderName) {
      return;
    }

    navigate(screens.playback, {webcamFolderName});
  }, []);

  return useMemo(() => {
    return {games, buildModeTitle, buildCategoryTitle, onReWatchGame};
  }, [games, buildModeTitle, buildCategoryTitle, onReWatchGame]);
};

export default HistoryViewModel;
