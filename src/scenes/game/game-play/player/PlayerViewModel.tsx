import {useCallback, useEffect, useMemo, useState} from 'react';
import {RemoteControlKeys} from 'types/bluetooth';
import {Player} from 'types/player';
import {GameSettings} from 'types/settings';
import {isPoolGame} from 'utils/game';
import RemoteControl from 'utils/remote';
import {useAplusPro} from 'features/subscription';

export interface Props {
  index: number;
  gameSettings: GameSettings;
  totalPlayers?: number;
  player: Player;
  isOnTurn: boolean;
  isOnPoolBreak: boolean;
  isStarted: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  proModeEnabled: boolean;
  totalTurns: number;
  onSwitchPoolBreakPlayerIndex: (
    index: number,
    callback?: (playerIndex: number) => void,
  ) => void;
  onEditPlayerName: (index: number, newName: string) => void;
  onChangePlayerPoint: (
    addedPoint: number,
    index: number,
    stepIndex: number,
  ) => void;
  onViolate: (playerIndex: number, reset?: boolean) => void;
  onEndTurn: (isPrevious?: boolean) => void;
  onPressGiveMoreTime?: () => void;
}

const formatAverage = (value?: number) => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
};

const PlayerViewModel = (props: Props) => {
  const logRemoteFlow = useCallback((stage: string, payload?: Record<string, any>) => {
    try {
      if (payload) {
        console.log(`REMOTE_FLOW: ${stage}`, JSON.stringify(payload));
        return;
      }

      console.log(`REMOTE_FLOW: ${stage}`);
    } catch {
      console.log(`REMOTE_FLOW: ${stage}`, payload);
    }
  }, []);
  const {requireAplusPro} = useAplusPro();
  const [nameEditable, setNameEditable] = useState(false);
  const [draftName, setDraftName] = useState(props.player.name || '');
  const [totalPointInTurn, setTotalPointInTurn] = useState(
    Number(props.player.proMode?.currentPoint || 0),
  );

  const highestRate = Number(props.player.proMode?.highestRate || 0);
  const averagePoint = formatAverage(Number(props.player.proMode?.average || 0));

  useEffect(() => {
    setTotalPointInTurn(Number(props.player.proMode?.currentPoint || 0));
  }, [props.player.proMode?.currentPoint]);

  useEffect(() => {
    if (!nameEditable) {
      setDraftName(props.player.name || '');
    }
  }, [props.player.name, nameEditable]);

  const onChangeDraftName = useCallback((value: string) => {
    setDraftName(value);
  }, []);

  const onCommitName = useCallback(() => {
    const originalName = props.player.name || '';
    const trimmedName = String(draftName || '').trim();
    const nextName = trimmedName || originalName;

    if (nextName !== originalName) {
      props.onEditPlayerName(props.index, nextName);
    }

    setDraftName(nextName);
    setNameEditable(false);
  }, [draftName, props]);

  const onToggleEditName = useCallback(() => {
    if (nameEditable) {
      onCommitName();
      return;
    }

    requireAplusPro('rename_player', () => {
      setDraftName(props.player.name || '');
      setNameEditable(true);
    });
  }, [nameEditable, onCommitName, props.player.name, requireAplusPro]);

  useEffect(() => {
    logRemoteFlow('PlayerViewModel remote effect', {
      playerIndex: props.index,
      playerName: props.player?.name,
      isOnTurn: props.isOnTurn,
      isStarted: props.isStarted,
      isPaused: props.isPaused,
      totalTurns: props.totalTurns,
    });

    if (props.isOnTurn) {
      RemoteControl.instance.registerKeyEvents(RemoteControlKeys.UP, () => {
        logRemoteFlow('PlayerViewModel callback UP', {
          playerIndex: props.index,
          playerName: props.player?.name,
          isOnTurn: props.isOnTurn,
          isStarted: props.isStarted,
          isPaused: props.isPaused,
        });
        onIncreasePoint();
      });
      RemoteControl.instance.registerKeyEvents(RemoteControlKeys.DOWN, () => {
        logRemoteFlow('PlayerViewModel callback DOWN', {
          playerIndex: props.index,
          playerName: props.player?.name,
          isOnTurn: props.isOnTurn,
          isStarted: props.isStarted,
          isPaused: props.isPaused,
        });
        onDecreasePoint();
      });
      RemoteControl.instance.registerKeyEvents(RemoteControlKeys.LEFT, () => {
        logRemoteFlow('PlayerViewModel callback LEFT', {
          playerIndex: props.index,
          playerName: props.player?.name,
          isOnTurn: props.isOnTurn,
          isStarted: props.isStarted,
          isPaused: props.isPaused,
        });
        onEndTurn(undefined);
      });
      RemoteControl.instance.registerKeyEvents(RemoteControlKeys.RIGHT, () => {
        logRemoteFlow('PlayerViewModel callback RIGHT', {
          playerIndex: props.index,
          playerName: props.player?.name,
          isOnTurn: props.isOnTurn,
          isStarted: props.isStarted,
          isPaused: props.isPaused,
        });
        onEndTurn();
      });
    }
  }, [
    logRemoteFlow,
    props.gameSettings,
    props.index,
    props.isOnTurn,
    props.isPaused,
    props.isStarted,
    props.player,
    props.totalTurns,
  ]);

  const onIncreasePoint = useCallback(() => {
    logRemoteFlow('PlayerViewModel onIncreasePoint entered', {
      playerIndex: props.index,
      playerName: props.player?.name,
      isOnTurn: props.isOnTurn,
      isStarted: props.isStarted,
      isPaused: props.isPaused,
      category: props.gameSettings?.category,
      mode: props.gameSettings?.mode?.mode,
    });
    if (
      (!isPoolGame(props.gameSettings.category) &&
        !props.isOnTurn &&
        props.gameSettings.mode?.mode !== 'fast') ||
      !props.isStarted ||
      props.isPaused
    ) {
      logRemoteFlow('PlayerViewModel onIncreasePoint blocked', {
        playerIndex: props.index,
        isOnTurn: props.isOnTurn,
        isStarted: props.isStarted,
        isPaused: props.isPaused,
        category: props.gameSettings?.category,
        mode: props.gameSettings?.mode?.mode,
      });
      return;
    }

    logRemoteFlow('PlayerViewModel onIncreasePoint apply', {playerIndex: props.index});
    setTotalPointInTurn(prev => prev + 1);
    props.onChangePlayerPoint(1, props.index, 0);
  }, [props]);

  const onDecreasePoint = useCallback(() => {
    logRemoteFlow('PlayerViewModel onDecreasePoint entered', {
      playerIndex: props.index,
      playerName: props.player?.name,
      isOnTurn: props.isOnTurn,
      isStarted: props.isStarted,
      isPaused: props.isPaused,
      category: props.gameSettings?.category,
      mode: props.gameSettings?.mode?.mode,
    });
    if (
      (!isPoolGame(props.gameSettings.category) &&
        !props.isOnTurn &&
        props.gameSettings?.mode?.mode !== 'fast') ||
      !props.isStarted ||
      props.isPaused
    ) {
      logRemoteFlow('PlayerViewModel onDecreasePoint blocked', {
        playerIndex: props.index,
        isOnTurn: props.isOnTurn,
        isStarted: props.isStarted,
        isPaused: props.isPaused,
        category: props.gameSettings?.category,
        mode: props.gameSettings?.mode?.mode,
      });
      return;
    }

    logRemoteFlow('PlayerViewModel onDecreasePoint apply', {playerIndex: props.index});
    setTotalPointInTurn(prev => prev - 1);
    props.onChangePlayerPoint(-1, props.index, 0);
  }, [props]);

  const onPressPointStep = useCallback(
    (addedPoint: number) => {
      if (
        (!props.isOnTurn && props.gameSettings?.mode?.mode !== 'fast') ||
        !props.isStarted ||
        props.isPaused
      ) {
        return;
      }

      props.onChangePlayerPoint(addedPoint, props.index, 0);
    },
    [props],
  );

  const onViolate = useCallback(() => {
    props.onViolate(props.index);
  }, [props]);

  const onResetViolate = useCallback(() => {
    props.onViolate(props.index, true);
  }, [props]);

  const onEndTurn = useCallback(
    (isPrevious?: boolean) => {
      logRemoteFlow('PlayerViewModel onEndTurn entered', {
        playerIndex: props.index,
        playerName: props.player?.name,
        isPrevious,
        isOnTurn: props.isOnTurn,
        isStarted: props.isStarted,
        isPaused: props.isPaused,
      });
      setTotalPointInTurn(0);
      props.onEndTurn(isPrevious);
    },
    [props],
  );

  const showProMode = useMemo(() => {
    return (
      props.proModeEnabled &&
      !isPoolGame(props.gameSettings?.category) &&
      Number(props.totalPlayers || 2) <= 2
    );
  }, [props]);

  return useMemo(() => {
    return {
      showProMode,
      highestRate,
      averagePoint,
      totalPointInTurn,
      nameEditable,
      draftName,
      onToggleEditName,
      onChangeDraftName,
      onCommitName,
      onIncreasePoint,
      onDecreasePoint,
      onPressPointStep,
      onViolate,
      onResetViolate,
      onEndTurn,
    };
  }, [
    showProMode,
    highestRate,
    averagePoint,
    totalPointInTurn,
    nameEditable,
    draftName,
    onToggleEditName,
    onChangeDraftName,
    onCommitName,
    onIncreasePoint,
    onDecreasePoint,
    onPressPointStep,
    onViolate,
    onResetViolate,
    onEndTurn,
  ]);
};

export default PlayerViewModel;
