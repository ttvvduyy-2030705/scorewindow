import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  matchInfo: {
    position: 'absolute',
    bottom: responsiveDimension(-0),
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  whiteBlock: {
    height: 50,
    width: 26,
    backgroundColor: colors.white,
    marginRight: -10,
  },
  blackBlock: {
    height: 50,
    width: 16,
    backgroundColor: colors.overlay,
  },
  imageTurnLeft: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    tintColor: colors.white,
  },
  imageTurnRight: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    transform: [{rotate: '180deg'}],
    tintColor: colors.white,
  },
  empty: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
  },
  matchBackground: {
    backgroundColor: colors.error,
    height: 50,
    borderRadius: 8,
  },
  matchRace: {
    height: '100%',
  },
  matchPointText: {
    marginTop: -7,
  },
});

export default styles;
