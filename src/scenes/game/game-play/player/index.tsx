import React, {memo, useMemo} from 'react';
import View from 'components/View';
import Text from 'components/Text';
import Button from 'components/Button';
import Image from 'components/Image';
import images from 'assets';
import TextInput from 'components/TextInput';
import {
  GAME_PLAY_POINTS_STEPS,
  GAME_PLAY_POINTS_STEPS_SHORT,
} from 'constants/game-play';
import colors from 'configuration/colors';
import PlayerViewModel, {Props} from './PlayerViewModel';
import styles from './styles';

const GamePlayer = (props: Props) => {
  const viewModel = PlayerViewModel(props);
  const PAIR_PLAY = props.gameSettings.players.playingPlayers.length === 2;

  const POINT_STEPS = useMemo(() => {
    let STEPS =
      props.gameSettings.category === 'libre' &&
      props.gameSettings.mode.mode === 'fast'
        ? GAME_PLAY_POINTS_STEPS
        : GAME_PLAY_POINTS_STEPS_SHORT;

    return (
      <View direction={'row'}>
        <View
          flex={'1'}
          style={styles.stepsWrapper}
          direction={'row'}
          alignItems={'center'}
          justify={'center'}
          marginLeft={'15'}
          marginBottom={'15'}>
          {Object.keys(STEPS).map((key, index) => {
            return (
              <Button
                key={`game-step-${index}`}
                style={[
                  styles.buttonStep,
                  {paddingVertical: PAIR_PLAY ? 15 : 10},
                ]}
                onPress={viewModel.onPressPointStep.bind(
                  GamePlayer,
                  (STEPS as any)[key],
                )}>
                <Text fontSize={PAIR_PLAY ? 32 : 24}>
                  +{(STEPS as any)[key]}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>
    );
  }, [PAIR_PLAY, props, viewModel.onPressPointStep]);

  return (
    <View
      flex={'1'}
      style={styles.container}
      marginHorizontal={'20'}
      marginBottom={'20'}>
      <View
        direction={'row'}
        alignItems={'center'}
        paddingHorizontal={'15'}
        marginTop={'10'}>
        <View flex={'1'}>
          <TextInput
            inputStyle={styles.input}
            value={props.player.name}
            onChange={viewModel.onChangeName}
            disabled={!viewModel.nameEditable}
          />
        </View>
        <Button style={styles.buttonEdit} onPress={viewModel.onToggleEditName}>
          <Image source={images.game.edit} style={styles.editIcon} />
        </Button>
      </View>

      <View
        direction={'row'}
        alignItems={'center'}
        marginHorizontal={'20'}
        marginTop={'10'}>
        <Button style={styles.button} onPress={viewModel.onDecreasePoint}>
          <Text fontSize={PAIR_PLAY ? 48 : 24} fontWeight={'bold'}>
            {'-'}
          </Text>
        </Button>
        <View marginHorizontal={'10'} />
        <Button style={styles.button} onPress={viewModel.onIncreasePoint}>
          <Text fontSize={PAIR_PLAY ? 48 : 24} fontWeight={'bold'}>
            {'+'}
          </Text>
        </Button>
      </View>

      <View
        flex={'1'}
        direction={'row'}
        alignItems={'center'}
        justify={'center'}>
        <View flex={'1'} alignItems={'center'} justify={'center'}>
          <Text
            style={{
              lineHeight: PAIR_PLAY ? 592 : 310,
            }}
            fontSize={
              props.player.totalPoint >= 100 ? 304 : PAIR_PLAY ? 512 : 304
            }
            color={colors.statusBar}>
            {props.player.totalPoint}
          </Text>
        </View>
      </View>

      {POINT_STEPS}
    </View>
  );
};

export default memo(GamePlayer);
