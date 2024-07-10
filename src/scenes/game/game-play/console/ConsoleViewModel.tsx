import {RootState} from 'data/redux/reducers';
import i18n from 'i18n';
import {ReactNode, useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {GameSettingsMode} from 'types/settings';

export interface Props {
  currentMode: GameSettingsMode;
  totalPlayers: number;
  countdownTime: string;
  onSwitchTurn: () => void;
  onSwapPlayers: () => void;
  renderLastPlayer: () => ReactNode;
  onPause: () => void;
  onStop: () => void;
}

const ConsoleViewModel = (props: Props) => {
  const {gameSettings} = useSelector((state: RootState) => state.game);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [proModeEnabled, setProModeEnabled] = useState(false);

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

  const onSwitchTurn = useCallback(() => {
    if (props.totalPlayers > 2) {
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

  const onPause = useCallback(() => {
    props.onPause();
  }, [props]);

  const onStop = useCallback(() => {
    props.onStop();
  }, [props]);

  return useMemo(() => {
    return {
      soundEnabled,
      remoteEnabled,
      proModeEnabled,
      gameSettings,
      buildGameModeTitle,
      onToggleSound: onToggleValue(setSoundEnabled),
      onToggleRemote: onToggleValue(setRemoteEnabled),
      onToggleProMode: onToggleValue(setProModeEnabled),
      onSwitchTurn,
      onSwapPlayers,
      onPause,
      onStop,
    };
  }, [
    soundEnabled,
    remoteEnabled,
    proModeEnabled,
    gameSettings,
    buildGameModeTitle,
    onToggleValue,
    onSwitchTurn,
    onSwapPlayers,
    onPause,
    onStop,
  ]);
};

export default ConsoleViewModel;
