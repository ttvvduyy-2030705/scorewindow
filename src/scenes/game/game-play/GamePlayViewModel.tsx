import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'data/redux/reducers';
import {PlayerSettings} from 'types/player';
import {goBack} from 'utils/navigation';

const GamePlayViewModel = () => {
  const {updateGameSettings} = useSelector((state: RootState) => state.UI.game);
  const {gameSettings} = useSelector((state: RootState) => state.game);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>();

  useEffect(() => {
    setPlayerSettings(gameSettings?.players);
  }, [gameSettings]);

  const onEditPlayerName = useCallback((index: number, newName: string) => {
    setPlayerSettings(
      prev =>
        ({
          ...prev,
          playingPlayers: prev?.playingPlayers.map((player, playerIndex) => {
            if (index === playerIndex) {
              return {...player, name: newName};
            }

            return player;
          }),
        } as PlayerSettings),
    );
  }, []);

  const onChangePlayerPoint = useCallback(
    (addedPoint: number, index: number, stepIndex: number) => {
      if (stepIndex === 4) {
        return;
      }

      setPlayerSettings(
        prev =>
          ({
            ...prev,
            playingPlayers: prev?.playingPlayers.map((player, playerIndex) => {
              if (index === playerIndex) {
                return {...player, totalPoint: player.totalPoint + addedPoint};
              }

              return player;
            }),
          } as PlayerSettings),
      );
    },
    [],
  );

  const onSwitchTurn = useCallback(() => {
    setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
  }, []);

  const onSwapPlayers = useCallback(() => {}, []);

  const onPause = useCallback(() => {}, []);

  const onStop = useCallback(() => {
    goBack();
  }, []);

  return useMemo(() => {
    return {
      currentPlayerIndex,
      playerSettings,
      gameSettings,
      updateGameSettings,
      onEditPlayerName,
      onChangePlayerPoint,
      onSwitchTurn,
      onSwapPlayers,
      onPause,
      onStop,
    };
  }, [
    currentPlayerIndex,
    playerSettings,
    gameSettings,
    updateGameSettings,
    onEditPlayerName,
    onChangePlayerPoint,
    onSwitchTurn,
    onSwapPlayers,
    onPause,
    onStop,
  ]);
};

export default GamePlayViewModel;
