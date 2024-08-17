import {BALLS_10, BALLS_15, BALLS_9} from 'constants/balls';
import {gameActions} from 'data/redux/actions/game';
import {RootState} from 'data/redux/reducers';
import i18n from 'i18n';
import {ReactNode, useCallback, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {PoolBallType} from 'types/ball';
import {GameSettings, GameSettingsMode} from 'types/settings';
import {formatTotalTime} from 'utils/date';
import {isPool10Game, isPool15Game} from 'utils/game';

export interface Props {
  gameSettings: GameSettings;
  currentMode: GameSettingsMode;
  warmUpCount?: number;
  totalPlayers: number;
  totalTurns: number;
  totalTime: number;
  goal: number;
  isStarted: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  onPressGiveMoreTime: () => void;
  onWarmUp: () => void;
  onSwitchTurn: () => void;
  onSwapPlayers: () => void;
  onToggleSound: () => void;
  onPoolScore: (ball: PoolBallType) => void;
  renderLastPlayer: () => ReactNode;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const ConsoleViewModel = (props: Props) => {
  const dispatch = useDispatch();
  const {gameSettings} = useSelector((state: RootState) => state.game);

  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [balls, setBalls] = useState(
    isPool15Game(gameSettings?.category)
      ? BALLS_15
      : isPool10Game(gameSettings?.category)
      ? BALLS_10
      : BALLS_9,
  );
  const [proModeEnabled, setProModeEnabled] = useState(
    props.currentMode.mode !== 'fast',
  );

  const onToggleValue = useCallback(
    (setValue: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setValue(prev => !prev);
    },
    [],
  );

  const buildGameModeTitle = useCallback(() => {
    return `${i18n.t(`${gameSettings?.category}`).toUpperCase()} - ${i18n
      .t(`${gameSettings?.mode.mode}`)
      .toUpperCase()}`;
  }, [gameSettings]);

  const displayTotalTime = useCallback(() => {
    const {hours, minutes, seconds} = formatTotalTime(props.totalTime);
    const _hours = hours < 10 ? `0${hours}` : hours;
    const _minutes = minutes < 10 ? `0${minutes}` : minutes;
    const _seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${_hours}:${_minutes}:${_seconds}`;
  }, [props]);

  const toggleProMode = useCallback(() => {
    setProModeEnabled(prev => !prev);
    dispatch(
      gameActions.updateGameSettings({
        ...props.gameSettings,
        mode: {
          ...props.currentMode,
          mode: props.currentMode.mode === 'fast' ? 'pro' : 'fast',
        },
      }),
    );
  }, [dispatch, props]);

  const onPressGiveMoreTime = useCallback(() => {
    if (props.isPaused) {
      return;
    }

    props.onPressGiveMoreTime();
  }, [props]);

  const onSwitchTurn = useCallback(() => {
    if (props.totalPlayers > 2 || props.isPaused) {
      return;
    }

    props.onSwitchTurn();
  }, [props]);

  const onSwapPlayers = useCallback(() => {
    if (props.totalPlayers > 2) {
      return;
    }

    props.onSwapPlayers();
  }, [props]);

  const onSelectBall = useCallback(
    (selectedBall: PoolBallType) => {
      const newBalls = balls.filter(
        ball => ball.number !== selectedBall.number,
      );

      setBalls(newBalls);
      props.onPoolScore(selectedBall);
    },
    [props, balls],
  );

  const onWarmUp = useCallback(() => {
    props.onWarmUp();
  }, [props]);

  const onStart = useCallback(() => {
    props.onStart();
  }, [props]);

  const onPause = useCallback(() => {
    props.onPause();
  }, [props]);

  const onStop = useCallback(() => {
    props.onStop();
  }, [props]);

  return useMemo(() => {
    return {
      balls,
      remoteEnabled,
      proModeEnabled,
      gameSettings,
      buildGameModeTitle,
      displayTotalTime,
      onToggleRemote: onToggleValue(setRemoteEnabled),
      onToggleProMode: toggleProMode,
      onPressGiveMoreTime,
      onSwitchTurn,
      onSwapPlayers,
      onSelectBall,
      onWarmUp,
      onStart,
      onPause,
      onStop,
    };
  }, [
    balls,
    remoteEnabled,
    proModeEnabled,
    gameSettings,
    buildGameModeTitle,
    displayTotalTime,
    onToggleValue,
    toggleProMode,
    onPressGiveMoreTime,
    onSwitchTurn,
    onSwapPlayers,
    onSelectBall,
    onWarmUp,
    onStart,
    onPause,
    onStop,
  ]);
};

export default ConsoleViewModel;
