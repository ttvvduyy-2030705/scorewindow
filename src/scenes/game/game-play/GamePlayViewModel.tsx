import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'data/redux/reducers';
import {Player, PlayerSettings} from 'types/player';
import {goBack} from 'utils/navigation';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {COUNTDOWN_WIDTH} from './styles';

let countdownInterval: NodeJS.Timeout;

const GamePlayViewModel = () => {
  const {updateGameSettings} = useSelector((state: RootState) => state.UI.game);
  const {gameSettings} = useSelector((state: RootState) => state.game);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [totalTurns, setTotalTurns] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const [countdownTime, setCountdownTime] = useState<number>(0);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>();

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const countdownOffsetX = useSharedValue(-COUNTDOWN_WIDTH);

  useEffect(() => {
    setPlayerSettings(gameSettings?.players);

    if (gameSettings?.mode.countdownTime) {
      setCountdownTime(gameSettings.mode.countdownTime);

      countdownOffsetX.value = withTiming(0, {
        duration: gameSettings.mode.countdownTime * 1000,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      });
    }

    return () => {
      clearInterval(countdownInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSettings]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    countdownInterval = setInterval(() => {
      setTotalTime(prev => prev + 1);
      setCountdownTime(prev =>
        typeof prev === 'number' && prev > 0 ? prev - 1 : 0,
      );
    }, 1000);
  }, [isPaused]);

  const COUNTDOWN_TIME_STYLE = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: countdownOffsetX.value,
        },
      ],
    };
  }, []);

  const _resetCountdown = useCallback(
    (isResume?: boolean) => {
      if (!gameSettings || !gameSettings.mode.countdownTime) {
        return;
      }

      if (!isResume) {
        countdownOffsetX.value = -COUNTDOWN_WIDTH;
        setCountdownTime(gameSettings?.mode.countdownTime || 0);
      }

      countdownOffsetX.value = withTiming(0, {
        duration: countdownTime * 1000,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      });
    },
    [countdownOffsetX, countdownTime, gameSettings],
  );

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

  const onPressGiveMoreTime = useCallback(() => {
    if (!playerSettings) {
      return;
    }

    const newPlayingPlayers = playerSettings.playingPlayers.map(
      (player, index) => {
        if (
          currentPlayerIndex === index &&
          player.proMode &&
          typeof player.proMode.extraTimeTurns === 'number'
        ) {
          return {
            ...player,
            proMode: {
              ...player.proMode,
              extraTimeTurns:
                player.proMode.extraTimeTurns - 1 > 0
                  ? player.proMode.extraTimeTurns - 1
                  : 0,
            },
          } as Player;
        }

        return player;
      },
    );

    _resetCountdown();
    setPlayerSettings({...playerSettings, playingPlayers: newPlayingPlayers});
  }, [playerSettings, currentPlayerIndex, _resetCountdown]);

  const onSwitchTurn = useCallback(() => {
    _resetCountdown();
    setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
  }, [_resetCountdown]);

  const onEndTurn = useCallback(() => {
    if (!gameSettings) {
      return;
    }

    _resetCountdown();
    if (currentPlayerIndex + 1 > gameSettings.players.playerNumber - 1) {
      setCurrentPlayerIndex(0);
      setTotalTurns(totalTurns + 1);
      return;
    }

    setCurrentPlayerIndex(currentPlayerIndex + 1);
  }, [currentPlayerIndex, totalTurns, gameSettings, _resetCountdown]);

  const onSwapPlayers = useCallback(() => {
    const player1: Player = {...playerSettings?.playingPlayers[0]} as Player;
    const player0: Player = {...playerSettings?.playingPlayers[1]} as Player;

    setPlayerSettings({
      ...playerSettings,
      playingPlayers: [player0, player1],
    } as PlayerSettings);
  }, [playerSettings]);

  const onPause = useCallback(() => {
    if (isPaused) {
      //Resume game
      _resetCountdown(true);
    } else {
      clearInterval(countdownInterval);
      cancelAnimation(countdownOffsetX);
    }

    setIsPaused(prev => !prev);
  }, [isPaused, countdownOffsetX, _resetCountdown]);

  const onStop = useCallback(() => {
    goBack();
  }, []);

  return useMemo(() => {
    return {
      COUNTDOWN_TIME_STYLE,
      currentPlayerIndex,
      totalTime,
      totalTurns,
      playerSettings,
      gameSettings,
      countdownTime,
      updateGameSettings,
      isPaused,
      onEditPlayerName,
      onChangePlayerPoint,
      onPressGiveMoreTime,
      onSwitchTurn,
      onSwapPlayers,
      onEndTurn,
      onPause,
      onStop,
    };
  }, [
    COUNTDOWN_TIME_STYLE,
    currentPlayerIndex,
    totalTime,
    totalTurns,
    playerSettings,
    gameSettings,
    countdownTime,
    updateGameSettings,
    isPaused,
    onEditPlayerName,
    onChangePlayerPoint,
    onPressGiveMoreTime,
    onSwitchTurn,
    onSwapPlayers,
    onEndTurn,
    onPause,
    onStop,
  ]);
};

export default GamePlayViewModel;
