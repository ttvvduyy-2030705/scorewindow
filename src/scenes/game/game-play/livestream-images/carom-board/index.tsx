import Text from 'components/Text';
import View from 'components/View';
import colors from 'configuration/colors';
import React, {memo, useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CaromBoardViewModel, {Props} from './CaromBoardViewModel';
import images from 'assets';
import {isPoolGame} from 'utils/game';
import i18n from 'i18n';

import styles from './styles';
import Image from 'components/Image';

const CaromBoard = (props: Props) => {
  const viewModel = CaromBoardViewModel(props);

  const renderArrowTurn = useCallback(
    (index: number) => {
      if (index === props.currentPlayerIndex) {
        if (index === 0) {
          return (
            <Image source={images.game.turn} style={styles.imageTurnRight} />
          );
        }

        return <Image source={images.game.turn} style={styles.imageTurnLeft} />;
      }

      return <View style={styles.empty} />;
    },
    [props.currentPlayerIndex],
  );

  return (
    <View
      ref={viewModel.matchRef}
      style={styles.matchInfo}
      direction={'row'}
      collapsable={false}
      alignItems={'center'}>
      <View style={styles.whiteBlock} />
      <View
        style={styles.matchBackground}
        flex={'1'}
        direction={'row'}
        alignItems={'center'}>
        <View flex={'1'} direction={'row'} alignItems={'center'}>
          {renderArrowTurn(0)}
          <View flex={'1'} justify={'center'} paddingHorizontal={'15'}>
            <Text fontWeight={'bold'} color={colors.white}>
              {viewModel.player0?.name}
            </Text>
          </View>
          <View justify={'center'} paddingHorizontal={'15'}>
            <Text
              style={styles.matchPointText}
              fontWeight={'bold'}
              fontSize={32}
              color={colors.white}>
              {viewModel.player0?.totalPoint}
            </Text>
          </View>
        </View>
        {isPoolGame(props.gameSettings?.category) ? (
          <LinearGradient colors={[colors.deepGray, colors.black]}>
            <View
              paddingHorizontal={'20'}
              justify={'center'}
              alignItems={'center'}
              style={styles.matchRace}>
              <Text fontSize={12} color={colors.white} fontWeight={'bold'}>
                {i18n.t('raceTo', {
                  goal: props.gameSettings?.players.goal.goal,
                })}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View />
        )}
        <View flex={'1'} direction={'row'} alignItems={'center'}>
          <View justify={'center'} paddingHorizontal={'15'}>
            <Text
              style={styles.matchPointText}
              fontWeight={'bold'}
              fontSize={32}
              color={colors.white}>
              {viewModel.player1?.totalPoint}
            </Text>
          </View>
          <View
            flex={'1'}
            alignItems={'end'}
            justify={'center'}
            paddingHorizontal={'15'}>
            <Text fontWeight={'bold'} color={colors.white}>
              {viewModel.player1?.name}
            </Text>
          </View>
          {renderArrowTurn(1)}
        </View>
      </View>
      <View style={styles.blackBlock} />
    </View>
  );
};

export default memo(CaromBoard);
