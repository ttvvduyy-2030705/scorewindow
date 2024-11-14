import React, {memo, useCallback} from 'react';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import View from 'components/View';
import Text from 'components/Text';
import Image from 'components/Image';
import colors from 'configuration/colors';
import {Player} from 'types/player';

import images from 'assets';
import CaromInfoViewModel, {Props} from './CaromInfoViewModel';
import {END, START} from './constants';
import styles from './styles';

const CaromInfo = (props: Props) => {
  const viewModel = CaromInfoViewModel(props);

  const renderPlayer = useCallback(
    (player: Player, index: number) => {
      return (
        <View
          style={{backgroundColor: player.color}}
          direction={'row'}
          alignItems={'center'}>
          <View
            direction={'row'}
            alignItems={'center'}
            paddingHorizontal={'10'}>
            <View flex={'1'}>
              <Text fontSize={20} fontWeight={'bold'} numberOfLines={1}>
                {player.name.toUpperCase()}
              </Text>
            </View>
            <View direction={'row'} alignItems={'end'}>
              <Text fontSize={40} fontWeight={'bold'}>
                {player.totalPoint || 0}
              </Text>
              <View style={styles.currentTotalPoint} marginLeft={'15'}>
                <Text fontSize={32} fontWeight={'bold'}>
                  {player.proMode?.currentPoint || 0}
                </Text>
              </View>
            </View>
            {props.currentPlayerIndex === index ? (
              <Image source={images.game.turn} style={styles.turnImage} />
            ) : (
              <View style={styles.empty} />
            )}
          </View>
        </View>
      );
    },
    [props.currentPlayerIndex],
  );

  return (
    <View style={styles.container} marginBottom={'20'} direction={'row'}>
      <View flex={'1'}>
        <View direction={'row'}>
          <View>
            <View
              flex={'1'}
              justify={'center'}
              style={styles.totalPointWrapper}
              paddingHorizontal={'15'}>
              <Text color={colors.white} fontSize={72}>
                {props.totalTurns}
              </Text>
            </View>
          </View>
          <View flex={'1'}>
            {renderPlayer(viewModel.player0, 0)}
            {renderPlayer(viewModel.player1, 1)}
          </View>
        </View>

        <View
          style={styles.countdownContainer}
          direction={'row'}
          alignItems={'center'}
          paddingVertical={'15'}>
          <View
            style={styles.countdownWrapper}
            marginLeft={'15'}
            paddingHorizontal={'10'}>
            <Text fontSize={20} color={colors.white}>
              {props.countdownTime}
            </Text>
          </View>
          <LinearGradient
            style={styles.linearWrapper}
            start={START}
            end={END}
            colors={[colors.green, colors.yellow, colors.orange, colors.red]}
            onLayout={viewModel.onLinearLayoutChange}>
            <Animated.View
              style={[viewModel.COUNTDOWN_TIME_STYLE, styles.linear]}
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default memo(CaromInfo);
