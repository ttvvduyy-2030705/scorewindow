import React, {memo, useCallback} from 'react';
import View from 'components/View';
import {GameSettings, GameSettingsMode} from 'types/settings';
import Text from 'components/Text';
import i18n from 'i18n';
import colors from 'configuration/colors';
import Button from 'components/Button';
import {isCaromGame} from 'utils/game';
import styles from './styles';
import Webcam from '../webcam';

interface Props {
  isStarted: boolean;
  webcamFolderName?: string;
  goal: number;
  totalTurns: number;
  totalPlayers: number;
  currentMode: GameSettingsMode;
  gameSettings: GameSettings;
  onPressGiveMoreTime: () => void;
  updateWebcamFolderName: (name: string) => void;
  renderMatchInfo: () => React.ReactNode;
}

const GameInfo = (props: Props) => {
  const isFullPlayer = props.totalPlayers === 5;

  const renderPoint = useCallback((title: string, value: number) => {
    return (
      <View
        flex={'1'}
        direction={'row'}
        alignItems={'center'}
        justify={'center'}
        style={styles.pointWrapper}>
        <Text fontSize={16}>{title}</Text>
        <View
          style={styles.valueWrapper}
          direction={'row'}
          alignItems={'center'}
          marginLeft={'5'}>
          <Text
            style={styles.valueText}
            fontSize={72}
            adjustsFontSizeToFit={true}
            color={colors.grayBlue}
            fontWeight={'bold'}>
            {value}
          </Text>
        </View>
      </View>
    );
  }, []);

  if (isFullPlayer && props.currentMode?.mode === 'fast') {
    return <View />;
  }

  if (props.currentMode?.mode === 'fast') {
    return <View flex={'1'} />;
  }

  return (
    <View flex={isFullPlayer ? '0' : '1'}>
      <View flex={isFullPlayer ? '0' : '1'} direction={'row'}>
        {renderPoint(i18n.t('totalTurns'), props.totalTurns)}
        {renderPoint(i18n.t('goal'), props.goal)}
      </View>

      {isCaromGame(props.gameSettings.category) &&
      props.totalPlayers < 5 &&
      props.currentMode?.mode === 'pro' ? (
        <Webcam
          webcamFolderName={props.webcamFolderName}
          renderMatchInfo={props.renderMatchInfo}
          updateWebcamFolderName={props.updateWebcamFolderName}
          innerControls
        />
      ) : (
        <View />
      )}

      <View style={styles.buttonWrapper} direction={'row'} alignItems={'end'}>
        <Button
          onPress={props.onPressGiveMoreTime}
          style={[styles.button, styles.buttonGiveMoreTime]}>
          <Text color={colors.white} fontSize={16}>
            {i18n.t('giveMoreTime')}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default memo(GameInfo);
