import React, {memo, useCallback} from 'react';
import View from 'components/View';
import {GameSettingsMode} from 'types/settings';
import Text from 'components/Text';
import i18n from 'i18n';
import colors from 'configuration/colors';
import Button from 'components/Button';
import styles from './styles';

interface Props {
  isStarted: boolean;
  goal: number;
  totalTurns: number;
  totalPlayers: number;
  currentMode: GameSettingsMode;
  onPressGiveMoreTime: () => void;
}

const GameInfo = (props: Props) => {
  const renderPoint = useCallback(
    (title: string, value: number) => {
      return (
        <View
          style={styles.functionItem}
          flex={'1'}
          direction={'row'}
          alignItems={'center'}
          justify={'center'}
          marginLeft={'20'}>
          <Text fontSize={16}>{title}</Text>
          <View
            flex={'1'}
            direction={'row'}
            alignItems={'center'}
            marginLeft={'5'}>
            <Text
              style={styles.textPoint}
              fontSize={128}
              adjustsFontSizeToFit={true}
              color={colors.grayBlue}
              fontWeight={'bold'}>
              {value}
            </Text>
          </View>
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.isStarted],
  );

  if (props.totalPlayers === 5 && props.currentMode?.mode === 'fast') {
    return <View />;
  }

  if (props.currentMode?.mode === 'fast') {
    return <View flex={'1'} />;
  }

  return (
    <View flex={'1'}>
      <View flex={'1'} direction={'row'} alignItems={'center'}>
        {renderPoint(i18n.t('totalTurns'), props.totalTurns)}
        {renderPoint(i18n.t('goal'), props.goal)}
      </View>
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
