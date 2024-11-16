import {useEffect, useMemo, useState} from 'react';
import {PlayerSettings} from 'types/player';
import {GameSettings} from 'types/settings';

export interface Props {
  isStarted: boolean;
  isPaused: boolean;
  isMatchPaused: boolean;
  goal: number;
  totalTurns: number;
  countdownTime: number;
  currentPlayerIndex: number;
  gameSettings: GameSettings;
  playerSettings: PlayerSettings;
}

const CaromInfoViewModel = (props: Props) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isResumed, setIsResumed] = useState(false);

  useEffect(() => {
    if (props.isPaused || props.isMatchPaused) {
      setIsResumed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isPaused, props.isMatchPaused]);

  useEffect(() => {
    if (props.countdownTime > (props.gameSettings.mode?.countdownTime || 0)) {
      setAnimationStarted(false);
      return;
    }

    if (props.countdownTime === (props.gameSettings.mode?.countdownTime || 0)) {
      setAnimationStarted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.countdownTime, props.gameSettings]);

  useEffect(() => {
    if (
      !props.isStarted ||
      props.isPaused ||
      props.isMatchPaused ||
      (!props.isPaused && !isResumed && animationStarted)
    ) {
      return;
    }

    if (isResumed) {
      setIsResumed(false);
    }

    if (!animationStarted) {
      setAnimationStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.isStarted,
    props.isPaused,
    props.isMatchPaused,
    isResumed,
    animationStarted,
  ]);

  return useMemo(() => {
    const currentTotalPoints =
      props.playerSettings.playingPlayers[props.currentPlayerIndex].totalPoint;
    const player0 = props.playerSettings.playingPlayers[0];
    const player1 = props.playerSettings.playingPlayers[1];

    return {
      currentTotalPoints,
      player0,
      player1,
    };
  }, [props.currentPlayerIndex, props.playerSettings]);
};

export default CaromInfoViewModel;
