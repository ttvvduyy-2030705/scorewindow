import React, {memo} from 'react';
import View from 'components/View';
import colors from 'configuration/colors';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Image from 'components/Image';
import images from 'assets';
import {responsiveDimension} from 'utils/helper';

import {Player} from 'types/player';

import styles from './styles';

interface Props {
  totalPlayers?: number;
  player: Player;
  nameEditable: boolean;
  onChangeName: (value: string) => void;
  onToggleEditName: () => void;
}

const PlayerName = (props: Props) => {
  const isPairPlay = props.totalPlayers && props.totalPlayers > 2;

  return (
    <View
      style={{
        height: isPairPlay ? responsiveDimension(40) : responsiveDimension(72),
      }}
      direction={'row'}
      alignItems={'center'}
      marginTop={'10'}
      marginBottom={'5'}
      paddingHorizontal={'15'}>
      <View flex={'1'}>
        <TextInput
          inputStyle={[
            styles.input,
            {
              borderBottomColor: props.nameEditable
                ? colors.black
                : colors.transparent,
            },
            isPairPlay
              ? {
                  fontSize: responsiveDimension(32),
                  height: responsiveDimension(56),
                }
              : {
                  fontSize: responsiveDimension(40),
                  height: responsiveDimension(72),
                },
          ]}
          value={props.player.name}
          onChange={props.onChangeName}
          disabled={!props.nameEditable}
        />
      </View>
      <Button style={styles.buttonEdit} onPress={props.onToggleEditName}>
        <Image source={images.game.edit} style={styles.editIcon} />
      </Button>
    </View>
  );
};

export default memo(PlayerName);
