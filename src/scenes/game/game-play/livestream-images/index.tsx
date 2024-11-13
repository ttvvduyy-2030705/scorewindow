import React, {memo, useCallback} from 'react';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import i18n from 'i18n';

import {isPoolGame} from 'utils/game';

import LiveStreamImagesViewModel, {Props} from './LiveStreamImagesViewModel';
import colors from 'configuration/colors';
import styles from './styles';
import images from 'assets';
import LinearGradient from 'react-native-linear-gradient';

const LiveStreamImages = (props: Props) => {
  const viewModel = LiveStreamImagesViewModel(props);

  const renderImages = useCallback((imageList: string[]) => {
    if (imageList.length === 0) {
      return <View style={styles.emptyView} />;
    }

    return (
      <View direction={'row'}>
        {imageList.map((image, index) => {
          return (
            <Image
              key={index}
              source={{uri: image}}
              style={styles.image}
              resizeMode={'contain'}
            />
          );
        })}
      </View>
    );
  }, []);

  const renderTopLeftImages = useCallback(() => {
    return (
      <View
        ref={viewModel.topLeftRef}
        collapsable={false}
        style={styles.absolute}>
        {renderImages(viewModel.topLeftImages)}
      </View>
    );
  }, [viewModel.topLeftRef, viewModel.topLeftImages, renderImages]);

  const renderTopRightImages = useCallback(() => {
    return (
      <View
        ref={viewModel.topRightRef}
        collapsable={false}
        style={styles.absolute}>
        {renderImages(viewModel.topRightImages)}
      </View>
    );
  }, [viewModel.topRightRef, viewModel.topRightImages, renderImages]);

  const renderBottomLeftImages = useCallback(() => {
    return (
      <View
        ref={viewModel.bottomLeftRef}
        collapsable={false}
        style={styles.absolute}>
        {renderImages(viewModel.bottomLeftImages)}
      </View>
    );
  }, [viewModel.bottomLeftRef, viewModel.bottomLeftImages, renderImages]);

  const renderBottomRightImages = useCallback(() => {
    return (
      <View
        ref={viewModel.bottomRightRef}
        collapsable={false}
        style={styles.absolute}>
        {renderImages(viewModel.bottomRightImages)}
      </View>
    );
  }, [viewModel.bottomRightRef, viewModel.bottomRightImages, renderImages]);

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

  if (!props.playerSettings || props.playerSettings.playingPlayers.length > 2) {
    return <View />;
  }

  return (
    <>
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

      {renderTopLeftImages()}
      {renderTopRightImages()}
      {renderBottomLeftImages()}
      {renderBottomRightImages()}
    </>
  );
};

export default memo(LiveStreamImages);
