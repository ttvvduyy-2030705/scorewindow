import {useCallback, useEffect, useMemo, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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
  const countdownOffsetX = useSharedValue(0);

  const [countdownWidth, setCountdownWidth] = useState(0);
  const [animationInitiated, setAnimationInitiated] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isResumed, setIsResumed] = useState(false);

  useEffect(() => {
    if (props.isPaused || props.isMatchPaused) {
      setIsResumed(true);
      cancelAnimation(countdownOffsetX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isPaused, props.isMatchPaused]);

  useEffect(() => {
    if (props.countdownTime > (props.gameSettings.mode?.countdownTime || 0)) {
      countdownOffsetX.value = countdownWidth * 2;
      setAnimationStarted(false);
      return;
    }

    if (props.countdownTime === (props.gameSettings.mode?.countdownTime || 0)) {
      countdownOffsetX.value = countdownWidth;
      setAnimationStarted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.countdownTime, props.gameSettings, countdownWidth]);

  useEffect(() => {
    if (
      !props.isStarted ||
      props.isPaused ||
      props.isMatchPaused ||
      (!props.isPaused && !isResumed && animationStarted)
    ) {
      return;
    }

    let _countdownTime = isResumed
      ? props.countdownTime
      : props.gameSettings.mode?.countdownTime || 0;

    countdownOffsetX.value = withTiming(0, {
      duration: _countdownTime * 1000,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.Never,
    });

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

  const onLinearLayoutChange = useCallback(
    (e: LayoutChangeEvent) => {
      if (!animationInitiated) {
        countdownOffsetX.value = -e.nativeEvent.layout.width;
        setCountdownWidth(-e.nativeEvent.layout.width);
        setAnimationInitiated(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animationInitiated],
  );

  const COUNTDOWN_TIME_STYLE = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: countdownOffsetX.value,
        },
      ],
    };
  }, []);

  return useMemo(() => {
    const currentTotalPoints =
      props.playerSettings.playingPlayers[props.currentPlayerIndex].totalPoint;
    const player0 = props.playerSettings.playingPlayers[0];
    const player1 = props.playerSettings.playingPlayers[1];

    return {
      COUNTDOWN_TIME_STYLE,
      currentTotalPoints,
      player0,
      player1,
      onLinearLayoutChange,
    };
  }, [
    COUNTDOWN_TIME_STYLE,
    props.currentPlayerIndex,
    props.playerSettings,
    onLinearLayoutChange,
  ]);
};

export default CaromInfoViewModel;
